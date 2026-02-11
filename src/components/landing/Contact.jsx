import React from 'react';
import { Facebook, Instagram, Github, X } from 'lucide-react';

const Contact = () => {
    return (
        <footer id="contact" className="py-20 px-20 bg-primary border-t border-white/5 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/30 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-text-primary mb-12 uppercase tracking-wide">Contact Us</h2>

                <form className="grid grid-cols-2 gap-6 mb-12">
                    <input type="text" placeholder="Name" className="bg-secondary border border-border rounded px-4 py-3 text-text-primary focus:border-accent outline-none transition-colors" />
                    <input type="email" placeholder="E-mail" className="bg-secondary border border-border rounded px-4 py-3 text-text-primary focus:border-accent outline-none transition-colors" />

                    <input type="tel" placeholder="Phone" className="bg-secondary border border-border rounded px-4 py-3 text-text-primary focus:border-accent outline-none transition-colors" />
                    <input type="text" placeholder="Subject" className="bg-secondary border border-border rounded px-4 py-3 text-text-primary focus:border-accent outline-none transition-colors" />

                    <textarea placeholder="Message" rows="6" className="col-span-2 bg-secondary border border-border rounded px-4 py-3 text-text-primary focus:border-accent outline-none transition-colors resize-none"></textarea>

                    <div className="col-span-2 flex justify-end">
                        <button className="px-12 py-3 border border-border text-text-primary rounded hover:bg-text-primary hover:text-white transition-colors uppercase tracking-wider text-sm font-semibold">
                            Done
                        </button>
                    </div>
                </form>

                <div className="flex justify-between items-center border-t border-white/5 pt-8">
                    <div className="flex gap-6">
                        <a href="#" className="p-2 bg-secondary border border-border text-text-primary rounded hover:bg-accent hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                        <a href="#" className="p-2 bg-secondary border border-border text-text-primary rounded hover:bg-accent hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="p-2 bg-secondary border border-border text-text-primary rounded hover:bg-accent hover:text-white transition-colors"><X className="w-5 h-5" /></a>
                        <a href="#" className="p-2 bg-secondary border border-border text-text-primary rounded hover:bg-accent hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                    </div>

                    <p className="text-text-secondary text-xs">Copyright CodeMentor AI</p>
                </div>
            </div>
        </footer>
    );
};

export default Contact;
