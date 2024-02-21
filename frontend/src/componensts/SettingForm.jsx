/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";

const SettingForm = () => {
  return (
    <div className="container-xl mt-4">
		<div className="row">
			<div className="card mb-4">
				<div className="card-header">Jira Account Details</div>
				<div className="card-body">
					<form>
						<div className="mb-3">
							<label className="small mb-1" htmlFor="projectUrl">Project Instance URL</label>
							<input className="form-control" id="projectUrl" type="text" placeholder="Enter your Jira instance URL" value=""/>
						</div>
						<div className="mb-3">
							<label className="small mb-1" htmlFor="projectToken">Project Token</label>
							<input className="form-control" id="projectToken" type="text" placeholder="Enter your Jira acces token" value=""/>
						</div>
						<div className="mb-3">
							<label className="small mb-1" htmlFor="projects">Projects</label>
							<input className="form-control" id="projects" type="text" placeholder="Enter projects name comma seperator" value=""/>
						</div>
						<button className="btn btn-primary" type="button">Save changes</button>
					</form>
				</div>
			</div>
		</div>
 	</div>
  );
};

export default SettingForm;
