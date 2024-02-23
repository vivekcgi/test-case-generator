import { token } from "../lib/auth";
import { readContent } from "../lib/file";
import { createIssue } from "../lib/jira";
import { generate } from "../lib/prompt";
import { ResponseHelper } from "../utils/response-helper";
import { SettingsController } from "./settings.controller";

export class WorkflowController {
    async process(filename: string) {
        try {
            const fileContents = await readContent(filename);
            const iamResponse = await token();
            const data = await generate(iamResponse.access_token, fileContents);
            const refinedData = await this.refine(data);
            return ResponseHelper.success('Response generated', refinedData);
        } catch (e: any) {
            return ResponseHelper.error(e.message);
        }

    }

    private async refine(response) {
        const parsedResponse = JSON.parse(JSON.stringify(response));
        const parsedObject = {
            model_id: parsedResponse.model_id,
            created_at: parsedResponse.created_at,
            results: [] as any[],
            system: parsedResponse.system
        };

        if (parsedResponse.results && parsedResponse.results.length > 0) {
            parsedResponse.results.forEach(result => {
                const parsedResult = {
                    generated_token_count: result.generated_token_count,
                    input_token_count: result.input_token_count,
                    stop_reason: result.stop_reason,
                    test_cases: [] as any[]
                };

                const generatedTextLines = result.generated_text.split('\n').filter(line => line.trim() !== '');
                let currentObject = {};
                let key = '';

                generatedTextLines.forEach(line => {
                    let processing_next_key = false;
                    if (line.endsWith(':')) {
                        processing_next_key = true;
                        key = line.slice(0, -1).trim().toLowerCase().replace(/ /g, '_');
                        currentObject[key] = '';
                    } else {
                        currentObject[key] = currentObject[key] + line;
                    }
                });

                parsedResult.test_cases.push(currentObject);
                parsedObject.results.push(parsedResult);
            });
        }

        return parsedObject;
    }

    async exportToJira(testCases: any[]){
        try{
            const settings = await SettingsController.getConfig();
            const { instanceUrl, projectKey, username, token  } = settings.data.data;
            const basicToken = this.getAuthToken(username, token);
            const responses: any = [];
            for(let oneTestCase of testCases) {
                const response = await createIssue(basicToken, instanceUrl, projectKey, 'Test', oneTestCase);
                responses.push(response.data.data);
            }
            return ResponseHelper.success('Created Jira Tickets', responses);
        } catch(e: any){
            console.log(e);
            return ResponseHelper.error('Something went wrong while exporting to Jira');
        }
    }

    private getAuthToken(user: string, password: string) {
        const token = btoa(`${user}:${password}`);
        return token;
    }
}