import axios from 'axios';
import { IPrompt } from './prompt.interface';
import { config } from '../../config/config';

export class GqlPrompt implements IPrompt {
  async generate(fragment: any): Promise<any> {
    const payload = {
      model_id: 'ibm/granite-13b-chat-v2', //'ibm/granite-34b-code-instruct',
      parameters: {
        // decoding_method: 'greedy',
        // repetition_penalty: 1.05,
        // min_new_tokens: 1,
        // max_new_tokens: 4096,
        // stop_sequences: ['<end>'],
        // include_stop_sequence: false,
        decoding_method: 'sample',
        temperature: 0.7,
        top_p: 0.85,
        top_k: 50,
        typical_p: 1,
        repetition_penalty: 1.05,
        stop_sequences: ['<end>'],
        include_stop_sequence: false,
        min_new_tokens: 1,
        max_new_tokens: 2048,
      },
      moderations: {},
      prompt_id: 'prompt_builder',
      data: {
        input: `
        """
        ${fragment}
        <end>
        `,
        instruction:
          'Generate the test cases for the GraphQL APIs using the data documented in a YAML format after """',
        input_prefix: 'Input:',
        output_prefix: 'Output:',
        examples: [
          {
            input: `
              """
              gqlapi: 1.0.1
                info:
                  title: Sysml Server Graphql API
                  description: Sysml Server Graphql API
                  version: 1.0.0
                mutations:
                  exampleMutation:
                    description: The description for exampleMutation
                    tags:
                      - example
                      - exampleMutation
                    variables:
                      param_one:
                        type: string
                        required: true
                        example: "param_one_example"
                      param_two:
                        type: object
                        required: false
                        properties:
                          child_param_one:
                            type: string
                            required: false
                            example: "child_param_one_example"
                          child_param_two:
                            type: boolean
                            required: false
                            example: "child_param_two_example"
                    output:
                      200:
                        contentType: application/json
                        description: something
                        schema:
                          type: object
                          properties:
                            outputData:
                              type: object
                              properties:
                                outputDataPropOne:
                                  type: string
                                  example: "outputDataPropOneExample"
                                outputDataPropTwo:
                                  type: string
                                  example: outputDataPropTwoExample
                      400:
                        description: Bad Request
                      401:
                        description: Unauthenticated
                      403:
                        description: Forbidden
              <end>
              `,
            output:
              '[{"scenario":"successfully call to the exampleMutation with required params","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{"outputData":{"outputDataPropOne":"outputDataPropOneExample","outputDataPropTwo":"outputDataPropTwoExample"}},"status":{"200":"something"}},{"scenario":"successfully call to the exampleMutation with additional params","sampleInput":{"param_one":"param_one_example","param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{"outputData":{"outputDataPropOne":"outputDataPropOneExample","outputDataPropTwo":"outputDataPropTwoExample"}},"status":{"200":"something"}},{"scenario":"call to the exampleMutation without required params","sampleInput":{"param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{},"status":{"400":"Bad Request"}},{"scenario":"call to the exampleMutation with unauthenticated user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must not be authenticated","preconditions 2","preconditions 3"],"steps":["do not set the authorization header with auth token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":null,"status":{"401":"Unauthenticated"}},{"scenario":"call to the exampleMutation with unauthorized user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with user auth token having improper permissions","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":null,"status":{"403":"Forbidden"}}]',
          },
          {
            input: `
              """
              gqlapi: 1.0.0
                info:
                  title: Sysml Server
                  description: This is sysml server
                  version: 1.0.0
                queries:
                  exampleQuery:
                    tags:
                      - example
                      - exampleQuery
                    summary: This is the summary of exampleQuery
                    description: This is the description of exampleQuery
                    variables:
                      param_one:
                        type: string
                        required: true
                        example: "param_one_example"
                      param_two:
                        type: object
                        required: false
                        properties:
                          child_param_one:
                            type: string
                            required: false
                            example: "child_param_one_example"
                          child_param_two:
                            type: boolean
                            required: false
                            example: "child_param_two_example"
                    output:
                      200:
                        description: Successful operation
                        contentType: application/json
                        schema:
                          type: object
                          properties:
                            outputData:
                              type: array
                              items:
                                properties:
                                  arrayPropOne:
                                    type: string
                                    required: true
                                    example: "arrayPropOneExample"
                                  arrayPropTwo:
                                    type: string
                                    required: true
                                    example: "arrayPropTwoExample"
                                  arrayPropThree:
                                    type: string
                                    required: false
                                    example: "arrayPropThreeExample"
                                  arrayPropFour:
                                    type: object
                                    properties:
                                      objectPropOne:
                                        type: string
                                        example: "objectPropOneExample"
                                      objectPropTwo:
                                        type: number
                                        example: 000
                      400:
                        description: Bad Request
                      401:
                        description: Unauthenticated
                      403:
                        description: Forbidden
              <end>
              `,
            output:
              '[{"scenario":"successfully call to the exampleQuery with required params","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated"],"steps":["set the authorization header with valid token","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":{"outputData":[{"arrayPropOne":"arrayPropOneExample","arrayPropTwo":"arrayPropTwoExample","arrayPropThree":"arrayPropThreeExample","arrayPropFour":{"objectPropOne":"objectPropOneExample","objectPropTwo":"000"}}]},"status":{"200":"Successful operation"}},{"scenario":"successfully call to the exampleQuery with additional params","sampleInput":{"param_one":"param_one_example","param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":{"outputData":[{"arrayPropOne":"arrayPropOneExample","arrayPropTwo":"arrayPropTwoExample","arrayPropThree":"arrayPropThreeExample","arrayPropFour":{"objectPropOne":"objectPropOneExample","objectPropTwo":"000"}}]},"status":{"200":"Successful operation"}},{"scenario":"call to the exampleQuery without required params","sampleInput":{"param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":null,"status":{"400":"Bad Request"}},{"scenario":"call to the exampleQuery with unauthenticated user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must not be authenticated","preconditions 2","preconditions 3"],"steps":["do not set the authorization header with auth token","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":null,"status":{"401":"Unauthenticated"}},{"scenario":"call to the exampleQuery with unauthorized user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with user auth token having improper permissions","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":null,"status":{"403":"Forbidden"}}]',
          },
        ],
      },
    };

    // const payload = {
    //   model_id: 'ibm/granite-34b-code-instruct',
    //   parameters: {
    //     decoding_method: 'greedy',
    //     repetition_penalty: 1.2,
    //     stop_sequences: ['<end>'],
    //     include_stop_sequence: false,
    //     min_new_tokens: 1,
    //     max_new_tokens: 750,
    //   },
    //   moderations: {},
    //   prompt_id: 'prompt_builder',
    //   data: {
    //     instruction: `Using the yaml specification given as an input after """, considering the queries and mutations in the document, generate the test cases for each path. The generated output test case should include 1.Test Case scenario 2. Sample Input data in JSON format 3. Preconditions and dependencies 4. Well described Testing steps 5. Sample output data in JSON format 6. All returned Output status codes. Stricktly Avoid including the input yaml data into the output. Also, Ensure that the final generated data is stricktly in the JSON format only. """ <end>`,
    //     input: `${fragment}`,
    //     input_prefix: '',
    //     output_prefix: '',
    //     examples: [
    //       {
    //         input:
    //           "gqlapi: 1.0.0\ninfo:\n  title: Sysml Server\n  description: This is sysml server\n  version: 1.0.0\nqueries:\n  exampleQuery:\n    tags:\n      - example\n      - exampleQuery\n    summary: This is the summary of exampleQuery\n    description: This is the description of exampleQuery\n    variables:\n      param_one:\n        type: string\n        required: true\n        example: \"param_one_example\"\n      param_two:\n        type: object\n        required: false\n        properties:\n          child_param_one:\n            type: string\n            required: false\n            example: '''child_param_one_example'''\n          child_param_two:\n            type: boolean\n            required: false\n            example: '''child_param_two_example'''\n    output:\n      200:\n        description: Successful operation\n        contentType: application/json\n        schema:\n          type: object\n          properties:\n            outputData:\n              type: array\n              items:\n                properties:\n                  arrayPropOne:\n                    type: string\n                    required: true\n                    example: \"arrayPropOneExample\"\n                  arrayPropTwo:\n                    type: string\n                    required: true\n                    example: \"arrayPropTwoExample\"\n                  arrayPropThree:\n                    type: string\n                    required: false\n                    example: \"arrayPropThreeExample\"\n                  arrayPropFour:\n                    type: object\n                    properties:\n                      objectPropOne:\n                        type: string\n                        example: \"objectPropOneExample\"\n                      objectPropTwo:\n                        type: number\n                        example: 000\n      400:\n        description: Bad Request\n      401:\n        description: Unauthenticated\n      403:\n        description: Forbidden",
    //         output:
    //           '[{"scenario":"successfully call to the exampleQuery with required params","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":{"outputData":[{"arrayPropOne":"arrayPropOneExample","arrayPropTwo":"arrayPropTwoExample","arrayPropThree":"arrayPropThreeExample","arrayPropFour":{"objectPropOne":"objectPropOneExample","objectPropTwo":"000"}}]},"status":{"200":"Successful operation"}},{"scenario":"successfully call to the exampleQuery with additional params","sampleInput":{"param_one":"param_one_example","param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":{"outputData":[{"arrayPropOne":"arrayPropOneExample","arrayPropTwo":"arrayPropTwoExample","arrayPropThree":"arrayPropThreeExample","arrayPropFour":{"objectPropOne":"objectPropOneExample","objectPropTwo":"000"}}]},"status":{"200":"Successful operation"}},{"scenario":"call to the exampleQuery without required params","sampleInput":{"param_one":"param_one_example","param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":{},"status":{"400":"Bad Request"}},{"scenario":"call to the exampleQuery with unauthenticated user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["do not set the authorization header with auth token","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":{},"status":{"401":"Unauthenticated"}},{"scenario":"call to the exampleQuery with unauthorized user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with user auth token having improper permissions","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":{},"status":{"403":"Forbidden"}}]',
    //       },
    //       {
    //         input:
    //           "gqlapi: 1.0.1 info:   title: Sysml Server Graphql API   description: Sysml Server Graphql API   version: 1.0.0 mutations:   exampleMutation:     description: The description for exampleMutation     tags:       - example       - exampleMutation     variables:       param_one:         type: string         required: true         example: \"param_one_example\"       param_two:         type: object         required: false         properties:           child_param_one:             type: string             required: false             example: '''child_param_one_example'''           child_param_two:             type: boolean             required: false             example: '''child_param_two_example'''     output:       200:         contentType: application/json         description: something         schema:           type: object           properties:             outputData:               type: object               properties:                 outputDataPropOne:                   type: string                   example: \"outputDataPropOneExample\"                 outputDataPropTwo:                   type: string                   example: outputDataPropTwoExample       400:         description: Bad Request       401:         description: Unauthenticated       403:         description: Forbidden",
    //         output:
    //           '[{"scenario":"successfully call to the exampleMutation with required params","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{"outputData":{"outputDataPropOne":"outputDataPropOneExample","outputDataPropTwo":"outputDataPropTwoExample"}},"status":{"200":"something"}},{"scenario":"successfully call to the exampleMutation with additional params","sampleInput":{"param_one":"param_one_example","param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{"outputData":{"outputDataPropOne":"outputDataPropOneExample","outputDataPropTwo":"outputDataPropTwoExample"}},"status":{"200":"something"}},{"scenario":"call to the exampleMutation without required params","sampleInput":{"param_one":"param_one_example","param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{},"status":{"400":"Bad Request"}},{"scenario":"call to the exampleMutation with unauthenticated user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["do not set the authorization header with auth token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{},"status":{"401":"Unauthenticated"}},{"scenario":"call to the exampleMutation with unauthorized user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with user auth token having improper permissions","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{},"status":{"403":"Forbidden"}}]',
    //       },
    //     ],
    //   },
    // };

    // const payload = {
    //   model_id: 'ibm/granite-34b-code-instruct',
    //   parameters: {
    //     decoding_method: 'greedy',
    //     repetition_penalty: 1.2,
    //     stop_sequences: ['<end>'],
    //     include_stop_sequence: false,
    //     min_new_tokens: 1,
    //     max_new_tokens: 400,
    //   },
    //   moderations: {},
    //   prompt_id: 'prompt_builder',
    //   data: {
    //     input: fragment,
    //     instruction:
    //       'Using the yaml specification given after """, considering the queries and mutations in the document, generate the test cases for each path. The generated output test case should include 1.Test Case scenario 2. Sample Input data in JSON format 3. Preconditions and dependencies 4. Well described Testing steps 5. Sample output data in JSON format 6. All returned Output status codes. In the response make sure not to include the input data as prefix""" <end>',
    //     examples: [
    //       {
    //         input:
    //           'gqlapi: 1.0.0 info:   title: Sysml Server   description: This is sysml server   version: 1.0.0 queries:   projects:     tags:       - project       - query     summary: Get all projects     description: Get all projects     variables:       searchText:         type: string         required: false         example: "Element"       filterInput:         required: false         type: object         properties:           projectId:             type: string             required: false             example: "qwert-12345-adefrt-qwertyghyuj"           name:             type: string             required: false             example: "SampleProject"           description:             type: string             required: false             example: "Description for SampleProject"           createdBy:             type: string             required: false             example: "2024-06-08"           created:             type: string             required: false             example: "user-1"           lastModified:             type: string             required: false             example: "2024-06-08"     output:       200:         description: Successful operation         contentType: application/json         schema:           type: object           properties:             data:               type: array               items:                 properties:                   name:                     type: string                     required: true                   projectId:                     type: string                     required: true                   elementType:                     type: string                     required: false                   root:                     type: object                     properties:                       elementId:                         type: string                       elementType:                         type: string                   description:                     type: string             totalRecords:               type: integer               example: 100       401:         description: Unauthenticated       403:         description: Forbidden',
    //         output:
    //           '[{"scenario":"successfully create a project","sampleInput":{"name":"SampleProject","description":"Description of SampleProject","templateId":"simple-template-id"},"preconditions":["user must be authenticated"],"steps":["set the authorization header with valid token","call the createProject mutation with valid input data","observe the output"],"output":{"200":"Project Created"}},{"scenario":"create a project with existing name","sampleInput":{"name":"SampleProject","description":"Description of SampleProject","templateId":"simple-template-id"},"preconditions":["user must be authenticated"],"steps":["set the authorization header with valid token","call the createProject mutation with valid input data","observe the output"],"output":{"400":"Project already exists"}},{"scenario":"create project with invalid authentication","sampleInput":{"name":"SampleProject","description":"Description of SampleProject","templateId":"simple-template-id"},"preconditions":["user must not be authenticated"],"steps":["set the authorization header with invalid token","call the createProject mutation with valid input data","observe the output"],"output":{"401":"Unauthenticated"}},{"scenario":"create project with invalid authentication","sampleInput":{"name":"SampleProject","description":"Description of SampleProject","templateId":"simple-template-id"},"preconditions":["user must not be authorized"],"steps":["set the authorization header with valid token","call the createProject mutation with valid input data","observe the output"],"output":{"403":"Forbidden"}}]',
    //       },
    //     ],
    //   },
    // };

    // console.log(config.ibm.iam.apiKey);
    // console.log(config.ibm.watsonx.modelApi);
    // console.log(JSON.stringify(payload));

    try {
      const response = await axios.post(
        'https://bam-api.res.ibm.com/v2/text/generation?version=2024-07-05',
        JSON.stringify(payload),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.ibm.iam.apiKey}`,
          },
        },
      );

      return response.data;
    } catch (e) {
      console.log(e);
      throw new Error('Something went wrong while generating response');
    }
  }
}
