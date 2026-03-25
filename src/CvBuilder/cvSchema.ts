import { z } from "zod"

export const personalDetailsSchema = z.object({
  fullName: z.string().min(3, { message: "Name should be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email" }),
  phoneNumber: z
    .string()
    .min(7, { message: "Invalid phone number" })
    .max(12, { message: "Invalid phone number" })
    .regex(/^[+\d][\d\s-]*\d$/, { message: "Invalid phone number" }),
  location: z.string().min(1, { message: "Location is required" }),
  yearOfExp:z.string().min(1,{message:"Year of experience is required"}),
  // Accept either a valid url OR empty string (so your form can keep "" as default)
  linkedin: z.union([z.string().url({ message: "Invalid url" }), z.literal("")]),
  github: z.union([z.string().url({ message: "Invalid url" }), z.literal("")]),
  imageUrl: z.string().min(1, { message: "Image is required" }),
  profileSummary:z.string().min(1,{message:"Profile summary is required"}).optional(),
  // Require the checkbox to be checked
  selfAttested: z.boolean().refine(v=>v===true,{message:"All data should be self attested"}),
});



export type PersonalDetailsItem = z.infer<typeof personalDetailsSchema>;



export const EducationItemSchema = z.object({
  id: z.string().uuid().or(z.string().min(1, "ID is required")),
  eduDocId:z.string(),
  level:z.union([
  z.enum([
    "Secondary School",
    "Higher Secondary School",
    "Graduation",
    "PostGraduation",
    "Other",
  ]),
  z.string().min(1)
], {
  required_error: "Level is required",
}),
  boardNameOrDegree: z.string().min(1,"This field is required"),
  institutionName: z.string().min(1,"Institution name is required"),
  gpa: z.string().min(1,"This field is required"),
  duration: z.object({
    to: z.string().min(1, { message: "End date is required" }),
    from: z.string().min(1, { message: "Start date is required" }),
  }),
  selfAttested: z
  .boolean()
  .refine((v) => v === true, { message: "All data should be self attested" }),
   isEmailSend:z.boolean().optional(),
  issuerEmailId:z.string().email({message:"Invalid email"}).optional(),
  verified:z.boolean().optional(),
  docHash:z.string().optional(),
  status:z.enum(["pending","verified","rejected","inProgress"]),
  verifiedThrough:z.string().optional(),
  docUri:z.string().optional().or(z.literal("")),
  orgId:z.string().optional(),
}).superRefine((data,ctx)=>{
    if(data.docUri && !data.verified)
  {
    if(!data.issuerEmailId)
    {
      ctx.addIssue({message:"Issuer Email Id required",path:["issuerEmailId"],code: z.ZodIssueCode.custom})
    }
  }
  if(data.issuerEmailId)
  {
    if(!data.docUri)
    {
      ctx.addIssue({message:"Document Uri required",path:["docUri"],code: z.ZodIssueCode.custom})
    }
  }
  if(data.duration.from && data.duration.to)
  {
    if(data.duration.from > data.duration.to)
    {
      ctx.addIssue({message:"Start date should be less than end date",path:["duration","from"],code: z.ZodIssueCode.custom})
    }
  }
})


// ✅ The array version (root schema)
export const EducationSchema = z.object({
  educations: z
    .array(EducationItemSchema)
});

export type EducationFormValues = z.infer<typeof EducationSchema>;
export type TypeEducation = z.infer<typeof EducationItemSchema>;

export const ExperienceItemSchema = z.object({
  id: z.string().uuid().or(z.string().min(1, "ID is required")),
  expDocId:z.string(),
  companyName: z.string().min(1, "Company name is required"),
  jobRole: z.string().min(1, "Position is required"),
  duration: z.object({
    from:z.string().min(1,"start date is required"),
    to:z.string().min(1,"end date is required")
  }),
  skills:z.string().min(1,"skill is required").refine((s)=>s.includes(","),"Separate multiple skills using commas (e.g., React, Node.js)"),
  description: z.string().min(1, "Description is required"),
  selfAttested: z.boolean().refine(v=>v===true,{message:"All data should be self attested"}),
  isEmailSend:z.boolean(),
  issuerEmailId:z.string().email().optional(),
  verified:z.boolean().optional(),
  docHash:z.string().optional(),
  status:z.enum(["pending","verified","rejected","inProgress"]),
  verifiedThrough:z.string().optional(),
  docUri: z.string().optional()
}).superRefine((data,ctx)=>{
    if(data.docUri)
  {
    if(!data.issuerEmailId)
    {
      ctx.addIssue({message:"Issuer Email Id required",path:["issuerEmailId"],code: z.ZodIssueCode.custom})
    }
  }
  if(data.issuerEmailId)
  {
    if(!data.docUri)
    {
      ctx.addIssue({message:"Document Uri required",path:["docUri"],code: z.ZodIssueCode.custom})
    }
  }
  if(data.duration.from && data.duration.to)
  {
    if(data.duration.from > data.duration.to)
    {
      ctx.addIssue({message:"Start date should be less than end date",path:["duration","from"],code: z.ZodIssueCode.custom})
    }
  }
});

