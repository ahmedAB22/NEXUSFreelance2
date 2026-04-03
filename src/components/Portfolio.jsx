import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Image, Film, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const categories = ['All Work', 'Web Design', 'Video Editing', 'Photo Editing', 'Other'];

const Portfolio = () => {
  const [active, setActive] = useState('All Work');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();

    // Set up real-time subscription
    const channel = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Keyboard support for ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProject]);

  const filtered =
    active === 'All Work' ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="portfolio" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">My projects</h2>
            <p className="text-gray-400 max-w-sm">
              A curated selection of my latest projects spanning web design, video production, and visual branding.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                onMouseEnter={() => setActive(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  active === cat
                    ? 'bg-purple-600 text-white'
                    : 'glass text-gray-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid or Empty State */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl flex items-center justify-center py-24">
            <p className="text-gray-400 text-base">No projects found in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <motion.div
                layout
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="glass rounded-2xl overflow-hidden group hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                {/* Media */}
                <div className="h-52 bg-gradient-to-br from-purple-900/20 to-blue-900/20 relative overflow-hidden">
                  {project.media_url ? (
                    project.media_type === 'video' ? (
                      <video
                        src={project.media_url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                      />
                    ) : (
                      <img
                        src={project.media_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <Image size={40} />
                    </div>
                  )}

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full bg-purple-600/80 backdrop-blur-sm text-white">
                    {project.category}
                  </span>

                  {/* Video Badge */}
                  {project.media_type === 'video' && (
                    <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded bg-black/60 backdrop-blur-sm text-white flex items-center gap-1">
                      <Film size={10} /> VIDEO
                    </span>
                  )}

                  {/* Hover overlay with link */}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    >
                      <span className="flex items-center gap-2 text-white font-medium text-sm bg-purple-600 px-4 py-2 rounded-full hover:bg-purple-500 transition-colors">
                        <ExternalLink size={16} /> View Project
                      </span>
                    </a>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h4 className="font-bold text-white text-lg mb-1 group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </h4>
                  {project.description && (
                    <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox / Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8"
            >
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setSelectedProject(null);
                  setCurrentMediaIndex(0);
                }}
                className="absolute inset-0 bg-black/95 backdrop-blur-sm"
              />

              {/* Content Card */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-6xl bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 flex flex-col lg:flex-row min-h-[500px]"
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setCurrentMediaIndex(0);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all z-50"
                >
                  <X size={20} />
                </button>

                {/* Media Section (Carousel) */}
                <div className="w-full lg:w-3/4 bg-black flex items-center justify-center relative group/modal">
                  {(() => {
                    const items = selectedProject.media_items && selectedProject.media_items.length > 0 
                      ? selectedProject.media_items 
                      : [{ url: selectedProject.media_url, type: selectedProject.media_type }];
                    
                    const item = items[currentMediaIndex];
                    
                    return (
                      <>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${selectedProject.id}-${currentMediaIndex}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full flex items-center justify-center"
                          >
                            {item.url ? (
                              item.type === 'video' ? (
                                <video
                                  src={item.url}
                                  className="w-full h-auto max-h-[70vh] lg:max-h-[85vh]"
                                  controls
                                  autoPlay
                                />
                              ) : (
                                <img
                                  src={item.url}
                                  alt={selectedProject.title}
                                  className="w-full h-auto max-h-[70vh] lg:max-h-[85vh] object-contain select-none"
                                />
                              )
                            ) : (
                              <div className="p-20 text-gray-700 text-center">
                                <Image size={64} className="mx-auto mb-4" />
                                <p>No preview available</p>
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        {items.length > 1 && (
                          <>
                            <button
                              onClick={() => setCurrentMediaIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all opacity-0 group-hover/modal:opacity-100 z-30"
                            >
                              <ChevronLeft size={24} />
                            </button>
                            <button
                              onClick={() => setCurrentMediaIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all opacity-0 group-hover/modal:opacity-100 z-30"
                            >
                              <ChevronRight size={24} />
                            </button>

                            {/* Pagination Dots */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                              {items.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentMediaIndex(idx)}
                                  className={`w-2 h-2 rounded-full transition-all ${idx === currentMediaIndex ? 'bg-purple-500 w-6' : 'bg-white/30 hover:bg-white/50'}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Info Section */}
                <div className="w-full lg:w-1/4 p-8 md:p-10 flex flex-col bg-zinc-900 border-l border-white/5 shadow-2xl relative z-10">
                  <div className="mb-auto">
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 text-xs font-bold mb-4 uppercase tracking-widest leading-none">
                      {selectedProject.category}
                    </span>
                    <h3 className="text-3xl font-black text-white mb-4">
                      {selectedProject.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {selectedProject.description || "No description provided for this masterpiece."}
                    </p>
                  </div>

                  <div className="pt-8 mt-8 border-t border-white/5">
                    {selectedProject.live_url ? (
                      <a
                        href={selectedProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-purple-500 transition-all transform active:scale-95 shadow-lg shadow-purple-500/20"
                      >
                        Visit Project
                        <ExternalLink size={18} />
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedProject(null);
                          setCurrentMediaIndex(0);
                        }}
                        className="w-full py-4 rounded-xl bg-white/5 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                      >
                        Close Preview
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All Button */}
        {projects.length > 0 && (
          <div className="flex justify-center mt-12">
            <button className="btn-secondary flex items-center gap-2 group">
              View All Projects
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
