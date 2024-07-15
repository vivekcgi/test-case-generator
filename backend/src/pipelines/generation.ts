import queue from 'async/queue';
import autoInject from 'async/autoInject';
import { Request, GenResult, Fragment } from '../models';
import { getPrompt } from '../modules';

var q = queue((task, callback) => {
  // console.log('hello ' + JSON.stringify(task));
  autoInject(
    {
      generate: async (callback) => {
        // async code to get some data
        try {
          const prompt = getPrompt(task.data.type);
          const result = await prompt.generate(task.data.fragment.data);
          callback(null, result.results[0].generated_text);
        } catch (e: any) {
          callback(e.message, null);
        }
      },
      save: async (generate, callback) => {
        // async code to create a directory to store a file in
        // this is run at the same time as getting the data
        // console.log('generated result => ', generate);
        try {
          const data = await GenResult.query().insert({
            fragmentId: task.data.fragment.id,
            data: generate,
          });
          console.log('fragment saved: ', data);
          callback(null, data);
        } catch (e: any) {
          // TODO: save the error into the database
          callback(e.message, null);
        }
      },
    },
    function (error, data) {
      //   console.log(data);
      callback(error, data);
    },
  );
}, 1);

export const generation = async (job: any, done: any) => {
  const request = await Request.query()
    .withGraphFetched('fragments(onlyPending)')
    .findById(job.data.requestId)
    .modifiers({
      onlyPending(builder) {
        builder.where('status', 'PENDING');
      },
    });

  for (let oneFragment of request?.fragments || []) {
    // console.log('==========onefragment==========');
    // console.log(oneFragment.data);
    const newjob = { data: { ...job.data, fragment: oneFragment } };
    q.push(newjob, async (error, data) => {
      if (error) {
        console.log(error);
        // TODO:
        // 1. save the error stack into the database for the failed fragment at the each stage (generate / save)
        // 2. in order to get the stage, return it from the callback from each stage

        await Fragment.query().updateAndFetchById(oneFragment.id, {
          requestId: oneFragment.requestId,
          status: 'FAILED',
        });
      }
      if (data) {
        // console.log('========Main=======');
        // console.log(data);
        await Fragment.query().updateAndFetchById(newjob.data.fragment.id, {
          requestId: newjob.data.requestId,
          status: 'COMPLETED',
        });
      }
    });

    // TODO:
    // 1. track all the jobs for its completion / failure
    // 2. if all the jobs are done, change the status of the request to COMPLETED
  }

  done();
};
