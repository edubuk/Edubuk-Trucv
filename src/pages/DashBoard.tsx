import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
//import OnChainData from "./OnChainData";
import CvById from "./CvById";
//import { connectWallet } from "@/api/contract.api";
import toast from "react-hot-toast";
//import { contractNFTAddress,abiNFT } from "@/contract/nft.contractData";
//import NFTGallery from "./NFTData";
import UserDocs from "./UserDocs";
import api from "@/lib/api";


const DashBoard = () => {
    //const [isActiveButton , setActiveButton] = useState<boolean>(true);
    const [cvData, setCvData] = useState([]);
    const [refreshKey,setRefreshKey] = useState<boolean>(false);
    const [userDocs,setUserDocs] = useState({
      educations:[],
      experiences:[],
      awards:[],
    });
    
    // const [projectDocs,setProjectDocs] = useState<ExperienceFormValues>({
    //   experiences:[]
    // });
    //const [isNFT, setNFT] = useState<boolean>(false);

    // new: which component is selected to render
    const [selected, setSelected] = useState<"cv" | "nft" | "docs">("docs");

    //  const getAccount = async()=>{
    //   try
    //   {
    //     const acc = await connectWallet();
    //     if(acc)
    //     setAccount(acc);
    //     console.log("logged acc",acc);
    //   }
    //   catch(e){
    //     console.log("error",e)
    //   }
    //  }

    //  const fetchIds = async()=>{
    //   const id=toast.loading("document fetching...")
    //   try{
    //     const response = await fetch(`${API_BASE_URL}/api/cv-ids`, {
    //       method: "GET",
    //       credentials:"include",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     const data = await response.json();
    //     if(!data.success)
    //     {
    //       toast.dismiss(id);
    //       return toast.error("No CV found");
    //     }
    //     setCvData(data.data);
    //     console.log("data",data.data)
    //     toast.dismiss(id);
    //   }
    //   catch(err){
    //     toast.dismiss(id);
    //     toast.error("something went wrong")
    //     console.log("error while fetching all doc ids",err)
    //   }
    //  }

     const idFetchHandler = ()=>{
      // keep existing behavior
      //setActiveButton(true)
      //setNFT(false);
      setSelected("cv");      // <- new: mark CV view as active
      //fetchIds();
      userCvs();
     }
    //  const nftFetchHandler = ()=>{
    //   //setActiveButton(false)
    //   //setNFT(true);
    //   setSelected("nft");     // <- new: mark NFT view as active
    //  }

       const getDocs = async()=>{
         // switch to docs view when fetching
         //setActiveButton(false);
         //setNFT(false);
         setSelected("docs");   // <- new: mark docs view as active

         try {
            //  const userDocs = await fetch(`${API_BASE_URL}/doc/user-docs`,{
            //      method:"GET",
            //      credentials:"include",
            //      headers:{
            //          "Content-Type":"application/json",
            //      }
            //  })
             const userDocs = await api.get("/doc/user-docs");
             const data = await userDocs.data;
             console.log("data",data);
             if(!data.success)
             {
              setUserDocs({educations:[],experiences:[],awards:[]})
                 toast.error(data.message);
                 return;
             }
             setUserDocs({educations:data.data.educations,experiences:data.data.experiences,awards:data.data.awards});
             console.log("education data",userDocs)
         } catch (error) {
             toast.error("something went wrong");
             console.log("error while fetching docs",error)
         }

       }


       const userCvs = async()=>{
        try {
          const res:any = await api.get("/cv/user-cvs");
          if(res.data.success)
          {
            setCvData(res.data.data);
          }
          console.log("data",res.data)
        } catch (error) {
          toast.error("something went wrong");
             console.log("error while fetching docs",error)
        }
       }

    useEffect(()=>{
        getDocs();
    },[refreshKey])

  return (
    <div className="flex flex-col justify-center items-center h-auto w-full">
        <div className="flex justify-center items-start gap-2 py-3 w-full bg-[#03257e]">
          <div className="relative rounded-lg p-[1px] bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]">
        <Button
          className={`text-center border border-slate-300 bg-white text-[#006666] hover:bg-slate-100 ${selected === "docs" ? "text-[#03257e] font-semibold" : "text-[#006666] border"}`}
          onClick={getDocs}
        >
          Uploaded Docs
        </Button>
        </div>
          <div className="relative rounded-lg p-[1px] bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]">
        <Button
          className={`text-center border border-slate-300 text-[#006666] hover:bg-slate-100 bg-white ${selected === "cv" ? "text-[#03257e] font-semibold" : "text-[#006666] border"}`}
          onClick={idFetchHandler}
        >
          Get Your CV
        </Button>
        </div>
        <div className="relative rounded-lg p-[1px] bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]">
        {/* <Button
          className={`text-center border border-slate-300 text-[#006666] hover:bg-slate-100 bg-white ${selected === "nft" ? "text-[#03257e] font-semibold" : "text-[#006666] border"}`}
          onClick={nftFetchHandler}
        >
          Fetch your NFTs
        </Button> */}
        </div>
        </div>

        <div className="flex justify-center items-center gap-2 my-4 w-full">
          {/* Render only the selected component */}
          {selected === "cv" && <CvById cvData={cvData} />}

          {/* {selected === "nft" && <NFTGallery contractAddress={contractNFTAddress} abi={abiNFT} account={account!}/>} */}

          {selected === "docs" && <UserDocs educationDocs={userDocs.educations} experienceDocs={userDocs.experiences} awardDocs = {userDocs.awards} setRefreshKey={setRefreshKey}/>}
        </div>
    </div>
  )
}


export default DashBoard
