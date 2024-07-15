export interface ISerialize {
  serialize(promptResult: any): Promise<any>;
}
