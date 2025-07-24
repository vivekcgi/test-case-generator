from dotenv import load_dotenv

from genai.client import Client
from genai.credentials import Credentials
from genai.schema import (
    DecodingMethod,
    LengthPenalty,
    ModerationHAP,
    ModerationHAPOutput,
    ModerationParameters,
    TextGenerationParameters,
    TextGenerationReturnOptions,
)
from genai.text.generation import CreateExecutionOptions

try:
    from tqdm.auto import tqdm
except ImportError:
    print("Please install tqdm to run this example.")
    raise


def heading(text: str) -> str:
    """Helper function for centering text."""
    return "\n" + f" {text} ".center(80, "=") + "\n"


# make sure you have a .env file under genai root with
# GENAI_KEY=<your-genai-key>
# GENAI_API=<genai-api-endpoint>
load_dotenv()
client = Client(credentials=Credentials.from_env())

promp = """
Generate the test cases by considering the data given in a YAML format after ???

The Input will be look like following:gqlapi: 1.0.1
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

The Output should look in following format [{"scenario":"successfully call to the exampleMutation with required params","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{"outputData":{"outputDataPropOne":"outputDataPropOneExample","outputDataPropTwo":"outputDataPropTwoExample"}},"status":{"200":"something"}},{"scenario":"successfully call to the exampleMutation with additional params","sampleInput":{"param_one":"param_one_example","param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{"outputData":{"outputDataPropOne":"outputDataPropOneExample","outputDataPropTwo":"outputDataPropTwoExample"}},"status":{"200":"something"}},{"scenario":"call to the exampleMutation without required params","sampleInput":{"param_two":{"child_param_one":"child_param_one_example","child_param_two":"child_param_two_example"}},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with valid token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{},"status":{"400":"Bad Request"}},{"scenario":"call to the exampleMutation with unauthenticated user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must not be authenticated","preconditions 2","preconditions 3"],"steps":["do not set the authorization header with auth token","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{},"status":{"401":"Unauthenticated"}},{"scenario":"call to the exampleMutation with unauthorized user","sampleInput":{"param_one":"param_one_example"},"preconditions":["user must be authenticated","preconditions 2","preconditions 3"],"steps":["set the authorization header with user auth token having improper permissions","call the exampleMutation mutation with valid input data","observe the output"],"sampleOutput":{},"status":{"403":"Forbidden"}}]` 

???
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
"""
# lots_of_greetings = [greeting] * 20

moderations = ModerationParameters(
    hap=ModerationHAP(
        output=ModerationHAPOutput(enabled=True, send_tokens=True, threshold=0.8)
    ),
    # possibly add more moderations:
    # social_bias=ModerationSocialBias(...),
    # hap=ModerationHAP(...),
)

parameters = TextGenerationParameters(
    temperature=0.7,
    top_p=0.85,
    top_k=50,
    typical_p=1,
    repetition_penalty=1.05,
    stop_sequences=["<end>"],
    include_stop_sequence=False,
    min_new_tokens=1,
    max_new_tokens=2048,
    decoding_method=DecodingMethod.SAMPLE,
    length_penalty=LengthPenalty(start_index=5, decay_factor=1.5),
)

print(heading("Generating responses in parallel"))
# yields batch of results that are produced asynchronously and in parallel
for idx, response in tqdm(
    enumerate(
        client.text.generation.create_stream(
            model_id="ibm/granite-13b-chat-v2",
            input=promp,
            moderations=None,
            parameters=parameters,
        )
    ),
    total=len(promp),
    desc="Progress",
    unit="input",
):
    print("res len => ", len(response.results))
    result = response.results[0]
    print(f"Input text ({idx}): {result.input_text}")
    for res in response.results:
        print(f"Generated text ({idx}): {res.generated_text}")
