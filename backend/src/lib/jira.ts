import axios from "axios";
import { ResponseHelper } from "../utils/response-helper";

export const createIssue = async (token: string, instance: string, projectKey: string, issueType: string, data: any) => {
    let input = JSON.stringify({
        "fields": {
            "project": {
                "key": projectKey
            },
            "summary": "creting 2nd story",
            "description": {
                "type": "doc",
                "version": 1,
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {
                                "type": "text",
                                "text": "This is heading"
                            }
                        ]
                    },
                    {
                        "type": "paragraph",
                        "content": [
                            {
                                "type": "text",
                                "text": "This is example story created by JIRA apis"
                            }
                        ]
                    }
                ]
            },
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