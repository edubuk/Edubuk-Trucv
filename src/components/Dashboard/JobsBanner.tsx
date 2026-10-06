import React from "react";

const JobsBanner: React.FC = () => {

  return (
    <div className="w-full h-[150px] bg-gradient-to-r from-[#03257e] via-[#f14419] to-[#006666] flex items-center justify-center px-6 mb-2">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between text-white">
        
        {/* Left Content */}
        <div className="mb-6 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Explore Exciting Career Opportunities
          </h1>
          <p className="text-gray-200 text-sm md:text-base">
            Find jobs that match your skills and grow your career with top companies.
          </p>
        </div>

        {/* CTA Button */}
        <div>
          <a
            href="https://edubuktrujobs.com"
            target="_blank"
            className="bg-white text-blue-800 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-gray-100 transition duration-300"
          >
            Browse Jobs
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobsBanner;