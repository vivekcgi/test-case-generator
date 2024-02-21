import { Outlet, useNavigation } from "react-router-dom";
import Headers from "../componensts/Header";
const Layout = () => {
	const navigation = useNavigation();
	const isPageLoading = navigation.state === "loading";

	return (
		<>
			<Headers />
			<main className="container">
				<div className="mt-5 bg-light rounded">
					{isPageLoading ? <div className='loading' /> : <Outlet />}
				</div>
			</main>
		</>
	);
};

export default Layout;