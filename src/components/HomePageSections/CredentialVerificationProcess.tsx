import { motion } from "framer-motion";
import { ArrowDown, BadgeCheck, Check, FileSearch, Fingerprint, MailCheck, Network, ShieldCheck, UploadCloud, UserRoundCheck, X } from "lucide-react";

const stepTones = [
  { node: "bg-[#edf1fa] text-[#03257e]", label: "bg-[#eef2fa] text-[#03257e]" },
  { node: "bg-[#e5f4f1] text-[#006666]", label: "bg-[#e7f5f2] text-[#006666]" },
  { node: "bg-[#fff0eb] text-[#f14419]", label: "bg-[#fff0eb] text-[#c63b18]" },
  { node: "bg-[#edf1fa] text-[#03257e]", label: "bg-[#eef2fa] text-[#03257e]" },
];

const steps = [
  {
    actor: "Candidate", title: "Submit verification request", icon: MailCheck,
    description: "The candidate submits credential details and supporting documents onchain. A secure verification email is sent to the credential issuer automatically.",
    visual: <div className="grid gap-2"><div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-700"><Fingerprint size={17} className="text-[#03257e]" />Request signed</div><ArrowDown size={15} className="mx-auto -my-1 text-slate-400" /><div className="flex items-center gap-2.5 rounded-lg border border-[#d9eee9] bg-[#f0f9f7] p-3 text-xs font-bold text-slate-700"><MailCheck size={17} className="text-[#006666]" />Issuer notified</div></div>,
  },
  {
    actor: "Admin", title: "Authenticate the issuer", icon: ShieldCheck,
    description: "The admin registers the issuer onchain after validating their identity, creating an authenticated and trusted authority for credential decisions.",
    visual: <div className="flex items-center gap-2.5 rounded-[10px] border border-[#dcece9] bg-[#f1f8f7] p-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#006666] text-xs font-extrabold text-white">UI</span><span className="flex-1"><strong className="block text-xs text-slate-800">University Issuer</strong><small className="mt-0.5 block text-[10px] text-slate-500">Registered onchain</small></span><BadgeCheck size={20} className="text-[#006666]" /></div>,
  },
  {
    actor: "Registered issuer", title: "Review and decide", icon: UserRoundCheck,
    description: "The registered issuer reviews the submitted details and document, then approves or disapproves in one click. The decision is permanently recorded onchain.",
    visual: <div className="grid grid-cols-2 gap-2"><span className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[#eaf7f3] text-[11px] font-extrabold text-[#006666]"><Check size={15} />Approve</span><span className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[#fff0eb] text-[11px] font-extrabold text-[#d1431f]"><X size={15} />Disapprove</span><small className="col-span-2 pt-1 text-center text-[9px] font-bold uppercase tracking-[1px] text-slate-400">Action recorded</small></div>,
  },
  {
    actor: "Any verifier", title: "Verify the credential", icon: FileSearch,
    description: "Any verifier can upload the credential document. TruCV matches it against the onchain record and instantly displays its verification data and history.",
    visual: <div className="flex items-center gap-2.5 rounded-[10px] border border-[#dce4f1] bg-[#f4f7fc] p-3 text-[#03257e]"><UploadCloud size={19} /><span className="flex-1"><strong className="block text-xs">Hash matched</strong><small className="mt-0.5 block text-[10px] text-slate-500">Credential verified</small></span><Check size={15} className="box-content rounded-full bg-[#d9f2ec] p-1 text-[#006666]" /></div>,
  },
];

const CredentialVerificationProcess = () => (
  <section className="relative w-full overflow-hidden bg-white py-20 font-body text-[#071530] sm:py-28" aria-labelledby="credential-process-title">
    <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(3,37,126,0.11)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent,#000_22%,#000_78%,transparent)]" aria-hidden="true" />
    <div className="absolute -left-64 top-20 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,102,102,0.08),transparent_68%)]" aria-hidden="true" />
    <div className="absolute -right-56 bottom-0 size-[480px] rounded-full bg-[radial-gradient(circle,rgba(241,68,25,0.07),transparent_68%)]" aria-hidden="true" />
    <div className="relative z-[2] mx-auto w-[calc(100%-28px)] max-w-[1180px] sm:w-[calc(100%-48px)]">
      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }} className="mx-auto mb-12 max-w-[700px] text-center sm:mb-16">
        <div className="mb-4 inline-flex items-center gap-2 font-heading text-[10px] font-bold tracking-[1.8px] text-[#006666]"><Network size={15} className="box-content rounded-full bg-[#e8f5f2] p-2" />ONCHAIN VERIFICATION FLOW</div>
        <h2 id="credential-process-title" className="m-0 font-heading text-4xl font-bold leading-[1.1] tracking-[-2px] text-[#071530] md:text-5xl lg:text-[56px] lg:tracking-[-2.6px]">From submitted claim<br />to <span className="text-[#f14419]">trusted credential.</span></h2>
        <p className="mt-5 text-sm leading-relaxed text-slate-500 sm:text-base">Every participant has a clear role. Every action becomes an immutable proof.</p>
      </motion.div>
      <div className="relative grid grid-cols-1 items-stretch gap-x-4 gap-y-14 md:grid-cols-2 md:gap-y-12 lg:grid-cols-4 lg:gap-y-10">
        <div className="absolute left-[12.5%] right-[12.5%] top-[62px] z-0 hidden h-1 overflow-visible rounded-full bg-slate-300 lg:block" aria-hidden="true">
          <motion.div className="h-full origin-left bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]" animate={{ scaleX: [0, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
          <motion.span className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-[#f14419] shadow-[0_0_0_6px_rgba(241,68,25,0.1),0_0_18px_rgba(241,68,25,0.55)]" animate={{ left: ["0%", "calc(100% - 10px)"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
        </div>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const tone = stepTones[index];
          return (
            <motion.article key={step.title} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: .58, delay: index * .13, ease: [0.22, 1, 0.36, 1] }} className="relative z-[1] flex min-h-0 flex-col pb-8 font-body lg:pb-0">
              <div className="relative flex gap-2 h-24 shrink-0 items-end justify-center pb-1">
                <span className="absolute top-0 rounded-full bg-slate-100 px-2.5 py-1 font-heading text-[10px] font-extrabold tracking-[1.5px] text-slate-500">STEP 0{index + 1}</span>
                <motion.div
                  className={`relative z-10 flex size-14 items-center justify-center rounded-full border-[5px] border-white shadow-[0_7px_22px_rgba(3,37,126,0.14)] sm:size-[60px] ${tone.node}`}
                  animate={{ scale: [1, 1.11, 1], boxShadow: ["0 7px 22px rgba(3,37,126,.14)", "0 0 0 10px rgba(0,102,102,.12), 0 12px 30px rgba(3,37,126,.22)", "0 7px 22px rgba(3,37,126,.14)"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 6, delay: index * 2, ease: "easeInOut" }}
                >
                  <Icon size={22} />
                </motion.div>
              </div>
              <motion.div
                className="relative mt-7 flex h-full min-h-[350px] flex-col gap-2 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-[0_18px_50px_rgba(7,21,48,0.055)] sm:p-6 md:min-h-[390px] lg:min-h-[420px]"
                animate={{
                  borderColor: ["rgba(226,232,240,1)", "rgba(0,102,102,.5)", "rgba(226,232,240,1)"],
                  boxShadow: ["0 18px 50px rgba(7,21,48,.055)", "0 24px 58px rgba(3,37,126,.13)", "0 18px 50px rgba(7,21,48,.055)"],
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 6, delay: index * 2, ease: "easeInOut" }}
              >
                <motion.span
                  className="absolute inset-x-0 top-0 h-1 origin-left bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]"
                  animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 6, delay: index * 2, ease: "easeInOut" }}
                  aria-hidden="true"
                />
                <div className={`self-start rounded-md px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[1.1px] ${tone.label}`}>{step.actor}</div>
                <h3 className="mb-3 mt-5 font-heading text-xl font-bold leading-snug tracking-[-0.5px] text-slate-900 lg:text-[19px]">{step.title}</h3>
                <p className="mb-6 text-sm leading-[1.75] text-slate-600">{step.description}</p>
                <div className="mt-auto">{step.visual}</div>
              </motion.div>
            </motion.article>
          );
        })}
      </div>
      <motion.div initial={{ opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .55, delay: .25 }} className="mx-auto mt-10 flex max-w-[820px] flex-wrap items-start gap-3 rounded-[14px] border border-[#03257e]/10 bg-[#03257e] p-4 font-body text-white shadow-[0_18px_45px_rgba(3,37,126,0.17)] sm:min-h-[74px] sm:flex-nowrap sm:items-center sm:px-[18px]">
        <motion.span className="mt-1 size-[9px] shrink-0 rounded-full bg-[#42d4b7] sm:mt-0" animate={{ boxShadow: ["0 0 0 0 rgba(66,212,183,.5)", "0 0 0 9px rgba(66,212,183,0)"] }} transition={{ duration: 2, repeat: Infinity }} /><Fingerprint size={20} className="shrink-0 text-[#88dcd2]" /><div className="min-w-[calc(100%-70px)] flex-1"><small className="block text-[8px] font-extrabold tracking-[1.2px] text-[#8fdcd3]">IMMUTABLE AUDIT TRAIL</small><strong className="mt-1 block text-xs font-semibold">Request · Issuer identity · Decision · Verification</strong></div><span className="ml-5 inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-white/10 px-2.5 py-2 text-[9px] font-bold text-[#d9f6f1] sm:ml-0"><BadgeCheck size={15} />Recorded onchain</span>
      </motion.div>
    </div>
  </section>
);

export default CredentialVerificationProcess;
