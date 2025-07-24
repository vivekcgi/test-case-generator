# ibm-generative-ai
import pythonmonkey

from dotenv import load_dotenv
from genai.client import Client
from genai.credentials import Credentials
from genai.schema import (
    DecodingMethod,
    TextGenerationParameters,
    TextGenerationReturnOptions,
)


jsonrepair = pythonmonkey.require("jsonrepair").jsonrepair


# make sure you have a .env file under genai root with
# GENAI_KEY=<your-genai-key>
# GENAI_API=<genai-api-endpoint>
load_dotenv()


# Instantiate a model proxy object to send your requests
client = Client(credentials=Credentials.from_env())


model_id = "ibm/granite-13b-chat-v2"

data = """
<|system|>
You are Granite Chat, an AI language model developed by IBM. You are a cautious assistant that carefully follows instructions. You are helpful and harmless and you follow ethical guidelines and promote positive behavior. You respond in a comprehensive manner unless instructed otherwise, providing explanations when needed while maintaining a neutral tone. You are capable of coding, writing, and roleplaying. You are cautious and refrain from generating real-time information, highly subjective or opinion-based topics. You are harmless and refrain from generating content involving any form of bias, violence, discrimination or inappropriate content. You always respond to greetings (for example, hi, hello, g'day, morning, afternoon, evening, night, what's up, nice to meet you, sup, etc) with "Hello! I am Granite Chat, created by IBM. How can I help you today?". Please do not say anything else and do not start a conversation.
<|user|>
Generate the test cases for the GraphQL APIs using the data documented in a YAML format.

Input:               gqlapi: 1.0.1
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
Output: [{"scenario":"successfully call to the exampleMutation with required params","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{"outputData":{"outputDataPropOne":"outputDataPropOneExample","outputDataPropTwo":"outputDataPropTwoExample"}},"status":{"200":"something"}},{"scenario":"successfully call to the exampleMutation with additional params","sampleInput":{"param_one":"param_one_example","param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{"outputData":{"outputDataPropOne":"outputDataPropOneExample","outputDataPropTwo":"outputDataPropTwoExample"}},"status":{"200":"something"}},{"scenario":"call to the exampleMutation without required params","sampleInput":{"param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{},"status":{"400":"Bad Request"}},{"scenario":"call to the exampleMutation with unauthenticated user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must not be authenticated","preconditions 2","preconditions 3"],"steps":["do not set the authorization header with auth token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{},"status":{"401":"Unauthenticated"}},{"scenario":"call to the exampleMutation with unauthorized user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with user auth token having improper permissions","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{},"status":{"403":"Forbidden"}}]

Input: gqlapi: 1.0.0
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
Output: [{"scenario":"successfully call to the exampleQuery with required params","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated"],"steps":["set the authorization header with valid token","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":{"outputData":[{"arrayPropOne":"arrayPropOneExample","arrayPropTwo":"arrayPropTwoExample","arrayPropThree":"arrayPropThreeExample","arrayPropFour":{"objectPropOne":"objectPropOneExample","objectPropTwo":"000"}}]},"status":{"200":"Successful operation"}},{"scenario":"successfully call to the exampleQuery with additional params","sampleInput":{"param_one":"param_one_example","param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":{"outputData":[{"arrayPropOne":"arrayPropOneExample","arrayPropTwo":"arrayPropTwoExample","arrayPropThree":"arrayPropThreeExample","arrayPropFour":{"objectPropOne":"objectPropOneExample","objectPropTwo":"000"}}]},"status":{"200":"Successful operation"}},{"scenario":"call to the exampleQuery without required params","sampleInput":{"param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":{},"status":{"400":"Bad Request"}},{"scenario":"call to the exampleQuery with unauthenticated user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must not be authenticated","preconditions 2","preconditions 3"],"steps":["do not set the authorization header with auth token","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":{},"status":{"401":"Unauthenticated"}},{"scenario":"call to the exampleQuery with unauthorized user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with user auth token having improper permissions","call the exampleQuery query with valid input data","observe the output"],"sampleOutput":{},"status":{"403":"Forbidden"}}]
"""