export const ExperienceSchema = z.object({
  experiences: z
    .array(ExperienceItemSchema)
})

export type ExperienceFormValues = z.infer<typeof ExperienceSchema>;
export type TypeExperience = z.infer<typeof ExperienceItemSchema>;

export const ProjectItemSchema = z.object({
  id: z.string().uuid().or(z.string().min(1, "ID is required")),
  projectName: z.string().min(1, "Project name is required"),
  projectUrl: z.string().url().optional().or(z.literal("")),
  duration: z.object({
    from:z.string().min(1,"start date is required"),
    to:z.string().min(1,"end date is required")
  }),
  skills:z.string().min(1,"skill is required").refine((s)=>s.includes(","),"Separate multiple skills using commas (e.g., React, Node.js)"),
  description: z.string().min(1, "Description is required"),
  selfAttested: z.boolean().refine(v=>v===true,{message:"All data should be self attested"}),
}).superRefine((data,ctx)=>{
  if(data.duration.from && data.duration.to)
  {
    if(data.duration.from > data.duration.to)
    {
      ctx.addIssue({message:"Start date should be less than end date",path:["duration","from"],code: z.ZodIssueCode.custom})
    }
  }
});

export const ProjectSchema = z.object({
  projects:z.array(ProjectItemSchema)
})

export type ProjectFormValues = z.infer<typeof ProjectSchema>;
export type TypeProject = z.infer<typeof ProjectItemSchema>;

export const AwardItemSchema = z.object({
  id: z.string().uuid().or(z.string().min(1, "ID is required")),
  level: z.enum(["Award", "Certificate", "Course"], { required_error: "Level is required" }),
  name: z.string().min(1, "Award name is required"),
  organisation: z.string().min(1,"organisation name is required"),
  duration: z.object({
    from:z.string().optional(),
    to:z.string().optional()
  }),
  description: z.string().min(1,"description is required"),
  selfAttested: z.boolean().refine(v=>v===true,{message:"All data should be self attested"}),
  isEmailSend:z.boolean(),
  issuerEmailId:z.string().email().optional(),
  docUri: z.string().optional(),
  verified:z.boolean().optional(),
  docHash:z.string().optional(),
  status:z.enum(["pending","verified","rejected","inProgress"]),
  verifiedThrough:z.string().optional(),
}).superRefine((data,ctx)=>{
  if(data.level==="Award" || data.level==="Certificate")
  {
    if(!data.duration.from){
      ctx.addIssue({path:["duration","from"],message:"Date of achievement required",code: z.ZodIssueCode.custom,})
    }
  }
  if(data.level==="Course")
  {
    if(!data.duration.from){
      ctx.addIssue({path:["duration","from"],message:"Date is required",code: z.ZodIssueCode.custom,})
    }
    if(!data.duration.to){
      ctx.addIssue({path:["duration","to"],message:"Date is required",code: z.ZodIssueCode.custom,})
    }
  }
  if(data.docUri)
  {
    if(!data.issuerEmailId)
    {
      ctx.addIssue({message:"Issuer Email Id required",path:["issuerEmailId"],code: z.ZodIssueCode.custom})
    }
  }
  if(data.issuerEmailId)
  {
    if(!data.docUri)
    {
      ctx.addIssue({message:"Document Uri required",path:["docUri"],code: z.ZodIssueCode.custom})
    }
  }
  if(data.duration.from && data.duration.to)
  {
    if(data.duration.from > data.duration.to)
    {
      ctx.addIssue({message:"Start date should be less than end date",path:["duration","from"],code: z.ZodIssueCode.custom})
    }
  }
});

export const AwardSchema = z.object({
  awards:z.array(AwardItemSchema)
})

export type AwardFormValues = z.infer<typeof AwardSchema>;
export type TypeAward = z.infer<typeof AwardItemSchema>;

export const ProfileSummarySchema = z.object({
    id: z.string().uuid().or(z.string().min(1, "ID is required")),
    profileSummary:z.string({required_error:"Profile summary is required"}),
    selfAttested: z.boolean().refine(v=>v===true,{message:"All data should be self attested"}),

})
export type ProfileSummaryItem = z.infer<typeof ProfileSummarySchema>


export const SKillItemSchema = z.object({
  id: z.string().uuid().or(z.string().min(1, "ID is required")),
  skillName:z.string().min(1,"Skill name is required"),
  level:z.enum(["beginner","intermediate","advanced","expert"],{required_error:"Level is required"}),
  selfAttested: z.boolean().refine(v=>v===true,{message:"All data should be self attested"}),
  endoresBy:z.string().optional(),
  endoresThrough:z.string().optional(),
})

export const SkillSchema = z.object({
  skills:z.array(SKillItemSchema)
})

export type SkillFormValues = z.infer<typeof SkillSchema>
export type TypeSkill = z.infer<typeof SKillItemSchema>


export const ResendEmailDoc = z.object({
  id:z.string().min(1,"id is required"),
  issuerEmailId:z.string().email(),
  docUri:z.string().min(1,"doc uri is required"),  
  docHash:z.string().min(1,"docHash is required")
})

export type TypeResendEmail = z.infer<typeof ResendEmailDoc>