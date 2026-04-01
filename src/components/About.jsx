import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import portrait from '../assets/portrait.png';

const About = () => {
  const imageRef = useRef(null);
  const isImageInView = useInView(imageRef, { margin: "-150px" });

  const skills = [
    'UI/UX Design', 'Full Stack Development', 'HTML, CSS & JS', 'React & Node.js', 
    'Video Editing', 'After Effects', 'Photoshop', 
    'Canva', 'Figma', 'Branding'
  ];

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div ref={imageRef} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10">
            <img 
              src={portrait} 
              alt="Portrait" 
              className={`w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${isImageInView ? 'grayscale-0' : 'grayscale'}`} 
            />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            About me
          </h2>
          <div className="text-gray-400 text-lg mb-10 leading-relaxed space-y-4">
            <p>
              I’m a passionate and versatile freelancer specializing in full-stack development, creative design, and multimedia editing. I build modern, responsive, and high-performing websites, handling both front-end and back-end development with a strong focus on user experience and clean code. Alongside development, I work as a designer, creating visually appealing interfaces, brand identities, and engaging digital content.
            </p>
            <p>
              I also have solid experience in photo and video editing, where I bring ideas to life through high-quality visuals, smooth transitions, and professional storytelling. My skills in branding allow me to help businesses build strong, consistent identities that stand out in today’s competitive market.
            </p>
            <p>
              I’m always learning and adapting to new trends and technologies, which helps me deliver creative, effective, and up-to-date solutions. Whether it’s building a website from scratch, designing a brand, or editing visual content, I aim to provide work that is both impactful and tailored to each client’s vision.
            </p>
          </div>
          
          <h3 className="text-xl font-bold mb-6">Core Skills</h3>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span key={index} className="px-4 py-2 rounded-full glass text-sm font-medium hover:border-purple-500/50 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
