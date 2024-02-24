import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExportToExcel } from './ExportToExcel';

const TestReport = ({reportData}) => {
    const [data,setData] = useState(reportData);
  return (
    <div className="container-xl mt-4">
		<div className="row">
			<div className="card mb-4">
				<div className="card-header d-flex justify-content-between">
                    <p style={{marginBottom: 0}}>Generated Test Case</p>
                    {/* <button className="btn btn-primary" type="button">Export Excel File</button> */}
                     <ExportToExcel apiData={data} fileName="myFile" /> 
                </div>
                <div className='card-body'>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Test number</th>
                                <th>Test Case</th>
                                <th>Input Data</th>
                                <th>Preconditions/Dependencies</th>
                                <th>Steps</th>
                                <th>Expected Output</th>
                                <th>Response code</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            data.map((item,index) => {
                                return (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{item.test_case_scenario}</td>
                                    <td>{item.sample_input_data_in_json_format}</td>
                                    <td>{item.preconditions_and_dependencies}</td>
                                    <td>{item.testing_steps}</td>
                                    <td>{item.sample_output_data_in_json_format}</td>
                                    <td>{item.all_returned_output_status_codes}</td>
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