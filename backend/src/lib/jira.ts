import axios from "axios";
import { ResponseHelper } from "../utils/response-helper";

const splitter = (input: string) => input.split(/\d+\./).filter(sentence => sentence.trim() !== '');

export const getStatus = (input: string): string[] => {
    const result = new Map<number, string>();
    const regex = /(\d+): (.+?)(?=\d+: |\z)/g;
    let match;
 
    while ((match = regex.exec(input)) !== null) {
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        result.set(parseInt(match[1]), match[2]);
    }
    const res: string[] = []
    result.forEach((value, key) => {
        res.push(`${key}: ${value}`)
    });
    return res;
}

const createBoldParagraph = (data): any => {
    return {
        "type": "paragraph",
        "content": [
            {
                "type": "text",
                "text": data,
                "marks": [
                    {
                        "type": "strong"
                    }
                ]
            }
        ]
    }
}

const createCodeBlockDocument = (languageType, code): any => {
    return { 
        "type": "codeBlock", 
        "attrs": { "language": languageType }, 
        "content": [
            { "type": "text", "text": code }
        ]};
}

const createBulletedListDocument = (data): any[] => {
    // const splitted = splitter(data);
    const formatted = data.map((oneObj) => ({
        "type": "bulletList",
        "content": [
            {
                "type": "listItem",
                "content": [{
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": oneObj
                        }
                    ]
                }]
            }
        ]
    }))

    return formatted;
}

export const getJiraDoc = async (data) => {
    const jiraDoc: any = {
        version: 1,
        type: "doc",
        content: []
    };

    // Preconditions and dependancies
    jiraDoc.content.push(createBoldParagraph("Preconditions and Dependencies: "))
    const splittedConditions = splitter(data.preconditions_and_dependencies);
    const allConditions = createBulletedListDocument(splittedConditions);
    jiraDoc.content.push(...allConditions)

    // Input Data
    jiraDoc.content.push(createBoldParagraph("Input Data: "))
    const code = createCodeBlockDocument("JSON", data.sample_input_data_in_json_format);
    jiraDoc.content.push(code);

    // Testing Steps
    jiraDoc.content.push(createBoldParagraph("Testing Steps: "));
    const splittedCTest = splitter(data.testing_steps);
    const allSteps = createBulletedListDocument(splittedCTest);
    jiraDoc.content.push(...allSteps)
    
    // Output Data
    jiraDoc.content.push(createBoldParagraph("Output Data: "));    
    jiraDoc.content.push(createCodeBlockDocument("JSON", data.sample_output_data_in_json_format));
    
    const statuses = getStatus(data.all_returned_output_status_codes);
    jiraDoc.content.push(createBoldParagraph("Supported Statuses: "));
    const allStatuses = createBulletedListDocument(statuses);
    jiraDoc.content.push(...allStatuses)

    return jiraDoc;
}

export const createIssue = async (token: string, instance: string, projectKey: string, issueType: string, data: any) => {
    const jiraDoc = await getJiraDoc(data);
    
    let input = JSON.stringify({
        "fields": {
            "project": {
                "key": projectKey
            },
            "summary": data.test_case_scenario,
            "description": jiraDoc,
            "issuetype": {
                "name": issueType
            }
        }
    });

    try {
        const response = await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: instance,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`
            },
            data: input
        })
        return ResponseHelper.success('Jira issue created', response.data);
    } catch (e: any) {
        console.log(e);
        return ResponseHelper.error('Something went wrong while creating Jira issue');
    }
}
