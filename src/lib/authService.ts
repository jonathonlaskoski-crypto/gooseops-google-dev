// import { jwtDecode } from 'jwt-decode'

function jwtDecode<T>(token: string): T {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    throw new Error('Invalid token');
  }
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: string[]
  department?: string
  lastLogin?: Date
  isActive: boolean
}

export interface UserRole {
  id: string
  name: string
  permissions: string[]
  description: string
}

export interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
  permissions: string[]
  iat: number
  exp: number
}

export class AuthService {
  private baseUrl: string
  private currentUser: User | null = null
  private authToken: AuthToken | null = null

  constructor(baseUrl: string = 'http://localhost:5002/make-server-9791e648') {
    this.baseUrl = baseUrl
    this.loadStoredAuth()
  }

  /**
   * Load stored authentication from localStorage
   */
  private loadStoredAuth(): void {
    try {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedToken && storedUser) {
        this.authToken = JSON.parse(storedToken)
        this.currentUser = JSON.parse(storedUser)

        // Check if token is still valid
        if (this.isTokenExpired()) {
          this.clearAuth()
        }
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error)
      this.clearAuth()
    }
  }

  /**
   * Store authentication in localStorage
   */
  private storeAuth(token: AuthToken, user: User): void {
    try {
      localStorage.setItem('auth_token', JSON.stringify(token))
      localStorage.setItem('auth_user', JSON.stringify(user))
    } catch (error) {
      console.error('Failed to store auth:', error)
    }
  }

  /**
   * Clear stored authentication
   */
  private clearAuth(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    this.authToken = null
    this.currentUser = null
  }

  /**
   * Check if current token is expired
   */
  private isTokenExpired(): boolean {
    if (!this.authToken) return true

    try {
      const payload = jwtDecode<JWTPayload>(this.authToken.accessToken)
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  /**
   * Get authorization header for API requests
   */
  getAuthHeader(): string | null {
    if (!this.authToken) return null
    return `${this.authToken.tokenType} ${this.authToken.accessToken}`
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        return { success: false, error: error.error || 'Login failed' }
      }

      const token: AuthToken = await response.json()

      // Get user info from token
      const payload = jwtDecode<JWTPayload>(token.accessToken)

      // Fetch user details
      const userResponse = await fetch(`${this.baseUrl}/auth/user/${payload.userId}`, {
        headers: {
          'Authorization': `${token.tokenType} ${token.accessToken}`,
        },
      })

      if (!userResponse.ok) {
        return { success: false, error: 'Failed to get user details' }
      }

      const user: User = await userResponse.json()

      this.authToken = token
      this.currentUser = user
      this.storeAuth(token, user)

      return { success: true, user }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<boolean> {
    try {
      if (this.authToken) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': this.getAuthHeader() || '',
          },
        })
      }

      this.clearAuth()
      return true
    } catch (error) {
      console.error('Logout error:', error)
      this.clearAuth() // Clear anyway
      return false
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    try {
      if (!this.authToken) return false

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.authToken.refreshToken }),
      })

      if (!response.ok) return false

      const newToken: AuthToken = await response.json()

      if (this.currentUser) {
        this.authToken = newToken
        this.storeAuth(newToken, this.currentUser)
        return true
      }

      return false
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null && !this.isTokenExpired()
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false

    // Super admin has all permissions
    if (this.currentUser.permissions.includes('*')) {
      return true
    }

    return this.currentUser.permissions.includes(permission)
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission))
  }

  /**
   * Check if user has specific role
   */
  hasRole(roleId: string): boolean {
    return this.currentUser?.role.id === roleId
  }

  /**
   * Get user's role name
   */
  getRoleName(): string {
    return this.currentUser?.role.name || 'Unknown'
  }

  /**
   * Check if user is field technician
   */
  isFieldTechnician(): boolean {
    return this.hasRole('technician')
  }

  /**
   * Check if user is office manager
   */
  isOfficeManager(): boolean {
    return this.hasRole('manager') || this.hasRole('admin') || this.hasRole('super_admin')
  }

  /**
   * Check if user has business account access
   */
  hasBusinessAccount(): boolean {
    return this.hasAnyPermission(['leads.read', 'apps.generate', 'analytics.view'])
  }

  /**
   * Make authenticated API request
   */
  async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const authHeader = this.getAuthHeader()

    if (!authHeader) {
      throw new Error('Not authenticated')
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      ...options.headers,
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }

  /**
   * Initialize with mock data for development
   */
  initializeMockAuth(): void {
    const mockUser: User = {
      id: 'manager-001',
      email: 'manager@rsd-brain.com',
      name: 'Operations Manager',
      role: {
        id: 'manager',
        name: 'Operations Manager',
        permissions: [
          'leads.read', 'leads.write',
          'apps.generate', 'apps.view',
          'analytics.view', 'analytics.export',
          'reports.view', 'reports.generate',
          'team.manage', 'team.view'
        ],
        description: 'Manage operations, leads, and team activities'
      },
      permissions: [
        'leads.read', 'leads.write',
        'apps.generate', 'apps.view',
        'analytics.view', 'analytics.export',
        'reports.view', 'reports.generate',
        'team.manage', 'team.view'
      ],
      department: 'Operations',
      isActive: true,
      lastLogin: new Date()
    }

    const mockToken: AuthToken = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600000,
      tokenType: 'Bearer'
    }

    this.currentUser = mockUser
    this.authToken = mockToken
    this.storeAuth(mockToken, mockUser)
  }
}

// Export singleton instance
export const authService = new AuthService()
