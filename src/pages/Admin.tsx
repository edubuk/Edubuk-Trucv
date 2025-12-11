import React, { useEffect, useState } from "react";
import { ShieldCheck, X, FileText, BadgeCheck, Loader2, Copy, Hash, ChevronDown, RefreshCwIcon, Crown, Edit, ExternalLink, User, XCircle,CircleCheckBig, FolderCheck} from "lucide-react";
import { API_BASE_URL } from "@/main";
import toast from "react-hot-toast";
import ThreeDotLoader from "@/components/Loader/ThreeDotLoader";
import AccessDeniedPage from "./AccessDenied";
import { useUserData } from "@/context/AuthContext";
import UpdateSubscription from "@/components/Subscription/UpdateSubscription";
import StatusBadge from "@/CvBuilder/StatusBadge";
// Colors
const COLOR_PRIMARY = "#03257e"; // deep blue
const COLOR_TEAL = "#006666"; // teal


// Types
export type VerificationStatus = "verified" | "pending" | "rejected";
export type VerificationMethod = "DigiLocker" | "Email" | "Third Party" | null;

type Certificate = {
  _id: string;
  docType: string;
  title: string; // e.g., Class X, Class XII, B Tech, Experience
  link: string; // URL to the uploaded certificate
  status: VerificationStatus;
  method: VerificationMethod;
  issuedBy?: string;
  issuedOn?: string; // ISO date string
  metadata?: Record<string, any>;
};

interface IUserDoc {
  userId:string;
  eduDocId:string,
  expDocId:string,
  level:string,
  boardNameOrDegree:string,
  institutionName:string,
  gpa:string,
  companyName:string,
  organisation:string,
  jobRole:string,
  skills:string,
  description:string,
  duration:{from:string,to:string},
  selfAttested:boolean,
  isEmailSend?:boolean,
  issuerEmailId?:string,
  verified?:boolean,
  status?:VerificationStatus,
  verifiedThrough?:VerificationMethod,
  docUri?:string,
  createdAt:string,
  updatedAt:string,
}

type UserProfile = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  certificates: Certificate[];
  userImageUrl: string;
  address: string;
  subscriptionPlan: string;
  roles: string;
};

interface ISubscription {
  couponCode: string;
  createdAt: string;
  orderId: string;
  subscriptionPlan: "free" | "basic" | "pro";
  updatedAt: string;
  endDate: string;
  paymentId: string;
}


const MethodChip: React.FC<{ method: VerificationMethod }> = ({ method }) => {
  const label = method === "DigiLocker" ? "DigiLocker" : method === "Email" ? "Email" : method === "Third Party" ? "Third Party" : "Not set";
  const color = method ? COLOR_PRIMARY : "#666";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full border"
      style={{ borderColor: color, color }}
    >
      <ShieldCheck className="h-3 w-3" /> {label}
    </span>
  );
};

