import api from "@/lib/api";

export const autoSave = async (cvData: any) => {
    try {
        // 1. Save education data
        if (cvData.educations.length > 0) {
            console.log("education data saving", cvData.educations);

            const eduResults = await Promise.all(
                cvData.educations.map((data: any) =>
                    api.post(`/doc/save-eduDoc`, {
                        data: {
                            level: data.level,
                            boardNameOrDegree: data.boardNameOrDegree,
                            institutionName: data.institutionName,
                            gpa: data.gpa,
                            duration: { from: data.duration.from, to: data.duration.to },
                            selfAttested: false,
                            isEmailSend: false,
                            verified: false,
                            status: "pending",
                        }
                    })
                )
            );

            // Check if any education save failed
            const eduFailed = eduResults.find(result => !result.data.success);
            if (eduFailed) return { success: false, message: eduFailed.data.message };
        }

        // 2. Save experience data
        if (cvData.experiences.length > 0) {
            console.log("experiences data saving", cvData.experiences);

            const expResults = await Promise.all(
                cvData.experiences.map((data: any) =>
                    api.post(`/doc/save-expDoc`, {
                        data: {
                            companyName: data.companyName,
                            jobRole: data.jobRole,
                            duration: {
                                from: data.duration.from,
                                to: data.duration.to,
                            },
                            description: data.description,
                            selfAttested:false,
                            isEmailSend: false,
                            verified:false,
                        }
                    })
                )
            );

            // Check if any experience save failed
            const expFailed = expResults.find(result => !result.data.success);
            if (expFailed) return { success: false, message: expFailed.data.message };
        }

        //3. save skills
        if(cvData.skills.length > 0) {
            console.log("skills data saving", cvData.skills);
            const skills = cvData.skills.map((skill: any) => ({
                skillName: skill.skillName,
                level: skill.level,
                selfAttested: false,
                endoresBy:'',
                endoresThrough:'',
            }));
            const skillResults = await api.post(`/doc/save-skills`, {
                data: {skills},
            });


            // Check if any skill save failed
            if (!skillResults.data.success) return { success: false, message: skillResults.data.message };
        }

        //4. Save Projects data
        if(cvData.projects.length > 0) {
            console.log("projects data saving", cvData.projects);

            const projectResults = await Promise.all(
                cvData.projects.map((data: any) =>
                    api.post(`/doc/save-projects`, {
                        data: {
                            projectName:data.projectName,
                            projectUrl: data.projectUrl,
                            duration: { from: data.duration.from, to: data.duration.to },
                            skills: data.skills,
                            description: data.description,
                            selfAttested: false,
                        }
                    })
                )
            );
            // Check if any project save failed
            const projectFailed = projectResults.find(result => !result.data.success);
            if (projectFailed) return { success: false, message: projectFailed.data.message };
        }

        //5. Save award data
        if(cvData.awards.length > 0) {
            console.log("awards data saving", cvData.awards);

            const awardResults = await Promise.all(
                cvData.awards.map((data: any) =>
                    api.post(`/doc/save-awards`, {
                        data: {
                            level: "Award",
                            name:data.name,
                            organisation:data.organisation,
                            duration: { from: data.duration.from, to: data.duration.to },
                            description:data.description,
                            selfAttested:false,
                            isEmailSend:false,
                            verified:false,
                            status:"pending",
                            verifiedThrough:"",
                        }
                    })
                )
            );

            // Check if any award save failed
            const awardFailed = awardResults.find(result => !result.data.success);
            if (awardFailed) return { success: false, message: awardFailed.data.message };
        }

        // 6. Return combined response after ALL are fully saved
        return {
            success: true,
            message: "CV data saved successfully",
        };

    } catch (error) {
        return { success: false, message: "Something went wrong" };
    }
};

