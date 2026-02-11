import React from 'react';
import { motion } from 'framer-motion';

const FeatureSection = ({ title, description, icon: Icon, imageContent, reversed = false }) => {
    return (
        <section className={`py-24 px-20 flex items-center justify-between relative ${reversed ? 'flex-row-reverse' : ''}`}>

            {/* Decor Line */}
            <div className={`absolute top-0 w-full h-[100px] -z-10 ${reversed ? 'bg-gradient-to-bl' : 'bg-gradient-to-br'} from-secondary to-primary transform -skew-y-2`}></div>

            <div className={`w-1/2 ${reversed ? 'pl-20' : 'pr-20'}`}>
                {Icon && (
                    <div className="w-16 h-16 bg-text-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <Icon className="w-8 h-8 text-text-primary" />
                    </div>
                )}
                <h2 className="text-3xl font-bold text-text-primary mb-6 leading-relaxed">
                    {title}
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed">
                    {description}
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, x: reversed ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="w-1/2 flex justify-center"
            >
                {/* Feature Card Visual */}
                <div className="w-[400px] h-[400px] bg-[#0f1120] rounded-2xl border border-purple/30 shadow-2xl relative flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-primary/80 pointer-events-none"></div>

                    {/* Header inside card */}
                    <h3 className="text-accent text-2xl font-bold mb-4 z-10">CodeMento AI</h3>

                    {/* Dynamic Content Area */}
                    <div className="z-10 w-full h-full flex items-center justify-center">
                        {imageContent}
                    </div>

                    <div className="z-10 mt-auto">
                        <p className="text-sm text-text-secondary">Your personal AI coding guide.</p>
                        <p className="text-sm text-text-secondary">Level up your skills.</p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default FeatureSection;
