import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        if (location.pathname === '/register' || location.pathname === '/signup') {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, [location.pathname]);

    const toggleAuth = () => {
        const newMode = !isLogin;
        setIsLogin(newMode);
        navigate(newMode ? '/login' : '/register');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary/20 backdrop-blur-sm p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full bg-primary -z-20"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple/20 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] -z-10"></div>

            {/* Main Container */}
            <div className="relative w-full max-w-[900px] min-h-[550px] bg-secondary border border-white/10 rounded-[30px] shadow-2xl overflow-hidden flex">

                {/* Left Side (Login Form Location) */}
                <div className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out ${isLogin ? 'opacity-100 z-20' : 'opacity-0 translate-x-[100%] z-10 pointer-events-none'}`}>
                    <LoginForm />
                </div>

                {/* Right Side (Signup Form Location) */}
                <div className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out ${!isLogin ? 'opacity-100 translate-x-[100%] z-20' : 'opacity-0 z-10 pointer-events-none'}`}>
                    <SignupForm />
                </div>

                {/* Overlay Container */}
                <div
                    className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50 rounded-l-[20px] ${isLogin ? 'translate-x-0 rounded-l-[20px]' : '-translate-x-full rounded-r-[20px] rounded-l-0'}`}
                >
                    <div className={`bg-gray-900 h-full w-[200%] text-white relative -left-full flex items-center justify-center transition-transform duration-700 ease-in-out ${isLogin ? 'translate-x-[50%]' : 'translate-x-0'}`}>

                        {/* Panel 1 (Left Side of Wrapper) - Shows "Register" message when Login is active */}
                        <div className="w-1/2 h-full flex flex-col items-center justify-center px-10 text-center">
                            <h1 className="text-4xl font-bold mb-4">Hello, Friend! <br /> Code Mentor AI</h1>
                            <p className="mb-8">Don't have an account yet?</p>
                            <button
                                onClick={toggleAuth}
                                className="px-8 py-3 bg-transparent border-2 border-white rounded-lg font-semibold tracking-wider hover:bg-white hover:text-primary transition-all uppercase"
                            >
                                Register
                            </button>
                        </div>

                        {/* Panel 2 (Right Side of Wrapper) - Shows "Login" message when Register is active */}
                        <div className="w-1/2 h-full flex flex-col items-center justify-center px-10 text-center">
                            <h1 className="text-4xl font-bold mb-4">Welcome Back! <br /> Code Mentor AI</h1>
                            <p className="mb-8">Already have an account?</p>
                            <button
                                onClick={toggleAuth}
                                className="px-8 py-3 bg-transparent border-2 border-white rounded-lg font-semibold tracking-wider hover:bg-white hover:text-primary transition-all uppercase"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Auth;