export const autoSaveParsedData = async (cvData: any) => {
    try {
        // 1. Save education data
        if (cvData.educations.length > 0) {
            console.log("education data saving", cvData.educations);

            const eduResults = await Promise.all(
                cvData.educations.map((doc: any) =>
                    api.post(`/doc/save-eduDoc`, {
                        data: {
                            level: doc.level==="Grade 10"?"Secondary School":doc.level==="Grade 12"?"Higher Secondary School":doc.level==="Undergraduate"?"Graduation":"PostGraduation",
                            boardNameOrDegree: doc.boardNameOrDegree==="CBSE"?"Central Board of Secondary Education(CBSE)":"",
                            institutionName: doc.institutionName ?? "",
                            gpa: doc.gpa.split("/")[0] ?? "",
                            orgId:doc.boardNameOrDegree==="CBSE"?"000027":"",
                            duration: { from: "", to: "" },
                            selfAttested: false,
                            isEmailSend: false,
                            verified: false,
                            status: "pending",
                        }
                    })
                )
            );

            // Check if any education save failed
            const eduFailed = eduResults.find(result => !result.data.success);
            if (eduFailed) return { success: false, message: eduFailed.data.message };
        }

        // 2. Save experience data
        if (cvData.experiences.length > 0) {
            console.log("experiences data saving", cvData.experiences);

            const expResults = await Promise.all(
                cvData.experiences.map((doc: any) =>
                    api.post(`/doc/save-expDoc`, {
                        data: {
                            companyName:doc.companyName,
                            jobRole:doc.jobRole,
                            duration: { from: "", to: "" },
                            skills:doc.skills || "",
                            description:doc.description || "",
                            selfAttested: false,
                            isEmailSend: false,
                            verified: false,
                            status: "pending",
                        }
                    })
                )
            );

            // Check if any experience save failed
            const expFailed = expResults.find(result => !result.data.success);
            if (expFailed) return { success: false, message: expFailed.data.message };
        }

        //3. save skills
        if(cvData.skills.length > 0) {
            console.log("skills data saving", cvData.skills);
            const skills = cvData.skills.map((skill: any) => ({
                skillName: skill.skillName,
                level: skill.level?.toLowerCase(),
                selfAttested: false,
                endoresBy:'',
                endoresThrough:'',
            }));
            const skillResults = await api.post(`/doc/save-skills`, {
                data: {skills},
            });


            // Check if any skill save failed
            if (!skillResults.data.success) return { success: false, message: skillResults.data.message };
        }

        //4. Save Projects data
        if(cvData.projects.length > 0) {
            console.log("projects data saving", cvData.projects);
            const projects = cvData.projects.map((doc:any)=>{
                return {
                    projectName:doc.projectName || "",
                    projectUrl: doc.projectUrl || "",
                    duration: { from: "", to: "" },
                    skills:doc.skills || "",
                    description: doc.description || "",
                    selfAttested: false,
                }
            })
            const projectResults = await api.post(`/doc/save-projects`, {
                        data: projects
                    })
            // Check if any project save failed
            if (!projectResults.data.success) return { success: false, message: projectResults.data.message };
        }

        //5. Save award data
        if(cvData.awards.length > 0) {
            console.log("awards data saving", cvData.awards);

            const awardResults = await Promise.all(
                cvData.awards.map((doc: any) =>
                    {
                        return api.post(`/doc/save-awards`, {
                            data: {
                                level: "Certificate",
                                name: doc.name,
                                organisation: doc.organisation,
                                duration: { from: "", to: "" },
                                description: doc.description || "",
                                isEmailSend: false,
                                selfAttested: false,
                                verified: false,
                                status: "pending",
                                verifiedThrough: ""
                            }
                        });
                    }
                )
            );

            // Check if any award save failed
            const awardFailed = awardResults.find(result => !result.data.success);
            if (awardFailed) return { success: false, message: awardFailed.data.message };
        }

        // 6. Return combined response after ALL are fully saved
        return {
            success: true,
            message: "CV data saved successfully",
        };

    } catch (error) {
        return { success: false, message: "Something went wrong" };
    }
};


