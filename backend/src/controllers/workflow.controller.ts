import { token } from '../lib/auth';
import { readContent } from '../lib/file';
import { createIssue } from '../lib/jira';
import { generate } from '../lib/prompt';
import { ResponseHelper } from '../utils/response-helper';
import { SettingsController } from './settings.controller';

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

  // use for granite model
  // private async refine(response) {
  //   const parsedResponse = JSON.parse(JSON.stringify(response));
  //   const parsedObject = {
  //     model_id: parsedResponse.model_id,
  //     created_at: parsedResponse.created_at,
  //     results: [] as any[],
  //     system: parsedResponse.system,
  //   };

  //   if (parsedResponse.results && parsedResponse.results.length > 0) {
  //     const allStdKeys = [
  //       'test_case_scenario',
  //       'sample_input_data_in_json_format',
  //       'preconditions_and_dependencies',
  //       'testing_steps',
  //       'sample_output_data_in_json_format',
  //       'all_returned_output_status_codes',
  //     ];
  //     let keyIndex = 0;
  //     parsedResponse.results.forEach((result) => {
  //       const parsedResult = {
  //         generated_token_count: result.generated_token_count,
  //         input_token_count: result.input_token_count,
  //         stop_reason: result.stop_reason,
  //         test_cases: [] as any[],
  //       };

  //       const splitted = this.splitSequences(result.generated_text);
  //       console.log('splitted sequences => ', splitted);

  //       const generatedTexts = splitted.map((onestr) =>
  //         onestr.split('\n').filter((line) => line.trim() !== ''),
  //       );
  //       console.log('generatedTexts => ', generatedTexts);
  //       let currentObject = {};
  //       let key = '';
  //       generatedTexts.forEach((generatedTextLines) => {
  //         if (generatedTextLines.length > 0) {
  //           generatedTextLines.forEach((line, idx) => {
  //             if (idx > 2) {
  //               console.log(`line ${idx} => ${line} : ${line.length}`);
  //               if (idx === 3 && line.length > 19) {
  //                 const d = line.split(':');
  //                 const oneKey = allStdKeys[keyIndex]; //d[0].trim().toLowerCase().replace(/ /g, '_');
  //                 currentObject[oneKey] = d[1];
  //                 keyIndex++;
  //               } else {
  //                 let processing_next_key = false;
  //                 if (line.endsWith(':')) {
  //                   processing_next_key = true;
  //                   key = allStdKeys[keyIndex]; //line.slice(0, -1).trim().toLowerCase().replace(/ /g, '_');
  //                   currentObject[key] = '';
  //                   keyIndex++;
  //                 } else {
  //                   if (line.includes('Preconditions and Dependencies')) {
  //                     const d = line.split(':');
  //                     const oneKey = allStdKeys[keyIndex]; //d[0].trim().toLowerCase().replace(/ /g, '_');
  //                     currentObject[oneKey] = d[1];
  //                     keyIndex++;
  //                   } else {
  //                     currentObject[key] = currentObject[key] + line;
  //                   }
  //                 }
  //               }
  //             }
  //           });

  //           parsedResult.test_cases.push(currentObject);
  //           parsedObject.results.push(parsedResult);
  //         }
  //       });
  //     });
  //   }

  //   return parsedObject;
  // }

  // use for mixtral model
  private async refine(response) {
    const parsedResponse = JSON.parse(JSON.stringify(response));
    const parsedObject = {
      model_id: parsedResponse.model_id,
      created_at: parsedResponse.created_at,
      results: [] as any[],
      system: parsedResponse.system,
    };

    if (parsedResponse.results && parsedResponse.results.length > 0) {
      const allStdKeys = [
        'test_case_scenario',
        'sample_input_data_in_json_format',
        'preconditions_and_dependencies',
        'testing_steps',
        'sample_output_data_in_json_format',
        'all_returned_output_status_codes',
      ];
      let keyIndex = 0;
      parsedResponse.results.forEach((result) => {
        const parsedResult = {
          generated_token_count: result.generated_token_count,
          input_token_count: result.input_token_count,
          stop_reason: result.stop_reason,
          test_cases: [] as any[],
        };

        const splitted = this.splitSequences(result.generated_text);
        const generatedTexts = splitted.map((onestr) =>
          onestr.split('\n').filter((line) => line.trim() !== ''),
        );
        
        // let currentObject = {};
        let currentObject = {};
        let key = '';
        generatedTexts.forEach((generatedTextLines) => {
          if (generatedTextLines.length > 0) {
            generatedTextLines.forEach((line, idx) => {
            //   console.log(`line ${idx} => ${line} : ${line.length}`);
              if (line.includes('Test Case scenario') && line.length > 19) {
                if (Object.keys(currentObject).length > 0) {
                  parsedResult.test_cases.push(currentObject);
                  currentObject = {};
                  keyIndex = 0;
                }
                const d = line.split(':');
                const oneKey = allStdKeys[keyIndex]; //d[0].trim().toLowerCase().replace(/ /g, '_');
                currentObject[oneKey] = d[1];
                keyIndex++;
              } else {
                let processing_next_key = false;
                if (line.endsWith(':')) {
                  processing_next_key = true;
                  key = allStdKeys[keyIndex]; //line.slice(0, -1).trim().toLowerCase().replace(/ /g, '_');
                  currentObject[key] = '';
                  keyIndex++;
                } else {
                  currentObject[key] = currentObject[key] + line;
                }
              }
            });

            // parsedResult.test_cases.push(currentObject);
            parsedObject.results.push(parsedResult);
          }
        });
      });
    }

    return parsedObject;
  }

  // ORIGINAL
  // private async refine(response) {
  //   const parsedResponse = JSON.parse(JSON.stringify(response));
  //   const parsedObject = {
  //     model_id: parsedResponse.model_id,
  //     created_at: parsedResponse.created_at,
  //     results: [] as any[],
  //     system: parsedResponse.system,
  //   };

  //   if (parsedResponse.results && parsedResponse.results.length > 0) {
  //     const allStdKeys = [
  //       'test_case_scenario',
  //       'sample_input_data_in_json_format',
  //       'preconditions_and_dependencies',
  //       'testing_steps',
  //       'sample_output_data_in_json_format',
  //       'all_returned_output_status_codes',
  //     ];
  //     let keyIndex = 0;
  //     parsedResponse.results.forEach((result) => {
  //       const parsedResult = {
  //         generated_token_count: result.generated_token_count,
  //         input_token_count: result.input_token_count,
  //         stop_reason: result.stop_reason,
  //         test_cases: [] as any[],
  //       };

  //       const splitted = this.splitSequences(result.generated_text);
  //       const generatedTexts = splitted.map((onestr) =>
  //         onestr.split('\n').filter((line) => line.trim() !== ''),
  //       );
  //       console.log('generatedTexts => ', generatedTexts);
  //       let currentObject = {};
  //       let key = '';
  //       generatedTexts.forEach((generatedTextLines) => {
  //         if (generatedTextLines.length > 0) {
  //           generatedTextLines.forEach((line, idx) => {
  //             console.log(`line ${idx} => ${line} : ${line.length}`);
  //             if (idx === 0 && line.length > 19) {
  //               const d = line.split(':');
  //               const oneKey = allStdKeys[keyIndex]; //d[0].trim().toLowerCase().replace(/ /g, '_');
  //               currentObject[oneKey] = d[1];
  //               keyIndex++;
  //             } else {
  //               let processing_next_key = false;
  //               if (line.endsWith(':')) {
  //                 processing_next_key = true;
  //                 key = allStdKeys[keyIndex]; //line.slice(0, -1).trim().toLowerCase().replace(/ /g, '_');
  //                 currentObject[key] = '';
  //                 keyIndex++;
  //               } else {
  //                 currentObject[key] = currentObject[key] + line;
  //               }
  //             }
  //           });

  //           parsedResult.test_cases.push(currentObject);
  //           parsedObject.results.push(parsedResult);
  //         }
  //       });
  //     });
  //   }

  //   return parsedObject;
  // }

  private splitSequences(data: string) {
    const pattern = /Test Case scenario\d+:/g;
    return data.split(pattern);
  }

  async exportToJira(testCases: any[]) {
    try {
      const settings = await SettingsController.getConfig();
      const { instanceUrl, projectKey, username, token } = settings.data.data;
      const basicToken = this.getAuthToken(username, token);
      const responses: any = [];
      for (let oneTestCase of testCases) {
        const response = await createIssue(
          basicToken,
          instanceUrl,
          projectKey,
          'Test',
          oneTestCase,
        );
        responses.push(response.data.data);
      }
      return ResponseHelper.success('Created Jira Tickets', responses);
    } catch (e: any) {
      console.log(e);
      return ResponseHelper.error('Something went wrong while exporting to Jira');
    }
  }

  private getAuthToken(user: string, password: string) {
    const token = btoa(`${user}:${password}`);
    return token;
  }
}
