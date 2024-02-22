import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExportToExcel } from './ExportToExcel';

const TestReport = () => {
     const [data, setData] = useState([])
     const tableData = async () => {
        try {
            const tableDataResponse = await axios.get('http://localhost:5173/data/data.json', {
                headers: {
                  "Cache-Control": "no-cache",
                  "Content-Type": "application/x-www-form-urlencoded",
                  "Access-Control-Allow-Origin": "*",
                },
              });
            setData(tableDataResponse.data.table)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        tableData();
    }, []);
    const customHeadings = data.map(item=> {
        return {
            "Test Scenarios":item.scenarios,
            "Input Data":item.inputData,
            "Expected Result":item.expectedOutput
        }
    })
    
  return (
    <div className="container-xl mt-4">
		<div className="row">
			<div className="card mb-4">
				<div className="card-header d-flex justify-content-between">
                    <p style={{marginBottom: 0}}>Generated Test Case</p>
                    {/* <button className="btn btn-primary" type="button">Export Excel File</button> */}
                    <ExportToExcel apiData={customHeadings} fileName="myFile" />
                </div>
                <div className='card-body'>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Test Scenarios</th>
                                <th>Input Data</th>
                                <th>Expected Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.length>0 && data.map((item,index) => {
                                    return (<tr key={index}>
                                        <td>{item.scenarios}</td>
                                        <td>{item.inputData}</td>
                                        <td>{item.expectedOutput}</td>
                                    </tr>)
                               })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TestReport