import TestReport from "../componensts/TestReport";
import { httpRequest } from "../utils/utils";
import DropFileInput from "../componensts/DropFileInput";
export default function HomePage() {
  const onFileChange = (files) => {
    console.log(files)
    // httpRequest
    //   .post("/api/file/upload", files, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then((response) => {
    //     // handle the response
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     // handle errors
    //     console.log(error);
    //   });
  };
  return (
    <>
      <h4>Home</h4>
      <div className="container-xl mt-4">
        <DropFileInput onFileChange={(files) => onFileChange(files)} />
        <TestReport />
      </div>
    </>
  );
}
