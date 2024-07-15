import { ISplitter } from './splitter.interface';

export class OpenapiSplitter implements ISplitter {
  split(document: any): Array<any> {
    return document;
  }
}
