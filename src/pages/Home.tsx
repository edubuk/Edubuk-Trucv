import Facts from "@/components/HomePageSections/Facts";
import ImageSlider from "../components/HomePageSections/ImageSlider";
import OurAdvisor from "../components/HomePageSections/OurAdvisor";
import OurExecutives from "../components/HomePageSections/OurExecutives";
import ThreeDot from "../components/HomePageSections/ThreeDot";
import VideoSection from "../components/HomePageSections/VideoSection";
import Footer from "./Footer";
import StepToCreateCV from "../components/HomePageSections/StepToCreateCV";
import WhyTrucv from "../components/HomePageSections/WhyTrucv";
import PartnerList from "@/components/HomePageSections/PartnerList";
import EdubukPopup from "@/components/EdubukPopup";
import TruCVIntroSections from "@/components/HomePageSections/TruCVIntroSections";

const Home: React.FC = () => (
  <div className="flex flex-col items-center overflow-hidden">
    <TruCVIntroSections />
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
    <OurExecutives />
    <ThreeDot />
    <OurAdvisor />
    <Footer />
    <EdubukPopup />
  </div>
);

export default Home;
