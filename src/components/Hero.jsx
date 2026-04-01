import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import NetworkBackground from './NetworkBackground';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <NetworkBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Sparkles size={16} className="text-purple-400" />
          <span className="text-xs font-semibold tracking-wider uppercase text-purple-200">Available for freelance work</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight"
        >
          Crafting <span className="gradient-text">Digital</span><br />
          Experiences.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          I'm a multidisciplinary designer and developer specializing in creating memorable brands, stunning websites, and compelling visual content.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary w-full sm:w-auto">View My Work</button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary w-full sm:w-auto">Contact Me</button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
