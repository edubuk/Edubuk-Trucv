import {internationalLogos,universityLogos,govLogos,} from "../../utils";


const PartnerList = () => {
  return (
    <div className="flex justify-center flex-col items-center w-full overflow-hidden">
  <p className="text-[#03257E] text-[25px] sm:text-[40px] md:text-[50px] font-bold uppercase text-center" data-aos="fade-left">
    Our Partners & Clients
  </p>

  <div className="flex justify-start items-center p-2 border-b-2 border-gray-300">
    <p className="absolute left-0 bg-gray-100 hidden border-b-4 w-[180px] border-[#03257e] sm:flex sm:ml-0 rounded py-2 px-4 text-[#03257e] text-center font-bold text-[10px] sm:text-[15px] md:text-[20px] uppercase leading-none animate-slide-in-right shadow-gray-800 z-20">
        International
    </p>
      <div className="overflow-hidden sm:py-4">
        <div
          key={1} 
          className="flex animate-slide whitespace-nowrap w-max"
        >
          {internationalLogos.concat(internationalLogos).map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`logo-${index}`}
              className="h-6 sm:h-10 w-auto sm:w-auto mx-4 sm:mx-8"
            />
            ))}
        </div>
      </div>
  </div>
  <div className="flex justify-start items-center p-2 border-b-2 border-gray-300">
      <div className="overflow-hidden sm:py-4">
        <div
          key={2} 
          className="flex animate-slideOpposite whitespace-nowrap w-max"
        >
          {govLogos.concat(govLogos).map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`logo-${index}`}
              className="h-6 sm:h-10 w-auto sm:w-auto mx-4 sm:mx-8"
            />
          ))}
        </div>
      </div>
      <p className="absolute right-0 bg-gray-100 hidden border-b-4 border-[#03257e] sm:flex rounded w-[200px] p-2 text-[#03257e] text-center font-bold text-[10px] sm:text-[15px] md:text-[20px] uppercase leading-none animate-slide-in-right shadow-gray-800 z-20">
            Governments
          </p>
  </div>
  <div className="flex justify-start items-center p-2 border-b-2 border-gray-300">
    <p className="absolute left-0 bg-gray-100 hidden border-b-4 p-2 border-[#03257e] sm:flex rounded w-[170px] text-[#03257e] text-center font-bold text-[10px] sm:text-[15px] md:text-[20px] uppercase leading-none shadow-gray-800 z-20">
            Universities
          </p>
      <div className="overflow-hidden sm:py-4">
        <div
          key={3} 
          className="flex animate-slide whitespace-nowrap w-max"
        >
          {universityLogos.concat(universityLogos).map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`logo-${index}`}           
              className="h-6 sm:h-10 w-auto sm:w-auto mx-4 sm:mx-8"
               />
            ))}
        </div>
      </div>
  </div>
</div>
  )
}

export default PartnerList
