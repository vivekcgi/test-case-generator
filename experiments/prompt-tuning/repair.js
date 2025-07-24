const { jsonrepair } = require('jsonrepair');

const data = '[{"scenario":"successfully get all projects using search text and filter input","sampleInput":{"searchText":"Element","filterInput":{},"searchText2":""},"preconditions":["user must be authenticated"],"steps":["set the authorization header with valid token","call the projects query with search text and filter input","observe the output"],"sampleOutput":{"data":[{"name":"SampleProject","projectId":"1234-1234-1234-1234567890","elementType":"Project","root":{}}],"status":{"200":"Successful operation","totalRecords":100}},{"scenario":"successfully get all projects without search text and filter input","sampleInput":{"searchText":"","filterInput":{}},"preconditions":["user must be authenticated"],"steps":["set the authorization header with valid token","call the projects query with search text and filter input","observe the output"],"sampleOutput":{"data":[{"name":"SampleProject-1","projectId":"1234-1234-1234-1234567890","elementType":"Project","root":{}}],"status":{"200":"Successful operation","totalRecords":100}},{"scenario":"call to the projects query with unauthenticated user","sampleInput":{"searchText":"Element","filterInput":{},"searchText2":""},"preconditions":["user must not be authenticated"],"steps":["do not set the authorization header with auth token","call the projects query with search text and filter input","observe the output"],"sampleOutput":{},"status":{"401":"Unauthenticated"}},{"scenario":"call to the projects query with unauthorized user","sampleInput":{"searchText":"Element","filterInput":{},"searchText2":""},"preconditions":["user must be authenticated"],"steps":["set the authorization header with user auth token having improper permissions","call the projects query with search text and filter input","observe the output"],"sampleOutput":{},"status":{"403":"Forbidden"}}]';

try {
    const json = "{name: 'John'}"
    console.log(jsonrepair(json))
    const repaired = jsonrepair(data)
    console.log('repaired => ', repaired)
} catch(e){
    console.log(e.message);
}