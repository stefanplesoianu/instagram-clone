/* 
given the size of the application and that it will not have more than one user at a time, i chose to 
store tokens here for accessibility.
*/ 

const TOKEN_KEY = 'authToken'; // key name for user tokens to be saved in the local storage
const GUEST_TOKEN_KEY = 'guestToken'; // the name of the key saved in the local storage for guest tokens

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const setGuestToken = (token) => {
    localStorage.setItem(GUEST_TOKEN_KEY, token);
};

export const getGuestToken = () => {
    return localStorage.getItem(GUEST_TOKEN_KEY);
};

export const clearGuestToken = () => {
    localStorage.removeItem(GUEST_TOKEN_KEY);
};