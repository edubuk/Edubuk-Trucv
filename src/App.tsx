import { Routes, Route} from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import ThreeDotLoader from "./components/Loader/ThreeDotLoader";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Lazy-loaded pages
//const HomePage = lazy(() => import("./pages/HomePage"));
const CvOutputPage = lazy(() => import("./pages/CvOutputPage"));
const Home = lazy(() => import("./pages/Home"));
const DashBoard = lazy(() => import("./pages/DashBoard"));
const Resume = lazy(() => import("./pages/ResumeTem"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const About = lazy(() => import("./pages/About"));
const TermsAndConditions = lazy(() => import("./pages/TermCond"));
const CancellationPolicy = lazy(() => import("./pages/CancellationPol"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const Digilocker = lazy(()=>import("./pages/Digilocker"));
const SkillVerify = lazy(()=>import("./components/SkillVerification/VerifySkill"))
import AOS from "aos";
import "aos/dist/aos.css";
import AppPrivacyPolicy from "./pages/AppPrivacy";
import SubscriptionPlans from "./components/Subscription/Subscription";
import GoogleLoginModal from "./pages/Login";
import ProtectedRoute from "./protectRoute";
import AdminUsersPage from "./pages/Admin";
import Layout from "./Layout/Layout";
import Register from "./pages/Register";
import PasswordResetUI from "./pages/ForgotPassword";
import CVBuilder from "./CvBuilder/CvBuilder";
import CreateCv from "./pages/CreateCv";


function App() {


useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      once: false,     // whether animation should happen only once
    });
  }, []);

  return (
    <div>
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
              <Route path="cv-builder" element={<Layout><CVBuilder /></Layout>}> </Route>
              <Route path="/password-reset" element={<PasswordResetUI />} />
              <Route path="/cv/:id" element={<Layout><CvOutputPage /></Layout>} />
              <Route path="/admin" element={<Layout><AdminUsersPage/></Layout>} />
              <Route path="/pricing" element={<ProtectedRoute><SubscriptionPlans /></ProtectedRoute>} />
              <Route path="/create-cv" element={<Layout><CreateCv /></Layout>} />
              <Route path="/dashboard" element={<Layout><DashBoard /></Layout>} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Suspense>
    </div>
  );
}

export default App;
