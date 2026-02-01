// // client/src/app/(dashboard)/student-dashboard/components/mail/utils.ts
// export function formatDateCompact(iso: string) {
//   const d = new Date(iso);
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const yy = String(d.getFullYear()).slice(-2);
//   return `${dd}/${mm}/${yy}`;
// }

// export function bytesToSizeLabel(bytes: number) {
//   if (!Number.isFinite(bytes)) return "";
//   const units = ["B", "KB", "MB", "GB"];
//   let v = bytes;
//   let i = 0;
//   while (v >= 1024 && i < units.length - 1) {
//     v /= 1024;
//     i++;
//   }
//   const digits = i === 0 ? 0 : 1;
//   return `${v.toFixed(digits)} ${units[i]}`;
// }

// export function makePreview(body: string, max = 120) {
//   const clean = (body || "").replace(/\s+/g, " ").trim();
//   if (clean.length <= max) return clean;
//   return clean.slice(0, max - 1) + "…";
// }

// export function initials(name?: string) {
//   const s = (name || "").trim();
//   if (!s) return "U";
//   const parts = s.split(/\s+/).filter(Boolean);
//   if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
//   return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
// }


// export function nameFromEmail(email?: string) {
//   const e = (email || "").trim()
//   if (!e.includes("@")) return ""
//   const left = e.split("@")[0] || ""
//   const parts = left.split(/[._-]+/).filter(Boolean)
//   if (!parts.length) return ""
//   return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ")
// }

