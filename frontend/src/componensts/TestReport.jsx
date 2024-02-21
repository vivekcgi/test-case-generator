import React from 'react'

const TestReport = () => {
  return (
    <div className="container-xl mt-4">
		<div className="row">
			<div className="card mb-4">
				<div className="card-header d-flex justify-content-between">
                    <p style={{marginBottom: 0}}>Generated Test Case</p>
                    <button className="btn btn-primary" type="button">Export Excel File</button>
                </div>
                <div className='card-body'>
                    <table className="table border bg-white">
                        <thead>
                            <tr>
                                <th>Test Scenarios</th>
                                <th>Input Data</th>
                                <th>Expected Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Login User</td>
                                <td>{`{name: 'milinds', password:'Abc#@1'}`}</td>
                                <td>{`{name: 'milinds', token:'Abc#@1'}`}</td>
                            </tr>
                            <tr>
                                <td>Fetch Users</td>
                                <td>/Users</td>
                                <td>{`
                                {id: 123,name:"milinds"}{id:342,name:"VivekK"}`}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TestReport