
import { useUserData } from "@/context/AuthContext";
import api from "@/lib/api";
import { Loader2, Trash } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import CvCardGridSkeleton from "./CvCardSkeleton";
import JobsBanner from "./JobsBanner";
interface CvByIdProps {
  cvData:any[]; // Expecting an array of strings as cvData
  setCvRefresh:React.Dispatch<React.SetStateAction<boolean>>;
  isFetching:boolean;
}

const CvById: React.FC<CvByIdProps> = ({ cvData,setCvRefresh,isFetching   }) => {
  const {user} = useUserData();
  const [loading,setLoading] = useState<boolean>(false);
  const [idx,setIdx] = useState<number>(-1);
  console.log("cv fetched data",cvData)

  const deleteCvHandler = async(id:string,idx:number)=>{
    try {
      const confirm = window.confirm("Are you sure you want to delete this CV?")
      if(!confirm){return}
      setIdx(idx);
      setLoading(true)
      const response = await api.delete(`/cv/delete-cv/${id}`)
      const {data} = response;
      if(data.success)
      {
        toast.success(data.message);
        setCvRefresh(prev=>!prev)
      }
    } catch (error:any) {
      toast.error(error.message||"something went wrong");
    }finally{setLoading(false)}
  }
  if(isFetching){
    return (
      <CvCardGridSkeleton />
    )
  }
  return (
  <div className="w-full max-w-6xl mx-auto px-4 py-6">
  {cvData?.length === 0 && (
    <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-10">
      <p className="text-slate-500 text-base">
        No CV found. Create your first CV to see it here.
      </p>
    </div>
  )}

  {cvData?.length > 0 && (
    <div className="grid grid-cols-1">
      <JobsBanner />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cvData.map((doc: any, i: number) => (
        <div
          key={i}
          className="group relative flex flex-col h-full border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-[#006666]/60 transition-all duration-200"
        >
          {/* Accent bar */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] rounded" />

          {/* Card content */}
          <div className="flex-1 flex flex-col gap-3 px-4 pt-5 pb-4">
            {/* Badge + index */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#03257e]/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-[#03257e]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#03257e]" />
                {doc.title}
              </span>
              <div>
              {loading&&i===idx?<Loader2 className="text-[#f14419] cursor-pointer animate-spin" />:<Trash 
              className="text-[#f14419] cursor-pointer"
              onClick={()=>deleteCvHandler(doc._id,i)} />}
              </div>
            </div>

            {/* Name / title */}
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-slate-900 truncate">
                {user?.name || "Untitled CV"}
              </h2>
            </div>

            {/* Meta info */}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              {user?.address && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1">
                  <span className="i-lucide-map-pin text-[13px]" />
                  <span className="truncate max-w-[140px]">
                    {user.address}
                  </span>
                </span>
              )}

              {user?.email && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1">
                  <span className="i-lucide-mail text-[13px]" />
                  <span className="truncate max-w-[140px]">
                    {user.email}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Footer / actions */}
          <div className="px-4 pb-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Link
                to={`/cv/${doc?._id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#006666] py-2 text-sm font-medium text-white shadow-sm hover:bg-[#03257e] transition-colors duration-150"
              >
                View CV
                <span className="i-lucide-arrow-right text-[14px]" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  )}
</div>
  );
};

export default CvById;
