export interface IPrompt {
  generate(fragment: any): Promise<any>;
}
