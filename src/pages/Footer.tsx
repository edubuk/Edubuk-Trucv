import { Link } from "react-router-dom";
import social2 from "../assets/Social/social2.png";
import social3 from "../assets/Social/social3.png";
import social4 from "../assets/Social/social4.png";
import social5 from "../assets/Social/social5.png";
import social6 from "../assets/Social/social6.png";
// import squareLogo from '@/assets/TruCV-Square.png'
import { MdEmail, MdLocationPin, MdPhone } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
const Footer = () => {
  return (
    <div
      className="bg-white border-t border-gray-200 border-b-8 border-[#006666]"
      data-aos="fade-up"
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo */}
          <div className="flex flex-col items-center lg:items-start">
            <img
              src={"/latest_edubuk_logo.png"}
              alt="Edubuk"
              className="w-40 h-auto object-contain"
            />

            <p className="mt-4 text-sm text-gray-600 text-center lg:text-left">
              Empowering trust through verified credentials and digital
              identity.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-[#03257e] mb-4">
              Contact Us
            </h3>

            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-2">
                <MdEmail className="mt-1 text-[#006666]" />
                <div>
                  <p>support@edubuk.com</p>
                  <p>support.southindia@edubuk.com</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MdPhone className="mt-1 text-[#006666]" />
                <div>
                  <p>+91 9250411261</p>
                  <p>+91 76966 69555</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold text-[#03257e] mb-4">Legal</h3>

            <div className="flex flex-col gap-3">
              <Link
                to="/terms-and-conditions"
                className="flex items-center gap-1 text-gray-700 hover:text-[#f14419] transition"
              >
                <FaRegFileAlt /> Terms & Conditions
              </Link>

              <Link
                to="/privacy-policy"
                className="flex items-center gap-1 text-gray-700 hover:text-[#f14419] transition"
              >
                <FaRegFileAlt /> Privacy Policy
              </Link>

              <Link
                to="/refund-policy"
                className="flex items-center gap-1 text-gray-700 hover:text-[#f14419] transition"
              >
                <FaRegFileAlt /> Refund Policy
              </Link>

              <Link
                to="/cancellation-policy"
                className="flex items-center gap-1 text-gray-700 hover:text-[#f14419] transition"
              >
                <FaRegFileAlt /> Cancellation Policy
              </Link>

              <Link
                to="/contact-us"
                className="flex items-center gap-1 text-gray-700 hover:text-[#f14419] transition"
              >
                <FaRegFileAlt /> Contact Us
              </Link>
            </div>
          </div>

          {/* Offices */}
          <div>
            <h3 className="text-lg font-bold text-[#03257e] mb-4">
              Our Offices
            </h3>

            <div className="space-y-3 text-gray-700">
              <div className="flex gap-2 items-start">
                <MdLocationPin className="text-[#006666] mt-1 flex-shrink-0 text-xl" />
                <span>
                  2nd Floor, R Square Building, Opposite SRS Mall, Vipul Khand,
                  Gomti Nagar, Lucknow, Uttar Pradesh, India
                </span>
              </div>

              <div className="flex gap-2 items-start">
                <MdLocationPin className="text-[#006666] mt-1 flex-shrink-0 text-xl" />
                <span>Door no 505/B-508, Sandhya Techno-1, Rangareddy, Hyderabad- 500104, Telangana</span>
              </div>

              <div className="flex gap-2 items-start">
                <MdLocationPin className="text-[#006666] mt-1 flex-shrink-0 text-xl" />
                <span>5th Floor, RAKBANK Office, RAK Innovation City, Sheikh Zayed Road, Ras Al Khaimah (RAK), UAE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 text-center">
            © 2026 Edubuk. All Rights Reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="font-medium text-[#03257e]">Follow Us</span>

            <a
              href="https://www.facebook.com/edubuk.trst/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={social2}
                alt=""
                className="w-5 h-5 hover:scale-110 transition"
              />
            </a>

            <a
              href="https://www.instagram.com/edubuk_/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={social3}
                alt=""
                className="w-5 h-5 hover:scale-110 transition"
              />
            </a>

            <a
              href="https://www.linkedin.com/company/edubuk-ai-web3/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={social4}
                alt=""
                className="w-5 h-5 hover:scale-110 transition"
              />
            </a>

            <a
              href="https://x.com/edubuktrust"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={social5}
                alt=""
                className="w-5 h-5 hover:scale-110 transition"
              />
            </a>

            <a
              href="https://www.youtube.com/channel/UC4g4MH4F_JTbd1tqNS5pq1g/videos"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={social6}
                alt=""
                className="w-5 h-5 hover:scale-110 transition"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
