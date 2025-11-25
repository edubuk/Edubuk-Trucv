import { Button } from "@/components/ui/button"
import { useState } from "react"
//import OnChainData from "./OnChainData";
import CvById from "./CvById";
//import { connectWallet } from "@/api/contract.api";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/main";
//import { contractNFTAddress,abiNFT } from "@/contract/nft.contractData";
//import NFTGallery from "./NFTData";
import UserDocs from "./UserDocs";


const DashBoard = () => {
    //const [isActiveButton , setActiveButton] = useState<boolean>(true);
    const [cvData, setCvData] = useState([]);
    const [educationDocs,setEducationDocs] = useState({
      educations:[]
    });
    const [experienceDocs,setExperienceDocs] = useState({
      experiences:[]
    });
    // const [projectDocs,setProjectDocs] = useState<ExperienceFormValues>({
    //   experiences:[]
    // });
    //const [isNFT, setNFT] = useState<boolean>(false);

    // new: which component is selected to render
    const [selected, setSelected] = useState<"cv" | "nft" | "docs">("cv");

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

     const fetchIds = async()=>{
      const id=toast.loading("document fetching...")
      try{
        const response = await fetch(`${API_BASE_URL}/api/cv-ids`, {
          method: "GET",
          credentials:"include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if(!data.success)
        {
          toast.dismiss(id);
          return toast.error("No CV found");
        }
        setCvData(data.data);
        console.log("data",data.data)
        toast.dismiss(id);
      }
      catch(err){
        toast.dismiss(id);
        toast.error("something went wrong")
        console.log("error while fetching all doc ids",err)
      }
     }

     const idFetchHandler = ()=>{
      // keep existing behavior
      //setActiveButton(true)
      //setNFT(false);
      setSelected("cv");      // <- new: mark CV view as active
      fetchIds();
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
             const userDocs = await fetch(`${API_BASE_URL}/doc/user-docs`,{
                 method:"GET",
                 credentials:"include",
                 headers:{
                     "Content-Type":"application/json",
                 }
             })
             const data = await userDocs.json();
             console.log("data",data);
             if(!data.success)
             {
              setEducationDocs({educations:[]})
                 toast.error(data.message);
                 return;
             }
             setEducationDocs(data.data);
             setExperienceDocs(data.data);
             console.log("education data",educationDocs)
         } catch (error) {
             toast.error("something went wrong");
             console.log("error while fetching docs",error)
         }

       }

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

          {selected === "docs" && <UserDocs educationDocs={educationDocs.educations} experienceDocs={experienceDocs.experiences} />}
        </div>
    </div>
  )
}


export default DashBoard
