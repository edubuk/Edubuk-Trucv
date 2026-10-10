import ImageSlider from "../components/HomePageSections/ImageSlider";
import OurAdvisor from "../components/HomePageSections/OurAdvisor";
import OurExecutives from "../components/HomePageSections/OurExecutives";
import ThreeDot from "../components/HomePageSections/ThreeDot";
import VideoSection from "../components/HomePageSections/VideoSection";
import Footer from "./Footer";
import PartnerList from "@/components/HomePageSections/PartnerList";
import TruCVIntroSections from "@/components/HomePageSections/TruCVIntroSections";

const Home: React.FC = () => (
  <div className="flex flex-col items-center overflow-hidden">
    <TruCVIntroSections />
    <PartnerList />
    <ImageSlider />
    <ThreeDot />
    <VideoSection />
    <ThreeDot />
    <OurExecutives />
    <ThreeDot />
    <OurAdvisor />
    <Footer />
  </div>
);

export default Home;
