import { useRef } from "react";
import {
  Mail,
  MapPinned,
  Phone,
  Linkedin,
  CircleUser,
  Link2,
  CheckCircle,
  X,
  Briefcase,
} from "lucide-react";
import { GraduationCap } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

// ─── tiny helpers (replace with your real imports) ───────────────────────────
const COLOR_TEAL = "#006666";

const formatDate = (d: any) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const ShowAnimatedVerifications = ({
  firstButtonText,
  isSelfAttested,
}: any) => (
  <span
    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
    style={{ backgroundColor: COLOR_TEAL + "18", color: COLOR_TEAL }}
  >
    {isSelfAttested && <CheckCircle size={14} className="text-green-500" />}
    {firstButtonText}
  </span>
);

const NotProvided = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => (
  <div
    className={twMerge(
      "border border-red-500 rounded px-2 py-1 text-xs text-white w-fit",
      className,
    )}
  >
    {label} not found
  </div>
);
const proxyImage = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
// ─── MODAL ────────────────────────────────────────────────────────────────────
const LinkedinProfileCvModal = ({ cvData, onClose }: any) => {
  const pdfRef = useRef(null);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ background: "rgba(2,20,20,0.72)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      {/* Modal shell */}
      <div
        className="relative flex flex-col"
        style={{
          width: "min(96vw, 1140px)",
          maxHeight: "92vh",
          borderRadius: 18,
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}
      >
        {/* ── Header bar ── */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-amber-50 border-b border-amber-200 shrink-0">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-amber-800 leading-snug">
                This is your imported LinkedIn profile preview —{" "}
              </p>
              <p className="text-xs text-amber-700 leading-snug">
                ⚠️ This is{" "}
                <span className="font-bold text-amber-900">not your trucv</span>
                . We've pre-filled this data for reference only.{" "}
                <button
                  onClick={onClose}
                  className="text-[#006666] font-bold underline underline-offset-2 hover:opacity-75 transition"
                >
                  Close & create your trucv →
                </button>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-amber-200 transition text-amber-600 shrink-0 ml-3"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto bg-white" style={{ flex: 1 }}>
          {/* swipe hint on small screens */}
          <p className="text-center text-[#F1441C] text-sm py-1 lg:hidden">
            👉 Swipe left/right to view the full CV
          </p>

          {/* CV canvas – same 1100 px fixed-width pattern as original */}
          <div
            ref={pdfRef}
            className="mt-2 mx-auto w-full border border-l-0 shadow-lg rounded-md overflow-x-scroll xl:overflow-x-clip"
            style={{ maxWidth: "100%" }}
          >
            <div className="flex gap-3 md:gap-7 w-[1100px]">
              {/* ── LEFT SIDEBAR ── */}
              <div className="w-72 h-auto bg-[#006666] rounded-ss-2xl px-2 md:px-5 text-white py-2 space-y-20 md:space-y-10">
                {/* Profile image */}
                {cvData.personal.imgUrl ? (
                  <div className="mt-5">
                    <img
                      src={proxyImage(cvData.personal.imgUrl)}
                      alt="profile"
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 mx-auto border-[#449298] object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="mt-5">
                    <CircleUser className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 mx-auto border-[#449298] object-cover" />
                  </div>
                )}

                {/* Education */}
                <div>
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-10 w-10 bg-[#FB980E] rounded-full text-white flex items-center justify-center">
                      <GraduationCap size={20} />
                    </div>
                    <h1 className="text-black-500 text-sm md:text-xl lg:text-2xl font-semibold tracking-tight uppercase">
                      Education
                    </h1>
                  </div>

                  <div className="flex flex-col gap-10 md:gap-5 mt-3">
                    {cvData.educations.map((education: any, index: any) => (
                      <div
                        className="flex flex-col p-4 md:p-5 rounded-lg shadow-sm"
                        key={index}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <h1 className="flex items-center gap-1 font-semibold text-sm md:text-base text-white">
                              {education.level ? (
                                education.level
                              ) : (
                                <NotProvided label="Level" />
                              )}

                              {education.docUri && (
                                <a
                                  href={education.docUri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center ml-1 p-1 rounded-md text-[#FB980E] hover:bg-[#FB980E]/10 transition"
                                >
                                  <Link2 size={14} />
                                </a>
                              )}
                            </h1>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-col gap-2">
                          <div className="text-sm flex flex-col justify-start text-white gap-1">
                            <span className="font-medium text-white flex items-center gap-1 flex-wrap">
                              {education.institutionName ? (
                                <span>{education.institutionName}</span>
                              ) : (
                                <NotProvided label="Institution" />
                              )}
                              {" | "}
                              {education.boardNameOrDegree ? (
                                <span>{education.boardNameOrDegree}</span>
                              ) : (
                                <NotProvided label="Degree" />
                              )}
                            </span>

                            {education.gpa ? (
                              Number(education.gpa) > 10 ? (
                                <span className="font-bold text-white">
                                  Percentage: {education.gpa}%
                                </span>
                              ) : (
                                <span className="font-bold text-white">
                                  GPA: {education.gpa}
                                </span>
                              )
                            ) : (
                              <NotProvided label="GPA" />
                            )}
                          </div>

                          <div className="text-sm text-white flex items-center gap-1 flex-wrap">
                            {education.duration?.from ? (
                              <span>{formatDate(education.duration.from)}</span>
                            ) : (
                              <NotProvided label="Start date" />
                            )}
                            {education.duration?.to ? (
                              <span>— {formatDate(education.duration.to)}</span>
                            ) : (
                              <NotProvided label="End date" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── RIGHT CONTENT ── */}
              <div className="flex-1">
                <div className="mt-5 px-2 flex flex-col gap-3">
                  {/* Name */}
                  <div className="flex items-center gap-5">
                    {cvData.personal.fullName ? (
                      <h1 className="text-4xl text-[#333B4D] tracking-wide capitalize max-w-[500px] lg:max-w-[600px] line-clamp-1">
                        {cvData.personal.fullName}
                      </h1>
                    ) : (
                      <NotProvided
                        label="Name"
                        className="text-black text-xl"
                      />
                    )}
                  </div>

                  {/* Personal details grid */}
                  <div className="bg-[#006666] grid grid-cols-2 rounded-md text-white px-5 py-1 md:max-w-3xl w-full gap-3">
                    <div className="w-full">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <Mail
                            size={26}
                            className="h-4 w-4 md:h-5 md:w-5 mt-1 shrink-0"
                          />
                          {cvData.personal.email ? (
                            <h1 className="text-sm md:text-base tracking-wider font-normal">
                              {cvData.personal.email}
                            </h1>
                          ) : (
                            <NotProvided label="Email" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPinned
                            size={26}
                            className="h-4 w-4 md:h-5 md:w-5 mt-1 shrink-0"
                          />
                          {cvData.personal.city ? (
                            <h1 className="text-sm md:text-base tracking-wider font-normal">
                              {cvData.personal.city}
                            </h1>
                          ) : (
                            <NotProvided label="City" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full ml-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <Phone
                            size={24}
                            className="h-4 w-4 md:h-5 md:w-5 mt-1 shrink-0"
                          />
                          {cvData.personal.phone ? (
                            <h1 className="text-sm md:text-base tracking-wider font-normal">
                              {cvData.personal.phone}
                            </h1>
                          ) : (
                            <NotProvided label="Mobile No." />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Briefcase
                            size={24}
                            className="h-4 w-4 md:h-5 md:w-5 mt-1 shrink-0"
                          />
                          {cvData.personal.profession ? (
                            <span className="text-sm capitalize">
                              {cvData.personal.profession}
                            </span>
                          ) : (
                            <NotProvided label="Profession" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="flex gap-2">
                        <div className="flex items-center gap-3">
                          <FaGithub
                            size={24}
                            className="h-4 w-4 md:h-5 md:w-5 mt-1 shrink-0"
                          />
                          {cvData.personal.github ? (
                            <a
                              href={cvData.personal.github}
                              target="_blank"
                              className="text-sm md:text-base tracking-wider font-normal underline"
                            >
                              Github
                            </a>
                          ) : (
                            <NotProvided label="Github" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Linkedin
                            size={24}
                            className="h-4 w-4 md:h-5 md:w-5 mt-1 shrink-0"
                          />
                          {cvData.personal.linkedin ? (
                            <a
                              href={cvData.personal.linkedin}
                              target="_blank"
                              className="text-sm md:text-base tracking-wider font-normal underline"
                            >
                              LinkedIn
                            </a>
                          ) : (
                            <NotProvided label="LinkedIn" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="flex gap-2 items-center overflow-hidden">
                    {cvData.personal?.summary ? (
                      <p className="text-sm md:text-base font-semibold">
                        {cvData.personal?.summary}
                      </p>
                    ) : (
                      <NotProvided label="Summary" className="text-black" />
                    )}
                  </div>

                  {/* Skills */}
                  <div className="mt-2">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="h-10 w-10 bg-[#FB980E] rounded-full text-white flex items-center justify-center text-sm font-bold">
                        S
                      </div>
                      <h1 className="text-2xl font-semibold tracking-wider uppercase">
                        Skills
                      </h1>
                    </div>
                    <div className="flex flex-col mt-2 gap-5 md:gap-3">
                      {cvData?.skills && cvData?.skills?.length > 0 ? (
                        cvData?.skills?.map((skill: any, index: any) => (
                          <div key={index}>
                            <div className="flex gap-1 items-center w-fit">
                              <ShowAnimatedVerifications
                                firstButtonText={skill.skillName}
                                isSelfAttested
                                mailStatus={skill.endoresBy}
                                hash=""
                              />
                              {skill.endoresBy && (
                                <span>
                                  Endorsed by{" "}
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
                                    style={{
                                      backgroundColor: COLOR_TEAL + "1a",
                                      color: COLOR_TEAL,
                                    }}
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    {skill.endoresBy.slice(0, 2)}...
                                    {skill.endoresBy.slice(-4)}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <NotProvided
                          label="Skills"
                          className="text-black text-sm lg:text-xl mt-2"
                        />
                      )}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="mt-5">
                    <div className="flex items-center gap-5">
                      <div className="h-10 w-10 bg-[#FB980E] rounded-full text-white flex items-center justify-center text-sm font-bold">
                        W
                      </div>
                      <h1 className="text-2xl font-semibold tracking-wider uppercase">
                        Work Experience
                      </h1>
                    </div>
                    {cvData?.experiences && cvData?.experiences?.length > 0 ? (
                      <div className="relative">
                        <div className="absolute inset-y-2 h-auto w-[3px] bg-[#FB980E] rounded-full"></div>
                        {cvData.experiences.map((exp: any, index: any) => (
                          <div
                            key={index}
                            className="flex flex-col mt-3 px-3 ml-1"
                          >
                            <div className="flex justify-between">
                              <div className="max-w-xl w-full relative">
                                <div className="absolute bg-[#FB980E] h-3 w-3 rounded-full top-2 -left-[21px]"></div>
                                <h1 className="text-md md:text-xl font-semibold tracking-tight line-clamp-1">
                                  {exp.jobRole}
                                </h1>
                                <div className="flex flex-col">
                                  <p className="flex gap-1 items-center text-sm md:text-lg capitalize line-clamp-1">
                                    {exp.companyName}
                                    {exp.docUri && (
                                      <a
                                        href={exp.docUri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#FB980E] font-semibold text-sm"
                                      >
                                        <Link2 size={14} />
                                      </a>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-[#006666] italic text-xs md:text-base text-nowrap">
                                  {formatDate(exp.duration.from)} —{" "}
                                  {exp.duration.to === "Present"
                                    ? "Present"
                                    : formatDate(exp.duration.to)}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3">
                              {exp.description ? (
                                <p>{exp.description}</p>
                              ) : (
                                <NotProvided
                                  label="Description"
                                  className="text-black"
                                />
                              )}
                              {exp.skills ? (
                                <p>
                                  <strong>Skills:</strong> {exp.skills}
                                </p>
                              ) : (
                                <NotProvided
                                  label="Skills"
                                  className="text-black mt-2"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NotProvided
                        label="Experience"
                        className="text-black text-sm lg:text-xl mt-2"
                      />
                    )}
                  </div>

                  {/* Achievements & Projects */}
                  <div className="flex items-center gap-5">
                    <div className="h-10 w-10 bg-[#FB980E] rounded-full text-white flex items-center justify-center text-sm font-bold">
                      A
                    </div>
                    <h1 className="text-2xl font-semibold tracking-wider uppercase">
                      Achievements and Certifications
                    </h1>
                  </div>
                  {cvData?.awards?.length > 0 ||
                  cvData?.projects?.length > 0 ? (
                    <div className="my-10 space-y-5">
                      {/* Awards */}
                      {cvData?.awards && cvData?.awards?.length > 0 ? (
                        <div className="px-3 mt-2">
                          <h1 className="text-xl font-semibold text-[#44949C] mb-2">
                            Awards
                          </h1>
                          <div className="flex flex-col gap-3 relative">
                            <div className="absolute inset-y-2 h-auto w-[3px] bg-[#FB980E] rounded-full"></div>
                            {cvData.awards.map((award: any, index: any) => (
                              <div key={index} className="flex flex-col ml-3">
                                <div className="flex justify-between">
                                  <div className="max-w-xl w-full relative">
                                    <div className="absolute bg-[#FB980E] h-3 w-3 rounded-full top-2 left-[-17px]"></div>
                                    <h1 className="text-md flex items-center gap-1 md:text-xl font-semibold tracking-tight line-clamp-1">
                                      {award.name}
                                      {award.docUri && (
                                        <a
                                          href={award.docUri}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[#FB980E] font-semibold text-sm"
                                        >
                                          <Link2 size={14} />
                                        </a>
                                      )}
                                    </h1>
                                    <div className="flex flex-col">
                                      <p className="text-sm md:text-lg capitalize line-clamp-1 mb-1">
                                        {award.organisation}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-[#006666] italic text-xs md:text-base">
                                      {formatDate(award.duration?.from)}
                                      {award.duration?.to
                                        ? ` -${formatDate(award.duration.to)}`
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-1">
                                  {award.description ? (
                                    <p className="text-base">
                                      {award.description}
                                    </p>
                                  ) : (
                                    <NotProvided
                                      label="Description"
                                      className="text-black"
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <NotProvided
                          label="Achievements and Certifications"
                          className="text-black text-sm lg:text-xl mt-2"
                        />
                      )}

                      {/* Projects */}
                      <h1 className="text-xl font-semibold text-[#44949C] mb-3">
                        Projects
                      </h1>
                      {cvData?.projects && cvData?.projects?.length > 0 ? (
                        <div className="px-3 mt-2">
                          <div className="flex flex-col gap-3 relative">
                            <div className="absolute inset-y-2 h-auto w-[3px] bg-[#FB980E] rounded-full"></div>
                            {cvData.projects.map((project: any, index: any) => (
                              <div key={index} className="flex flex-col ml-3">
                                <div className="flex justify-between">
                                  <div className="max-w-xl w-full flex flex-col md:flex-row md:gap-10 md:items-center relative">
                                    <div className="absolute bg-[#FB980E] h-3 w-3 rounded-full top-2 -left-[17px]"></div>
                                    <div className="flex flex-col">
                                      <h1 className="flex gap-1 text-center items-center text-md md:text-xl font-semibold tracking-tight line-clamp-2">
                                        {project.projectName}
                                        {project.projectUrl && (
                                          <a
                                            href={project.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#FB980E] font-semibold text-sm"
                                          >
                                            <Link2 size={14} />
                                          </a>
                                        )}
                                      </h1>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-[#006666] italic text-xs md:text-base text-nowrap">
                                      {formatDate(project.duration.from)} —{" "}
                                      {project.duration.to === "Present"
                                        ? "Present"
                                        : formatDate(project.duration.to)}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-1">
                                  {project.description ? (
                                    <p className="text-base">
                                      {project.description}
                                    </p>
                                  ) : (
                                    <NotProvided
                                      label="Description"
                                      className="text-black mb-2"
                                    />
                                  )}
                                  {project.skills ? (
                                    <>
                                      <p>
                                        <strong>Skills:</strong>{" "}
                                        {project.skills}
                                      </p>
                                    </>
                                  ) : (
                                    <NotProvided
                                      label="Skills"
                                      className="text-black"
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <NotProvided
                          label="Projects"
                          className="text-black text-sm lg:text-xl mt-2"
                        />
                      )}
                    </div>
                  ) : (
                    <NotProvided
                      label="Achievements , Certifications and Projects"
                      className="text-black text-sm lg:text-xl mt-2"
                    />
                  )}
                </div>
              </div>
              {/* end right */}
            </div>
          </div>
          {/* bottom padding inside scroll */}
          <div className="h-6" />
        </div>
      </div>
    </div>
  );
};

export default LinkedinProfileCvModal;
