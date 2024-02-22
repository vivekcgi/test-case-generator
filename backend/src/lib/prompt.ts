import axios from "axios"
import { config } from "../config/config";

export const generate = async (token:string, input: any) => {

    const prompt = `Using the data given below after """, generate the test cases. The test case should include 1.Test Case scenario 2. Sample Input data in JSON format 3. Preconditions and dependencies 4. Well described Testing steps 5. Sample output data in JSON format 6. All returned Output status codes. The final response should be standardized in Gherkin syntax. """ ${input}`

    const inputData = {
		input: prompt,
		parameters: {
			decoding_method: "greedy",
			max_new_tokens: 1000,
			min_new_tokens: 1,
			stop_sequences: [
				`"""`
			],
			repetition_penalty: 1
		},
		model_id: config.ibm.watsonx.modelId,
		project_id: config.ibm.watsonx.projectId,
		moderations: {
			hap: {
				input: true,
				output: true,
				threshold: 0.5,
				mask: {
					remove_entity_value: true
				}
			}
		}
	};

    try{
        const response = await axios.post(config.ibm.watsonx.modelApi as string, JSON.stringify(inputData), {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        
        return response.data;
    } catch(e){
        console.log(e)
    }
}
