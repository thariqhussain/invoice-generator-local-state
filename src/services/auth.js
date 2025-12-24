import { BASE_URL } from '../config/api.js';
// const USE_MOCK_API = true;

const SESSION_KEY = 'is_logged_in_flag';

const VALID_CREDENTIALS = {
    email: 'admin@example.com',
    password: 'admin123',
    org: 'MyOrg'
}

export async function signup(data) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Store user in localStorage (optional)
    localStorage.setItem('user_data', JSON.stringify(data));
    
    return { success: true, message: "Signup success" };
}


export async function signin(data) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (data.email === VALID_CREDENTIALS.email && 
        data.password === VALID_CREDENTIALS.password && 
        data.org === VALID_CREDENTIALS.org) {
        
        sessionStorage.setItem(SESSION_KEY, 'true');
        return { success: true, message: "Signin success" };
    } else {
        sessionStorage.removeItem(SESSION_KEY);
        return {
            success: false,
            message: 'Invalid credentials. Please try again.'
        };
    }
}

export async function signout() {
    sessionStorage.removeItem(SESSION_KEY);
    return { ok: true, status: 200 };
}

export function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
}
