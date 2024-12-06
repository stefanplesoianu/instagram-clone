import React, { createContext, useState, useEffect } from 'react';
import { logout } from '../APIs/userAPI';
import { getProfile } from '../APIs/indexAPI';
import { getToken, getGuestToken, setToken, clearToken, setGuestToken, clearGuestToken } from '../utils/tokenManager';

export const YapContext = createContext();

export const YapProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [guestId, setGuestId] = useState(localStorage.getItem('guestId') || null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isFollowedByUser, setIsFollowedByUser] = useState([]); //had to move this here to prevent state update issues
    const [error, setError] = useState(null);
    //needed a default image because it disappeared a couple of times from my DB
    const defaultProfileImage = 'https://res.cloudinary.com/djdyyplbz/image/upload/v1729508109/abstract-user-flat-4_fkxupb.png';

    useEffect(() => {
        //check memory for tokens
        const token = getToken();
        const guestToken = getGuestToken();

        if (token) {
            setToken(token);
            localStorage.setItem('user', guestToken);
        } else if (guestToken) {
            setGuestId(guestToken);
            localStorage.setItem('guestId', guestToken);
        }
    }, []);

    const fetchCurrentUser = async () => {
        try {
            if (!user) return;
            const profile = await getProfile(user.id);
            setCurrentUser(profile);
            const followedUserIds = profile.following.map((follow) => follow.userId);
            setIsFollowedByUser(followedUserIds);
        } catch (error) {
            console.error("Could not load current user profile", error);
        }
    };

    //fetch a new user every time the user of the app changes
    useEffect(() => {
        fetchCurrentUser();
    }, [user]);

    const handleLogin = (token, user) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setGuestId(null);
        localStorage.removeItem('guestId');
        setToken(token);
        clearGuestToken();
    };

    const handleGuestLogin = (guestToken) => {
        setUser(null);
        setGuestId(guestToken);
        localStorage.setItem('guestId', guestToken);
        clearToken();
        setGuestToken(guestToken);
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            localStorage.removeItem('user');
            setGuestId(null);
            localStorage.removeItem('guestId');
            clearToken();
            clearGuestToken();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <YapContext.Provider value={{ 
            user, 
            guestId, 
            currentUser, 
            isFollowedByUser, 
            defaultProfileImage,
            handleLogin, 
            handleLogout, 
            handleGuestLogin, 
            fetchCurrentUser,
            error 
        }}>
            {children}
        </YapContext.Provider>
    );
};
