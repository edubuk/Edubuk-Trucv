import api from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


const IssuedCertificates = ()=>{
    const [hackathonName,setHackathonName] = useState<string>("");
    const [currPage,setCurrPage] = useState<number>(1);
    const [hackathonData,setHackathonData] = useState<any>(null);
    const [totalPages,setTotalPages] = useState<number>(1);
    const [totalCert,setTotalCert] = useState<number>();
    const [isFetching,setIsFetching] = useState(true);

    const fetchHackathonCertificateList = async() => {
        try {
            setIsFetching(true);
            const response = await api.get(`/admin/hackathon-certificate-list?hackathonName=${hackathonName}&page=${currPage}`);
            console.log(response.data);
            setHackathonData(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
            setTotalCert(response.data.pagination.totalCertificate)
        } catch (error:any) {
            toast.error(error.message || error)
        }finally{
            setIsFetching(false);
        }
    }
    useEffect(()=>{
        fetchHackathonCertificateList();
    },[currPage])

    const handlePrev = () => {
    if (currPage > 1)
      setCurrPage(currPage - 1);
  }

  const handleNext = () => {
    if (currPage < totalPages)
      setCurrPage(currPage + 1);
  }

//   if(isFetching)
//   {
//     return(
//         <ThreeDotLoader w={4} h={4} yPos="center"/>
//     )
//   }

    return(
        <main className="max-w-9xl mx-auto px-4 sm:px-6 py-6 space-y-4 overflow-y-auto mb-12">
            <div className="sticky flex items-center justify-between bg-[#03257e] p-4 rounded">
                <div>
                    <h2 className="text-white text-xl font-semibold">Hackathon Certificate List</h2>
                </div>
                <div className="flex items-center gap-2">
                    <input type="text" value={hackathonName} onChange={(e)=>setHackathonName(e.target.value)} 
                    placeholder="Search by hackathon name"
                    className="border border-white rounded px-2 py-2 text-black" />
                    <button onClick={()=>fetchHackathonCertificateList()} className="bg-white text-[#03257e] px-4 py-2 rounded">Search</button>
                </div>
            </div>
            {
                isFetching&&
                <div className="mt-3">
                {
                    Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="flex items-center shadow-md p-4 rounded mb-4 bg-white border border-gray-100 animate-pulse">
                            <div className="flex items-center justify-between w-full text-[#03257e]">
                                <div className="bg-gray-200 w-20 p-2 flex rounded items-center justify-center animate-pulse">
                                    <p className="text-gray-500 w-full"></p>
                                </div>
                                <p>...</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            }

           { !isFetching && <div className="mt-3">
                {hackathonData?.length === 0 ? (
                    <div className="text-center text-gray-500">
                        No hackathon certificates found
                    </div>
                ):<p className="mb-1 text-[#006666] font-bold">Total Certificates: {totalCert}</p>}
                {
                    hackathonData?.map((cert:any,i:number)=>(
                        <div key={i} className="flex items-center shadow-md p-4 rounded mb-4 bg-white border border-gray-100">
                            <div className="flex items-center justify-between w-full text-[#03257e]">
                                <a href={`https://trucvstorage.blob.core.windows.net/uploads/${cert.certUrl}`} target="_blank" rel="noopener noreferrer" className="underline">
                                    View Certificate
                                </a>
                                <p>{cert?.txHash?.slice(0,5)}...{cert?.txHash?.slice(-5)}</p>
                            </div>
                        </div>
                    ))
                }
            </div>}
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
        </main>
    )
}

export default IssuedCertificates;