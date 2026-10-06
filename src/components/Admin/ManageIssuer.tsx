import { useState } from "react";
import WhitelistRemoveIssuer from "./WhitelistRemoveIssuer";
import IssuerList from "./IssuerList";



const WhitelistIssuer = () => {

  const [activeTab, setActiveTab] = useState<"whitelist/remove" | "issuerList">("whitelist/remove");
  
  return (
    <div className="w-full" >
       <div className="flex items-center justify-between border-b border-gray-200 mb-6">
        <div className="flex">
          {(["whitelist/remove", "issuerList"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === activeTab
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "whitelist/remove" ? "Whitelist/Remove" : "Issuer List"}
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
      {activeTab === "whitelist/remove" ? <WhitelistRemoveIssuer />:<IssuerList />}
    </div>
  );
};

export default WhitelistIssuer;
