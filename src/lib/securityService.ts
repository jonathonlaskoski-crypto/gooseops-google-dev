/**
 * GooseOps Security Service
 * 
 * Provides comprehensive security features including:
 * - Input validation and sanitization
 * - API request protection
 * - Audit logging
 * - Data encryption
 * - Rate limiting
 * - CSRF protection
 * - Content Security Policy enforcement
 */

// Types
export type SecurityEventType = 'authentication' | 'authorization' | 'data_access' | 'system' | 'api';
export type SecurityLevel = 'info' | 'warning' | 'critical' | 'emergency';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: SecurityEventType;
  level: SecurityLevel;
  userId?: string;
  userName?: string;
  action: string;
  resource?: string;
  status: 'success' | 'failure' | 'blocked';
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

export interface ValidationRule {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  allowedValues?: string[];
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  custom?: (value: any) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Security Audit Journal (in-memory for now, would connect to backend in production)
class AuditJournal {
  private events: SecurityEvent[] = [];
  private maxEvents: number = 1000;
  private persistenceEnabled: boolean = false;
  private persistenceEndpoint: string = '';
  private persistenceApiKey: string = '';
  
  constructor() {
    // Try to load persisted settings
    this.loadSettings();
    
    // Set up periodic flush of events if persistence is enabled
    if (this.persistenceEnabled) {
      setInterval(() => this.flushEvents(), 60000); // Every minute
    }
  }
  
  private loadSettings() {
    try {
      const settingsJson = localStorage.getItem('security-audit-settings');
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        this.persistenceEnabled = settings.persistenceEnabled || false;
        this.persistenceEndpoint = settings.persistenceEndpoint || '';
        this.persistenceApiKey = settings.persistenceApiKey || '';
      }
    } catch (error) {
      console.error('Failed to load audit journal settings:', error);
    }
  }
  
  public saveSettings(settings: {
    persistenceEnabled: boolean;
    persistenceEndpoint: string;
    persistenceApiKey: string;
  }) {
    this.persistenceEnabled = settings.persistenceEnabled;
    this.persistenceEndpoint = settings.persistenceEndpoint;
    this.persistenceApiKey = settings.persistenceApiKey;
    
    localStorage.setItem('security-audit-settings', JSON.stringify({
      persistenceEnabled: this.persistenceEnabled,
      persistenceEndpoint: this.persistenceEndpoint,
      // Don't store the API key in plaintext in localStorage
      persistenceApiKey: this.persistenceApiKey ? '***' : ''
    }));
  }
  
