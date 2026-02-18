import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <nav className="w-full py-6 px-10 flex justify-between items-center bg-primary/80 backdrop-blur-md fixed top-0 z-50 border-b border-border">
            {/* Logo Logic: If logged in, do nothing. If logged out, link to / */}
            {user ? (
                <div className="text-accent text-2xl font-bold tracking-wider cursor-default select-none">
                    CodeMentor AI
                </div>
            ) : (
                <Link to="/" className="text-accent text-2xl font-bold tracking-wider hover:opacity-80 transition-opacity" onClick={() => window.scrollTo(0, 0)}>
                    CodeMentor AI
                </Link>
            )}

            <div className="flex items-center gap-8">
                <Link to="/" className="text-text-primary hover:text-accent font-medium transition-colors" onClick={() => window.scrollTo(0, 0)}>Home</Link>
                <a href="#contact" className="text-text-primary hover:text-accent font-medium transition-colors">contact us</a>

                {user ? (
                    <Link to="/dashboard" className="px-6 py-2 border border-accent bg-accent/10 rounded text-accent hover:bg-accent hover:text-white transition-all uppercase text-sm font-semibold tracking-wide">
                        Dashboard
                    </Link>
                ) : (
                    <Link to="/auth" className="px-6 py-2 border border-border rounded text-text-primary hover:bg-white hover:text-primary transition-all uppercase text-sm font-semibold tracking-wide">
                        Register
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
