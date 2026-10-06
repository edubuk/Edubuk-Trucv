
interface IssuedCertificatesListProps {
    loading: boolean;
    currPage: number;
    setCurrPage: (page: number) => void;
    hackathonData: any;
    setHackathonData: (data: any) => void;
    totalPages: number;
    setTotalPages: (pages: number) => void;
    totalCert: number;
    setTotalCert: (cert: number) => void;
    setShowCertificates: (show: boolean) => void;
}

const IssuedCertificatesList = ({loading,currPage, setCurrPage, hackathonData,totalPages, totalCert, setShowCertificates}: IssuedCertificatesListProps)=>{



    const handlePrev = () => {
    if (currPage > 1)
      setCurrPage(currPage - 1);
  }

  const handleNext = () => {
    if (currPage < totalPages)
      setCurrPage(currPage + 1);
  }

//   if(loading)
//   {
//     return(
//         <ThreeDotLoader w={4} h={4} yPos="center"/>
//     )
//   }

    return(
        <main className="fixed inset-0 z-50 bg-white backdrop-blur-sm h-auto max-w-9xl mx-auto px-4 py-2 overflow-y-auto mb-0">
            <div className="sticky top-0 left-0 right-0 flex items-center justify-between bg-[#03257e] p-4 rounded">
                <div>
                    <h2 className="text-white text-xl font-semibold w-full">Hackathon Certificate List</h2>
                </div>
                <button onClick={() => setShowCertificates(false)} className="bg-white text-[#03257e] px-4 py-2 rounded">Close</button>
            </div>

            {loading && <div className="mt-3">
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
            </div>}

            {(!loading) && <div className="mt-3">
                {hackathonData?.length === 0 ? (
                    <div className="text-center text-[#f14419] h-screen flex items-center justify-center">
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

            <div className="sticky bottom-0 left-0 right-0 flex justify-center items-center space-x-4 bg-white p-3 shadow-md rounded-md z-40">
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

export default IssuedCertificatesList;