  public logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>) {
    const timestamp = new Date().toISOString();
    const id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fullEvent: SecurityEvent = {
      ...event,
      id,
      timestamp,
      ip: this.getCurrentIp(),
      userAgent: navigator.userAgent
    };
    
    // Add to in-memory storage
    this.events.unshift(fullEvent);
    
    // Trim if too many events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }
    
    // Try to persist if enabled
    if (this.persistenceEnabled) {
      this.persistEvent(fullEvent).catch(error => {
        console.error('Failed to persist security event:', error);
      });
    }
    
    // Log critical events to console as well
    if (event.level === 'critical' || event.level === 'emergency') {
      console.warn('SECURITY EVENT:', fullEvent);
    }
    
    return fullEvent;
  }
  
  private async persistEvent(event: SecurityEvent): Promise<boolean> {
    if (!this.persistenceEnabled || !this.persistenceEndpoint) {
      return false;
    }
    
    try {
      const response = await fetch(this.persistenceEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.persistenceApiKey}`
        },
        body: JSON.stringify(event)
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to persist security event:', error);
      return false;
    }
  }
  
  private async flushEvents(): Promise<void> {
    if (!this.persistenceEnabled || !this.persistenceEndpoint || this.events.length === 0) {
      return;
    }
    
    // Get events that haven't been persisted yet
    const unpersisted = this.events.filter(e => !e.details?.persisted);
    if (unpersisted.length === 0) return;
    
    try {
      const response = await fetch(`${this.persistenceEndpoint}/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.persistenceApiKey}`
        },
        body: JSON.stringify(unpersisted)
      });
      
      if (response.ok) {
        // Mark as persisted
        this.events = this.events.map(e => {
          if (unpersisted.find(u => u.id === e.id)) {
            return {
              ...e,
              details: { ...e.details, persisted: true }
            };
          }
          return e;
        });
      }
    } catch (error) {
      console.error('Failed to flush security events:', error);
    }
  }
  
  public getEvents(
    filter?: {
      type?: SecurityEventType;
      level?: SecurityLevel;
      userId?: string;
      from?: Date;
      to?: Date;
      status?: 'success' | 'failure' | 'blocked';
    },
    limit: number = 100
  ): SecurityEvent[] {
    let filtered = this.events;
    
    if (filter) {
      if (filter.type) {
        filtered = filtered.filter(e => e.type === filter.type);
      }
      if (filter.level) {
        filtered = filtered.filter(e => e.level === filter.level);
      }
      if (filter.userId) {
        filtered = filtered.filter(e => e.userId === filter.userId);
      }
      if (filter.status) {
        filtered = filtered.filter(e => e.status === filter.status);
      }
      if (filter.from) {
        filtered = filtered.filter(e => new Date(e.timestamp) >= filter.from);
      }
      if (filter.to) {
        filtered = filtered.filter(e => new Date(e.timestamp) <= filter.to);
      }
    }
    
    return filtered.slice(0, limit);
  }
  
  public clearEvents() {
    this.events = [];
  }
  
  private getCurrentIp(): string {
    // In a browser environment, we can't reliably get the client IP
    // This would be provided by the server in a real implementation
    return 'client';
  }
}

// Input Validation and Sanitization
class InputValidator {
  private rules: Record<string, Record<string, ValidationRule>> = {};
  
  constructor() {
    this.initDefaultRules();
  }
  
  private initDefaultRules() {
    // Common validation rules
    this.rules = {
      'user': {
        'email': {
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          required: true,
          maxLength: 255
        },
        'password': {
          minLength: 8,
          required: true
        },
        'name': {
          pattern: /^[a-zA-Z0-9 ,.'-]+$/,
          minLength: 2,
          maxLength: 100,
          required: true
        }
      },
      'job': {
        'title': {
          minLength: 3,
          maxLength: 100,
          required: true
        },
        'description': {
          maxLength: 1000
        },
        'priority': {
          allowedValues: ['low', 'medium', 'high']
        }
      }
    };
  }
  
  public addRule(domain: string, field: string, rule: ValidationRule) {
    if (!this.rules[domain]) {
      this.rules[domain] = {};
    }
    
    this.rules[domain][field] = rule;
  }
  
  public validate(domain: string, field: string, value: any): ValidationResult {
    const rule = this.rules[domain]?.[field];
    if (!rule) {
      return { isValid: true, errors: [] };
    }
    
    const errors: string[] = [];
    
    // Check required
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
    }
    
    // Skip further validation if value is empty and not required
    if (value === undefined || value === null || value === '') {
      return { isValid: errors.length === 0, errors };
    }
    
    // Check type
    if (rule.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rule.type) {
        errors.push(`${field} must be of type ${rule.type}`);
      }
    }
    
    // String specific validations
    if (typeof value === 'string') {
      // Check pattern
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${field} has an invalid format`);
      }
      
      // Check length
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }
      
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        errors.push(`${field} must be no more than ${rule.maxLength} characters`);
      }
      
      // Check allowed values
      if (rule.allowedValues && !rule.allowedValues.includes(value)) {
        errors.push(`${field} must be one of: ${rule.allowedValues.join(', ')}`);
      }
    }
    
    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      errors.push(`${field} failed custom validation`);
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  public sanitizeHtml(html: string): string {
    // Simple HTML sanitization (for a real app, use a library like DOMPurify)
    return html
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/&(?![\w#]+;)/g, '&amp;');
  }
  
  public validateObject(domain: string, obj: Record<string, any>): ValidationResult {
    const errors: string[] = [];
    let isValid = true;
    
    if (!this.rules[domain]) {
      return { isValid: true, errors: [] };
    }
    
    for (const [field, rule] of Object.entries(this.rules[domain])) {
      if (rule.required && (obj[field] === undefined || obj[field] === null || obj[field] === '')) {
        errors.push(`${field} is required`);
        isValid = false;
      }
    }
    
    // Validate each field
    for (const [field, value] of Object.entries(obj)) {
      if (this.rules[domain][field]) {
        const result = this.validate(domain, field, value);
        if (!result.isValid) {
          errors.push(...result.errors);
          isValid = false;
        }
      }
    }
    
    return { isValid, errors };
  }
}

// API Security Service
class ApiSecurity {
  private rateLimits: Record<string, { count: number, timestamp: number }> = {};
  private blockList: Set<string> = new Set();
  private csrfToken: string = '';
  
  constructor() {
    // Generate CSRF token on init
    this.regenerateCSRFToken();
    
    // Try to load blocked IPs/Users
    this.loadBlockList();
  }
  
  private loadBlockList() {
    try {
      const blockedJson = localStorage.getItem('security-blocklist');
      if (blockedJson) {
        const blocked = JSON.parse(blockedJson);
        this.blockList = new Set(blocked);
      }
    } catch (error) {
      console.error('Failed to load block list:', error);
    }
  }
  
  private saveBlockList() {
    localStorage.setItem('security-blocklist', JSON.stringify([...this.blockList]));
  }
  
  public regenerateCSRFToken(): string {
    // Generate a random token
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    this.csrfToken = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return this.csrfToken;
  }
  
  public getCSRFToken(): string {
    return this.csrfToken;
  }
  
  public checkRateLimit(
    key: string, 
    limit: number = 100, 
    windowMs: number = 60000
  ): boolean {
    const now = Date.now();
    
    // Clean up old rate limits
    for (const [k, v] of Object.entries(this.rateLimits)) {
      if (now - v.timestamp > windowMs) {
        delete this.rateLimits[k];
      }
    }
    
    // Check if key exists
    if (!this.rateLimits[key]) {
      this.rateLimits[key] = { count: 1, timestamp: now };
      return true;
    }
    
    // Check if window has passed
    if (now - this.rateLimits[key].timestamp > windowMs) {
      this.rateLimits[key] = { count: 1, timestamp: now };
      return true;
    }
    
    // Check limit
    if (this.rateLimits[key].count >= limit) {
      return false;
    }
    
    // Increment count
    this.rateLimits[key].count++;
    return true;
  }
  
  public isBlocked(identifier: string): boolean {
    return this.blockList.has(identifier);
  }
  
  public addToBlockList(identifier: string): void {
    this.blockList.add(identifier);
    this.saveBlockList();
  }
  
  public removeFromBlockList(identifier: string): void {
    this.blockList.delete(identifier);
    this.saveBlockList();
  }
  
  public validateRequest(request: Request): { valid: boolean; reason?: string } {
    // Validate CSRF token for non-GET requests
    if (request.method !== 'GET') {
      const csrfToken = request.headers.get('X-CSRF-Token');
      if (!csrfToken || csrfToken !== this.csrfToken) {
        return { valid: false, reason: 'Invalid CSRF token' };
      }
    }
    
    // Check rate limiting
    const requestKey = request.url; // In a real app, this would include user ID and other factors
    if (!this.checkRateLimit(requestKey)) {
      return { valid: false, reason: 'Rate limit exceeded' };
    }
    
    return { valid: true };
  }
}

// Data Protection Service
class DataProtection {
  private encryptionKey: CryptoKey | null = null;
  private keyInitialized: boolean = false;
  
  constructor() {
    this.initEncryptionKey();
  }
  
  private async initEncryptionKey(): Promise<void> {
    try {
      // Try to load key from secure storage
      const storedKey = localStorage.getItem('encryption-key');
      
      if (storedKey) {
        // Import the stored key
        const keyData = this.hexToArrayBuffer(storedKey);
        this.encryptionKey = await window.crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );
      } else {
        // Generate a new key
        this.encryptionKey = await window.crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
        
        // Export and store the key
        const keyData = await window.crypto.subtle.exportKey('raw', this.encryptionKey);
        const keyHex = this.arrayBufferToHex(keyData);
        localStorage.setItem('encryption-key', keyHex);
      }
      
      this.keyInitialized = true;
    } catch (error) {
      console.error('Failed to initialize encryption key:', error);
    }
  }
  
  private hexToArrayBuffer(hexString: string): ArrayBuffer {
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      bytes[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
    }
    return bytes.buffer;
  }
  
  private arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  
  public async encrypt(data: string): Promise<string> {
    if (!this.keyInitialized || !this.encryptionKey) {
      await this.initEncryptionKey();
      if (!this.encryptionKey) {
        throw new Error('Encryption key not available');
      }
    }
    
    // Generate IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);
    
    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      encodedData
    );
    
    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + encryptedData.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encryptedData), iv.length);
    
    // Return as base64
    return btoa(String.fromCharCode(...result));
  }
  
  public async decrypt(encrypted: string): Promise<string> {
    if (!this.keyInitialized || !this.encryptionKey) {
      await this.initEncryptionKey();
      if (!this.encryptionKey) {
        throw new Error('Encryption key not available');
      }
    }
    
    // Decode the base64
    const data = new Uint8Array(
      atob(encrypted)
        .split('')
        .map(c => c.charCodeAt(0))
    );
    
    // Extract IV and encrypted data
    const iv = data.slice(0, 12);
    const encryptedData = data.slice(12);
    
    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      encryptedData
    );
    
    // Return as string
    return new TextDecoder().decode(decryptedData);
  }
  
  public hashPassword(password: string, salt?: string): Promise<string> {
    // In a real app, use a proper password hashing algorithm
    // This is just a placeholder that uses SHA-256
    const encoder = new TextEncoder();
    const saltValue = salt || Math.random().toString(36).substring(2);
    const data = encoder.encode(`${password}${saltValue}`);
    
    return window.crypto.subtle.digest('SHA-256', data)
      .then(hash => {
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return `${hashHex}.${saltValue}`;
      });
  }
  
  public async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [hash, salt] = hashedPassword.split('.');
    const newHash = await this.hashPassword(password, salt);
    return newHash === hashedPassword;
  }
}

