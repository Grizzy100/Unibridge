// client/components/mail/utils.ts

export function formatDateCompact(iso: string): string {
  try {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, "0")
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const yy = String(d.getFullYear()).slice(-2)
    return `${dd}/${mm}/${yy}`
  } catch (error) {
    console.error("Failed to format date:", error)
    return "Invalid date"
  }
}

export function bytesToSizeLabel(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B"
  
  const units = ["B", "KB", "MB", "GB"]
  let value = bytes
  let unitIndex = 0
  
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }
  
  const digits = unitIndex === 0 ? 0 : 1
  return `${value.toFixed(digits)} ${units[unitIndex]}`
}

export function makePreview(body: string, maxLength = 120): string {
  if (!body) return ""
  
  const cleaned = body.replace(/\s+/g, " ").trim()
  
  if (cleaned.length <= maxLength) return cleaned
  
  return cleaned.slice(0, maxLength - 1) + "…"
}

export function initials(name?: string): string {
  const trimmed = (name || "").trim()
  
  if (!trimmed) return "U"
  
  const parts = trimmed.split(/\s+/).filter(Boolean)
  
  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase()
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function nameFromEmail(email?: string): string {
  const trimmed = (email || "").trim()
  
  if (!trimmed || !trimmed.includes("@")) return ""
  
  const localPart = trimmed.split("@")[0] || ""
  const parts = localPart.split(/[._-]+/).filter(Boolean)
  
  if (!parts.length) return ""
  
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = diff / (1000 * 60 * 60)

    if (hours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }
    
    if (hours < 168) {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    }
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    console.error("Failed to format timestamp:", error)
    return "Invalid date"
  }
}
