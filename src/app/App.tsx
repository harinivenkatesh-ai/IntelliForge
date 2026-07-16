import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Home, FileText, BookOpen, FolderOpen, Bell, User, Settings,
  HelpCircle, LogOut, Menu, X, Mic, MicOff, Volume2, ChevronRight,
  RotateCcw, Square, Check, Globe, Loader2, Wheat, GraduationCap,
  Building2, Heart, Users, Briefcase, Baby, Zap, MoreHorizontal,
  CheckCircle2, Pencil, Lock, Star, Bot, ArrowRight, BookMarked,
  AlertCircle, Navigation, Clock, FileCheck, Trophy,
  Send, RefreshCw, ListChecks, Phone, MapPin,
} from "lucide-react";

type Screen =
  | "home" | "listening" | "understanding" | "confirm" | "matching"
  | "scheme" | "doccheck" | "missingdoc" | "application" | "review"
  | "submitted" | "myapps";

// ─── 9-step workflow ──────────────────────────────────────────────────────────
const WF = [
  {icon:"🎤",label:"Listen"    },
  {icon:"🧠",label:"Understand"},
  {icon:"📍",label:"Extract"   },
  {icon:"🔍",label:"Match"     },
  {icon:"📋",label:"Docs"      },
  {icon:"📝",label:"Apply"     },
  {icon:"👁", label:"Review"   },
  {icon:"✅",label:"Submit"    },
  {icon:"📊",label:"Track"     },
];
const SA:Record<Screen,number>={
  home:0,listening:0,understanding:1,confirm:2,matching:3,
  scheme:4,doccheck:4,missingdoc:4,application:5,review:6,submitted:7,myapps:9,
};
const SD:Record<Screen,number>={
  home:-1,listening:-1,understanding:0,confirm:1,matching:2,
  scheme:3,doccheck:3,missingdoc:3,application:4,review:5,submitted:6,myapps:8,
};
const MOB_STATUS:Record<Screen,string>={
  home:"Ready to help",listening:"Listening...",understanding:"Understanding...",
  confirm:"Confirm details",matching:"Schemes found!",scheme:"Scheme details",
  doccheck:"Checking documents...",missingdoc:"Document guidance",
  application:"Recording answer...",review:"Ready to submit",
  submitted:"Submitted! 🎉",myapps:"How can I help?",
};

// ─── document check list ──────────────────────────────────────────────────────
const CHECK_DOCS=[
  {name:"Aadhaar Card",        emoji:"🪪",issuer:"UIDAI / Government of India",      purpose:"Identity Verification"           },
  {name:"Bank Passbook",       emoji:"🏦",issuer:"Your Bank Branch",                 purpose:"Benefit Transfer Verification"   },
  {name:"Income Certificate",  emoji:"📄",issuer:"Tahsildar Office",                 purpose:"PM Fasal Bima Yojana Eligibility" },
  {name:"Land Ownership Proof",emoji:"🏡",issuer:"Revenue Department",               purpose:"Land Record Verification"        },
  {name:"Crop Damage Photos",  emoji:"📸",issuer:"Self / Village Officer",            purpose:"Damage Assessment Proof"         },
];
const MISSING_TL=[
  "Visit nearest Tahsildar office",
  "Carry Aadhaar card & address proof",
  "Fill the income certificate application",
  "Pay applicable fee (₹20)",
  "Collect certificate in 3–7 working days",
];

// ─── static data ──────────────────────────────────────────────────────────────
const NAV_ITEMS=[
  {icon:Home,        label:"Home",           active:true },
  {icon:FileText,    label:"My Applications"             },
  {icon:BookOpen,    label:"Schemes"                     },
  {icon:FolderOpen,  label:"Documents"                   },
  {icon:Bell,        label:"Notifications",  badge:3     },
  {icon:User,        label:"Profile"                     },
  {icon:Settings,    label:"Settings"                    },
  {icon:HelpCircle,  label:"Help & Support"              },
  {icon:LogOut,      label:"Logout"                      },
];
const CATS=[
  {icon:Wheat,         label:"Agriculture",color:"bg-amber-50 text-amber-700",  b:"border-amber-200" },
  {icon:GraduationCap, label:"Education",  color:"bg-blue-50 text-blue-700",    b:"border-blue-200"  },
  {icon:Building2,     label:"Housing",    color:"bg-orange-50 text-orange-700",b:"border-orange-200"},
  {icon:Heart,         label:"Health",     color:"bg-red-50 text-red-700",      b:"border-red-200"   },
  {icon:Users,         label:"Women",      color:"bg-pink-50 text-pink-700",    b:"border-pink-200"  },
  {icon:Briefcase,     label:"Employment", color:"bg-indigo-50 text-indigo-700",b:"border-indigo-200"},
  {icon:Baby,          label:"Children",   color:"bg-purple-50 text-purple-700",b:"border-purple-200"},
  {icon:Zap,           label:"Utility",    color:"bg-yellow-50 text-yellow-700",b:"border-yellow-200"},
  {icon:MoreHorizontal,label:"More",       color:"bg-gray-50 text-gray-600",    b:"border-gray-200"  },
];
const CONV_LINES=["I am from Thanjavur.","I am a farmer.","Heavy rain damaged my paddy crop yesterday.","I don't know what government help I can get."];
const CONFIRM_ROWS=[
  {emoji:"👨",field:"Occupation",value:"Farmer"                   },
  {emoji:"📍",field:"Location",  value:"Thanjavur, Tamil Nadu"    },
  {emoji:"🌾",field:"Crop",      value:"Paddy"                    },
  {emoji:"🌧", field:"Problem",   value:"Crop damaged due to heavy rain"},
  {emoji:"🌐",field:"Language",  value:"Tamil"                    },
];
const SCHEMES=[
  {id:"pmfby",name:"PM Fasal Bima Yojana",  match:98,benefit:"₹18,000 Estimated Benefit",tag:"Crop Insurance", top:true },
  {id:"pmk",  name:"PM Kisan Samman Nidhi", match:82,benefit:"₹6,000 per year",           tag:"Income Support", top:false},
  {id:"sdrf", name:"State Disaster Relief",  match:76,benefit:"₹5,000 – ₹20,000",         tag:"Disaster Comp.", top:false},
];
const REVIEW_ROWS=[
  {label:"Applicant",         value:"Ramesh Kumar"                   },
  {label:"Occupation",        value:"Farmer"                         },
  {label:"Location",          value:"Thanjavur"                      },
  {label:"Selected Scheme",   value:"PM Fasal Bima Yojana"           },
  {label:"Problem",           value:"Crop Damage due to Heavy Rain"  },
  {label:"Estimated Benefit", value:"₹18,000"                        },
];
const REVIEW_DOCS=[
  {label:"Aadhaar Card",       ok:true              },
  {label:"Bank Passbook",      ok:true              },
  {label:"Land Record",        ok:true              },
  {label:"Income Certificate", ok:false,note:"Upload later"},
];
const SUBMIT_STEPS=["Application Submitted","Verification","Department Review","Benefit Approval","Amount Credited"];
const MY_APPS=[
  {name:"PM Fasal Bima Yojana",id:"PMFBY-2026-584721",status:"Under Verification",sc:"bg-amber-50 text-amber-700 border-amber-200",dot:"bg-amber-400",btn:"View Details",bc:"border border-gray-200 text-gray-600",latest:true},
  {name:"PM Kisan Samman Nidhi",                       status:"Eligible",          sc:"bg-green-50 text-green-700 border-green-200", dot:"bg-green-500",btn:"Apply Now",  bc:"bg-[#2E7D32] text-white"},
  {name:"State Disaster Relief",                        status:"Draft Saved",       sc:"bg-blue-50 text-blue-700 border-blue-200",   dot:"bg-blue-400", btn:"Continue",   bc:"border border-[#2E7D32] text-[#2E7D32]"},
];
const TIMELINE_STEPS=[
  {label:"Application Submitted",  done:true, active:false},
  {label:"Received by Department", done:true, active:false},
  {label:"Under Verification",     done:false,active:true },
  {label:"Pending Approval",       done:false,active:false},
  {label:"Benefit Transfer",       done:false,active:false},
];
const READY_CHIPS=[{emoji:"👨",label:"Farmer"},{emoji:"📍",label:"Thanjavur"},{emoji:"🌾",label:"Paddy"},{emoji:"🌧",label:"Heavy Rain"},{emoji:"🌐",label:"Tamil"}];

