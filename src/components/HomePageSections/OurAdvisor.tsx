import { FaLinkedinIn } from 'react-icons/fa';
import advisor1 from '@/assets/Advisor/advisor1.png'
import advisor2 from '@/assets/Advisor/advisor2.png'
import advisor3 from '@/assets/Advisor/advisor3.png'
import advisor4 from '@/assets/Advisor/advisor4.png'
import advisor5 from '@/assets/Advisor/advisor5.png'
import advisor6 from '@/assets/Advisor/advisor6.png'
import advisor7 from '@/assets/Advisor/advisor7.jpeg';

const OurAdvisor = () => {

  const AdvisorsArray = [
  {
    name: "Somashekhar",
    position: "Global Tech Leader",
    intro: "MBA-MIT Sloan Fellow, INSEAD-EIR, Adjunct Professor of Innovation & Entreprenurship; VC-Singapore Innovate; AI Venture Guide; Singapore Government IMDA" ,
    image: advisor1,
    linkdeinProfile: "https://www.linkedin.com/in/neralakere-somashekhar-soma-9151611/",
  },
  {
    name: "Dr. Ish Anand",
    position: "Serial Entrepreneur, Advisor in Startups, Global Citizen",
    intro: `30 years + of experience in Corporates, the Startup Ecosystem and as an Enterpreneur across 5 continents`,
    image: advisor2,
    linkdeinProfile: "https://www.linkedin.com/in/ishanand/",
  },
   {
    name: "Dr. Sindhu Bhaskar",
    position: "Co-Founder, EST Global, Forbes Council Member",
    intro: `Established $100M+ business in Education sector. Co-Founded Fintech & Blockchain Association (FAB), US`,
    image: advisor3,
    linkdeinProfile: "https://www.linkedin.com/in/dr-sindhu-bhaskar-55a84568/",
  },
  {
    name:"Dr. Vishram Bapat",
    position:"Director, SNDT University",
    intro:"Director, India's Largest Women's University, Startup Mentor acrooss India Ministry of Science & Technology, Goverment of India",
    image:advisor4,
    linkdeinProfile:"https://www.linkedin.com/in/vishram/"
  },
    {
    name: "Dr. Narsing Rao, GS",
    position: "Former VC at ICFAI University",
    intro: `30 years + of experience in Education Sector as Vice Chancellor & Chief Mentor at Indian Universities ex-Professor`,
    image: advisor5,
    linkdeinProfile: "https://www.linkedin.com/in/dr-narsing-rao-gs-a318735/",
  },
  {
    name:"Christian Sauer",
    position:"Founder, Soonami",
    intro:"Early-Stage AI & Web3 Investor, Soonami.io, from Germany EU. Investing in early-stage startups",
    image:advisor7,
    linkdeinProfile:"https://www.linkedin.com/in/christian-sauer-soonami/"
  },
  {
    name: "James Wren",
    position: "Lead BD, Liquidium",
    intro: `7+ years experience in Web3, Blockchain Degen & influencer in the BTC Ecosystem`,
    image: advisor6,
    linkdeinProfile: "https://www.linkedin.com/in/james-wren-15b8b759/",
  },
];

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <p className="text-[#03257E] text-[25px] sm:text-[40px] md:text-[50px] font-bold uppercase text-center" data-aos="fade-up">
        MEET OUR ADVISORS
      </p>
      <div className=" flex justify-center items-center flex-wrap gap-3">
           {
          AdvisorsArray?.map((advisor,index)=>{
            return(
          <div key={index} className="w-full max-w-xs min-h-[450px] p-4 bg-gradient-to-br from-gray-100 to-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-2 transition duration-300 flex flex-col justify-between items-center text-center">
          <div className="w-28 h-28 mb-4 rounded-full p-1 bg-gradient-to-br from-[#03257e] via-[#006666] to-[#F14419]">
            <img
              src={advisor.image}
              alt="advisor1"
              className="w-full h-full rounded-full object-cover"
              data-aos="zoom-in"
            />
          </div>
          <div className="flex flex-col items-center flex-grow" data-aos="zoom-in">
            <p className="text-lg font-bold text-gray-800 mb-1">{advisor.name}</p>
            <p className="bg-gradient-to-r from-[#03257e] via-[#006666] to-[#F14419] text-white text-sm font-semibold px-3 py-1 rounded-full mb-3">
              {advisor.position}
            </p>

            <a
              href={advisor.linkdeinProfile}
              target="_blank"
              rel="noreferrer"
              className="mb-4"
            >
              <FaLinkedinIn className="text-[#0077B5] w-7 h-7" />
            </a>

            <p className="text-sm text-gray-600 leading-relaxed">
              {advisor.intro}
            </p>
          </div>
          </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default OurAdvisor;
