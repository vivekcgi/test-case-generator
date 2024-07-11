// import { getSplitter, splitterType } from '../modules';
// import { Request } from '../models/Requests';
// import { Fragment } from '../models/Fragments';
// import { GenResult } from '../models/Results';
// import { v4 as uuid4 } from 'uuid';
// import { GenError } from '../models/Errors';

export const testQueue = async function (job: any, done: any) {
  console.log(job);
  // const request = await Request.query().insert({
  //   doc_type: 'gql',
  //   file_key: 'sysml.yaml',
  // });
  // console.log(request);

  // const fragment = await Fragment.query().insert({
  //   request_id: '726286cc-ea46-4774-b9ac-afb9d2c1a3cf',
  //   name: 'some api',
  //   data: 'some data',
  // });
  // console.log(fragment);

  // 49d8bf7a-697e-48a5-b551-c7d16148695f
  // const result = await GenResult.query().insert({
  //   id: uuid4(),
  //   fragmentId: '49d8bf7a-697e-48a5-b551-c7d16148695f',
  //   data: { d: 'This is result data for fragment id 49d8bf7a-697e-48a5-b551-c7d16148695f' },
  // });
  // console.log(result);

  // const error = await GenError.query().insert({
  //   id: uuid4(),
  //   fragmentId: '49d8bf7a-697e-48a5-b551-c7d16148695f',
  //   message: 'This is test message for fragment id 49d8bf7a-697e-48a5-b551-c7d16148695f',
  //   data: { d: 'This is result data for fragment id 49d8bf7a-697e-48a5-b551-c7d16148695f' },
  // });
  // console.log(error);

  let result = await Request.query()
    .select()
    .withGraphFetched('fragments')
    .withGraphFetched('fragments.result')
    .withGraphFetched('fragments.error');
  console.log('request_id: ', result[1].id);
  console.log('docType: ', result[1].docType);
  console.log('fileKey: ', result[1].fileKey);
  console.log('status: ', result[1].status);
  console.log('fragments: ', result[1].fragments);
  console.log('one fragment result: ', result[1].fragments[0].result);
  console.log('one fragment error: ', result[1].fragments[0].error);

  done();
};
