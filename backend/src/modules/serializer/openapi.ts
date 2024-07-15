import { ISerialize } from './serializer.interface';

export class OpenapiSerializer implements ISerialize {
  async serialize(promptResult: any) {
    const parsedResponse = JSON.parse(JSON.stringify(promptResult));
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

  private splitSequences(data: string) {
    const pattern = /Test Case scenario\d+:/g;
    return data.split(pattern);
  }
}
