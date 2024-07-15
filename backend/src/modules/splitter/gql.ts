import yaml from 'js-yaml';
import { ISplitter } from './splitter.interface';

export class GqlSplitter implements ISplitter {
  split(document: any): Array<any> {
    let parsedYaml: any = yaml.load(document);

    // Extract the common parts (excluding mutations)
    const commonParts = {
      gqlapi: parsedYaml.gqlapi,
      info: parsedYaml.info,
    };

    // Extract queries and mutations
    const queries = parsedYaml.queries;
    const mutations = parsedYaml.mutations;

    // Iterate over each mutation and create a separate YAML block
    let yamlBlocks: Array<any> = [
      ...this.processParts('queries', commonParts, queries),
      ...this.processParts('mutations', commonParts, mutations),
    ];

    return yamlBlocks;
  }

  private processParts(type, common, parts) {
    let yamlBlocks: any = [];
    for (let partKey in parts) {
      if (parts.hasOwnProperty(partKey)) {
        let mutationBlock = {
          ...common,
          [type]: {
            [partKey]: parts[partKey],
          },
        };

        // Convert the mutation block to YAML format
        yamlBlocks.push({ name: partKey, content: yaml.dump(mutationBlock) });
      }
    }
    return yamlBlocks;
  }
}
