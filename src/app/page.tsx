
// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import Sidebar from "@/components/Sidebar";
// import PasswordModal from "@/components/profile-setup/PasswordModal";
// import { useProfileSetup } from "@/components/profile-setup/useProfileSetup";
// import { Textarea } from "@/components/ui/textarea";
// import { Think } from "@/components/ui/think";
// import ResumeUploadModal from "@/components/resume/ResumeUploadModal";

// export default function HomePage() {
//   const { isSetup, markSetup } = useProfileSetup();
//   const [selected, setSelected] = useState<string>("home");

//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState<{ sender: "user" | "bot"; text: string }[]>([
//     {
//       sender: "bot",
//       text: "👋 Hello! I’m Rithiha's AI assistant. Ask about her",
//     },
//   ]);

//   const chatEndRef = useRef<HTMLDivElement | null>(null);
//   useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [
//     chat,
//   ]);

//   const [resumeText, setResumeText] = useState("");
//   const [hydrated, setHydrated] = useState(false);
//   useEffect(() => setHydrated(true), []);

//   // === SEND QUESTION TO AI ===
//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     setChat((prev) => [...prev, { sender: "user", text: message }]);

//     const userQuestion = message;
//     setMessage("");

//     const res = await fetch("/api/ai/resume-qa", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ question: userQuestion }),
//     });

//     const data = await res.json();

//     setChat((prev) => [
//       ...prev,
//       {
//         sender: "bot",
//         text: data.success ? data.answer : data.error || "Something went wrong.",
//       },
//     ]);
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="flex-none">
//         <Sidebar selected={selected} onSelect={(id) => setSelected(id)} />
//       </div>

//       <main className="flex-1 p-10 overflow-auto">
//         <header className="text-center mb-8">
//           <h1 className="text-[48px] font-extrabold text-cyan-500">
//             Rithiha's AI Assistant
//           </h1>

//           <div className="mt-4 flex items-center justify-center gap-4">
//             {hydrated &&
//               (!isSetup ? (
//                 <PasswordModal onSetup={markSetup} />
//               ) : (
//                 <>
//                   <ResumeUploadModal
//                     onUploaded={(text: string) => setResumeText(text)}
//                   />

//                   <a
//                     href="https://github.com/Rithi-20"
//                     target="_blank"
//                     className="rounded-full bg-white px-4 py-2 shadow"
//                   >
//                     GitHub
//                   </a>

//                   <a
//                     href="https://www.linkedin.com/in/rithiha-u-3278a4286/"
//                     target="_blank"
//                     className="rounded-full bg-white px-4 py-2 shadow"
//                   >
//                     LinkedIn
//                   </a>
//                 </>
//               ))}
//           </div>
//         </header>

//         <section>
//           {selected === "home" && (
//             <div className="mx-auto max-w-4xl">
//               <div className="rounded-2xl bg-white/90 p-6 shadow-md">

//                 {/* CHAT WINDOW */}
//                 <div className="h-[420px] overflow-y-auto p-4 bg-white border rounded-lg space-y-4">
//                   {chat.map((msg, i) => (
//                     <div
//                       key={i}
//                       className={`max-w-[75%] p-3 rounded-lg ${
//                         msg.sender === "user"
//                           ? "self-end bg-[#00CFFF] text-white ml-auto"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {msg.text}
//                     </div>
//                   ))}

//                   <div ref={chatEndRef} />
//                 </div>

//                 {/* INPUT */}
//                 <div className="rounded-lg border p-4 bg-white mt-4">
//                   <Textarea
//                     className="h-20"
//                     placeholder="Type your question..."
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                   />

//                   <div className="mt-4 flex justify-end items-center gap-3">
//                     <div className="inline-flex items-center gap-2 text-sm text-slate-500">
//                       <Think /> Thinking
//                     </div>

//                     <button
//                       className="px-6 py-2 bg-[#00CFFF] hover:bg-[#00B8E6] text-white rounded-full"
//                       onClick={sendMessage}
//                     >
//                       Send
//                     </button>
//                   </div>
//                 </div>

