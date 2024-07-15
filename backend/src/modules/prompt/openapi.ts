import axios from 'axios';
import { config } from '../../config/config';
import { IPrompt } from './prompt.interface';

export class OpenapiPrompt implements IPrompt {
  async generate(fragment: any): Promise<any> {
    const prompt = `Using the openapi specification given below after """, considering all the paths in the document, generate the test cases for each path. The generated output test case should include 1.Test Case scenario 2. Sample Input data in JSON format 3. Preconditions and dependencies 4. Well described Testing steps 5. Sample output data in JSON format 6. All returned Output status codes. 
  for example 
  Test Case scenario: \n
    - some scenario 1
  Sample Input data: \n
    - { key: value}
  Preconditions and dependencies: \n
    1. precondition1
    2. precondition1
  Testing steps: \n
    1. step 1
    2. step 2
  Sample output data: \n
  - { key: value}
  All returned Output status codes: \n
  - [200.400]
  ----
  Test Case scenario: \n
    - some scenario 2
  Sample Input data: \n
    - { key: value}
  Preconditions and dependencies: \n
    1. precondition1
    2. precondition1
  Testing steps: \n
    1. step 1
    2. step 2
  Sample output data: \n
  - { key: value}
  All returned Output status codes: \n
  - [200.400]
   """ ${fragment} <end>`;

    // Using the openapi specification given below after """, generate the test cases. The generated output test case should include 1.Test Case scenario 2. Sample Input data in JSON format 3. Preconditions and dependencies 4. Well described Testing steps 5. Sample output data in JSON format 6. All returned Output status codes. """ ${input} <end>
    const inputData = {
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: 1000,
        min_new_tokens: 1,
        stop_sequences: ['<end>'],
        repetition_penalty: 1,
      },
      model_id: config.ibm.watsonx.modelId,
      moderations: {
        hap: {
          input: true,
          output: true,
          threshold: 0.5,
          mask: {
            remove_entity_value: true,
          },
        },
      },
    };

    try {
      const response = await axios.post(
        config.ibm.watsonx.modelApi as string,
        JSON.stringify(inputData),
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