// Content Security Policy Manager
class CSPManager {
  private basePolicy: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"], // Allow inline styles for simplicity
    'img-src': ["'self'", "data:", "https://images.unsplash.com"],
    'connect-src': ["'self'"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'object-src': ["'none'"],
    'media-src': ["'self'"],
    'frame-src': ["'none'"]
  };
  
  constructor() {
    this.applyCSP();
  }
  
  private applyCSP() {
    if (!document || !window) return; // Skip if not in browser
    
    try {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = this.generateCSPString();
      document.head.appendChild(meta);
    } catch (error) {
      console.error('Failed to apply CSP:', error);
    }
  }
  
  public addSource(directive: string, source: string): void {
    if (!this.basePolicy[directive]) {
      this.basePolicy[directive] = [];
    }
    
    if (!this.basePolicy[directive].includes(source)) {
      this.basePolicy[directive].push(source);
      this.applyCSP();
    }
  }
  
  public removeSource(directive: string, source: string): void {
    if (this.basePolicy[directive]) {
      this.basePolicy[directive] = this.basePolicy[directive].filter(s => s !== source);
      this.applyCSP();
    }
  }
  
  public generateCSPString(): string {
    return Object.entries(this.basePolicy)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }
}

// Security Service Main Class
export class SecurityService {
  private static instance: SecurityService;
  
