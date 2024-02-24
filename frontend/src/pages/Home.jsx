import TestReport from "../componensts/TestReport";
import { httpRequest } from "../utils/utils";
import DropFileInput from "../componensts/DropFileInput";
import { useEffect, useState } from "react";
import {ProgressBar } from "react-bootstrap";
import Loading from '../componensts/Loading';
import { IoHome } from "react-icons/io5";
import axios from "axios";

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isDataPrepare, setIsDataPrepare] = useState(false)
    const [data, setData] = useState([])
  
    const onFileChange = (files) => {
        let tempName = files.name;
        const formData = new FormData();
        formData.append("file", files);
        formData.append("filename", tempName)
        setIsLoading(true);
        httpRequest
            .post("/api/file/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            .then((response) => {
                // handle the response
                setIsLoading(false);
                //setSelectedFile(response.data.data.filename)
                setIsDataPrepare(true);
                // httpRequest.post(`api/workflow/init?filename=${response.data.data.filename}`, {
                httpRequest.post(`api/workflow/init?filename=${response.data.data.filename}`, {   
                headers: {
                    "Cache-Control": "no-cache",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Access-Control-Allow-Origin": "*",
                    },
                }).then(response => {
                    setIsDataPrepare(false);
                    setData(response.data.data.results[0].test_cases)
                })
            })
            .catch((error) => {
                // handle errors
                console.log(error);
            });
    };
  
    return (
        <>
            <div className="row homeHeader">
                <h1>TestGenie <span>Empowering Testers</span></h1>
                <p>Auto generate test cases by leveraging power of GenAI.</p>
            </div>
            <div className="row">
                <div  style={{margin: "0 auto",  width: "800px"}} >
                    <DropFileInput onFileChange={(files) => onFileChange(files)}/>
                </div>
            </div>
            <div className="row"> 
                <div className="container-sm mt-4">
                    {isLoading && <Loading msg="File uploading in progress..." />}
                    {isDataPrepare && <Loading msg="Test data generation in progress..."/>}
                    {data.length > 0 && <TestReport reportData={data}/>}
                </div>
            </div>
            
        </>
    );
}