export default function AdminUserProfilesPage() {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [activeCert, setActiveCert] = useState<IUserDoc | null>(null);
  const [viewUserData, setViewUserData] = useState<boolean>(false);
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [mintResult, setMintResult] = useState<{ txId: string; assetId?: number } | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [userSubscriptionDetails, setUserSubscriptionDetails] = useState<ISubscription>();
  const [totalPages, setTotalPages] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState<boolean>(false);
  const [cvIds, setCvIds] = useState([]);
  const [currentUserId,setCurrentUserId] = useState<string>("");
  const [educationDocs, setEducationDocs] = useState({
    educations: [],
    experiences: [],
    awards:[],
  });
  
  const { user } = useUserData();

  const userListHandler = async () => {
    try {
      setLoading(true);
      const users = await fetch(`${API_BASE_URL}/admin/users-list?page=${pageNum}&email=${email ? email : ""}`, { credentials: "include" })
      const usersList = await users.json();
      if (!usersList.success) {
        toast.error(usersList.message);
        setLoading(false);
        throw new Error(usersList.message)
      }
      setUsersList(usersList.data);
      console.log("user-list", usersList);
      setTotalPages(usersList?.meta?.totalPages);
      setLoading(false)
    } catch (error: any) {
      console.log(error)
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handlePrev = () => {
    if (pageNum > 1)
      setPageNum(pageNum - 1);
  }

  const handleNext = () => {
    if (pageNum < totalPages)
      setPageNum(pageNum + 1);
  }


  //const verifiedCount = useMemo(() => userDocs.reduce((sum, u) => (sum + (u.status === "verified" ? 1 : 0)), 0), [userDocs]);
  //const totalCerts = useMemo(() => userDocs.reduce((sum) => sum + 1, 0), [userDocs]);

  function formatDate(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  }

  const userSubscription = async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/subscription?id=${userId}`, {
        method: "GET",
        credentials: "include",
      });
      const subscription = await res.json();

      if (subscription && subscription.success) {
        setUserSubscriptionDetails((prev) => ({
          ...prev,
          couponCode: subscription.subscription.couponCode,
          createdAt: subscription.subscription.createdAt,
          orderId: subscription.subscription.orderId,
          subscriptionPlan: subscription.subscription.subscriptionPlan,
          updatedAt: subscription.subscription.updatedAt,
          endDate: subscription.subscription.endDate,
          paymentId: subscription.subscription.paymentId
        }));
      } else {
        setUserSubscriptionDetails({
          couponCode: "",
          createdAt: "",
          orderId: "",
          subscriptionPlan: "free",
          updatedAt: "",
          endDate: "",
          paymentId: ""
        });
      }
    } catch (error) {
      console.error("Error fetching user subscription:", error);
    }
  };

  async function toggleUser(userId: string) {
    console.log({ userId })
    if(currentUserId!==userId){
      await userSubscription(userId);
    }
    //await userDocsHandler(userId);
    setExpandedUserId((prev) => (prev === userId ? null : userId));
    setActiveCert(null);
    setActiveUser(null);
    setMintResult(null);
    setCvIds([])
  }

  const fetchIds = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cv/cv-ids?userId=${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!data.success) {
        return toast.error("No CV found");
      }
      setCvIds(data.data);
    }
    catch (err) {
      toast.error("something went wrong")
    }
  }

  const helperHandler = async (userId: string) => {
    setLoading(true);
    await toggleUser(userId);
    if((educationDocs.educations.length===0 && educationDocs.experiences.length===0 && educationDocs.awards.length===0) || currentUserId!==userId){
      await userDocsHandler(userId);
    }
  }

  const userDocsHandler = async (userId: string) => {
    try {
      setCurrentUserId(userId);
      const response = await fetch(`${API_BASE_URL}/admin/user-docs?userId=${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("docs data",data.data);
      if (!data.success) {
        return toast.error("No CV found");
      }
      setEducationDocs(data.data);
    }
    catch (err) {
      toast.error("something went wrong")
    }finally{
      setLoading(false);
    }
  }

  // function updateCertificate(userId: string, certId: string, patch: Partial<Certificate>) {
  //   setUsers((prev:any) => prev.map((u:any) => {
  //     if (u._id !== userId) return u;
  //     return {
  //       ...u,
  //       certificates: u.certificates.map((c:any) => c._id === certId ? { ...c, ...patch } : c)
  //     };
  //   }));
  // }

  // async function simulateMintOnAlgorand(user: UserProfile, cert: IUserDoc) {
  //   setIsMinting(true);
  //   setMintResult(null);

  //   // Build ARC-3 style metadata object (for display only)
  //   const metadata = {
  //     name: `${user.name} – ${cert.title}`,
  //     description: `Verifiable credential token for ${cert.title}`,
  //     properties: {
  //       holderEmail: user.email,
  //       phoneNumber: user.phoneNumber,
  //       issuedBy: cert.organisation,
  //       issuedOn: cert.createdAt,
  //       verificationStatus: cert.status,
  //       verificationMethod: cert.verifiedThrough,
  //       link: cert.docUrl,
  //     },
  //     standard: "arc3",
  //   };

  //   await new Promise((r) => setTimeout(r, 1200));
  //   const txId = "TX-" + Math.random().toString(16).slice(2) + Date.now().toString(16);
  //   const assetId = Math.floor(10_000_000 + Math.random() * 90_000_000);

  //   setIsMinting(false);
  //   setMintResult({ txId, assetId });

  //   // attach arc3 preview back to the cert
  //   //updateCertificate(user._id, cert._id, { metadata: { ...(cert.meta || {}), arc3: metadata } });
  // }

  useEffect(() => {
    userListHandler();
  }, [pageNum, refreshKey]);


  return (
    <>
      {user?.roles === "admin" ?
        <div className="min-h-screen w-full" style={{ background: "#f7f8fb" }}>
          {/* Header */}
          <header className="w-full shadow-sm" style={{ backgroundColor: COLOR_PRIMARY }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
              <h1 className="text-white text-xl sm:text-2xl font-semibold tracking-tight">Admin • User Profiles</h1>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search User"
                  className="border border-gray-200 rounded-lg px-4 py-2"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="bg-white text-[#03257e] px-4 py-2 rounded-lg"
                  onClick={userListHandler}
                >Search</button>
                <RefreshCwIcon
                  onClick={() => setRefreshKey(!refreshKey)}
                  className={`text-[#f14419] cursor-pointer w-8 h-8 transition-transform duration-500 ${refreshKey ? "rotate-180" : ""
                    }`}
                />
              </div>
            </div>
          </header>

          {/* Users list */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4 overflow-y-auto mb-12">
            {usersList?.map((userData) => (
              <div key={userData._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Collapsible header (acts like profile row) */}
                <button
                  onClick={() => helperHandler(userData._id)}
                  className="w-full flex items-center justify-between px-4 py-3 sm:px-6 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3 text-left">
                    {userData.userImageUrl && <img src={userData.userImageUrl} alt={userData.name} className="h-12 w-12 rounded-xl object-cover shadow" />}
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900">{userData.name}</h2>
                      <div className="text-sm text-gray-600">{userData.email} • {userData.phoneNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#03257e] text-xs sm:text-sm">

                    {/* {(expandedUserId === user._id) && <div className="flex gap-1 justify-center items-center "><BadgeCheck className="h-4 w-4 text-green-500" />{verifiedCount}/{totalCerts} verified</div>} */}
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedUserId === userData._id ? "rotate-180" : "rotate-0"}`} />
                </button>

                {/* Smooth expandable section with ORIGINAL certificate card design */}
                <div className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${expandedUserId === userData._id ? "max-h-[1200px]" : "max-h-0"}`}>
                  <div className="px-4 sm:px-6 pb-5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 mt-2">
                        <FileText className="h-5 w-5" /> User Documents
                      </h3>
                      <div className="flex items-center gap-2">
                        <User className="text-[#03257e] h-6 w-6 cursor-pointer" onClick={() => setViewUserData(!viewUserData)} />
                        <Edit className="text-[#f14419] h-6 w-6 cursor-pointer" onClick={() => setModalOpen(true)} />
                      </div>
                    </div>
                    {educationDocs?.educations.length > 0? <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {educationDocs?.educations.map((cert: any) => (
                        <button
                          key={cert?.eduDocId}
                          className="group bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-shadow"
                          aria-label={`Open ${cert.level}`}
                          onClick={() => { setActiveCert(cert); setActiveUser(userData); setMintResult(null); }}

                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm text-gray-500">{cert.institutionName || "Issuer —"}</div>
                              <div className="mt-0.5 text-base font-semibold text-gray-900">{cert.level}</div>
                            </div>
                            <StatusBadge status={cert?.status || "pending"} isEmailSend={cert.isEmailSend} />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <MethodChip method={cert?.verifiedThrough || null} />
                            <div className="text-xs text-gray-500">{formatDate(cert?.createdAt)}</div>
                          </div>
                          <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
                        View details <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                        </button>
                      ))}
                      {educationDocs?.experiences.map((cert: any) => (
                        <button
                          key={cert?.expDocIdId}
                          className="group bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-shadow"
                          aria-label={`Open ${cert.level}`}
                          onClick={() => { setActiveCert(cert); setActiveUser(userData); setMintResult(null); }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm text-gray-500">{cert.companyName || "Issuer —"}</div>
                              <div className="mt-0.5 text-base font-semibold text-gray-900">{cert.jobRole}</div>
                            </div>
                            <StatusBadge status={cert?.status || "pending"} isEmailSend={cert.isEmailSend} />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <MethodChip method={cert?.verifiedThrough || "email"} />
                            <div className="text-xs text-gray-500">{formatDate(cert?.createdAt)}</div>
                          </div>
                          <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
                        View details <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                        </button>
                      ))}
                      {educationDocs?.awards.map((cert: any) => (
                        <button
                          key={cert?.awDocIdId}
                          className="group bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-shadow"
                          aria-label={`Open ${cert.level}`}
                          onClick={() => { setActiveCert(cert); setActiveUser(userData); setMintResult(null); }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm text-gray-500">{cert.organisation || "Issuer —"}</div>
                              <div className="mt-0.5 text-base font-semibold text-gray-900">{cert.level}</div>
                            </div>
                            <StatusBadge status={cert?.status || "pending"} isEmailSend={cert.isEmailSend} />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <MethodChip method={cert?.verifiedThrough || "email"} />
                            <div className="text-xs text-gray-500">{formatDate(cert?.createdAt)}</div>
                          </div>
                          <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
                        View details <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                        </button>
                      ))}
                    </div> : loading?<ThreeDotLoader w={2} h={2} yPos="center"/>:<p className="text-center text-[#f14419] py-2">No Certificate Found</p>}
                    { (expandedUserId === userData._id)&&viewUserData &&
                      <div
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-0 z-50 flex items-center justify-center p-6"
                      >
                        <div
                          className="absolute inset-0 bg-black/40"
                          aria-hidden
                        />
                        <div className="relative max-w-xl w-full bg-white rounded-2xl shadow-2xl p-6">
                          <XCircle className="absolute top-2 right-4 cursor-pointer" onClick={() => setViewUserData(false)} />
                          <div className="w-full mx-auto grid md:grid-cols-2 grid-cols-1  gap-3 p-2">

                            <div className="space-y-3 text-sm text-gray-700">
                              <p className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="font-medium text-[#006666]">Name:</span>
                                <strong className="text-[#03257e]">{userData.name}</strong>
                              </p>

                              <p className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="font-medium text-[#006666]">Email:</span>
                                <strong className="text-[#03257e]">{userData.email}</strong>
                              </p>

                              <p className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="font-medium text-[#006666]">Phone Number:</span>
                                <strong className="text-[#03257e]">{userData.phoneNumber}</strong>
                              </p>

                              <p className="flex justify-between">
                                <span className="font-medium text-[#006666]">Address:</span>
                                <strong className="text-[#03257e]">{userData.address}</strong>
                              </p>
                            </div>
                            <div className="w-full sm:border-l sm:pl-2">
                              <div className="space-y-3 text-sm text-gray-700">
                                <p className="flex justify-between border-b border-gray-100 pb-1">
                                  <span className="font-medium text-[#006666]">Plan:</span>
                                  {userSubscriptionDetails?.subscriptionPlan === "pro" ? <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                    <Crown size={16} className="text-yellow-500" />
                                    <p className="text-sm font-medium">Pro Member</p>
                                  </div> :
                                    <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                      <p className="text-sm font-medium">Free Member</p>
                                    </div>
                                  }
                                </p>

                                <p className="flex justify-between border-b border-gray-100 pb-1">
                                  <span className="font-medium text-[#006666]">Order ID:</span>
                                  <strong className="text-[#03257e]">{userSubscriptionDetails?.orderId}</strong>
                                </p>

                                <p className="flex justify-between border-b border-gray-100 pb-1">
                                  <span className="font-medium text-[#006666]">Payment ID:</span>
                                  <strong className="text-[#03257e]">{userSubscriptionDetails?.paymentId}</strong>
                                </p>

                                <p className="flex justify-between border-b border-gray-100 pb-1">
                                  <span className="font-medium text-[#006666]">Coupon Code:</span>
                                  <strong className="text-[#03257e]">
                                    {userSubscriptionDetails?.couponCode || "N/A"}
                                  </strong>
                                </p>

                                <p className="flex justify-between border-b border-gray-100 pb-1">
                                  <span className="font-medium text-[#006666]">Start Date:</span>
                                  {userSubscriptionDetails && <strong className="text-[#03257e]">
                                    {new Date(userSubscriptionDetails?.createdAt).toLocaleDateString()}
                                  </strong>}
                                </p>

                                <p className="flex justify-between">
                                  <span className="font-medium text-[#006666]">End Date:</span>
                                  {userSubscriptionDetails && <strong className="text-[#03257e]">
                                    {new Date(userSubscriptionDetails?.endDate).toLocaleDateString()}
                                  </strong>}
                                </p>
                              </div>
                            </div>

                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="mt-2 p-2 bg-[#006666] text-white rounded-lg"
                              onClick={() => fetchIds(userData._id)}
                            >Fetch User CV</button>
                            {
                              cvIds?.map((id: any, index) => {
                                return (
                                  <div key={index}>
                                    <a className="underline text-[#f14419]" href={`/cv/${id.nanoId}`}>{id.nanoId}</a>
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      </div>}
                  </div>
                </div>
                {(isModalOpen && expandedUserId === userData._id) && <UpdateSubscription setModalOpen={setModalOpen} user={userData} userSubscriptionDetails={userSubscriptionDetails} />}

              </div>
            ))}
          </main>
          {/* MODAL — restored to previous detailed design */}
          {activeCert && activeUser && (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/30" onClick={() => { setActiveCert(null); setActiveUser(null); setMintResult(null); }} />
              <div className="absolute inset-0 flex items-end sm:items-center justify-center p-2 sm:p-4">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-y">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3 rounded-t-2xl" style={{ backgroundColor: COLOR_PRIMARY, color: "white" }}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <div className="font-semibold flex items-center gap-2">{activeCert?.level??activeCert?.jobRole} • {activeUser?.name} {activeCert?.status === "verified" && <CircleCheckBig size={20} className="text-green-600 font-semibold" />}</div>
                    </div>
                    <button className="p-1 rounded-lg hover:bg-white/10" onClick={() => { setActiveCert(null); setActiveUser(null); setMintResult(null); }} aria-label="Close">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Modal Body (original layout) */}
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between"><span className="text-gray-500">Issued By</span><span className="font-medium">{activeCert?.companyName??activeCert?.institutionName??activeCert?.organisation}</span></div>
                        <div className="flex items-center justify-between"><span className="text-gray-500">Issued To</span><span className="font-medium">{activeUser?.name}</span></div>
                        <div className="flex items-center justify-between"><span className="text-gray-500">Issued On</span><span className="font-medium">{formatDate(activeCert?.createdAt)}</span></div>
                        {(activeCert?.issuerEmailId &&activeCert.status==="verified") && <div className="flex items-center justify-between"><span className="text-gray-500">Approved By</span><span className="font-medium">{activeCert?.issuerEmailId}</span></div>}
                        <div className="flex items-center justify-between"><span className="text-gray-500">Last Updated</span><span className="font-medium">{formatDate(activeCert?.updatedAt)}</span></div>
                        <div className="flex items-center justify-between"><span className="text-gray-500">Status</span><span>                            <StatusBadge status={activeCert?.status || "pending"} isEmailSend={activeCert.isEmailSend} /></span></div>
                        <div className="flex items-center justify-between"><span className="text-gray-500">Verification Method</span><span><MethodChip method={activeCert?.verifiedThrough ||null} /></span></div>
                        {(activeCert?.isEmailSend && activeCert.status!=="verified") && <div className="flex items-start justify-start gap-1"><span className="text-[#f14419]">Remark: </span><span>Email has been sent to issuer email id  <span className="font-medium text-[#008888]">{activeCert?.issuerEmailId}</span>. Once issuer approve or reject, the updated status will reflect here</span></div>}  
                        {activeCert.status==="verified" && <div className="flex items-center justify-center text-green-600 text-lg font-semibold gap-1"><FolderCheck className="h-6 w-6" /> Verified</div>}  

                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs text-gray-500">Certificate link</div>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <a href={`${API_BASE_URL}/api/dl/view-doc?uri=${activeCert?.docUri}`} target="_blank" rel="noreferrer" className="truncate text-sm font-medium hover:underline" style={{ color: COLOR_PRIMARY }}>
                            {activeCert?.docUri}
                          </a>
                          <button className="p-2 rounded-lg hover:bg-white" title="Copy link" onClick={() => navigator.clipboard?.writeText(activeCert?.docUri || "")}><Copy className="h-4 w-4 text-gray-500" /></button>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">Metadata</div>
                        <pre className="mt-1 text-[11px] leading-relaxed bg-white border border-gray-200 rounded-lg p-2 overflow-auto max-h-40">
                          {JSON.stringify({
                            holder: activeUser.name,
                            email: activeUser.email,
                            phoneNumber: activeUser.phoneNumber,
                            certificate: {
                              name: activeCert.level??activeCert.jobRole,
                              issuedBy:activeCert.boardNameOrDegree??activeCert.companyName,
                              issuedOn: activeCert.createdAt,
                              updatedAt: activeCert.updatedAt,
                              duration:`${activeCert.duration.from} - ${activeCert.duration.to}`,
                              verifiedThrough:activeCert.verifiedThrough
                            },
                          }, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Actions (restored) */}
                    <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      {/* <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          className="px-3 py-2 rounded-xl text-white text-sm font-medium shadow"
                          style={{ backgroundColor: COLOR_TEAL }}
                        // onClick={() => { updateCertificate(activeUser._id, activeCert._id, { status: "verified", method: "digilocker" }); setActiveCert({ ...activeCert, status: "verified", verifiedThrough: "digilocker" }); }}
                        >
                          Verify via DigiLocker
                        </button>
                        <button
                          className="px-3 py-2 rounded-xl text-white text-sm font-medium shadow"
                          style={{ backgroundColor: COLOR_PRIMARY }}
                        // onClick={() => { updateCertificate(activeUser._id, activeCert._id, { status: "verified", method: "email" }); setActiveCert({ ...activeCert, status: "verified", verifiedThrough: "email" }); }}
                        >
                          Verify via Email
                        </button>
                        <button
                          className="px-3 py-2 rounded-xl text-white text-sm font-medium shadow"
                          style={{ backgroundColor: COLOR_ACCENT }}
                        // onClick={() => { updateCertificate(activeUser._id, activeCert._id, { status: "verified", method: "third_party" }); setActiveCert({ ...activeCert, status: "verified", verifiedThrough: "third_party" }); }}
                        >
                          Verify via Third Party
                        </button>
                      </div> */}

                      <div className="flex items-center gap-2 sm:ml-auto">
                        <button
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white text-sm font-semibold shadow"
                          style={{ backgroundColor: COLOR_PRIMARY }}
                          //onClick={() => simulateMintOnAlgorand(activeUser, activeCert)}
                          disabled={false}
                        >
                          {false ? <Loader2 className="h-4 w-4 animate-spin" /> : <Hash className="h-4 w-4" />} Generate Token (Algorand)
                        </button>
                        <button
                          className="px-3 py-2 rounded-xl text-sm font-medium border border-gray-200"
                          onClick={() => { setActiveCert(null); setActiveUser(null); setMintResult(null); }}
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    {mintResult && (
                      <div className="mt-4 border border-gray-200 rounded-xl p-3 bg-gray-50">
                        <div className="text-sm font-semibold flex items-center gap-2" style={{ color: COLOR_TEAL }}>
                          <BadgeCheck className="h-4 w-4" /> Token simulated successfully
                        </div>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-2">
                            <span className="text-gray-500">Tx ID</span>
                            <span className="font-mono text-xs truncate">{mintResult.txId}</span>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-2">
                            <span className="text-gray-500">Asset ID</span>
                            <span className="font-mono text-xs">{mintResult.assetId}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-[11px] text-gray-500"></div>
                      </div>
                    )}

                    {/* Original developer notes */}
                    <details className="mt-4 group">
                      <summary className="cursor-pointer text-xs text-gray-500 group-open:text-gray-700">To be discussed on token generation</summary>
                      <div className="mt-2 text-xs text-gray-600 space-y-2 bg-gray-50 border border-gray-200 rounded-xl p-3">

                        <pre className="bg-white p-2 rounded border overflow-auto">
                          {`// Example (pseudo):
                            import algosdk from 'algosdk';
                            const client = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
                            const acct = algosdk.mnemonicToSecretKey(process.env.NEXT_PUBLIC_ALGO_MNEMONIC!);
                            const params = await client.getTransactionParams().do();
                            const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
                              from: acct.addr,
                              total: 1,
                              decimals: 0,
                              assetName: '${'${activeUser?.fullName ?? ""} – ${activeCert?.name ?? ""}'}',
                              unitName: 'CERT',
                              defaultFrozen: false,
                              assetURL: 'https://your-domain.com/metadata/123.json',
                              metadataHash: new Uint8Array([/* sha256 of JSON */]),
                              suggestedParams: params,
                            });
                            const signed = txn.signTxn(acct.sk);
                            const { txId } = await client.sendRawTransaction(signed).do();
                            const result = await algosdk.waitForConfirmation(client, txId, 4);
                            const assetId = result['asset-index'];
                            `}
                        </pre>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="fixed bottom-1 left-0 right-0 flex justify-center items-center space-x-4 bg-white p-3 shadow-md rounded-md">
            <button
              onClick={handlePrev}
              disabled={pageNum === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-gray-800 font-medium">
              Page {pageNum} / {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={pageNum === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div> : <AccessDeniedPage />}
    </>
  );
}
