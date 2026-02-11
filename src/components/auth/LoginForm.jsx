import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaGithub, FaGoogle } from 'react-icons/fa';
import { supabase } from '../../lib/supabaseClient';

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('https://rqqdmxvhhrxdghnhefmp.supabase.co/auth/v1/token?grant_type=password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': 'sb_publishable_uFkTNQBEEI5_cfWrKmSseQ_76imNDzP'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error_description || data.msg || 'Login failed');
            }

            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/home');
            } else {
                throw new Error('No access token received');
            }

        } catch (err) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full w-full text-center">
            <h2 className="text-3xl font-bold mb-6 text-text-primary">LOGIN</h2>

            <div className="flex gap-4 mb-8">
                <button onClick={() => handleSocialLogin('google')} className="p-3 border border-border rounded-xl hover:bg-white/10 transition-colors"><FaGoogle className="w-6 h-6 text-text-primary" /></button>
                <button onClick={() => handleSocialLogin('facebook')} className="p-3 border border-border rounded-xl hover:bg-white/10 transition-colors"><FaFacebook className="w-6 h-6 text-text-primary" /></button>
                <button onClick={() => handleSocialLogin('github')} className="p-3 border border-border rounded-xl hover:bg-white/10 transition-colors"><FaGithub className="w-6 h-6 text-text-primary" /></button>
            </div>

            <p className="text-text-secondary text-sm mb-4">or use your email password</p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-5">
                {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-5 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors text-lg"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-5 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors text-lg"
                    required
                />

                <a href="#" className="text-text-secondary text-sm hover:text-accent mt-2">Forget password ?</a>

                <button
                    type="submit"
                    className="mt-6 px-8 py-4 bg-transparent border border-accent text-accent rounded-xl font-bold tracking-wider hover:bg-accent hover:text-primary transition-all duration-300 uppercase text-lg">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
