import React from 'react';
import { Facebook, Instagram, Github, X } from 'lucide-react';

const SignupForm = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 h-full w-full text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">REGISTER</h2>

            <div className="flex gap-4 mb-8">
                <a href="#" className="p-3 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"><Facebook className="w-6 h-6 text-white" /></a>
                <a href="#" className="p-3 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"><Instagram className="w-6 h-6 text-white" /></a>
                <a href="#" className="p-3 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"><X className="w-6 h-6 text-white" /></a>
                <a href="#" className="p-3 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"><Github className="w-6 h-6 text-white" /></a>
            </div>

            <p className="text-text-secondary text-sm mb-4">or use your email for registration</p>

            <form className="w-full max-w-sm flex flex-col gap-5">
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-text-secondary focus:outline-none focus:border-accent transition-colors text-lg"
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-text-secondary focus:outline-none focus:border-accent transition-colors text-lg"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-secondary/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-text-secondary focus:outline-none focus:border-accent transition-colors text-lg"
                />

                <button
                    type="button"
                    onClick={() => window.location.href = '/dashboard'}
                    className="mt-8 px-8 py-4 bg-secondary border border-white/20 text-white rounded-xl font-bold tracking-wider hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 uppercase text-lg">
                    Register
                </button>
            </form>
        </div>
    );
};

export default SignupForm;
