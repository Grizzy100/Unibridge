
// client/lib/auth.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Types
export type Role = "ADMIN" | "STUDENT" | "TEACHER" | "PARENT" | "WARDEN"

export interface User {
  id: string
  email: string
  role: Role
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginResponse {
  success: boolean
  data: {
    token: string
    user: User
  }
}

// ============================================================================
// STORAGE KEYS (Simple & Clean)
// ============================================================================
const TOKEN_KEY = "accessToken"
const USER_KEY = "currentUser"
const TOKEN_EXPIRY_KEY = "tokenExpiry"

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

/**
 * Store authentication data in localStorage
 * @param token - JWT token
 * @param user - User object
 * @param expiresIn - Token expiry in seconds (default 24h)
 */
export function setAuth(token: string, user: User, expiresIn: number = 86400) {
  if (typeof window === "undefined") return

  const expiryTime = Date.now() + expiresIn * 1000
  
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())

  console.log(`[Auth] User ${user.role} logged in, token expires in ${expiresIn}s`)
}

/**
 * Get current JWT token
 * Automatically checks expiry and clears if expired
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null

  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null

  // Check if token is expired
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
  if (expiry && Date.now() > parseInt(expiry)) {
    console.warn("[Auth] Token expired, clearing session")
    clearAuth()
    return null
  }

  return token
}

/**
 * Get current user from localStorage
 */
export function getUser(): User | null {
  if (typeof window === "undefined") return null

  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as User
  } catch (error) {
    console.error("[Auth] Failed to parse user data:", error)
    return null
  }
}

/**
 * Get current authentication state
 */
export function getAuthState(): AuthState {
  const token = getToken()
  const user = getUser()

  return {
    token,
    user,
    isAuthenticated: !!(token && user),
  }
}

/**
 * Clear all authentication data
 */
export function clearAuth() {
  if (typeof window === "undefined") return

  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_EXPIRY_KEY)

  console.log("[Auth] Session cleared")
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken()
}

/**
 * Check if user has specific role
 */
export function hasRole(role: Role): boolean {
  const user = getUser()
  return user?.role === role
}

/**
 * Get current user's role
 */
export function getCurrentRole(): Role | null {
  return getUser()?.role || null
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Login user and store credentials
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Login failed" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    const data: LoginResponse = await response.json()

    if (data.success && data.data) {
      // Store token and user info
      setAuth(data.data.token, data.data.user)
      return data
    }

    throw new Error("Invalid response format")
  } catch (error) {
    console.error("[Auth] Login failed:", error)
    throw error
  }
}

/**
 * Logout user and clear session
 */
export function logout() {
  clearAuth()
  
  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login"
  }
}

/**
 * Decode JWT token (client-side only for debugging)
 */
export function decodeToken(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("[Auth] Failed to decode token:", error)
    return null
  }
}

// ============================================================================
// LEGACY COMPATIBILITY (For existing logins)
// ============================================================================

/**
 * Migrate old token storage to new format
 */
export function migrateOldTokens() {
  if (typeof window === "undefined") return

  // Check for old format tokens
  const oldToken = localStorage.getItem("token")
  const oldUser = localStorage.getItem("user")

  if (oldToken && oldUser) {
    try {
      const user = JSON.parse(oldUser)
      setAuth(oldToken, user)
      
      // Clean up old keys
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      
      console.log("[Auth] Migrated old token format")
    } catch (error) {
      console.error("[Auth] Failed to migrate old tokens:", error)
    }
  }

  // Check for role-scoped tokens
  const roles: Role[] = ["ADMIN", "STUDENT", "TEACHER", "PARENT", "WARDEN"]
  for (const role of roles) {
    const roleToken = localStorage.getItem(`token:${role}`)
    const roleUser = localStorage.getItem(`user:${role}`)

    if (roleToken && roleUser && !getToken()) {
      try {
        const user = JSON.parse(roleUser)
        setAuth(roleToken, user)
        
        // Clean up old keys
        localStorage.removeItem(`token:${role}`)
        localStorage.removeItem(`user:${role}`)
        
        console.log(`[Auth] Migrated ${role} token`)
        break // Only migrate first found
      } catch (error) {
        console.error(`[Auth] Failed to migrate ${role} token:`, error)
      }
    }
  }
}

// Auto-migrate on import
if (typeof window !== "undefined") {
  migrateOldTokens()
}