max_new_tokens = 800

parameters = TextGenerationParameters(
    temperature=0.7,
    top_p=0.85,
    top_k=50,
    typical_p=1,
    repetition_penalty=1.05,
    stop_sequences=["<end>"],
    include_stop_sequence=False,
    min_new_tokens=1,
    max_new_tokens=max_new_tokens,
    decoding_method=DecodingMethod.SAMPLE,
    random_seed=10,
    return_options=TextGenerationReturnOptions(generated_tokens=True),
)


def prepare_input(input) -> str:
    """
    Prepare the input with proper prompt
    """

    prompt = f"Input: {input} <end> Output: <|assistant|>"
    return prompt


def generate(input: str):
    """
    Generate the text
    """
    generated_text_chunks = []

    prompt = prepare_input(input)

    print("Generating text stream...")

    continuation_prompt = ""
    while True:
        max_token_reached = False
        is_eos_reached = False
        # print(f"generating again...{continuation_prompt}")
        for response in client.text.generation.create_stream(
            model_id=model_id,
            input=(
                data + prompt
                if continuation_prompt == ""
                else data + continuation_prompt + prompt
            ),
            parameters=parameters,
            moderations=None,
        ):
            if not response.results:
                continue
            for result in response.results:
                if result.generated_token_count >= max_new_tokens:
                    max_token_reached = True
                    # print(f"max_token_reached => {max_token_reached}")
                    break
                if result.generated_text:
                    is_eos_reached = result.stop_sequence == "<|endoftext|>"
                    # print(f"is_eos_reached => {result.stop_sequence}")
                    # print(result.generated_text, end="")
                    generated_text_chunks.append(result.generated_text)

        if max_token_reached is True and is_eos_reached is False:
            temp_list = generated_text_chunks.copy()
            last_tokens = temp_list[-200:]
            generated_text_chunks.clear()
            # TODO: try to give the previously generated teext and original prompt in  continuation_prompt to continue generating the text]\
            continuation_prompt = f"continue generating the result from where the previously generated result left off using the context of previous prompt. previously generated content is {last_tokens}"

        if is_eos_reached is True:
            print("Completed")
            break

    final_result = "".join(generated_text_chunks)
    final_result = jsonrepair(final_result)
    return final_result


presult = generate(
    """
gqlapi: 1.0.0
info:
  title: Sysml Server
  description: This is sysml server
  version: 1.0.0
queries:
  projects:
    tags:
      - project
      - query
    summary: Get all projects
    description: Get all projects
    variables:
      searchText:
        type: string
        required: false
        example: Element
      filterInput:
        required: false
        type: object
        properties:
          projectId:
            type: string
            required: false
            example: qwert-12345-adefrt-qwertyghyuj
          name:
            type: string
            required: false
            example: SampleProject
          description:
            type: string
            required: false
            example: Description for SampleProject
          createdBy:
            type: string
            required: false
            example: '2024-06-08'
          created:
            type: string
            required: false
            example: user-1
          lastModified:
            type: string
            required: false
            example: '2024-06-08'
    output:
      '200':
        description: Successful operation
        contentType: application/json
        schema:
          type: object
          properties:
            data:
              type: array
              items:
                properties:
                  name:
                    type: string
                    required: true
                    example: SampleProject
                  projectId:
                    type: string
                    required: true
                    example: 1234-1234-1234-1234567890
                  elementType:
                    type: string
                    required: false
                    example: Project
                  root:
                    type: object
                    properties:
                      elementId:
                        type: string
                        example: 1234-1234-1234-987654320
                      elementType:
                        type: string
                        example: Package
                  description:
                    type: string
                    example: some description
            totalRecords:
              type: integer
              example: 100
      '401':
        description: Unauthenticated
      '403':
        description: Forbidden

"""
)
print(presult)
