import { ICvData } from "@/CvBuilder/CvBuilder";
import api from "@/lib/api";

interface CVResponse{
    cvData:ICvData;
}

export const cvService = {ICvData:async(userId:string):Promise<CVResponse>=>{
        const {data} = await api.get(`/cv/user/${userId}`)
        console.log("data",data)
        return data;
}
}