  public readonly auditJournal: AuditJournal;
  public readonly inputValidator: InputValidator;
  public readonly apiSecurity: ApiSecurity;
  public readonly dataProtection: DataProtection;
  public readonly cspManager: CSPManager;
  
  private constructor() {
    this.auditJournal = new AuditJournal();
    this.inputValidator = new InputValidator();
    this.apiSecurity = new ApiSecurity();
    this.dataProtection = new DataProtection();
    this.cspManager = new CSPManager();
    
    // Set up security reporting
    this.setupSecurityReporting();
  }
  
  private setupSecurityReporting() {
    // Listen for CSP violations
    document.addEventListener('securitypolicyviolation', (e) => {
      this.auditJournal.logEvent({
        type: 'system',
        level: 'warning',
        action: 'csp_violation',
        resource: e.blockedURI,
        status: 'blocked',
        details: {
          documentURI: e.documentURI,
          violatedDirective: e.violatedDirective,
          originalPolicy: e.originalPolicy
        }
      });
    });
  }
  
  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    
    return SecurityService.instance;
  }
  
  // Validate API request
  public validateRequest(request: Request): boolean {
    const validation = this.apiSecurity.validateRequest(request);
    
    if (!validation.valid) {
      this.auditJournal.logEvent({
        type: 'api',
        level: 'warning',
        action: 'api_request',
        resource: request.url,
        status: 'blocked',
        details: { reason: validation.reason }
      });
      
      return false;
    }
    
    return true;
  }
  
  // Log security events
  public logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
    return this.auditJournal.logEvent(event);
  }
  
  // Validate input
  public validateInput(
    domain: string, 
    field: string, 
    value: any
  ): ValidationResult {
    return this.inputValidator.validate(domain, field, value);
  }
  
  // Encrypt sensitive data
  public async encryptData(data: string): Promise<string> {
    try {
      return await this.dataProtection.encrypt(data);
    } catch (error) {
      console.error('Encryption error:', error);
      
      this.auditJournal.logEvent({
        type: 'data_access',
        level: 'warning',
        action: 'encrypt_data',
        status: 'failure',
        details: { error: String(error) }
      });
      
      throw error;
    }
  }
  
  // Decrypt sensitive data
  public async decryptData(encrypted: string): Promise<string> {
    try {
      return await this.dataProtection.decrypt(encrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      
      this.auditJournal.logEvent({
        type: 'data_access',
        level: 'warning',
        action: 'decrypt_data',
        status: 'failure',
        details: { error: String(error) }
      });
      
      throw error;
    }
  }
  
  // Sanitize HTML content
  public sanitizeHTML(html: string): string {
    return this.inputValidator.sanitizeHtml(html);
  }
  
  // Check if a specific API or resource is under rate limit
  public checkRateLimit(key: string, limit?: number, windowMs?: number): boolean {
    return this.apiSecurity.checkRateLimit(key, limit, windowMs);
  }
}

// Export singleton instance
export const securityService = SecurityService.getInstance();