//               </div>
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

"use client";
import Academics from "@/components/pages/Academics";
import Projects from "@/components/pages/Projects";
import Skills from "@/components/pages/Skills";
import Internships from "@/components/pages/Internships";
import Certifications from "@/components/pages/Certifications";
import Publications from "@/components/pages/Publications";
import Activities from "@/components/pages/Activities";
import ContactInfo from "@/components/pages/Contact";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import PasswordModal from "@/components/profile-setup/PasswordModal";
import { useProfileSetup } from "@/components/profile-setup/useProfileSetup";
import { Textarea } from "@/components/ui/textarea";
import { Think } from "@/components/ui/think";
import ResumeUploadModal from "@/components/resume/ResumeUploadModal";

export default function HomePage() {
  const { isSetup, markSetup } = useProfileSetup();
  const [selected, setSelected] = useState<string>("home");

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: "user" | "bot"; text: string }[]>([
    {
      sender: "bot",
      text: "👋 Hello! I’m Rithiha's AI assistant. Ask about education, projects, internships, skills, or Publications.",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const [resumeText, setResumeText] = useState("");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // === SEND QUESTION TO AI ===
  const sendMessage = async () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { sender: "user", text: message }]);

    const userQuestion = message;
    setMessage("");

    const res = await fetch("/api/ai/resume-qa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userQuestion }),
    });

    const data = await res.json();

    setChat((prev) => [
      ...prev,
      {
        sender: "bot",
        text: data.success ? data.answer : data.error || "Something went wrong.",
      },
    ]);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-none">
        <Sidebar selected={selected} onSelect={(id) => setSelected(id)} />
      </div>

      <main className="flex-1 p-10 overflow-auto">
        <header className="text-center mb-8">
          <h1 className="text-[48px] font-extrabold text-cyan-500">
            Rithiha's AI Assistant
          </h1>

          <div className="mt-4 flex items-center justify-center gap-4">
            {hydrated &&
              (!isSetup ? (
                <PasswordModal onSetup={markSetup} />
              ) : (
                <>
                  <ResumeUploadModal
                    onUploaded={(text: string) => setResumeText(text)}
                  />

                  <a
                    href="https://github.com/Rithi-20"
                    target="_blank"
                    className="rounded-full bg-white px-4 py-2 shadow"
                  >
                    GitHub
                  </a>

                  <a
                    href="https://www.linkedin.com/in/rithiha-u-3278a4286/"
                    target="_blank"
                    className="rounded-full bg-white px-4 py-2 shadow"
                  >
                    LinkedIn
                  </a>
                </>
              ))}
          </div>
        </header>

        <section>
          {/* 🏠 HOME PAGE (CHAT WINDOW) */}
          {selected === "home" && (
            <div className="mx-auto max-w-4xl">
              <div className="rounded-2xl bg-white/90 p-6 shadow-md">

                {/* CHAT WINDOW */}
                <div className="h-[420px] overflow-y-auto p-4 bg-white border rounded-lg space-y-4">
                  {chat.map((msg, i) => (
                    <div
                      key={i}
                      className={`max-w-[75%] p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "self-end bg-cyan-500 text-white ml-auto"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* INPUT */}
                <div className="rounded-lg border p-4 bg-white mt-4">
                  <Textarea
                    className="h-20"
                    placeholder="Type your question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <div className="mt-4 flex justify-end items-center gap-3">
                    <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                      <Think /> Thinking
                    </div>

                    <button
                      className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full"
                      onClick={sendMessage}
                    >
                      Send
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 📄 ALL OTHER SECTIONS */}
          
          {selected === "academics" && <Academics />}
          {selected === "projects" && <Projects />}
          {selected === "skills" && <Skills />}
          {selected === "internships" && <Internships />}
          {selected === "certifications" && <Certifications />}
          {selected === "publications" && <Publications />}
          {selected === "activities" && <Activities />}
          {selected === "contact" && <ContactInfo />}

        </section>
      </main>
    </div>
  );
}
