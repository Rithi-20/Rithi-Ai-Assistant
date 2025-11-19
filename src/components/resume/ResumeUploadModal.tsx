"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Upload, FileText, XCircle, CheckCircle } from "lucide-react";

export default function ResumeUploadModal({
  onUploaded,
}: {
  onUploaded: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    if (!file) return;

    // === VALIDATE WORD FILE ===
    const allowedTypes = [
      "application/msword",                              // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a Word document (.doc or .docx)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/resume/process", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    if (!json.success) {
      setError("Error processing resume");
      return;
    }

    onUploaded(json.text);

    // close upload modal
    setOpen(false);

    // show success modal
    setSuccessOpen(true);
  };

  return (
    <>
      {/* ----------- Upload Button ----------- */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="rounded-full bg-white px-4 py-2 shadow flex items-center gap-2">
            <FileText size={18} /> Resume
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

          <Dialog.Content
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            bg-white p-8 rounded-2xl w-[400px] shadow-xl"
          >
            {/* REQUIRED for accessibility */}
            <Dialog.Title className="text-xl font-bold text-cyan-600 mb-4">
              Upload Your Resume
            </Dialog.Title>

            <div className="border-2 border-dashed border-cyan-300 rounded-xl p-6 text-center">
              <Upload size={40} className="mx-auto text-cyan-500" />

              <p className="mt-2 text-sm text-slate-500">
                Upload Word Resume (.doc / .docx)
              </p>

              <input
                type="file"
                accept=".doc, .docx"
                className="mt-4"
                onChange={(e) => handleFile(e.target.files?.[0] as File)}
              />
            </div>

            {error && (
              <div className="mt-4 text-red-600 flex items-center gap-2 text-sm">
                <XCircle size={16} /> {error}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ----------- Success Popup ----------- */}
      <Dialog.Root open={successOpen} onOpenChange={setSuccessOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20" />

          <Dialog.Content
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            bg-white p-8 rounded-2xl w-[350px] shadow-xl text-center"
          >
            <Dialog.Title className="text-xl font-bold text-green-600">
              Resume Uploaded
            </Dialog.Title>

            <CheckCircle
              size={48}
              className="mx-auto text-green-500 mt-4"
            />

            <p className="text-slate-600 mt-3">
              Your resume has been uploaded successfully!
            </p>

            <button
              className="mt-5 bg-green-500 text-white px-4 py-2 rounded-full"
              onClick={() => setSuccessOpen(false)}
            >
              OK
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
