import TestReport from "../componensts/TestReport";
import { httpRequest } from "../utils/utils";
import DropFileInput from "../componensts/DropFileInput";
import {useState } from "react";
import Loading from '../componensts/Loading';
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
                },
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
   
    console.log(data)
    console.log(data.length)
    return (
        <>
            <h4>Home</h4>
            <div className="container-xl mt-4">
                <DropFileInput onFileChange={(files) => onFileChange(files)} />
                {isLoading && <Loading msg="File uploading in progress..." />}
                {isDataPrepare && <Loading msg="Test data generation in progress..."/>}
                {data.length > 0 && <TestReport reportData={data}/>}
            </div>
        </>
    );
}