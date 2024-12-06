import React, { useContext, useState } from "react";
import { userLogin, guestLogin } from '../APIs/indexAPI';
import { YapContext } from "./Context";
import { useNavigate } from "react-router-dom";
import '../Styles/Login.css';

const Login = ({ toggleForm }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { handleLogin, handleGuestLogin, guestId } = useContext(YapContext);
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await userLogin(username, password);
            if (response.token && response.user) {
                handleLogin(response.token, response.user); 
                navigate('/');
            } else {
                setError('Unexpected response format from server.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Invalid username or password');
        }
    };

    const handleFormGuestLogin = async () => {
        try {
            const response = await guestLogin();
            if (response.token) {
                handleGuestLogin(response.token);
                navigate('/');
            } else {
                setError('Unexpected response format from server.');
            }
        } catch (error) {
            console.error('Guest login error:', error);
            setError('Could not log in as guest, try again.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {!guestId && (
                <>
                    <p>Don't have an account? <a href="#" onClick={toggleForm}>Register here</a>.</p>
                    <p>Log in as a <a href="#" onClick={handleFormGuestLogin}>guest</a></p>
                </>
            )}
        </div>
    );
};

export default Login;
