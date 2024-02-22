/* eslint-disable no-mixed-spaces-and-tabs */
import * as formik from 'formik';
import * as yup from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const SettingForm = () => {
	const { Formik } = formik;

	const schema = yup.object().shape({
		projectUrl: yup.string().required(),
		projectToken: yup.string().required(),
		projects: yup.string().required(),
	});
	
	return (
		<div className="container-xl mt-4">
			<div className="row">
				<div className="card mb-4">
					<div className="card-header">Jira Account Details</div>
					<div className="card-body">
						<Formik
							validationSchema={schema}
							onSubmit={console.log}
							initialValues={{
								projectUrl:'',
								projectToken:'',
								projects: '',
							}}
						>
						{({ handleSubmit, handleChange, values, errors }) => (
							<Form noValidate onSubmit={handleSubmit}>
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
									<Form.Label>Projects</Form.Label>
									<Form.Control
										type="text"
										name="projects"
										value={values.projects}
										onChange={handleChange}
										isInvalid={!!errors.projects}
										placeholder='Enter projects name comma seperator'
									/>
									<Form.Control.Feedback> {errors.projects}</Form.Control.Feedback>
								</div>
								<Button type="submit">Submit form</Button>
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
