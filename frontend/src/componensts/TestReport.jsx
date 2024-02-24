import { useState } from "react";
import { ExportToExcel } from "./ExportToExcel";
import { httpRequest } from "../utils/utils";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TestReport = ({ reportData }) => {
	const [isLoading, setIsLoading] = useState(false);
    const splitter = (input,numbers) => {
        const listingArray = input
            .split(/\d+\./)
            .filter((sentence) => sentence.trim() !== "");
        return (
            (numbers===true)?
                <ol>
                {listingArray.map((item, index) => {
                                            return <li key={index}>{item}</li>;
                                    })}
            </ol>
            
           :
                <ul>
                {listingArray.map((item, index) => {
                                            return <li key={index}>{item}</li>;
                                    })}
            </ul>
                    );
    };

    const getStatus = (input) => {
        const result = new Map();
        const regex = /(\d+): (.+?)(?=\d+: |\z)/g;
        let match;
        while ((match = regex.exec(input)) !== null) {
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            result.set(parseInt(match[1]), match[2]);
        }
        const res = [];
        result.forEach((value, key) => {
            res.push(`${key}: ${value}`);
        });

        return (
            <ul>
                {res.map((item, index) => {
                    return <li key={index}>{item}</li>;
                })}
            </ul>
        );
    };

	const generateJira = (data) => {
		console.log(data)
		setIsLoading(true);
        httpRequest.post("api/jira/export", {tests:data}).then((response)=> {
			if(response.status===200) {
				setIsLoading(false);
                toast.success(' Ticket generated Successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
			}
			console.log(response);
		}).catch((error) => {
			console.log(error);
		})
	}

    return (
        <div className="container-xl mt-4">
            <div className="row">
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between">
                    <ToastContainer />
                        <p style={{ marginBottom: 0 }}>Generated Test Case</p>
						<DropdownButton id="dropdown-basic-button" title="Export">
							<Dropdown.Item>
								<ExportToExcel apiData={reportData} fileName="Generated test cases" />
							</Dropdown.Item>
							<Dropdown.Item>
								<button type="button" onClick={(e) => generateJira(reportData)}>Jira Ticket</button>
							</Dropdown.Item>
						</DropdownButton> 
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Test Case</th>
                                    <th>Input Data</th>
                                    <th>Preresquisite</th>
                                    <th>Test Steps</th>
                                    <th>Expected Output</th>
                                    <th>Supported Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => {
                                   return (
                                        <tr key={index}>
                                           
                                            <td>{index + 1}</td>
                                            <td>{item.test_case_scenario}</td>
                                            <td>
                                                <code>
                                                    {
                                                        item.sample_input_data_in_json_format
                                                    }
                                                </code>
                                            </td>
                                            <td>
                                                {
                                               item.preconditions_and_dependencies &&  splitter(
                                                    item.preconditions_and_dependencies
                                                )
                                                }
                                            </td>
                                            <td>
                                                {item.testing_steps && splitter(item.testing_steps,true)}
                                            </td>
                                            <td>
                                                <code>
                                                    {
                                                        item.sample_output_data_in_json_format
                                                    }
                                                </code>
                                            </td>
                                            <td>
                                                {getStatus(
                                                    item.all_returned_output_status_codes
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestReport;
