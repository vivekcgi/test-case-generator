import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/Home";
import SettingPage from './pages/Setting'
import LoginPage from './pages/Login'
import ErrorPage from "./pages/Error";
import 'bootstrap/scss/bootstrap.scss'

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		errorElement: <ErrorPage />,
		
		children: [
			{
				index: true,
				element: <HomePage />,
				errorElement: <ErrorPage />,
			},
			{	
				path:"setting",
				element: <SettingPage />,
				errorElement: <ErrorPage />,
			},
			{	
				path:"login",
				element: <LoginPage />,
				errorElement: <ErrorPage />,
			}
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;