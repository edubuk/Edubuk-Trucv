export type GuideStepData = {
  image: string;
  title?: string;
  description?: string;
  /** Field-by-field guidance, each rendered as its own bulleted line. */
  tips?: string[];
  link?: { label: string; href: string };
};

// One entry per distinct TruCV section (Smart Autofill has two — CV tab and
// LinkedIn tab). TODO: remaining descriptions/tips (Skills, Personal
// Projects, Certificates/Courses/Awards) to be filled in.
export const TRUCV_GUIDE_STEPS: GuideStepData[] = [
  {
    image: "/TrucvGuide/TrucvGuide_1.png",
    title: "Smart Autofill",
    description:
      "You can import your cv and it will automatically fill the form fields, remaining fields you should fill manually",
  },
  {
    image: "/TrucvGuide/TrucvGuide_2.png",
    title: "Import via LinkedIn",
    description:
      "Or you can import your linkdein profile and it will automatically fill the fields for you and remaining fields you hv to fill it manually",
  },
  {
    image: "/TrucvGuide/TrucvGuide_3.png",
    title: "Personal Details",
    description:
      "Next, fill in your personal details. This section is the foundation of your CV, so keep it accurate and up to date — fields marked (optional) can be skipped, everything else is required before you save.",
    tips: [
      "Profile photo — upload a clear, professional headshot in JPG or PNG, up to 5 MB.",
      "Full name — enter your full legal name as you'd like it to appear on your CV, e.g. Aditi Sharma.",
      "Profession — pick the option that fits best: Student, Employee, Entrepreneur or Freelance. Don't see yours? Choose \"Add another profession\" and type your own.",
      "Years of experience — enter a short value like 3 years, or 0 if you're a fresher.",
      "Email — this is your registered account email and is locked here for verification, so it can't be edited.",
      "Phone number — select your country code and enter your active contact number.",
      "Location — add City, state, country, e.g. Pune, Maharashtra, India.",
      "LinkedIn / GitHub (optional) — paste your full profile URL, e.g. https://linkedin.com/in/your-name.",
      "Profile summary (optional) — a short 2–3 sentence pitch covering your experience, strengths and career goals.",
      "Finally, tick Self attest to confirm everything you've entered is accurate before you save.",
    ],
  },
  {
    image: "/TrucvGuide/TrucvGuide_4.png",
    title: "Educational Details",
    description:
      "Add your education records one at a time — start with School, then add your University/College separately. You can add as many entries as you need, and update or delete them anytime.",
    tips: [
      "Select your education level — choose Secondary School, Higher Secondary School, Graduation or PostGraduation. Can't find yours? Pick Other and type it in.",
      "Start date / End date — enter when you began and completed this level of education.",
      "Board Name / Degree — for school, search and select your board, e.g. CBSE/ICSE; for college, enter your degree, e.g. B.Tech, B.Sc.",
      "Institution Name — enter your school or college name, e.g. Delhi Public School or IIT Bombay.",
      "Percentage / GPA — enter your final percentage for school, or GPA for college.",
      "Get your document from DigiLocker (Recommended) — this pulls a verified copy of your certificate directly, so it's faster and gets verified automatically.",
      "Tick Self attest to confirm the details are accurate, then click Save new education.",
      "Use Add School or Add University/College at the bottom to add more entries, and Edit or Delete on any card to update it later.",
    ],
  },
  {
    image: "/TrucvGuide/TrucvGuide_7.png",
    title: "Experience Details",
    description:
      "Add every role you've worked in — internships, part-time or full-time jobs. Each entry is saved separately, so you can add, update or delete them anytime.",
    tips: [
      "Are you currently working here? — tick this if it's your current job; it automatically sets the To date to \"present\" and locks the end date field.",
      "Company Name — enter the full name of the organisation you worked at.",
      "Position — your job title, e.g. Software Engineer.",
      "From / To — enter the start and end dates of your role, e.g. 10/11/2015 to 10/11/2018.",
      "Skills — list the key skills you used or built in this role.",
      "Description — describe your responsibilities and achievements in paragraph format.",
      "Tick Self attest to confirm the details are accurate, then click Save new experience.",
      "Use Add Experience to add more roles, and Edit or Delete on any card to update it later.",
    ],
  },
  {
    image: "/TrucvGuide/TrucvGuide_10.png",
    title: "Skills",
    description:
      "Add your strongest skills along with your proficiency level. You can add as many as you like, and request verification for the ones that matter most.",
    tips: [
      "Enter a skill — type it into the input box, e.g. React, Node.js, DevOps.",
      "Select your proficiency — Beginner, Intermediate, Advanced or Expert — then click Add Skill.",
      "Repeat this for every skill you want to showcase; each one shows up as its own card below.",
      "Tick Self attest on a skill to confirm you genuinely have it, before saving.",
      "Want a skill verified? Tick the checkbox on the skill card, then click Verify Below Listed Skills to request verification.",
      "Once verified, a skill shows a green checkmark and \"Verified by …\" instead of the checkbox.",
      "Made a mistake? Use Remove (for a new, unsaved skill) or Delete (for an already-saved one) to take it off the list.",
      "When you're done, click Save New Skills to save everything.",
    ],
  },
  {
    image: "/TrucvGuide/TrucvGuide_11.png",
    title: "Personal Projects",
    description:
      "Add projects that show off what you've built. Make them stand out with a link and a short description — you can add as many as you like, and remove any of them later.",
    tips: [
      "Project Name — give your project a clear, recognisable name.",
      "Project Url (optional) — link to a live demo, GitHub repo, or case study.",
      "From / To (optional) — the duration you worked on this project.",
      "Skills — list the technologies you used, e.g. ReactJs, Java, NodeJs.",
      "Description — describe what the project does and your role in it, written as a paragraph.",
      "Tick Self attest to confirm the details are accurate.",
      "Use Add Project / Add More Project to add additional projects, and Save New Project to save them.",
      "If you've already uploaded a resume, use Fill Parsed Projects to auto-fill projects detected from it, then review and edit before saving.",
    ],
  },
  {
    image: "/TrucvGuide/TrucvGuide_12.png",
    title: "Certificates/Courses/Awards",
    description:
      "Add your certificates, completed courses and any awards you've earned. You can add as many as you like, and update or remove them anytime.",
    tips: [
      "Select your relevant field — choose Award, Certificate or Course depending on what you're adding.",
      "Name — enter the name of the award, certificate or course, e.g. AWS Certified Developer.",
      "Organisation — enter who issued it, e.g. Amazon Web Services, Coursera.",
      "Date of achievement (optional) — for Awards/Certificates, enter when you earned it; for a Course, enter the From and To dates instead.",
      "Description — briefly describe what it covers or why it matters, written as a paragraph.",
      "Tick Self attest to confirm the details are accurate, then click Save.",
      "Use Add Award/Certificate to add more entries, and Edit or Delete on any card to update it later.",
    ],
  },
];
