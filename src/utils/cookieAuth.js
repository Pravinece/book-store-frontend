// Secure Cookie & Token Management Utility
import { jwtDecode } from "jwt-decode";

// Simple hash function for token integrity (works in HTTP and HTTPS)
function hashToken(token) {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Verify hash
function verifyHash(token, hash) {
  const computedHash = hashToken(token);
  return computedHash === hash;
}

// Set secure cookie
export function setCookie(name, value, days = 1) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  const sameSite = window.location.hostname === 'localhost' ? 'Lax' : 'Strict';
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=${sameSite}${secure}`;
}

// Get cookie
export function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

// Delete cookie
export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
}

// Store token securely with hash
export function setSecureToken(token) {
  if (!token) return false;
  
  try {
    const hash = hashToken(token);
    setCookie('auth_token', token, 1);
    setCookie('auth_hash', hash, 1);
    console.log("ok");
    
    return true;
  } catch (error) {
    console.error('Error storing token',error);
    return false;
  }
}

// Get and validate token
export function getSecureToken() {
  const token = getCookie('auth_token');
  const hash = getCookie('auth_hash');
  
  if (!token || !hash) return null;
  
  try {
    const isValid = verifyHash(token, hash);
    if (!isValid) {
      clearAuth();
      return null;
    }
    
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      clearAuth();
      return null;
    }
    return token;
  } catch (error) {
    console.log('error: ', error);
    clearAuth();
    return null;
  }
}

// Validate token and get user info
export function validateToken() {
  const token = getSecureToken();
  
  if (!token) {
    return { isValid: false, token: null, user: null, role: null };
  }
  
  try {
    const decoded = jwtDecode(token);
    return {
      isValid: true,
      token,
      user: decoded,
      role: decoded.role || null
    };
  } catch (error) {
    console.log('error: ', error);
    return { isValid: false, token: null, user: null, role: null };
  }
}

// Store user data securely
export function setSecureUser(userData) {
  if (!userData) return false;
  
  try {
    const userString = JSON.stringify(userData);
    const hash = hashToken(userString);
    setCookie('user_data', userString, 1);
    setCookie('user_hash', hash, 1);
    return true;
  } catch (error) {
    console.error('Error storing user data');
    return false;
  }
}

// Get and validate user data
export function getSecureUser() {
  const userData = getCookie('user_data');
  const hash = getCookie('user_hash');
  
  if (!userData || !hash) return null;
  
  try {
    const isValid = verifyHash(userData, hash);
    if (!isValid) {
      deleteCookie('user_data');
      deleteCookie('user_hash');
      return null;
    }
    
    return JSON.parse(userData);
  } catch (error) {
    deleteCookie('user_data');
    deleteCookie('user_hash');
    return null;
  }
}

// Clear all auth data
export function clearAuth() {
  deleteCookie('auth_token');
  deleteCookie('auth_hash');
  deleteCookie('user_data');
  deleteCookie('user_hash');
}

// Check if user has required role
export function hasRole(requiredRoles) {
  const { isValid, role } = validateToken();
  
  if (!isValid || !role) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(role);
  }
  
  return role === requiredRoles;
}
