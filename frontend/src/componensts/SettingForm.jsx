/* eslint-disable no-mixed-spaces-and-tabs */
import { useState, useEffect } from 'react';
import * as formik from 'formik';
import * as yup from 'yup';
import { httpRequest } from '../utils/utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";

const SettingForm = () => {
	const [success, setSuccess] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const [jvalues,setJvalues] = useState({username:'',
	instanceUrl:'',
		token:'',
		projectKey: '',
	});
	const navigate = useNavigate();
	const { Formik } = formik;

	const schema = yup.object().shape({
		userName: yup.string().required(),
		projectUrl: yup.string().required(),
		projectToken: yup.string().required(),
		projectKey: yup.string().required(),
	});
	
	const onSubmit = async (values) => {
		console.log(values);
		setLoading(true);
		await httpRequest.post("/api/config/jira",{
			instanceUrl: values.projectUrl,
			username: values.userName,
			token: values.projectToken,
			projectKey: values.projectKey
		}).then(function (response) {
			setLoading(false);
			if(response.status === 200) {
				toast("This is a custom toast Notification!", {
					position: "top-center",
					className: "toast-message",
				});
				
				console.log(response.data)
				localStorage.setItem('setting', response.data)
				navigate('/home');
			}
		  })
		  .catch(function (error) {
			setLoading(false);
			console.log(error);
		  });
	}
	useEffect( ()=>{
			async function loadSettings(){
			await httpRequest.get("/api/config/jira").then(function (response) {
					if(response.status === 200) {
							toast("This is a custom toast Notification!", {
									position: "top-center",
									className: "toast-message",
							});
							// console.log("get: ",response.data.data);
							setJvalues({instanceUrl:response.data.data.instanceUrl,
								projectKey: response.data.data.projectKey,
								token: response.data.data.token,
								username: response.data.data.username});
				
					}
		  })
		  	  .catch(function (error) {
					setLoading(false);
					console.log(error);
		  	  });
			}
		loadSettings();
	},[])
	// console.log(values.username)
	return (
		<div className="container-xl mt-4">
			<div className="row">
				<div className="card mb-4">
					<div className="card-header">Jira Account Details</div>
					<div className="card-body">
						<Formik
							validationSchema={schema}
							onSubmit={onSubmit}
							initialValues={{
								userName:jvalues.username,
								projectUrl:jvalues.instanceUrl,
								projectToken:jvalues.token,
								projectKey: jvalues.projectKey,
							}}
							enableReinitialize
						>
						{({ handleSubmit, handleChange, values, errors }) => (
							<Form noValidate onSubmit={handleSubmit}>
								<div className="mb-3">
									<Form.Label>User Name</Form.Label>
									<Form.Control
										type="text"
										name="userName"
										value={values.userName}
										onChange={handleChange}
										isInvalid={!!errors.userName}
										placeholder='Enter user name'
									/>
									<Form.Control.Feedback> {errors.userName}</Form.Control.Feedback>
								</div>
								<div className="mb-3">
									<Form.Label>Project Instance URL</Form.Label>
									<Form.Control
										type="text"
										name="projectUrl"
										value={values.projectUrl}
										onChange={handleChange}
										isInvalid={!!errors.projectUrl}
										placeholder='Project Instance URL'
									/>
									<Form.Control.Feedback> {errors.projectUrl}</Form.Control.Feedback>
								</div>
								<div className="mb-3">
									<Form.Label>Project Token</Form.Label>
									<Form.Control
										type="text"
										name="projectToken"
										value={values.projectToken}
										onChange={handleChange}
										isInvalid={!!errors.projectToken}
										placeholder='Enter your Jira acces token'
									/>
									<Form.Control.Feedback> {errors.projectToken}</Form.Control.Feedback>
								</div>
								<div className="mb-3">
									<Form.Label>Project Key</Form.Label>
									<Form.Control
										type="password"
										name="projectKey"
										value={values.projectKey}
										onChange={handleChange}
										isInvalid={!!errors.projectKey}
										placeholder='Enter project key'
									/>
									<Form.Control.Feedback> {errors.projectKey}</Form.Control.Feedback>
								</div>
								{isLoading ? (
									<button className="btn btn-primary" type="button" disabled>
										<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
										Submitting...
									</button>
								) : (
									<button className="btn btn-primary" type="submit">
										<span>Submit</span>
									</button>
								)}
								
							</Form>
						)}
						</Formik>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingForm;
