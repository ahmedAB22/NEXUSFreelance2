import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Video, Image, Palette, Globe, Layers } from 'lucide-react';

const Services = () => {
  const services = [
    { title: 'Web Design', icon: <Layout />, desc: 'Modern and responsive websites built with the latest technologies.' },
    { title: 'Video Editing', icon: <Video />, desc: 'High-quality video content production for brands and creators.' },
    { title: 'UI/UX Design', icon: <Palette />, desc: 'User-centric interface designs that deliver exceptional experiences.' },
    { title: 'Brand Identity', icon: <Globe />, desc: 'Cohesive branding strategies that make your business stand out.' },
    { title: 'Graphic Design', icon: <Image />, desc: 'Visual assets for social media, marketing, and physical print.' },
    { title: 'Motion Graphics', icon: <Layers />, desc: 'Engaging animations that bring your digital products to life.' }
  ];

  return (
    <section id="services" className="py-32 px-6 bg-[#0c0c0e]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-4">What I Do</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Helping businesses grow by providing top-notch creative services.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                {React.cloneElement(service.icon, { size: 24 })}
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
