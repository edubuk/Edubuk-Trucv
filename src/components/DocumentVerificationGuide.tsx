
import { CheckCircle, LogIn, LayoutDashboard, FileCheck, Mail, Send } from 'lucide-react';
import guid1 from '../assets/Guid/guid1.png';
import guid2 from '../assets/Guid/guid2.png';
import guid3 from '../assets/Guid/guid3.png';
import guid4 from '../assets/Guid/guid4.png';
import guid5 from '../assets/Guid/guid5.png';
import guid6 from '../assets/Guid/guid6.png';
import { Link } from 'react-router-dom';
const DocumentVerificationGuide = () => {
  const steps = [
    {
      id: 1,
      title: "Login to Your Account",
      description: "First, login with your provided email ID and password to access your TruCV dashboard.",
      icon: LogIn,
      image: guid1,
      imageAlt: "Login page showing email and password fields"
    },
    {
      id: 2,
      title: "Navigate to My Documents",
      description: "Head over to Dashboard and click on 'My Documents' section to view all your created documents.",
      icon: LayoutDashboard,
      image: guid2,
      imageAlt: "Dashboard interface with My Documents highlighted"
    },
    {
      id: 3,
      title: "Request Verification",
      description: "Click on the 'Request Verification' button next to the document that you want to verify.",
      icon: FileCheck,
      image: guid3,
      imageAlt: "Document list with Request Verification button highlighted",
      highlight: true
    },
    {
      id: 4,
      title: "Fill Verification Details",
      description: "A popup will open asking you to upload the document and provide the issuer's email or any reference email of the issuer, organization HR, or any appropriate member. Verification will be sent over this email for validation.",
      icon: Mail,
      image: guid4,
      imageAlt: "Verification request popup with form fields"
    },
    {
      id: 5,
      title: "Send Verification Request",
      description: "Review the details and click 'Send Email' to submit your verification request to the issuer.",
      icon: Send,
      image: guid5,
      imageAlt: "Send button in verification popup"
    },
    {
      id: 6,
      title: "Verification Complete!",
      description: "Your verification request has been sent successfully. The issuer will receive an email with a verification link to validate your document.",
      icon: CheckCircle,
      image: guid6,
      imageAlt: "Success message confirmation",
      isLast: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] opacity-5"></div>
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] bg-clip-text text-transparent">
              Document Verification Guide
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to verify your documents on TruCV platform
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Content Side */}
                  <div className="lg:w-2/5 p-8 flex flex-col justify-center">
                    {/* Step Number & Icon */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`
                        w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg
                        ${step.isLast 
                          ? 'bg-gradient-to-br from-[#006666] to-[#f14419]' 
                          : 'bg-gradient-to-br from-[#03257e] to-[#006666]'}
                      `}>
                        {step.id}
                      </div>
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        ${step.isLast 
                          ? 'bg-[#f14419] bg-opacity-10' 
                          : 'bg-[#03257e] bg-opacity-10'}
                      `}>
                        <Icon className={`
                          w-6 h-6
                          ${step.isLast ? 'text-[#f14419]' : 'text-[#03257e]'}
                        `} />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl font-bold mb-3 text-[#03257e]">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Highlight Badge */}
                    {step.highlight && (
                      <div className="mt-4 inline-flex">
                        <span className="px-4 py-2 bg-gradient-to-r from-[#f14419] to-[#006666] text-white text-sm font-semibold rounded-full shadow-md">
                          Important Step
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Image Side */}
                  <div className="lg:w-3/5 relative">
                    <div className="relative h-64 lg:h-full">
                      <img
                        src={step.image}
                        alt={step.imageAlt}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#03257e] to-transparent opacity-10"></div>
                      
                      {/* Step Indicator on Image */}
                      <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
                        <span className="text-sm font-semibold text-[#006666]">
                          Step {step.id} of {steps.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center -mb-4 relative z-10">
                    <div className="w-1 h-8 bg-gradient-to-b from-[#006666] to-[#03257e]"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] opacity-5"></div>
          <div className="relative">
            <h3 className="text-2xl font-bold mb-4 text-[#03257e]">
              Ready to Verify Your Documents?
            </h3>
            <p className="text-gray-600 mb-6">
              Start the verification process now and ensure your credentials are blockchain-secured.
            </p>
            <Link to="/login" className="bg-[#006666] text-white px-8 py-2 rounded-[6px] font-bold text-lg hover:bg-white hover:text-[#f14419] transition-colors duration-200">
              Get Started →
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@edubukeseal.org" className="text-[#006666] hover:text-[#f14419] font-semibold">
              support@edubukeseal.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerificationGuide;