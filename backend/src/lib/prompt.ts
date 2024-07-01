import axios from 'axios';
import { config } from '../config/config';

export const generate = async (token: string, input: any) => {
  // The final response should be standardized in Gherkin syntax
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
   """ ${input} <end>`;

  // Using the openapi specification given below after """, generate the test cases. The generated output test case should include 1.Test Case scenario 2. Sample Input data in JSON format 3. Preconditions and dependencies 4. Well described Testing steps 5. Sample output data in JSON format 6. All returned Output status codes. """ ${input} <end>
  const inputData = {
    input: prompt,
    parameters: {
      decoding_method: 'greedy',
      max_new_tokens: 1000,
      min_new_tokens: 1,
      stop_sequences: ['<end>'],
      repetition_penalty: 1,
    },
    model_id: config.ibm.watsonx.modelId,
    project_id: config.ibm.watsonx.projectId,
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

  // const inputData = {
  //   model_id: 'ibm/granite-13b-chat-v2',
  //   project_id: config.ibm.watsonx.projectId,
  //   conversation_id: '59338ab3-2a1d-4a81-9544-0314955ced83',
  //   parent_id: 'ec92817a-68f0-4973-9f7e-72ca1826764d',
  //   messages: [
  //     {
  //       role: 'user',
  //       content: prompt,
  //     },
  //   ],
  //   parameters: {
  //     decoding_method: 'greedy',
  //     repetition_penalty: 1.05,
  //     stop_sequences: ['<end>'],
  //     include_stop_sequence: true,
  //     min_new_tokens: 1,
  //     max_new_tokens: 1024,
  //   },
  //   moderations: {},
  // };
  // const inputData = {
  //   model_id: 'ibm-mistralai/mixtral-8x7b-instruct-v01-q',
  //   parameters: {
  //     decoding_method: 'greedy',
  //     min_new_tokens: 1,
  //     max_new_tokens: 1024,
  //   },
  //   moderations: {},
  //   prompt_id: 'prompt_builder',
  //   data: {
  //     input: `Input: ${prompt}`,
  //     instruction: '',
  //     input_prefix: 'Input:',
  //     output_prefix: 'Output:',
  //     examples: [],
  //     system_prompt:
  //       "You are Granite Chat, an AI language model developed by IBM. You are a cautious assistant that carefully follows instructions. You are helpful and harmless and you follow ethical guidelines and promote positive behavior. You respond in a comprehensive manner unless instructed otherwise, providing explanations when needed while maintaining a neutral tone. You are capable of coding, writing, and roleplaying. You are cautious and refrain from generating real-time information, highly subjective or opinion-based topics. You are harmless and refrain from generating content involving any form of bias, violence, discrimination or inappropriate content. You always respond to greetings (for example, hi, hello, g'''day, morning, afternoon, evening, night, what'''s up, nice to meet you, sup, etc) with \"Hello! I am Granite Chat, created by IBM. How can I help you today?\". Please do not say anything else and do not start a conversation.",
  //   },
  // };
  try {
    const response = await axios.post(
      config.ibm.watsonx.modelApi as string,
      JSON.stringify(inputData),
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error('Something went wrong while generating response');
  }
};
