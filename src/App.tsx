import { Routes, Route} from "react-router-dom";
import { lazy, Suspense, useEffect} from "react";
import ThreeDotLoader from "./components/Loader/ThreeDotLoader";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import AOS from "aos";
import "aos/dist/aos.css";
import AppPrivacyPolicy from "./pages/AppPrivacy";
import SubscriptionPlans from "./components/Subscription/Subscription";
import GoogleLoginModal from "./pages/Login";
import ProtectedRoute from "./protectRoute";
import Layout from "./Layout/Layout";
import Register from "./pages/Register";
import PasswordResetUI from "./pages/ForgotPassword";
import CVBuilder from "./CvBuilder/CvBuilder";
import CreateCv from "./pages/CreateCv";
import CertificateTimerPage from "./components/Certification/CertificateTimerPage";
import AdminDashBoard from "./components/Admin/AdminDashboard";
import { Providers } from "./app/providers";


// Lazy-loaded pages
//const HomePage = lazy(() => import("./pages/HomePage"));
const CvOutputPage = lazy(() => import("./pages/CvOutputPage"));
const Home = lazy(() => import("./pages/Home"));
const DashBoard = lazy(() => import("./components/Dashboard/DashBoard"));
const Resume = lazy(() => import("./pages/ResumeTem"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const About = lazy(() => import("./pages/About"));
const TermsAndConditions = lazy(() => import("./pages/TermCond"));
const CancellationPolicy = lazy(() => import("./pages/CancellationPol"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const Digilocker = lazy(()=>import("./pages/Digilocker"));
const SkillVerify = lazy(()=>import("./components/Verification/VerifySkill"))
const DocumentVerificationPage = lazy(()=>import("./components/Verification/DocumentVerificationPage"))
const DocumentVerifier = lazy(()=>import("./components/Verification/Documentverifier"))
const MetamaskGuide = lazy(()=>import("./pages/Metamaskguide"));
const DigilockerConnectPage = lazy(()=>import("./pages/DigiLockerConnectPage"));
const Hackathons = lazy(()=>import("./pages/Hackathons"));
const UserVerification = lazy(()=>import("./pages/UserVerification"));




function App() {

  useEffect(() => {

    AOS.init({
      duration: 1000, // animation duration in ms
      once: false,     // whether animation should happen only once
    })
  },[])


  return (
    <div>
      <Providers>
          <Suspense fallback={<div className="flex justify-center items-center text-3xl text-[#03257e] font-bold h-[80vh]" data-aos="zoom-in">Loading {""} <ThreeDotLoader w={2} h={2} yPos={'end'} /></div>}>
            <Routes>
              <Route
                path="/"
                element={<Layout> <Home /></Layout>}
              />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/digilocker" element={<Digilocker/>}/>
              <Route path="/new-cv/:id" element={<Resume />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/cancellation-policy" element={<CancellationPolicy />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/pprivacy-policy" element={<AppPrivacyPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/login" element={<GoogleLoginModal />} />
              <Route path="/verify-skill/:token" element={<SkillVerify />} />
              <Route path="/verify-document/:token" element={<DocumentVerificationPage />} />
              <Route path="cv-builder" element={<Layout><CVBuilder /></Layout>}> </Route>
              <Route path="/password-reset" element={<PasswordResetUI />} />
              <Route path="/verify" element={<Layout><DocumentVerifier /></Layout>} />
              <Route path="/cv/:id" element={<Layout><CvOutputPage /></Layout>} />
              <Route path="/admin" element={<Layout><ProtectedRoute><AdminDashBoard/></ProtectedRoute></Layout>} />
              <Route path="/pricing" element={<ProtectedRoute><SubscriptionPlans /></ProtectedRoute>} />
              <Route path="/create-cv" element={<Layout><ProtectedRoute><CreateCv /></ProtectedRoute></Layout>} />
              <Route path="/dashboard" element={<Layout><ProtectedRoute><DashBoard /></ProtectedRoute></Layout>} />
              <Route path="/register" element={<Register />} />
              <Route path="/certificate-timer" element={<Layout><ProtectedRoute><CertificateTimerPage /></ProtectedRoute></Layout>} />
              <Route path="/setup-wallet" element={<Layout><ProtectedRoute><MetamaskGuide /></ProtectedRoute></Layout>} />
              <Route path="/dl-connect" element={<DigilockerConnectPage />} />
              <Route path="/user-verification" element={<Layout><ProtectedRoute><UserVerification /></ProtectedRoute></Layout>} />
              <Route path="/hackathons" element={<Layout><ProtectedRoute><Hackathons /></ProtectedRoute></Layout>} />
            </Routes>
          </Suspense>
      </Providers>
    </div>
  );
}

export default App;
