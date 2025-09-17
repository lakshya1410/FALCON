// Single, complete authentication system
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { app } from './firebaseConfig';

const auth = getAuth(app);

export interface User {
  id: string;
  email: string;
  fullName: string;
  siteName: string;
  latitude: string;
  longitude: string;
  mobile: string;
  role: string;
}

// Storage key
const CURRENT_USER_KEY = 'falcon_current_user';

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Save user to localStorage
const setCurrentUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error('Failed to save user:', error);
  }
};

// Auth listeners
const listeners: ((event: string, user: User | null) => void)[] = [];

const notifyListeners = (event: string, user: User | null) => {
  listeners.forEach(callback => callback(event, user));
};

export const addAuthListener = (callback: (event: string, user: User | null) => void) => {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
};

// Registration
export const register = async (
  email: string, 
  password: string, 
  userData: {
    fullName: string;
    siteName: string;
    latitude: string;
    longitude: string;
    mobile: string;
  }
) => {
  try {
    console.log('🔄 Registering user:', email);
    
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update display name
    await updateProfile(firebaseUser, {
      displayName: userData.fullName
    });
    
    // Create app user object
    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || email,
      fullName: userData.fullName,
      siteName: userData.siteName,
      latitude: userData.latitude,
      longitude: userData.longitude,
      mobile: userData.mobile,
      role: 'operator'
    };
    
    // Save to localStorage and notify
    setCurrentUser(user);
    notifyListeners('SIGNED_IN', user);
    
    console.log('✅ Registration successful');
    return { data: { user }, error: null };
    
  } catch (error: any) {
    console.error('❌ Registration failed:', error);
    
    let message = 'Registration failed';
    if (error.code === 'auth/email-already-in-use') {
      message = 'An account with this email already exists';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password is too weak. Please use at least 6 characters';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address';
    }
    
    return { data: { user: null }, error: { message } };
  }
};

// Login
export const login = async (email: string, password: string) => {
  try {
    console.log('🔄 Logging in user:', email);
    
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Create app user object
    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || email,
      fullName: firebaseUser.displayName || 'User',
      siteName: 'Mine Site',
      latitude: '',
      longitude: '',
      mobile: '',
      role: 'operator'
    };
    
    // Save to localStorage and notify
    setCurrentUser(user);
    notifyListeners('SIGNED_IN', user);
    
    console.log('✅ Login successful');
    return { data: { user }, error: null };
    
  } catch (error: any) {
    console.error('❌ Login failed:', error);
    
    let message = 'Login failed';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      message = 'Invalid email or password';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Too many failed attempts. Please try again later';
    }
    
    return { data: { user: null }, error: { message } };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    setCurrentUser(null);
    notifyListeners('SIGNED_OUT', null);
    return { error: null };
  } catch (error: any) {
    return { error: { message: 'Logout failed' } };
  }
};

// Placeholder for compatibility
export const resendConfirmation = async (_email: string) => {
  return { data: { message: 'Email confirmation handled by Firebase' }, error: null };
};