// ─── tiny helpers ─────────────────────────────────────────────────────────────
function Waveform({active,sm}:{active:boolean;sm?:boolean}){
  const bars=[5,9,14,8,18,11,6,15,10,7,13,9,5];
  return(
    <div className="flex items-center gap-[2px]" style={{height:sm?18:26}}>
      {bars.map((h,i)=>(
        <div key={i} className={`rounded-full transition-colors ${active?"bg-[#2E7D32]":"bg-gray-300"}`}
          style={{width:2,height:active?`${sm?Math.round(h*.55):h}px`:"3px",
            animation:active?`saarthiPulse ${.55+i*.065}s ease-in-out infinite alternate`:"none"}}/>
      ))}
    </div>
  );
}
function Dots(){
  return(
    <div className="flex items-center gap-1 flex-shrink-0">
      {[0,.2,.4].map((d,i)=><div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" style={{animation:`blink 1.2s ease-in-out ${d}s infinite`}}/>)}
    </div>
  );
}
function Chip({emoji,label}:{emoji:string;label:string}){
  return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-[10px] font-semibold text-[#2E7D32]">{emoji} {label}</span>;
}

// ─── desktop workflow card ────────────────────────────────────────────────────
function WorkflowCard({screen,statusNode}:{screen:Screen;statusNode:React.ReactNode}){
  const ai=SA[screen], du=SD[screen], allDone=du>=WF.length-1;
  return(
    <div className="hidden md:block bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#1a2332]">Your Request In Progress</h2>
        {screen==="myapps"&&<span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full"><Trophy size={11}/>Journey Complete</span>}
      </div>
      <div className="flex items-start gap-0.5 mb-3">
        {WF.map((s,i)=>{
          const done=allDone||i<=du, active=!allDone&&i===ai;
          return(
            <div key={s.label} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center min-w-0 flex-shrink-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition-all
                  ${done?"border-[#2E7D32] bg-[#2E7D32]":active?"border-[#2E7D32] bg-green-50":"border-gray-200 bg-gray-50 opacity-40"}`}
                  style={active?{animation:"glowRing 2s ease-in-out infinite"}:{}}>
                  {done?<Check size={13} className="text-white"/>:s.icon}
                </div>
                <span className={`text-[8.5px] font-medium mt-0.5 text-center leading-tight
                  ${done||active?"text-[#2E7D32]":"text-gray-400"}`}>{s.label}</span>
              </div>
              {i<WF.length-1&&<div className={`flex-1 h-0.5 mx-0.5 rounded-full mb-4
                ${(allDone||i<ai)?"bg-[#2E7D32]":"bg-gray-200"}`}/>}
            </div>
          );
        })}
      </div>
      {statusNode}
    </div>
  );
}

// ─── mobile compact progress ──────────────────────────────────────────────────
function MobileProgress({screen}:{screen:Screen}){
  const ai=SA[screen], du=SD[screen], allDone=du>=WF.length-1;
  const idx=allDone?WF.length-1:Math.min(ai,WF.length-1);
  const pct=allDone?100:Math.round((idx/(WF.length-1))*100);
  return(
    <div className="md:hidden bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{WF[idx].icon}</span>
          <span className="text-xs font-semibold text-[#1a2332]">{WF[idx].label}</span>
          {!allDone&&<div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" style={{animation:"blink 1.2s ease-in-out infinite"}}/>}
        </div>
        <span className="text-[10px] text-gray-400 font-medium">Step {idx+1} of {WF.length}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-[#2E7D32] rounded-full transition-all duration-500" style={{width:`${pct}%`}}/>
      </div>
    </div>
  );
}

// ─── shared recent apps ───────────────────────────────────────────────────────
function RecentApps(){
  return(
    <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#1a2332]">Recent Applications</h2>
        <button className="text-xs text-[#2E7D32] hover:underline flex items-center gap-0.5">View All<ChevronRight size={12}/></button>
      </div>
      <div className="md:hidden space-y-2">
        {[{s:"PM Fasal Bima Yojana",st:"Submitted",cl:"bg-blue-50 text-blue-700"},{s:"PM Awas Yojana",st:"Approved",cl:"bg-green-50 text-green-700"}].map(a=>(
          <div key={a.s} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-[#1a2332]">{a.s}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.cl}`}>{a.st}</span>
          </div>
        ))}
      </div>
      <table className="hidden md:table w-full text-sm">
        <thead><tr className="border-b border-gray-100">
          {["Scheme Name","Application ID","Submitted On","Status"].map(h=>(
            <th key={h} className="text-left text-xs text-gray-400 font-medium pb-2 pr-4">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {[
            {s:"PM Fasal Bima Yojana",sub:"PM Kisan Samman Nidhi",id:"PMFBY/2024/03/034",d:"18 May 2024",cl:"bg-blue-50 text-blue-700",dot:"bg-blue-500",st:"Submitted"},
            {s:"PM Awas Yojana – Gramin",sub:"Housing for All",id:"PMAY/2024/01/112",d:"02 Mar 2024",cl:"bg-green-50 text-green-700",st:"Approved"},
          ].map(a=>(
            <tr key={a.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-4"><div className="font-semibold text-[#1a2332] text-sm">{a.s}</div><div className="text-xs text-gray-400">{a.sub}</div></td>
              <td className="py-3 pr-4 text-xs font-mono text-gray-500">{a.id}</td>
              <td className="py-3 pr-4 text-xs text-gray-500">{a.d}</td>
              <td className="py-3"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${a.cl}`}>
                {a.dot?<div className={`w-1.5 h-1.5 rounded-full ${a.dot}`}/>:<Check size={10}/>}{a.st}
              </span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [screen,setScreen]=useState<Screen>("home");
  const [docIndex,setDocIndex]=useState(0);
  const [missingDocName,setMissingDocName]=useState("");

  const go=(s:Screen)=>{
    if(s==="doccheck"&&screen==="scheme") setDocIndex(0);
    setDrawerOpen(false);
    setScreen(s);
  };

  const haveDoc=()=>{
    const next=docIndex+1;
    if(next>=CHECK_DOCS.length) go("application");
    else setDocIndex(next);
  };
  const dontHaveDoc=()=>{
    setMissingDocName(CHECK_DOCS[docIndex].name);
    go("missingdoc");
  };
  const resumeApp=()=>{
    const next=docIndex+1;
    if(next>=CHECK_DOCS.length){ setScreen("application"); }
    else{ setDocIndex(next); setScreen("doccheck"); }
  };

  const curDoc=CHECK_DOCS[Math.min(docIndex,CHECK_DOCS.length-1)];
  const missingDoc=CHECK_DOCS.find(d=>d.name===missingDocName)||CHECK_DOCS[2];
  const micActive=screen==="listening"||screen==="application"||screen==="doccheck";

  const SN:Record<Screen,React.ReactNode>={
    home:      <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 border border-green-100"><div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse"/><p className="text-xs text-[#2E7D32]">Matching your query with relevant schemes.</p></div>,
    listening: <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 border border-green-100"><div className="w-2 h-2 rounded-full bg-[#2E7D32] flex-shrink-0" style={{animation:"blink 1.2s ease-in-out infinite"}}/><p className="text-xs font-semibold text-[#2E7D32]">🎤 Listening — speak naturally in your language.</p></div>,
    understanding:<div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2 border border-blue-100"><Dots/><p className="text-xs font-semibold text-blue-700">Understanding your request…</p></div>,
    confirm:    <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" style={{animation:"blink 1.5s ease-in-out infinite"}}/><p className="text-xs font-semibold text-amber-700">Confirm your details before we search for schemes.</p></div>,
    matching:   <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 border border-green-100"><CheckCircle2 size={14} className="text-[#2E7D32] flex-shrink-0"/><p className="text-xs font-semibold text-[#2E7D32]">3 government schemes found for your situation.</p></div>,
    scheme:     <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 border border-green-100"><FileCheck size={14} className="text-[#2E7D32] flex-shrink-0"/><p className="text-xs font-semibold text-[#2E7D32]">Reviewing scheme details and eligibility.</p></div>,
    doccheck:   <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2 border border-blue-100"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" style={{animation:"blink 1.2s ease-in-out infinite"}}/><p className="text-xs font-semibold text-blue-700">Checking document {docIndex+1} of {CHECK_DOCS.length}…</p></div>,
    missingdoc: <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2 border border-orange-100"><AlertCircle size={14} className="text-orange-500 flex-shrink-0"/><p className="text-xs font-semibold text-orange-700">Guiding you to obtain the missing document.</p></div>,
    application:<div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 border border-green-100"><div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] flex-shrink-0" style={{animation:"blink 1.2s ease-in-out infinite"}}/><p className="text-xs font-semibold text-[#2E7D32]">Recording your answers — Saarthi AI fills the form.</p></div>,
    review:     <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2 border border-blue-100"><CheckCircle2 size={14} className="text-blue-600 flex-shrink-0"/><p className="text-xs font-semibold text-blue-700">Review all details before submitting.</p></div>,
    submitted:  <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 border border-green-100"><Trophy size={14} className="text-amber-500 flex-shrink-0"/><p className="text-xs font-semibold text-[#2E7D32]">Application submitted successfully!</p></div>,
    myapps:     <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 border border-green-100"><ListChecks size={14} className="text-[#2E7D32] flex-shrink-0"/><p className="text-xs font-semibold text-[#2E7D32]">Tracking your applications and next steps.</p></div>,
  };

  return(
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden"
      style={{fontFamily:"'Plus Jakarta Sans','Noto Sans',sans-serif",background:"#f4f6f8"}}>

      <style>{`
        @keyframes saarthiPulse{from{transform:scaleY(.35);opacity:.65}to{transform:scaleY(1);opacity:1}}
        @keyframes micRipple{0%{box-shadow:0 0 0 0 rgba(46,125,50,.45)}60%{box-shadow:0 0 0 22px rgba(46,125,50,0)}100%{box-shadow:0 0 0 0 rgba(46,125,50,0)}}
        @keyframes glowRing{0%,100%{box-shadow:0 0 0 3px rgba(46,125,50,.5)}50%{box-shadow:0 0 0 7px rgba(46,125,50,.12)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes processingOrb{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.15);opacity:1}}
        @keyframes successPop{0%{transform:scale(0.7);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
        .hide-scroll::-webkit-scrollbar{display:none}
        .mid-scroll::-webkit-scrollbar{width:4px}
        .mid-scroll::-webkit-scrollbar-thumb{background:#c8d5c9;border-radius:4px}
        .mid-scroll::-webkit-scrollbar-track{background:transparent}
      `}</style>

      {/* mobile top bar */}
      <div className="md:hidden flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <button onClick={()=>setDrawerOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-[#1a2332]">
          <Menu size={20}/>
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-bold text-[#2E7D32] flex-shrink-0">Saarthi AI</span>
          <div className="flex-1 flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-xl px-2.5 py-1.5 min-w-0 overflow-hidden">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${micActive?"bg-red-500":"bg-[#2E7D32]"}`} style={{animation:"blink 1.2s ease-in-out infinite"}}/>
            <span className="text-[10px] font-semibold text-[#1a2332] truncate">{MOB_STATUS[screen]}</span>
            <Waveform active={micActive} sm/>
          </div>
        </div>
        <button onClick={()=>{if(screen==="home")go("listening");}}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
          style={{background:"#2E7D32",animation:micActive?"micRipple 1.5s ease-out infinite":"none"}}>
          <Mic size={18} className="text-white"/>
        </button>
      </div>

      {/* mobile drawer */}
      <AnimatePresence>
        {drawerOpen&&(
          <motion.div className="md:hidden fixed inset-0 z-50 flex"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.2}}>
            <motion.nav className="w-64 bg-[#2E7D32] h-full flex flex-col shadow-2xl"
              initial={{x:"-100%"}} animate={{x:0}} exit={{x:"-100%"}} transition={{duration:.28,ease:[.32,.72,0,1]}}>
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                <button onClick={()=>setDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 text-white">
                  <X size={16}/>
                </button>
                <div><div className="text-white font-bold text-sm">Saarthi AI</div><div className="text-green-200 text-[10px]">Your Government Assistant</div></div>
              </div>
              <div className="flex-1 overflow-y-auto hide-scroll py-3 px-2 space-y-0.5">
                {NAV_ITEMS.map(({icon:Icon,label,active,badge})=>(
                  <button key={label} onClick={()=>setDrawerOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${active?"bg-white text-[#2E7D32]":"text-green-100 hover:bg-white/10"}`}>
                    <div className="relative flex-shrink-0">
                      <Icon size={18}/>
                      {badge&&<span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">{badge}</span>}
                    </div>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </motion.nav>
            <div className="flex-1 bg-black/40" onClick={()=>setDrawerOpen(false)}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* desktop sidebar */}
      <aside className={`hidden md:flex flex-col flex-shrink-0 h-full bg-[#2E7D32] transition-all duration-300 ${sidebarOpen?"w-52":"w-14"}`}>
        <div className="flex items-center gap-3 px-3 py-4 border-b border-white/10">
          <button onClick={()=>setSidebarOpen(!sidebarOpen)}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
            {sidebarOpen?<X size={16}/>:<Menu size={16}/>}
          </button>
          {sidebarOpen&&<div className="overflow-hidden"><div className="text-white font-bold text-sm whitespace-nowrap">Saarthi AI</div><div className="text-green-200 text-[10px] whitespace-nowrap">Your Government Assistant</div></div>}
        </div>
        <nav className="flex-1 overflow-y-auto hide-scroll py-3 px-2 space-y-0.5">
          {NAV_ITEMS.slice(0,6).map(({icon:Icon,label,active,badge})=>(
            <button key={label} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${active?"bg-white text-[#2E7D32] shadow-sm":"text-green-100 hover:bg-white/10 hover:text-white"}`}>
              <div className="relative flex-shrink-0">
                <Icon size={18}/>
                {badge&&<span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">{badge}</span>}
              </div>
              {sidebarOpen&&<span className="whitespace-nowrap text-sm">{label}</span>}
            </button>
          ))}
        </nav>
        <div className="px-2 pb-4 space-y-0.5 border-t border-white/10 pt-3">
          {NAV_ITEMS.slice(6).map(({icon:Icon,label})=>(
            <button key={label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-green-100 hover:bg-white/10 transition-all">
              <Icon size={18} className="flex-shrink-0"/>
              {sidebarOpen&&<span className="whitespace-nowrap text-sm">{label}</span>}
            </button>
          ))}
        </div>
      </aside>

      {/* main content */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto mid-scroll px-4 md:px-5 py-4 md:py-5 space-y-4">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-[#1a2332]">Vanakkam, Ramesh! 👋</h1>
            <p className="text-xs md:text-sm text-[#6b7a8d] mt-0.5">Let me find the best government support for you.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"><Globe size={13}/><span>English</span></button>
            <div className="w-9 h-9 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-sm font-semibold">R</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={`wf-${screen}`} className="space-y-4" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.25}}>
            <WorkflowCard screen={screen} statusNode={SN[screen]}/>
            <MobileProgress screen={screen}/>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">

          {/* 01 Home */}
          {screen==="home"&&(
            <motion.div key="sc-home" className="space-y-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3,delay:.05}}>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-[#1a2332]">Explore by Category</h2>
                  <button className="text-xs text-[#2E7D32] hover:underline flex items-center gap-0.5">View All<ChevronRight size={12}/></button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2 md:gap-2.5">
                  {CATS.map(({icon:Icon,label,color,b})=>(
                    <button key={label} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border ${b} ${color} hover:scale-105 transition-all`}>
                      <div className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center shadow-sm"><Icon size={17}/></div>
                      <span className="text-[10px] font-semibold text-center leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 flex flex-col items-center gap-3">
                <p className="text-sm font-semibold text-[#1a2332]">Tap the mic to tell me your problem</p>
                <button onClick={()=>go("listening")} className="w-20 h-20 rounded-full bg-[#2E7D32] flex items-center justify-center shadow-xl" style={{animation:"micRipple 2s ease-out infinite"}}>
                  <Mic size={32} className="text-white"/>
                </button>
                <p className="text-xs text-gray-400">Speak in Tamil, Hindi, or English</p>
              </div>
              <RecentApps/>
            </motion.div>
          )}

          {/* 02 Listening */}
          {screen==="listening"&&(
            <motion.div key="sc-listen" className="space-y-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3,delay:.05}}>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-semibold text-[#1a2332] mb-4">Voice Conversation</h2>
                <div className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center text-xl md:text-2xl">👨‍🌾</div>
                    <span className="text-[10px] text-gray-400 font-medium">Ramesh</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    {CONV_LINES.map((l,i)=><div key={i} className="bg-green-50 border border-green-100 rounded-2xl rounded-tl-sm px-3 md:px-4 py-2.5 text-sm text-[#1a2332] leading-relaxed">{l}</div>)}
                    <div className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 rounded-2xl rounded-tl-sm w-14 border border-gray-100">
                      {[0,.2,.4].map((d,i)=><div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" style={{animation:`blink 1s ease-in-out ${d}s infinite`}}/>)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-[#1a2332]">Live Transcript</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#2E7D32]" style={{animation:"blink 1.2s ease-in-out infinite"}}/>
                    <span className="text-xs font-medium text-[#2E7D32]">Listening in Tamil</span>
                    <Waveform active={true}/>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-1.5">
                  {CONV_LINES.map((l,i)=><p key={i} className="text-sm text-[#1a2332] leading-relaxed"><span className="text-gray-400 text-xs font-mono mr-2">{String(i+1).padStart(2,"0")}</span>{l}</p>)}
                  <div className="flex items-center gap-1.5 pt-1"><span className="text-gray-300 text-xs font-mono">05</span><span className="inline-block w-0.5 h-4 bg-[#2E7D32] ml-1" style={{animation:"blink 0.8s ease-in-out infinite"}}/></div>
                </div>
              </div>
              <div className="md:hidden flex gap-3">
                <button onClick={()=>go("understanding")} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm"><Square size={15}/>Stop</button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-gray-200 text-gray-500 font-semibold text-sm"><RotateCcw size={15}/>Restart</button>
              </div>
              <RecentApps/>
            </motion.div>
          )}

          {/* 03 Understanding */}
          {screen==="understanding"&&(
            <motion.div key="sc-under" className="space-y-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3,delay:.05}}>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-[#1a2332]">AI Understanding Your Request</h2>
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1.5"><Loader2 size={10} className="animate-spin"/>Analysing</span>
                </div>
                <div className="space-y-2">
                  {[{emoji:"👨",field:"Occupation",value:"Farmer",done:true},{emoji:"📍",field:"Location",value:"Thanjavur",done:true},{emoji:"🌾",field:"Crop",value:"Paddy",done:true},{emoji:"🌧",field:"Problem",value:"Heavy Rain Damage",done:true},{emoji:"🌐",field:"Language",value:"Tamil",done:true},{emoji:"💬",field:"Intent",value:"Find Government Support",done:false}].map(({emoji,field,value,done})=>(
                    <div key={field} className={`flex items-center gap-3 px-3 md:px-4 py-2.5 rounded-xl border ${done?"bg-green-50 border-green-100":"bg-blue-50 border-blue-100"}`}>
                      <span className="text-base w-5 text-center flex-shrink-0">{emoji}</span>
                      <span className="text-xs font-medium text-gray-500 w-20 md:w-28 flex-shrink-0">{field}</span>
                      <span className="flex-1 text-xs md:text-sm font-semibold text-[#1a2332]">{value}</span>
                      {done?<CheckCircle2 size={15} className="text-[#2E7D32] flex-shrink-0"/>:<Loader2 size={13} className="text-blue-500 animate-spin flex-shrink-0"/>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-[#1a2332]">AI Analysis</h2>
                  <button onClick={()=>go("confirm")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2E7D32] text-white text-xs font-semibold hover:bg-[#1b5e20] transition-colors">Continue<ArrowRight size={11}/></button>
                </div>
                <div className="space-y-2.5">
                  {[{label:"Speech converted to text",done:true},{label:"Language detected",done:true},{label:"Key information extracted",done:true},{label:"Finding relevant government schemes...",done:false}].map(({label,done})=>(
                    <div key={label} className="flex items-center gap-3">
                      {done?<div className="w-5 h-5 rounded-full bg-[#2E7D32] flex items-center justify-center flex-shrink-0"><Check size={11} className="text-white"/></div>
                           :<div className="w-5 h-5 rounded-full border-2 border-blue-300 flex items-center justify-center flex-shrink-0"><Loader2 size={10} className="text-blue-500 animate-spin"/></div>}
                      <span className={`text-xs md:text-sm ${done?"text-[#1a2332]":"text-blue-600 font-medium"}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <RecentApps/>
            </motion.div>
          )}

          {/* 04 Confirm */}
          {screen==="confirm"&&(
            <motion.div key="sc-confirm" className="space-y-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3,delay:.05}}>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
                <h2 className="text-base md:text-lg font-bold text-[#1a2332] mb-1">Here's what I understood</h2>
                <p className="text-xs md:text-sm text-[#6b7a8d] mb-4 md:mb-5">Please confirm before I search for government schemes.</p>
                <div className="space-y-2 mb-5">
                  {CONFIRM_ROWS.map(({emoji,field,value})=>(
                    <div key={field} className="flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl bg-green-50 border border-green-100 group">
                      <span className="text-base w-5 text-center flex-shrink-0">{emoji}</span>
                      <span className="text-xs font-medium text-gray-500 w-20 md:w-28 flex-shrink-0">{field}</span>
                      <span className="flex-1 text-xs md:text-sm font-semibold text-[#1a2332]">{value}</span>
                      <CheckCircle2 size={14} className="text-[#2E7D32] flex-shrink-0"/>
                      <button className="ml-1 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-green-100 transition-all"><Pencil size={11} className="text-gray-400"/></button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                  <button onClick={()=>go("matching")} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2E7D32] text-white font-semibold hover:bg-[#1b5e20] transition-colors shadow-md shadow-green-200">
                    <Check size={16}/>Yes, That's Correct
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
                    <Pencil size={14}/>Edit Details
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400"><Lock size={11}/><span>Your information is secure and used only to identify eligible schemes.</span></div>
              </div>
              <RecentApps/>
            </motion.div>
          )}

          {/* 05 Matching */}
          {screen==="matching"&&(
            <motion.div key="sc-match" className="space-y-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3,delay:.05}}>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
                <h2 className="text-base md:text-lg font-bold text-[#1a2332] mb-1">Government Schemes Found</h2>
                <p className="text-xs md:text-sm text-[#6b7a8d] mb-4 md:mb-5">Based on your situation, these schemes match best.</p>
                <div className="space-y-3">
                  {SCHEMES.map(s=>(
                    <div key={s.id} className={`rounded-2xl border transition-all ${s.top?"border-[#2E7D32] bg-gradient-to-br from-green-50 to-emerald-50 shadow-md shadow-green-100 p-4 md:p-6":"border-gray-200 bg-white p-3 md:p-4"}`}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          {s.top&&<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-bold mb-2 block w-fit"><Star size={9} fill="white"/>Recommended by AI</span>}
                          <h3 className={`font-bold text-[#1a2332] ${s.top?"text-base":"text-sm"}`}>{s.name}</h3>
                        </div>
                        <div className={`flex-shrink-0 rounded-xl text-center px-2.5 py-1.5 font-bold ${s.top?"bg-[#2E7D32] text-white text-xl min-w-[64px]":"bg-green-50 text-[#2E7D32] text-sm min-w-[52px]"}`}>
                          {s.match}%<div className={`font-normal text-[10px] ${s.top?"text-green-200":"text-green-600"}`}>Match</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3 md:mb-4">
                        <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full border text-[10px] md:text-xs font-semibold ${s.top?"bg-white border-green-200 text-[#2E7D32]":"bg-gray-50 border-gray-200 text-gray-700"}`}>💰 {s.benefit}</span>
                        <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full border text-[10px] md:text-xs font-semibold ${s.top?"bg-white border-green-200 text-[#2E7D32]":"bg-gray-50 border-gray-200 text-gray-700"}`}>🏷️ {s.tag}</span>
                        <span className="inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] md:text-xs font-semibold">✅ Eligible</span>
                      </div>
                      <button onClick={()=>{if(s.top)go("scheme");}} className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${s.top?"bg-[#2E7D32] text-white hover:bg-[#1b5e20]":"border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                        View Details{s.top&&" →"}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-3 md:p-4">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"><Bot size={13} className="text-blue-600"/></div>
                  <p className="text-xs md:text-sm text-blue-700 leading-relaxed italic">"I recommend applying for <strong>PM Fasal Bima Yojana</strong> first — it provides the highest support for crop damage caused by heavy rain."</p>
                </div>
              </div>
              <RecentApps/>
            </motion.div>
          )}

          {/* 06 Scheme Details */}
          {screen==="scheme"&&(
            <motion.div key="sc-scheme" className="space-y-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3,delay:.05}}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-[#2E7D32] to-[#43a047] px-5 md:px-6 py-4 md:py-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold mb-2"><Star size={9} fill="white"/>Top Match</span>
                    <h2 className="text-lg md:text-xl font-bold text-white mb-0.5">PM Fasal Bima Yojana</h2>
                    <p className="text-green-200 text-xs md:text-sm">Crop insurance to protect farmers from natural disasters.</p>
                  </div>
                  <div className="flex-shrink-0 bg-white/15 rounded-2xl px-3 md:px-4 py-2 md:py-3 text-center">
                    <div className="text-2xl md:text-3xl font-black text-white leading-none">98%</div>
                    <div className="text-green-200 text-[10px] font-medium mt-0.5">Match</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
                  {[{icon:"💰",label:"Est. Benefit",value:"₹18,000"},{icon:"🌐",label:"Mode",value:"Online / CSC"},{icon:"👨‍🌾",label:"Eligible",value:"Land-owning farmers"}].map(({icon,label,value})=>(
                    <div key={label} className="px-3 md:px-5 py-3 md:py-4"><p className="text-[10px] md:text-xs text-gray-400 font-medium mb-1">{icon} {label}</p><p className="text-xs md:text-sm font-bold text-[#1a2332]">{value}</p></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-[#1a2332] mb-3">Key Benefits</h3>
                <div className="space-y-2">
                  {["Compensation for crop loss due to natural calamities","Financial support during disaster recovery","Covers paddy, wheat, oilseeds, and other kharif crops"].map(b=>(
                    <div key={b} className="flex items-start gap-3 px-3 md:px-4 py-2.5 bg-green-50 rounded-xl border border-green-100">
                      <div className="w-5 h-5 rounded-full bg-[#2E7D32] flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={10} className="text-white"/></div>
                      <span className="text-xs md:text-sm text-[#1a2332]">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={()=>go("doccheck")} className="w-full py-4 rounded-2xl bg-[#2E7D32] text-white font-bold text-base hover:bg-[#1b5e20] transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2">
                Check My Documents <ArrowRight size={18}/>
              </button>
            </motion.div>
          )}

          {/* 07 Document Check */}
          {screen==="doccheck"&&(
            <motion.div key="sc-doccheck" className="space-y-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3,delay:.05}}>
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-[#1a2332]">Document Check</h2>
                    <p className="text-xs md:text-sm text-[#6b7a8d] mt-0.5">I'll ask about each document one at a time.</p>
                  </div>
                  <div className="flex-shrink-0 bg-green-50 border border-green-100 rounded-xl px-3 py-1.5 text-center">
                    <p className="text-[10px] text-gray-400 font-medium">Document</p>
                    <p className="text-sm font-bold text-[#2E7D32]">{docIndex+1} of {CHECK_DOCS.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mb-6">
                  {CHECK_DOCS.map((_,i)=>(
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i<docIndex?"bg-[#2E7D32]":i===docIndex?"bg-[#2E7D32] opacity-50":"bg-gray-200"}`}/>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={`doc-${docIndex}`}
                    initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
                    transition={{duration:.22}}>
                    <div className="flex flex-col items-center gap-5 py-2">
                      <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 flex items-center justify-center shadow-lg">
                        <span className="text-6xl md:text-7xl">{curDoc.emoji}</span>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg md:text-xl font-bold text-[#1a2332] mb-1">{curDoc.name}</h3>
                        <p className="text-xs text-gray-400">Issued by: <span className="font-medium text-gray-600">{curDoc.issuer}</span></p>
                        <p className="text-xs text-gray-400 mt-0.5">Purpose: <span className="font-medium text-gray-600">{curDoc.purpose}</span></p>
                      </div>
                      <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                        <p className="text-sm font-semibold text-[#1a2332] mb-1">Do you have this document?</p>
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-1"><Volume2 size={11}/>Saarthi AI will read the options aloud.</p>
                      </div>
                      <div className="flex flex-col md:flex-row gap-3 w-full">
                        <button onClick={haveDoc}
                          className="flex-1 flex items-center justify-center gap-2 py-4 md:py-3.5 rounded-2xl bg-[#2E7D32] text-white font-bold text-base md:text-sm hover:bg-[#1b5e20] transition-colors shadow-md shadow-green-200">
                          <Volume2 size={14} className="opacity-70"/><Check size={18}/>Yes, I Have It ✅
                        </button>
                        <button onClick={dontHaveDoc}
                          className="flex-1 flex items-center justify-center gap-2 py-4 md:py-3.5 rounded-2xl bg-red-50 border-2 border-red-200 text-red-600 font-bold text-base md:text-sm hover:bg-red-100 transition-colors">
                          <Volume2 size={14} className="opacity-70"/>No, I Don't Have It ❌
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* 08 Missing Document Help */}
          {screen==="missingdoc"&&(
            <motion.div key="sc-missingdoc" className="space-y-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3,delay:.05}}>
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle size={28} className="text-orange-500"/>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-[#1a2332] mb-1">Don't worry.</h2>
                  <p className="text-base md:text-lg font-semibold text-[#2E7D32]">I'll help you get this document.</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 md:p-5 mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-orange-100 flex items-center justify-center flex-shrink-0 text-3xl shadow-sm">{missingDoc.emoji}</div>
                    <div>
                      <h3 className="font-bold text-[#1a2332] text-base">{missingDoc.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5"><span className="font-medium">Issued by:</span> {missingDoc.issuer}</p>
                      <p className="text-xs text-gray-500 mt-0.5"><span className="font-medium">Purpose:</span> {missingDoc.purpose}</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-[#1a2332] mb-4">Step-by-step guide to get it:</h3>
                <div className="mb-5">
                  {MISSING_TL.map((step,i)=>(
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#2E7D32] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{i+1}</div>
                        {i<MISSING_TL.length-1&&<div className="w-0.5 h-7 bg-green-200 my-1"/>}
                      </div>
                      <div className="pb-4 pt-1.5"><p className="text-sm text-[#1a2332] font-medium leading-tight">{step}</p></div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden mb-5">
                  <div className="h-24 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center relative">
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle,#2E7D32 1px,transparent 1px)",backgroundSize:"20px 20px"}}/>
                    <div className="bg-white rounded-xl px-3 py-2 shadow-md flex items-center gap-2 relative">
                      <MapPin size={15} className="text-red-500"/>
                      <span className="text-xs font-semibold text-[#1a2332]">Tahsildar Office, Thanjavur</span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#1a2332]">Tahsildar Office</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1"><Clock size={10}/>Mon–Sat: 9:00 AM – 5:00 PM</p>
                      <p className="text-[11px] text-[#2E7D32] font-medium mt-0.5 flex items-center gap-1"><MapPin size={10}/>2.4 km away</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2E7D32] text-white text-xs font-semibold hover:bg-[#1b5e20] transition-colors"><Navigation size={11}/>Navigate</button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"><Phone size={11}/>Call Office</button>
                    </div>
                  </div>
                </div>
                <button onClick={resumeApp} className="w-full py-4 rounded-2xl bg-[#2E7D32] text-white font-bold text-base hover:bg-[#1b5e20] transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2">
                  <ArrowRight size={18}/>Resume Application
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">You can upload {missingDoc.name} later in the application.</p>
              </div>
            </motion.div>
          )}

          {/* 09 Application */}
          {screen==="application"&&(
            <motion.div key="sc-app" className="space-y-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3,delay:.05}}>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-[#1a2332] mb-1">Let's Fill Your Application</h2>
                    <p className="text-xs md:text-sm text-[#6b7a8d]">Answer a few simple voice questions.</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1 justify-end"><Clock size={10}/>~5 min</div>
                    <div className="text-sm font-bold text-[#2E7D32]">Q 3 of 8</div>
                    <div className="w-28 h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-[#2E7D32] rounded-full" style={{width:"37.5%"}}/></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-4 md:p-5 mb-4">
                  <p className="text-[10px] font-semibold text-[#2E7D32] uppercase tracking-widest mb-2">Current Question</p>
                  <h3 className="text-sm md:text-base font-bold text-[#1a2332] mb-1">What is your Aadhaar Number?</h3>
                  <p className="text-xs text-gray-500">You may speak or type the number.</p>
                </div>
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 md:p-5 flex flex-col items-center gap-4 mb-4">
                  <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-red-500" style={{animation:"blink 0.8s ease-in-out infinite"}}/><span className="text-sm font-semibold text-[#1a2332]">Listening...</span></div>
                  <div className="flex items-center gap-[4px]" style={{height:40}}>
                    {[8,14,22,10,32,18,9,28,16,11,25,15,8,20,12,7,18,13,6,22,10].map((h,i)=>(
                      <div key={i} className="rounded-full bg-[#2E7D32]" style={{width:4,height:`${h}px`,animation:`saarthiPulse ${.45+i*.055}s ease-in-out infinite alternate`}}/>
                    ))}
                  </div>
                  <div className="flex gap-3 w-full">
                    <button onClick={()=>go("review")} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm"><Square size={13}/>Stop</button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm"><MicOff size={13}/>Type Instead</button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors">← Previous</button>
                  <button onClick={()=>go("review")} className="flex-1 py-3 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1b5e20] transition-colors">Next Question →</button>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[#1a2332]">Application Summary</h3>
                  <span className="text-xs text-[#2E7D32] font-semibold bg-green-50 px-2 py-0.5 rounded-full">2 / 8 Completed</span>
                </div>
                <div className="space-y-2 mb-3">
                  {[{l:"Name",v:"Ramesh Kumar"},{l:"Village",v:"Melathur"},{l:"District",v:"Thanjavur"},{l:"Crop",v:"Paddy"},{l:"Problem",v:"Heavy Rain Damage"}].map(({l,v})=>(
                    <div key={l} className="flex items-center gap-3 px-3 md:px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-xs font-medium text-gray-400 w-16 md:w-20 flex-shrink-0">{l}</span>
                      <span className="flex-1 text-xs md:text-sm font-semibold text-[#1a2332]">{v}</span>
                      <CheckCircle2 size={12} className="text-[#2E7D32] flex-shrink-0"/>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 bg-blue-50 rounded-xl px-3 md:px-4 py-3 border border-blue-100">
                  <Bot size={12} className="text-blue-600 mt-0.5 flex-shrink-0"/>
                  <p className="text-xs text-blue-600">Your answers are automatically filling the government application form.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 10 Review & Submit */}
          {screen==="review"&&(
            <motion.div key="sc-review" className="space-y-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3,delay:.05}}>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
                <h2 className="text-base md:text-lg font-bold text-[#1a2332] mb-1">Review Your Application</h2>
                <p className="text-xs md:text-sm text-[#6b7a8d] mb-4 md:mb-5">Please verify your information before submitting.</p>
                <div className="space-y-2 mb-4">
                  {REVIEW_ROWS.map(({label,value})=>(
                    <div key={label} className="flex items-center gap-3 px-3 md:px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-xs font-medium text-gray-400 w-28 md:w-36 flex-shrink-0">{label}</span>
                      <span className="flex-1 text-xs md:text-sm font-semibold text-[#1a2332]">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-[#1a2332] mb-2">Required Documents</h3>
                  <div className="space-y-2">
                    {REVIEW_DOCS.map(({label,ok,note})=>(
                      <div key={label} className={`flex items-center gap-3 px-3 md:px-4 py-2.5 rounded-xl border ${ok?"bg-green-50 border-green-100":"bg-amber-50 border-amber-200"}`}>
                        {ok?<CheckCircle2 size={14} className="text-[#2E7D32] flex-shrink-0"/>:<AlertCircle size={14} className="text-amber-500 flex-shrink-0"/>}
                        <span className="flex-1 text-xs md:text-sm font-medium text-[#1a2332]">{label}</span>
                        {note&&<span className="text-[10px] md:text-xs text-amber-600 font-medium">{note}</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5">
                  <div className="flex items-center gap-2 mb-2"><div className="w-7 h-7 rounded-lg bg-[#2E7D32] flex items-center justify-center flex-shrink-0"><Bot size={12} className="text-white"/></div><p className="text-sm font-semibold text-[#2E7D32]">AI Review</p></div>
                  <p className="text-xs md:text-sm text-green-800 leading-relaxed mb-2">🤖 AI has verified that you are eligible for PM Fasal Bima Yojana based on the information provided.</p>
                  <div className="flex items-center gap-2 text-xs text-amber-700"><AlertCircle size={11} className="text-amber-500"/>Income Certificate can be uploaded after submission.</div>
                  <div className="mt-2 pt-2 border-t border-green-200 flex items-center gap-2"><Clock size={11} className="text-gray-400"/><span className="text-xs text-gray-500">Estimated approval: <strong className="text-[#1a2332]">15–30 Days</strong></span></div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <button onClick={()=>go("submitted")} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2E7D32] text-white font-semibold hover:bg-[#1b5e20] transition-colors shadow-md shadow-green-200"><Send size={15}/>Confirm & Submit</button>
                  <button onClick={()=>go("application")} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"><Pencil size={14}/>Edit Application</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 11 Submitted */}
          {screen==="submitted"&&(
            <motion.div key="sc-submitted" className="space-y-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3,delay:.05}}>
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-green-400 to-[#2E7D32] flex items-center justify-center mb-5 shadow-xl shadow-green-200"
                  style={{animation:"successPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both"}}>
                  <Check size={40} className="text-white" strokeWidth={3}/>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-[#1a2332] mb-2">Application Submitted!</h2>
                <p className="text-xs md:text-sm text-[#6b7a8d] leading-relaxed mb-6 max-w-md">Your application has been successfully submitted. Track it anytime from My Applications.</p>
                <div className="grid grid-cols-2 gap-3 w-full mb-6">
                  {[{l:"Application ID",v:"PMFBY-2026-584721",m:true},{l:"Scheme",v:"PM Fasal Bima Yojana"},{l:"Submitted On",v:"14 July 2026"},{l:"Est. Processing",v:"15–30 Days"}].map(({l,v,m})=>(
                    <div key={l} className="bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-100 text-left">
                      <p className="text-[10px] md:text-xs text-gray-400 font-medium mb-1">{l}</p>
                      <p className={`text-xs md:text-sm font-bold text-[#1a2332] ${m?"font-mono":""}`}>{v}</p>
                    </div>
                  ))}
                </div>
                <div className="w-full bg-green-50 rounded-2xl border border-green-100 p-4 md:p-5 mb-6 text-left">
                  <h3 className="text-sm font-semibold text-[#1a2332] mb-3">What Happens Next</h3>
                  <div>
                    {SUBMIT_STEPS.map((step,i)=>(
                      <div key={step} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-[#2E7D32] flex items-center justify-center flex-shrink-0"><Check size={11} className="text-white"/></div>
                          {i<SUBMIT_STEPS.length-1&&<div className="w-0.5 h-5 bg-green-300 my-1"/>}
                        </div>
                        <div className="pb-2.5 pt-0.5"><p className="text-xs md:text-sm text-[#1a2332] font-medium">{step}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full">
                  <button onClick={()=>go("myapps")} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2E7D32] text-white font-semibold hover:bg-[#1b5e20] transition-colors shadow-md shadow-green-200"><ListChecks size={16}/>Track Application</button>
                  <button onClick={()=>go("home")} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"><Home size={15}/>Return Home</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 12 My Applications */}
          {screen==="myapps"&&(
            <motion.div key="sc-myapps" className="space-y-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3,delay:.05}}>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
                <h2 className="text-base md:text-lg font-bold text-[#1a2332] mb-1">My Applications</h2>
                <p className="text-xs md:text-sm text-[#6b7a8d] mb-4 md:mb-5">Track your submitted and ongoing government applications.</p>
                <div className="space-y-3 mb-5">
                  {MY_APPS.map(app=>(
                    <div key={app.name} className={`rounded-2xl border p-3 md:p-4 flex items-center gap-3 md:gap-4 ${app.latest?"border-[#2E7D32] bg-green-50":"border-gray-200 bg-white"}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {app.latest&&<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2E7D32] text-white text-[9px] font-bold"><Star size={8} fill="white"/>Latest</span>}
                          <h3 className="text-xs md:text-sm font-bold text-[#1a2332] truncate">{app.name}</h3>
                        </div>
                        {app.id&&<p className="text-[10px] font-mono text-gray-400 mb-1.5">{app.id}</p>}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-semibold border ${app.sc}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${app.dot}`}/>{app.status}
                        </span>
                      </div>
                      <button className={`flex-shrink-0 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors ${app.bc}`}>{app.btn}</button>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-5">
                  <h3 className="text-sm font-semibold text-[#1a2332] mb-3">Application Progress</h3>
                  <div>
                    {TIMELINE_STEPS.map(({label,done,active},i)=>(
                      <div key={label} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${done?"bg-[#2E7D32] border-[#2E7D32]":active?"bg-white border-amber-400":"bg-white border-gray-300"}`}>
                            {done?<Check size={10} className="text-white"/>:active?<div className="w-1.5 h-1.5 rounded-full bg-amber-400" style={{animation:"blink 1.5s ease-in-out infinite"}}/>:<div className="w-1.5 h-1.5 rounded-full bg-gray-300"/>}
                          </div>
                          {i<TIMELINE_STEPS.length-1&&<div className={`w-0.5 h-5 my-1 ${done?"bg-[#2E7D32]":"bg-gray-200"}`}/>}
                        </div>
                        <div className="pb-2 pt-0.5">
                          <p className={`text-xs md:text-sm font-medium ${active?"text-amber-700 font-semibold":done?"text-[#1a2332]":"text-gray-400"}`}>{label}</p>
                          {active&&<span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-0.5">Current Step</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-4 text-center">
                  <p className="text-sm font-semibold text-[#1a2332] mb-1">Need help with another service?</p>
                  <p className="text-xs text-gray-400 mb-3">Saarthi AI is ready to assist.</p>
                  <div className="flex flex-col md:flex-row gap-2">
                    <button onClick={()=>go("home")} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2E7D32] text-white font-semibold text-sm hover:bg-[#1b5e20] transition-colors shadow-sm"><RefreshCw size={13}/>Start New Conversation</button>
                    <button onClick={()=>go("home")} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"><Home size={13}/>Go to Home Dashboard</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* desktop right AI panel */}
      <aside className="hidden md:flex flex-col flex-shrink-0 w-60 h-full gap-3 p-4 border-l border-gray-200 bg-white overflow-y-auto hide-scroll">
        <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-xl bg-green-50 flex items-center justify-center"><Volume2 size={13} className="text-[#2E7D32]"/></div><span className="text-sm font-semibold text-[#1a2332]">Read Out</span></div>
            <Waveform active={false}/>
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-b from-green-50 to-emerald-50 rounded-2xl border border-green-100 flex flex-col items-center justify-center gap-4 py-5 px-4">
          <p className="text-[10px] font-semibold text-green-700 uppercase tracking-widest">Voice Assistant</p>
          <div className="flex items-center gap-[3px]" style={{height:30}}>
            {[5,10,16,9,22,13,7,19,12,8,17,11,6,14,8].map((h,i)=>(
              <div key={i} className={`rounded-full transition-colors ${micActive?"bg-[#2E7D32]":screen==="understanding"?"bg-blue-300":"bg-green-200"}`}
                style={{width:3,height:micActive?`${h}px`:screen==="understanding"?`${Math.max(3,Math.round(h*.5))}px`:"4px",
                  animation:micActive?`saarthiPulse ${.5+i*.06}s ease-in-out infinite alternate`:screen==="understanding"?`processingOrb ${1+i*.08}s ease-in-out infinite alternate`:"none"}}/>
            ))}
          </div>
          <button onClick={()=>{if(screen==="home")go("listening");}}
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
            style={{background:["understanding","confirm"].includes(screen)?"#a5d6a7":"#2E7D32",
              animation:micActive?"micRipple 1.5s ease-out infinite":"none",
              cursor:screen==="home"?"pointer":"default"}}>
            <Mic size={28} className="text-white" style={{opacity:["understanding","confirm"].includes(screen)?.5:1}}/>
          </button>
          <AnimatePresence mode="wait">
            <motion.div key={`ms-${screen}`} className="text-center" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:.22}}>
              <p className="text-sm font-semibold text-[#1a2332]">{
                screen==="home"?"Tap to Speak":screen==="listening"?"Listening...":screen==="understanding"?"Understanding...":
                screen==="confirm"?"Confirm Details":screen==="matching"?"Schemes Found!":screen==="scheme"?"Scheme Details":
                screen==="doccheck"?"Checking Docs...":screen==="missingdoc"?"Document Guide":screen==="application"?"Recording Answer":
                screen==="review"?"Ready to Submit":screen==="submitted"?"Submitted! 🎉":"How can I help?"
              }</p>
              <p className="text-xs text-gray-400 mt-0.5">{
                screen==="home"?"or type your problem":screen==="listening"?"Speak naturally in Tamil":screen==="doccheck"?`Doc ${docIndex+1} of ${CHECK_DOCS.length}`:""
              }</p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {screen==="home"&&<motion.button key="b-home" className="w-full py-2 rounded-xl border border-[#2E7D32] text-[#2E7D32] text-sm font-semibold hover:bg-green-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}>Type Instead</motion.button>}
            {screen==="listening"&&(<motion.div key="b-listen" className="w-full grid grid-cols-3 gap-2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}>
              <button onClick={()=>go("understanding")} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-red-50 border border-red-100"><Square size={12} className="text-red-600"/><span className="text-[10px] font-semibold text-red-600">Stop</span></button>
              <button className="flex flex-col items-center gap-1 py-2 rounded-xl bg-amber-50 border border-amber-100"><RotateCcw size={12} className="text-amber-600"/><span className="text-[10px] font-semibold text-amber-600">Restart</span></button>
              <button className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gray-50 border border-gray-200"><MicOff size={12} className="text-gray-500"/><span className="text-[10px] font-semibold text-gray-500">Type</span></button>
            </motion.div>)}
            {screen==="understanding"&&<motion.button key="b-proc" disabled className="w-full py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-400 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}><Loader2 size={12} className="animate-spin"/>Processing...</motion.button>}
            {screen==="confirm"&&<motion.div key="b-conf" className="w-full flex flex-col gap-2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}><button className="w-full py-2 rounded-xl border border-[#2E7D32] text-[#2E7D32] text-sm font-semibold hover:bg-green-50 flex items-center justify-center gap-1.5"><Mic size={12}/>Speak Again</button><button className="w-full py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50">Type Instead</button></motion.div>}
            {screen==="matching"&&<motion.div key="b-match" className="w-full flex flex-col gap-2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}><button className="w-full py-2 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1b5e20] flex items-center justify-center gap-1.5"><Volume2 size={12}/>Explain This</button><button className="w-full py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-1.5"><Mic size={12}/>Ask a Question</button></motion.div>}
            {screen==="scheme"&&<motion.div key="b-scheme" className="w-full flex flex-col gap-2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}><button className="w-full py-2 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1b5e20] flex items-center justify-center gap-1.5"><BookMarked size={12}/>Explain Scheme</button></motion.div>}
            {screen==="doccheck"&&<motion.div key="b-doc" className="w-full flex flex-col gap-2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}><button onClick={haveDoc} className="w-full py-2 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1b5e20] flex items-center justify-center gap-1.5"><Volume2 size={12}/>Read Question</button></motion.div>}
            {screen==="missingdoc"&&<motion.div key="b-miss" className="w-full flex flex-col gap-2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}><button className="w-full py-2 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1b5e20] flex items-center justify-center gap-1.5"><Volume2 size={12}/>Read Instructions</button><button onClick={resumeApp} className="w-full py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-1.5"><ArrowRight size={12}/>Resume</button></motion.div>}
            {screen==="application"&&<motion.div key="b-app" className="w-full grid grid-cols-3 gap-2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}>
              <button onClick={()=>go("review")} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-red-50 border border-red-100"><Square size={12} className="text-red-600"/><span className="text-[10px] font-semibold text-red-600">Stop</span></button>
              <button className="flex flex-col items-center gap-1 py-2 rounded-xl bg-amber-50 border border-amber-100"><RotateCcw size={12} className="text-amber-600"/><span className="text-[10px] font-semibold text-amber-600">Restart</span></button>
              <button className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gray-50 border border-gray-200"><MicOff size={12} className="text-gray-500"/><span className="text-[10px] font-semibold text-gray-500">Type</span></button>
            </motion.div>}
            {screen==="review"&&<motion.div key="b-rev" className="w-full flex flex-col gap-2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}><button className="w-full py-2 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1b5e20] flex items-center justify-center gap-1.5"><Volume2 size={12}/>Read Summary</button></motion.div>}
            {screen==="submitted"&&<motion.div key="b-sub" className="w-full flex flex-col gap-2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}><button className="w-full py-2 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1b5e20] flex items-center justify-center gap-1.5"><Volume2 size={12}/>Read Confirmation</button><button onClick={()=>go("home")} className="w-full py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-1.5"><Home size={12}/>Go Home</button></motion.div>}
            {screen==="myapps"&&<motion.div key="b-my" className="w-full flex flex-col gap-2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}><button onClick={()=>go("home")} className="w-full py-2 rounded-xl bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1b5e20] flex items-center justify-center gap-1.5"><RefreshCw size={12}/>Start New</button><button className="w-full py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-1.5"><Volume2 size={12}/>Read Status</button></motion.div>}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {screen==="home"&&<motion.div key="cc-home" className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex-shrink-0" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">AI Suggestions</p>
            <div className="space-y-1.5">{[{e:"🌾",t:"My crops were damaged"},{e:"🎓",t:"I need a scholarship"},{e:"🏠",t:"I need a house"},{e:"❤️",t:"I need medical help"}].map(({e,t})=>(<button key={t} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white border border-gray-100 text-left hover:border-[#2E7D32] hover:bg-green-50 transition-all shadow-sm"><span className="text-sm">{e}</span><span className="text-[11px] font-medium text-[#1a2332]">{t}</span></button>))}</div>
          </motion.div>}
          {screen==="listening"&&<motion.div key="cc-listen" className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex-shrink-0" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Information Detected</p>
            <div className="flex flex-wrap gap-1.5">{READY_CHIPS.map(c=><Chip key={c.label} {...c}/>)}</div>
          </motion.div>}
          {screen==="understanding"&&<motion.div key="cc-under" className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex-shrink-0" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">AI Findings</p>
            <div className="flex flex-wrap gap-1.5">{READY_CHIPS.map(c=><Chip key={c.label} {...c}/>)}</div>
          </motion.div>}
          {screen==="confirm"&&<motion.div key="cc-conf" className="bg-amber-50 rounded-2xl p-3 border border-amber-100 flex-shrink-0" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>
            <div className="flex items-center gap-2 mb-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"/><p className="text-[10px] font-semibold text-amber-700 uppercase tracking-widest">Awaiting Confirmation</p></div>
            <div className="flex flex-wrap gap-1.5">{READY_CHIPS.map(c=><Chip key={c.label} {...c}/>)}</div>
          </motion.div>}
          {screen==="matching"&&<motion.div key="cc-match" className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 border border-green-200 flex-shrink-0" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>
            <div className="flex items-center gap-1 mb-2"><Star size={10} className="text-[#2E7D32]" fill="#2E7D32"/><p className="text-[10px] font-semibold text-[#2E7D32] uppercase tracking-widest">Top Pick</p></div>
            <div className="bg-white rounded-xl p-2.5 border border-green-100"><p className="text-xs font-bold text-[#1a2332] mb-1">🌾 PM Fasal Bima Yojana</p><span className="px-2 py-0.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-bold">98% Match</span><p className="text-[10px] text-gray-400 mt-1.5">Benefit</p><p className="text-sm font-bold text-[#2E7D32]">₹18,000</p></div>
          </motion.div>}
          {screen==="scheme"&&<motion.div key="cc-scheme" className="bg-green-50 rounded-2xl p-3 border border-green-200 flex-shrink-0" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>
            <p className="text-[10px] font-semibold text-[#2E7D32] uppercase tracking-widest mb-2">Scheme Ready</p>
            <div className="space-y-1.5">{["98% Match","₹18,000 Benefit","Eligible"].map(t=><div key={t} className="flex items-center gap-1.5 text-[11px] text-green-700"><Check size={10} className="text-[#2E7D32]"/>{t}</div>)}</div>
          </motion.div>}
          {screen==="doccheck"&&<motion.div key="cc-doc" className="bg-blue-50 rounded-2xl p-3 border border-blue-200 flex-shrink-0" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>
            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest mb-2">Document Check</p>
            <div className="w-full h-1.5 bg-blue-200 rounded-full mb-2 overflow-hidden"><div className="h-full bg-[#2E7D32] rounded-full transition-all" style={{width:`${(docIndex/CHECK_DOCS.length)*100}%`}}/></div>
            <p className="text-[11px] text-center text-blue-700 font-medium">{docIndex} of {CHECK_DOCS.length} verified</p>
          </motion.div>}
          {screen==="missingdoc"&&<motion.div key="cc-miss" className="bg-orange-50 rounded-2xl p-3 border border-orange-200 flex-shrink-0" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>
            <div className="flex items-center gap-2 mb-2"><AlertCircle size={12} className="text-orange-500"/><p className="text-[10px] font-semibold text-orange-700 uppercase tracking-widest">Missing Doc</p></div>
            <p className="text-xs font-bold text-[#1a2332] mb-0.5">{missingDoc.name}</p>
            <p className="text-[11px] text-orange-600">Tahsildar Office · 2.4 km</p>
            <p className="text-[11px] text-gray-400 mt-0.5">3–7 working days</p>
          </motion.div>}
          {screen==="application"&&<motion.div key="cc-app" className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex-shrink-0" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Progress</p>
            <div className="flex items-center gap-2 mb-1.5"><div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-[#2E7D32] rounded-full" style={{width:"25%"}}/></div><span className="text-[11px] font-bold text-[#2E7D32]">25%</span></div>
            <p className="text-[11px] text-gray-400 text-center">2 of 8 answered</p>
          </motion.div>}
          {screen==="review"&&<motion.div key="cc-rev" className="bg-green-50 rounded-2xl p-3 border border-green-200 flex-shrink-0" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>
            <p className="text-[10px] font-semibold text-[#2E7D32] uppercase tracking-widest mb-2">All Info Collected</p>
            <div className="space-y-1">{["Applicant details","Scheme selected","Documents verified"].map(t=><div key={t} className="flex items-center gap-1.5 text-[11px] text-green-700"><Check size={10} className="text-[#2E7D32]"/>{t}</div>)}</div>
          </motion.div>}
          {screen==="submitted"&&<motion.div key="cc-sub" className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 border border-green-200 flex-shrink-0" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>
            <div className="flex items-center gap-1.5 mb-2"><Trophy size={11} className="text-amber-500"/><p className="text-[10px] font-semibold text-[#2E7D32] uppercase tracking-widest">Submitted</p></div>
            <p className="text-[10px] font-mono text-gray-500 text-center bg-white rounded-lg px-2 py-1 border border-gray-100">PMFBY-2026-584721</p>
          </motion.div>}
          {screen==="myapps"&&<motion.div key="cc-my" className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex-shrink-0" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Status</p>
            {[{t:"Application Submitted",ok:true},{t:"Under Verification",ok:false}].map(({t,ok})=>(
              <div key={t} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border mb-1.5 ${ok?"bg-white border-gray-100":"bg-amber-50 border-amber-200"}`}>
                {ok?<CheckCircle2 size={10} className="text-[#2E7D32] flex-shrink-0"/>:<div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" style={{animation:"blink 1.5s ease-in-out infinite"}}/>}
                <span className={`text-[11px] font-medium ${ok?"text-[#1a2332]":"text-amber-700"}`}>{t}</span>
              </div>
            ))}
          </motion.div>}
        </AnimatePresence>
      </aside>

    </div>
  );
}
