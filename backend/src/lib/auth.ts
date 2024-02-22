import axios from "axios"
import { config } from "../config/config";

export const token = async () => {

    const data = new URLSearchParams();
    data.set("grant_type", "urn:ibm:params:oauth:grant-type:apikey");
    data.set("apikey", config.ibm.iam.apiKey as string);
    
    try{
        const response = await axios.post(config.ibm.iam.tokenUrl as string, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
        return response.data;
    }catch(e) {
        console.log(e);
    }
    
}