import Facts from "@/components/HomePageSections/Facts";
import heroImg from "../assets/hero.png";
import ImageSlider from "../components/HomePageSections/ImageSlider";
import OurAdvisor from "../components/HomePageSections/OurAdvisor";
import OurExecutives from "../components/HomePageSections/OurExecutives";
import ThreeDot from "../components/HomePageSections/ThreeDot";
import VideoSection from "../components/HomePageSections/VideoSection";
import Footer from "./Footer";
import StepToCreateCV from "../components/HomePageSections/StepToCreateCV";
import WhyTrucv from "../components/HomePageSections/WhyTrucv";
import { useState} from "react";
import ProfilePopup from "@/components/ui/Profile";
import { Link } from "react-router-dom";
import { useUserData } from "@/context/AuthContext";
import { Crown } from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/main";
import PartnerList from "@/components/HomePageSections/PartnerList";

const Home:React.FC = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const {user} = useUserData();

  const handlerLogout = async () => {
    try {
      const logoutData = await fetch(`${API_BASE_URL}/user/logout`,{
        method:"PUT",
        credentials: "include"
      })
      const logoutResult = await logoutData.json();
      console.log("logoutResult",logoutResult);
      if(logoutResult.success){
        window.location.href="/login";
      }
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed");
        }
  };

  return (
    <div className="flex justify-center items-center flex-col gap-8 overflow-hidden">
     <div className="relative w-full flex flex-col">
     <div className="relative flex justify-end items-center w-full h-[20px] mt-2 p-6">
          {user&&<div className="flex flex-col justify-center items-center">
            {user?.subscriptionPlan === "pro" && <Crown size={20} className="absolute -top-1 text-[#f14419] bg-white" />}
              <p
                className="px-3 py-1 font-bold text-2xl text-[#03257e] rounded-full cursor-pointer border-2 border-[#03257e]"
                onClick={() => setOpenProfile(!openProfile)}
              >{user.name.slice(0,1)}</p>            {/* <div className="absolute top-0  w-12 h-12  rounded-full   bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] -z-10"></div> */}
          </div>}
          <ProfilePopup openProfile={openProfile} setOpenProfile={setOpenProfile} user={user}/>
        </div>
        <div className="flex justify-around items-center flex-wrap-reverse gap-10 md:gap-20 border-b-4 border-amber-300 md:h-[80vh]">
        <div className="flex justify-center items-center flex-col gap-4 pb-4" data-aos="fade-up">
          <div className="flex justify-center items-center gap-2">
            <div className="relative rounded-lg p-[2px] bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]" data-aos="fade-up">
            <Link
              to="/create-cv"
              className="flex items-center gap-2 bg-[#006666] text-[20px] sm:text-[30px] px-2 py-4 font-bold rounded-lg text-white hover:bg-white hover:text-[#f14419] transition-colors duration-200"
            >
             Create TruCV →
            </Link>
          </div>
            {user ? (
              <div className="flex lg:hidden relative rounded-lg p-[2px] bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]" data-aos="fade-left">
                <button
                  className="w-full bg-white text-[20px] px-6 py-4 font-bold text-center rounded-lg text-[#03257e] hover:text-[#f14419]"
                  onClick={handlerLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex lg:hidden relative rounded-lg p-[2px] bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]" data-aos="fade-left">
                <Link
                  to="/login"
                  className="w-full bg-white text-[20px] px-6 py-4 font-bold text-center rounded-lg text-[#03257e] hover:text-[#f14419]"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          <p className="text-[#03257E] text-center text-2xl sm:text-3xl md:text-5xl font-bold" data-aos="fade-up">
            Your Verifiable CV<br /> on Blockchain
          </p>
          <p className="text-[#f14419] text-center font-bold text-xl sm:text-2xl" data-aos="fade-up">
            [ Academic & Professional Credentials ]
          </p>

          {/* Create CV CTA */}
        </div>

        <div className="relative w-fit">
          <img
            src={heroImg}
            alt="hero-img"
            className="h-[50vh] sm:h-[50vh] md:w-68 md:h-68 lg:w-68 lg:h-68 rounded-b-full object-cover"
            data-aos="zoom-in"
          />
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] lg:w-[350px] lg:h-[350px] bg-[#03257e] rounded-full -z-10"></div>
        </div>
</div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]">
        </div>
      </div>
      <PartnerList />
      <ImageSlider />
      <ThreeDot />
      <Facts />
      <ThreeDot />
      <WhyTrucv />
      <ThreeDot />
      <StepToCreateCV />
      <ThreeDot />
      <VideoSection />
      <ThreeDot />
      {/* <Collaborators />
      <ThreeDot /> */}
      <OurExecutives />
      <ThreeDot />
      <OurAdvisor />
      <Footer />
      {/* <div><DownloadButton/></div> */}
    </div>
  );
};

export default Home;
