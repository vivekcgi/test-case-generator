const yaml = require('js-yaml');
// import yaml from 'js-yaml';

function splitGraphQLYaml(yamlContent) {
    // Load the YAML content
    let parsedYaml = yaml.load(yamlContent);

    // Extract the common parts (excluding mutations)
    const commonParts = {
        gqlapi: parsedYaml.gqlapi,
        info: parsedYaml.info
    };

    // Extract mutations
    const mutations = parsedYaml.mutations;

    // Array to hold the individual YAML blocks
    let yamlBlocks = [];

    // Iterate over each mutation and create a separate YAML block
    for (let mutationName in mutations) {
        if (mutations.hasOwnProperty(mutationName)) {
            let mutationBlock = {
                ...commonParts,
                mutations: {
                    [mutationName]: mutations[mutationName]
                }
            };

            // Convert the mutation block to YAML format
            yamlBlocks.push(yaml.dump(mutationBlock));
        }
    }

    return yamlBlocks;
}

const yamlContent = `
gqlapi: 1.0.1
info:
  title: Sysml Server Graphql API
  description: Sysml Server Graphql API
  version: 1.0.0
mutations:
  createProject:
    description: Create a sysml project
    tags:
      - createProject
      - project
    variables:
      name:
        type: string
        required: true
        example: "SampleProject"
      sort:
        type: object
        required: false
        properties:
          aaa:
            type: string
            required: false
          bbb:
            type: boolean
            required: false
    output:
      200:
        contentType: application/json
        description: something
        schema:
          type: object
          properties:
            project:
              type: object
              properties:
                projectId:
                  type: string
                  example: "123456"
                name:
                  type: string
                  example: SampleProject
  updateProject:
    description: Create a sysml project
    tags:
      - createProject
      - project
    variables:
      name:
        type: string
        required: true
        example: "SampleProject"
      sort:
        type: object
        required: false
        properties:
          aaa:
            type: string
            required: false
          bbb:
            type: boolean
            required: false
    output:
      200:
        contentType: application/json
        description: something
        schema:
          type: object
          properties:
            project:
              type: object
              properties:
                projectId:
                  type: string
                  example: "123456"
                name:
                  type: string
                  example: SampleProject
`;

// Split the YAML into separate blocks
let yamlBlocks = splitGraphQLYaml(yamlContent);

// Output the YAML blocks
yamlBlocks.forEach((block, index) => {
    console.log(`YAML Block ${index + 1}:\n${block}\n`);
});