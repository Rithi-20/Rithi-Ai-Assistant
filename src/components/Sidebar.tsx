"use client";

import React from "react";
import {
  Home,
  GraduationCap,
  FileText,
  Briefcase,
  Code,
  BookOpen,
  Mail,
  Activity,
  Gift
} from "lucide-react";

const items = [
  { id: "home", label: "Home", icon: <Home size={18} /> },
  { id: "academics", label: "Academics", icon: <GraduationCap size={18} /> },
  { id: "projects", label: "Projects", icon: <Code size={18} /> },
  { id: "internships", label: "Internships", icon: <Briefcase size={18} /> },
  { id: "skills", label: "Skills", icon: <Activity size={18} /> },
  { id: "certifications", label: "Certifications", icon: <Gift size={18} /> },
  { id: "publications", label: "Publications", icon: <FileText size={18} /> },
  { id: "activities", label: "Co-curricular", icon: <BookOpen size={18} /> },
  { id: "contact", label: "Contact", icon: <Mail size={18} /> }
];

export default function Sidebar({
  selected,
  onSelect
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="w-20 flex-shrink-0 bg-white/70 shadow-inner px-3 py-6 rounded-r-2xl">
      <div className="flex flex-col items-center gap-4">

        {/* Profile bubble */}
        <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
          R
        </div>

        {/* Navigation icons */}
        <nav className="flex flex-col gap-3 mt-4">
          {items.map((it) => {
            const active = it.id === selected;
            return (
              <button
                key={it.id}
                onClick={() => onSelect(it.id)}
                title={it.label}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition ${
                  active
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {it.icon}
              </button>
            );
          })}
        </nav>

        {/* Footer Text */}
        
      </div>
    </aside>
  );
}
