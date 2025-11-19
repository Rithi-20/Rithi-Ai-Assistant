// // src/components/profile-setup/PasswordModal.tsx
// "use client";
// import React, { useState } from "react";
// import * as Dialog from "@radix-ui/react-dialog";
// import { Check, Lock } from "lucide-react";

// export default function PasswordModal({ onSetup }: { onSetup: () => void }) {
//   const [open, setOpen] = useState(false);
//   const [pw, setPw] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [err, setErr] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     setErr(null);
//     if (pw.length < 6) {
//       setErr("Password must be at least 6 characters.");
//       return;
//     }
//     if (pw !== confirm) {
//       setErr("Passwords do not match.");
//       return;
//     }
//     setLoading(true);
//     try {
//       // Basic client-side encode — server storage encryption optional later
//       localStorage.setItem("profilePasswordToken", btoa(pw));
//       localStorage.setItem("profileSetupDone", "true");
//       onSetup();
//       setOpen(false);
//     } catch {
//       setErr("Could not save password locally.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog.Root open={open} onOpenChange={setOpen}>
//       <Dialog.Trigger asChild>
//         <button className="rounded-full bg-cyan-500 px-4 py-2 text-white font-semibold shadow hover:brightness-95 flex items-center gap-2">
//           <Lock size={16} />
//           Set up your profile
//         </button>
//       </Dialog.Trigger>

//       <Dialog.Portal>
//         <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
//         <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(520px,92vw)] rounded-2xl bg-white p-6 shadow-lg">
//           <h3 className="text-2xl font-bold text-cyan-600 mb-1">Create profile password</h3>
//           <p className="text-sm text-slate-500 mb-4">After setup the quick links will appear under the title.</p>

//           <div className="flex flex-col gap-2">
//             <input placeholder="Enter password" value={pw} onChange={(e) => setPw(e.target.value)} type="password"
//               className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-200" />
//             <input placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password"
//               className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-200" />
//             {err && <div className="text-sm text-rose-600">{err}</div>}
//           </div>

//           <div className="mt-5 flex justify-end gap-3">
//             <Dialog.Close asChild><button className="px-3 py-2 rounded-md">Cancel</button></Dialog.Close>
//             <button onClick={submit} disabled={loading}
//               className="rounded-full bg-cyan-500 px-4 py-2 text-white font-medium">
//               {loading ? "Saving..." : <span className="inline-flex items-center gap-2"><Check size={14} /> Save</span>}
//             </button>
//           </div>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// }

"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Lock, XCircle } from "lucide-react";

export default function PasswordModal({ onSetup }: { onSetup: () => void }) {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(null);

    if (pw.length < 3) {
      setErr("Password is required");
      return;
    }
    if (pw !== confirm) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/profile/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),   // <-- EXACTLY what your backend expects
      });

      const data = await res.json();

      if (!data.success) {
        setErr("Wrong password");
        setLoading(false);
        return;
      }

      // SUCCESS — unlock the UI
      localStorage.setItem("profileSetupDone", "true");

      setLoading(false);
      setOpen(false);
      onSetup();   // tells page.tsx to reveal resume/github/linkedin
    } catch (err) {
      console.error(err);
      setErr("Network error");
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="rounded-full bg-cyan-500 px-4 py-2 text-white font-semibold shadow hover:brightness-95 flex items-center gap-2">
          <Lock size={16} />
          Set up your profile
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(500px,92vw)] rounded-2xl bg-white p-6 shadow-lg">
          <Dialog.Title className="text-2xl font-bold text-cyan-600 mb-2">
  Enter Password
</Dialog.Title>

          <p className="text-sm text-slate-500 mb-4">
            Enter the password to unlock your profile.
          </p>

          <div className="flex flex-col gap-2">
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-200"
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-200"
            />

            {err && (
              <div className="flex items-center gap-2 text-sm text-rose-600">
                <XCircle size={16} /> {err}
              </div>
            )}
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-3 py-2 rounded-md">Cancel</button>
            </Dialog.Close>

            <button
              onClick={submit}
              disabled={loading}
              className="rounded-full bg-cyan-500 px-4 py-2 text-white font-medium"
            >
              {loading ? "Checking..." : "Unlock"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
