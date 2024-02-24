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
    const [progress, setProgress] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [data, setData] = useState([])

    const tableData = async () => {
        
    };

    // useEffect(() => {
    //    selectedFile && tableData();
    // }, [selectedFile]);
  
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
                onUploadProgress: data => {
                    //console.log(data)
                    //Set the progress value to show the progress bar
                    setProgress(Math.round((100 * data.loaded) / data.total))
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

                // try {
                //     console.log(`api/workflow/init?filename=${response.data.data.filename}`)
                //     const tableDataResponse = ;
                //     if(tableDataResponse.status === 200){
                //         setIsDataPrepare(false)
                //         console.log(tableDataResponse)
                //     }
                // } catch (error) {
                //     console.log(error);
                // }
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
            <h4><IoHome /></h4>
            <h5 style={{ textAlign: "center"}}> Welcome to TestGenie</h5>
            <div className="container-sm mt-4">
                <div  style={{margin: "0 auto",  width: "800px"}} >
        <DropFileInput onFileChange={(files) => onFileChange(files)}/>
    </div>
                
                {/* {progress  && <ProgressBar now={progress} label={`${progress}%`} />} */}
                
                {isLoading && <Loading msg="File uploading in progress..." />}
                {isDataPrepare && <Loading msg="Test data generation in progress..."/>}
                {data.length > 0 && <TestReport reportData={data}/>}
            </div>
        </>
    );
}