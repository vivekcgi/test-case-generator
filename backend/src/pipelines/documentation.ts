import queue from 'async/queue';
import autoInject from 'async/autoInject';
import { readContent } from '../lib/file';
import { getSplitter } from '../modules';
import { Request, Fragment } from '../models';
import { generation } from './generation';

var q = queue((task, callback) => {
  autoInject(
    {
      read: async (callback) => {
        // read the content of the document
        try {
          const content = await readContent(task.data.filename);
          callback(null, content);
        } catch (e: any) {
          callback(e.message, null);
        }
      },
      split: async (read, callback) => {
        // split the content of the document into fragments
        try {
          const splitter = getSplitter(task.data.type);
          const fragments = splitter.split(read);
          callback(null, fragments);
        } catch (e: any) {
          callback(e.message, null);
        }
      },
      save: async (split, callback) => {
        // save all the fragments at once in the database
        try {
          const transactions: any = [];
          for (let oneFragment of split) {
            transactions.push(
              Fragment.query().insert({
                requestId: task.data.requestId,
                name: oneFragment.name || `api-${Date.now()}`,
                data: oneFragment.content,
              }),
            );
          }

          const result = await Promise.all(transactions);
          callback(null, result);
        } catch (e: any) {
          callback(e.message, null);
        }
      },
    },
    function (error, data) {
      callback(error, data);
    },
  );
}, 1);

export const documentation = async (job: any, done: any) => {
  q.push(job, async (error, data) => {
    if (error) {
      // if the stage is failed for request level task, mark the request as failed and exit
      console.log(error);
      await Request.query().update({
        id: job.data.requestId,
        status: 'FAILED',
      });
    }
    if (data) {
      // once all the request level tasks are done, call the generation pipeline
      console.log('========Main=======');
      console.log('Documentation pipeline completed successfully.');
      console.log(`Starting generation pipeline for request id ${job.data.requestId}...`);
      generation(job, done);
    }
  });
};
