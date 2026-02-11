import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaGithub, FaGoogle } from 'react-icons/fa';
import { supabase } from '../../lib/supabaseClient';

const SignupForm = () => {
    const navigate = useNavigate();
    const [nameState, setNameState] = useState('');
    const [emailState, setEmailState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSocialLogin = async (provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/home`,
                },
            });

            if (error) throw error;
        } catch (err) {
            alert(err.message || 'An error occurred during social login');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const response = await fetch('https://rqqdmxvhhrxdghnhefmp.supabase.co/auth/v1/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': 'sb_publishable_uFkTNQBEEI5_cfWrKmSseQ_76imNDzP'
                },
                body: JSON.stringify({
                    email: emailState,
                    password: passwordState,
                    data: {
                        full_name: nameState
                    }
                })
            });

            const data = await response.json();
            console.log('Signup Response:', data, response.ok);

            if (!response.ok) {
                // Handle Supabase/GoTrue error formats
                throw new Error(data.msg || data.error_description || data.message || 'Signup failed');
            }

            if (data.access_token) {
                // Scenario 1: Email confirmation disabled (Session exists)
                // Action 1: Save the token
                localStorage.setItem('token', data.access_token);
                // Action 2: Save user data
                localStorage.setItem('user', JSON.stringify(data.user));
                // Action 3: Redirect immediately
                navigate('/dashboard');
            } else if (data.user && !data.access_token) {
                // Scenario 2: Email confirmation enabled (Session is null)
                setSuccessMessage('Account created! Please check your email to confirm your account.');
                setLoading(false);
                // Do NOT navigate
            } else {
                // Fallback for unexpected success state
                setSuccessMessage('Account created! Please check your email.');
                setLoading(false);
            }

        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message);
            setLoading(false);
        }
        // remove finally block because we handle loading state manually in success cases to prevent flash
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full w-full text-center">
            <h2 className="text-3xl font-bold mb-6 text-text-primary">REGISTER</h2>

            <div className="flex gap-4 mb-8">
                <button onClick={() => handleSocialLogin('google')} className="p-3 border border-border rounded-xl hover:bg-white/10 transition-colors"><FaGoogle className="w-6 h-6 text-text-primary" /></button>
                <button onClick={() => handleSocialLogin('facebook')} className="p-3 border border-border rounded-xl hover:bg-white/10 transition-colors"><FaFacebook className="w-6 h-6 text-text-primary" /></button>
                <button onClick={() => handleSocialLogin('github')} className="p-3 border border-border rounded-xl hover:bg-white/10 transition-colors"><FaGithub className="w-6 h-6 text-text-primary" /></button>
            </div>

            <p className="text-text-secondary text-sm mb-4">or use your email for registration</p>

            <form onSubmit={handleSignup} className="w-full max-w-sm flex flex-col gap-5">
                {successMessage && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-xl text-sm">
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Name"
                    value={nameState}
                    onChange={(e) => setNameState(e.target.value)}
                    required
                    className="w-full bg-secondary border border-border rounded-xl px-5 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors text-lg"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={emailState}
                    onChange={(e) => setEmailState(e.target.value)}
                    required
                    className="w-full bg-secondary border border-border rounded-xl px-5 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors text-lg"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={passwordState}
                    onChange={(e) => setPasswordState(e.target.value)}
                    required
                    className="w-full bg-secondary border border-border rounded-xl px-5 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors text-lg"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 px-8 py-4 bg-accent border border-accent text-white rounded-xl font-bold tracking-wider hover:bg-transparent hover:text-accent transition-all duration-300 uppercase text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default SignupForm;
