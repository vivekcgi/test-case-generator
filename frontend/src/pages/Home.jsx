import TestReport from "../componensts/TestReport";
import { httpRequest } from "../utils/utils";
import DropFileInput from "../componensts/DropFileInput";
import { useEffect, useState } from "react";
import {ProgressBar } from "react-bootstrap";
import Loading from '../componensts/Loading';
import axios from "axios";

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [data, setData] = useState([])

    const tableData = async () => {
        try {
            console.log(`http://localhost:5173/data/${selectedFile}`)
            const tableDataResponse = await axios.get(`http://localhost:5173/data/${selectedFile}`, {
                headers: {
                  "Cache-Control": "no-cache",
                  "Content-Type": "application/x-www-form-urlencoded",
                  "Access-Control-Allow-Origin": "*",
                },
              });
              setData(tableDataResponse);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
       selectedFile && tableData();
    }, [selectedFile]);
  
    const onFileChange = (files) => {
        const formData = new FormData();
        formData.append("file", files);
        formData.append("filename", "test.json")
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
                setIsLoading(false);console.log(response.data.data.filename)
                setSelectedFile(response.data.data.filename)
            })
            .catch((error) => {
                // handle errors
                console.log(error);
            });
    };

    
    return (
        <>
            <h4>Home</h4>
            <div className="container-xl mt-4">
                <DropFileInput onFileChange={(files) => onFileChange(files)} />
                {/* {progress  && <ProgressBar now={progress} label={`${progress}%`} />} */}
                
                {(isLoading && data) ? <Loading/> :<TestReport testCase={data}/>}
            </div>
        </>
    );
}
