import { useState } from "react";
//import RegisterHackathon from "./RegisterHackathon";
// import IssuedCertificates from "./IssuedCertificates";
// import HackathonList from "./HackathonLists";



const ManageHackathon = () => {

  const [activeTab, setActiveTab] = useState<"Register" | "Certificate List" | "Hackathon List">("Register");
  
  return (
    <div className="w-full" >
       <div className="flex items-center justify-between border-b border-gray-200 mb-6">
        <div className="flex">
          {(["Register", "Certificate List", "Hackathon List"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === activeTab
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "Register" ? "Register" : tab === "Certificate List" ? "Certificate List" : "Hackathon List"}
            </button>
          ))}
        </div>

        {/* <button
          onClick={()=>refetch()}
          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button> */}
      </div>
      {/* {activeTab === "Register" ? 
      <RegisterHackathon heading="Register Hackathon" buttonLabel="Register Hackathon"/> : activeTab === "Certificate List" ? <IssuedCertificates /> : <HackathonList />} */}
    </div>
  );
};

export default ManageHackathon;
