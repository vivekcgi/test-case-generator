import { Job } from 'bull';
import { pipelines } from '..';

export default function (job, done) {
  pipelines[job.data.name](job.data, done);
}
