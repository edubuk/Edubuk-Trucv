import React from "react";
import contactUs from "../assets/contactUs.avif";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaBuilding,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ContactUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#03257e] hover:text-[#f14419] transition-colors mb-6 font-medium"
        >
          <FaArrowLeft />
          Back to Home
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200">

          <div className="grid lg:grid-cols-2">

            {/* Left Image Section */}
            <div className="bg-gradient-to-br from-[#03257e] via-[#006666] to-[#03257e] flex items-center justify-center p-8 lg:p-12">
              <img
                src={contactUs}
                alt="Contact Us"
                className="w-full max-w-md object-contain"
              />
            </div>

            {/* Right Content Section */}
            <div className="p-8 lg:p-12">

              {/* Header */}
              <div className="mb-8">
                <span className="text-[#f14419] font-semibold uppercase tracking-wider text-sm">
                  Get In Touch
                </span>

                <h1 className="text-4xl font-bold text-[#03257e] mt-2">
                  Contact Us
                </h1>

                <div className="w-20 h-1 bg-[#f14419] rounded-full mt-4"></div>

                <p className="mt-6 text-gray-600 leading-relaxed">
                  Have questions about Edubuk, TruCV, verification services,
                  blockchain credentials, or need technical assistance?
                  Our team is here to help.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-5">

                {/* Company */}
                <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-[#03257e]/10 flex items-center justify-center">
                    <FaBuilding className="text-[#03257e]" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#03257e]">
                      Company
                    </h2>

                    <p className="text-gray-600 mt-1">
                      Eduprovince Technologies Private Limited (Edubuk)
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-[#006666]/10 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-[#006666]" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#03257e]">
                      Address
                    </h2>

                    <p className="text-gray-600 mt-1 leading-relaxed">
                    2nd Floor, R Square Building, Opposite SRS Mall, Vipul Khand, Gomti Nagar, Lucknow, Uttar Pradesh, India
                      PHF 4117, Prestige High Fields,
                      <br />
                      ISB Road, Financial District,
                      <br />
                      Hyderabad - 500032,
                      <br />
                      Telangana, India
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-[#f14419]/10 flex items-center justify-center">
                    <FaEnvelope className="text-[#f14419]" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#03257e]">
                      Email
                    </h2>

                    <div className="flex flex-col gap-1 mt-1">
                      <a
                        href="mailto:support@edubuk.com"
                        className="text-[#006666] hover:text-[#f14419] transition-colors"
                      >
                        support@edubuk.com
                      </a>

                      <a
                        href="mailto:support.southindia@edubuk.com"
                        className="text-[#006666] hover:text-[#f14419] transition-colors"
                      >
                        support.southindia@edubuk.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-[#03257e]/10 flex items-center justify-center">
                    <FaPhoneAlt className="text-[#03257e]" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#03257e]">
                      Phone
                    </h2>

                    <div className="text-gray-600 mt-1">
                      <p>+91 9250411261</p>
                      <p>+91 76966 69555</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;