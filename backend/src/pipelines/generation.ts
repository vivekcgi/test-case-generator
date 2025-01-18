import queue from 'async/queue';
import autoInject from 'async/autoInject';
import { Request, GenResult, Fragment, GenError } from '../models';
import { getPrompt } from '../modules';

var q = queue((task, callback) => {
  autoInject(
    {
      generate: async (callback) => {
        // get the appropriate propmt to process the fragment
        // submit the prompt to the model to generate the result
        try {
          const prompt = getPrompt(task.data.type);
          const result = await prompt.generate(task.data.fragment.data);
          console.log('result => ', result);
          callback(null, result.results[0].generated_text);
        } catch (e: any) {
          callback(
            {
              message:
                'Something went wrong while generating the test case data. Please retry later',
              error: e,
            },
            null,
          );
        }
      },
      save: async (generate, callback) => {
        // save the generated data into the databse
        // if there is any error, return it to the main process
        // console.log('generated result => ', generate);
        try {
          const data = await GenResult.query().insert({
            fragmentId: task.data.fragment.id,
            data: generate,
          });
          // console.log('fragment saved: ', data);
          callback(null, data);
        } catch (e: any) {
          callback(
            {
              message:
                'Result generated for this endpoint is incomplete or partial. Please retry later',
              error: e,
            },
            null,
          );
        }
      },
    },
    function (error, data) {
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
        builder.where('status', 'PENDING').orWhere('status', 'FAILED');
      },
    });
  RequestPipelineHelper.init(request as Request);

  for (let oneFragment of request?.fragments || []) {
    // console.log('==========onefragment==========');
    // console.log(oneFragment.data);
    const newjob = { data: { ...job.data, fragment: oneFragment } };
    q.push(newjob, async (err, data) => {
      if (err) {
        // 1. save the error stack into the database for the failed fragment at the each stage (generate / save)
        // 2. in order to get the stage, return it from the callback from each stage

        await GenError.query().insert({
          fragmentId: oneFragment.id,
          message: err.message,
          data: {
            actualError: err.error.message,
            stack: `${err.error}`,
            genResponse: data.generate,
          },
        });

        await Fragment.query().updateAndFetchById(oneFragment.id, {
          requestId: oneFragment.requestId,
          status: 'FAILED',
        });
      }
      if (data.save) {
        // console.log('========Main=======');
        // console.log(data);
        await Fragment.query().updateAndFetchById(newjob.data.fragment.id, {
          requestId: newjob.data.requestId,
          status: 'COMPLETED',
        });
      }

      // 1. track all the jobs for its completion / failure
      // 2. if all the jobs are done, change the status of the request to COMPLETED
      RequestPipelineHelper.postFragmentProcessing(oneFragment.id);

      if (RequestPipelineHelper.isPipelineCompleted()) {
        console.log(`generation pipeline completed for request id ${job.data.requestId}...`);
        await Request.query().updateAndFetchById(job.data.requestId, {
          status: 'COMPLETED',
        });
      }
    });
  }

  done();
};

class RequestPipelineHelper {
  private static request: Request;
  private static fragments: Array<string> = [];
  static init(request: Request) {
    this.request = request;
  }

  static postFragmentProcessing(id) {
    this.fragments.push(id);
  }

  static isPipelineCompleted() {
    return this.request.fragments.length === this.fragments.length;
  }
}
