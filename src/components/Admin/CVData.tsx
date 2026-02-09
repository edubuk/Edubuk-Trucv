import api from "@/lib/api";
import { useEffect, useState } from "react";
import ThreeDotLoader from "../Loader/ThreeDotLoader";
import { ArrowUpRight} from "lucide-react";
import axios from "axios";


const CVData = ()=>{
    const [selectedCV, setSelectedCV] = useState('TruCV');
    const [cvIds,setCvIds] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCV, setTotalCV] = useState(0);

    const fetchCVIds = async (cvType: string) => {
        try {
            if(cvType === "TruCV"){
            setSelectedCV(cvType);
            setFetching(true);
            const response = await api.get(`/admin/all-user-cvs?page=${currPage}`);
            console.log(response.data);
            setCvIds(response.data.data);
            setTotalPages(response.data.totalPage);
            setTotalCV(response.data.totalCVs);
            }
            if(cvType === "Educhain-CV"){
            setSelectedCV(cvType);
            setFetching(true);
            return (
                <div>
                    <p className="items-center text-[#f14419] font-bold text-lg">Under Development...</p>
                </div>
            )
            // const response = await api.get(`/admin/all-user-cvs?page=${currPage}`);
            // console.log(response.data);
            // setCvIds(response.data.data);
            // setTotalPages(response.data.totalPage);
            // setTotalCV(response.data.totalCVs);
            }
            if(cvType === "Lisk-CV"){
            setSelectedCV(cvType);
            setFetching(true);
            const response = await axios.get(`https://www.edubuktrucvlisk.org/cv/all_user_cvs?page=${currPage}`);
            console.log(response.data);
            setCvIds(response.data.cvIds);
            setTotalPages(response.data.totalPages);
            setTotalCV(response.data.totalCvs);
            }
            if(cvType === "Algorand-CV"){
            setSelectedCV(cvType);
            setFetching(true);
            const response = await api.get(`https://algorand-trucv-backend.edubuktrucv.com/admin/all-user-cvs?page=${currPage}`);
            console.log(response.data);
            setCvIds(response.data.data);
            setTotalPages(response.data.totalPage);
            setTotalCV(response.data.totalCVs);
            }
            if(cvType === "Educhain-CV"){
            // setSelectedCV(cvType);
            // setFetching(true);
            // const response = await api.get(`https://algorand-trucv-backend.edubuktrucv.com/admin/all-user-cvs?page=${currPage}`);
            // console.log(response.data);
            // setCvIds(response.data.data);
            // setTotalPages(response.data.totalPage);
            // setTotalCV(response.data.totalCVs);
            }
        } catch (error) {
            console.error('Error fetching CV IDs:', error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(()=>{
        fetchCVIds(selectedCV);
    },[currPage])

        const handlePrev = () => {
    if (currPage > 1)
      setCurrPage(currPage - 1);
  }

  const handleNext = () => {
    if (currPage < totalPages)
      setCurrPage(currPage + 1);
  }

    return(
        <div className="flex flex-col h-full">
            <div className="flex justify-center flex-wrap items-center gap-2 border-b-2 border-gray-300 rounded-lg p-2 w-full mb-2">
                <button className={`${selectedCV === 'TruCV' ? 'bg-[#03257e] text-white' : 'bg-gray-300 text-black'} px-4 py-2 rounded-lg`} onClick={() => fetchCVIds('TruCV')}>TruCV</button>
                <button className={`${selectedCV === 'Educhain-CV' ? 'bg-[#03257e] text-white' : 'bg-gray-300 text-black'} px-4 py-2 rounded-lg`} onClick={() => fetchCVIds('Educhain-CV')}>Educhain CV</button>
                <button className={`${selectedCV === 'Lisk-CV' ? 'bg-[#03257e] text-white' : 'bg-gray-300 text-black'} px-4 py-2 rounded-lg`} onClick={() => fetchCVIds('Lisk-CV')}>Lisk CV</button>
                <button className={`${selectedCV === 'Algorand-CV' ? 'bg-[#03257e] text-white' : 'bg-gray-300 text-black'} px-4 py-2 rounded-lg`} onClick={() => fetchCVIds('Algorand-CV')}>Algorand CV</button>
            </div>

            <div>
                {fetching ? (
                    <ThreeDotLoader w={4} h={4} yPos="center" />
                ) : (
                    <div className="flex flex-col gap-2">
                    <div className="text-center mb-2 text-[#f14419] font-bold">
                        Total CVs: {totalCV}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {cvIds?.map((cvId:any) => (
                            <a key={cvId._id} 
                            href={selectedCV==="TruCV" ? `/cv/${cvId._id}` : selectedCV==="Lisk-CV" ? `https://tru-cv-lisk.vercel.app/cv/${cvId._id}` : selectedCV==="Algorand-CV" ? `https://algorand.edubuktrucv.com/cv/${cvId._id}` :`/cv/${cvId._id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full flex mb-2 p-2 bg-[#006666] text-white rounded-lg hover:bg-[#005555] transition-colors">
                                CV-{cvId._id.slice(0,4)}...{cvId._id.slice(-4)} <ArrowUpRight />
                            </a>
                        ))}
                    </div>
                    </div>
                )}
            </div>
            <div className="fixed bottom-1 left-0 right-0 flex justify-center items-center space-x-4 bg-white p-3 shadow-md rounded-md">
            <button
              onClick={handlePrev}
              disabled={currPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-gray-800 font-medium">
              Page {currPage} / {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
    )
}

export default CVData;