import React, { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink, Image, Film } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const categories = ['All Work', 'Web Design', 'Video Editing', 'Photo Editing', 'Other'];

const Portfolio = () => {
  const [active, setActive] = useState('All Work');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
              <div
                key={project.id}
                className="glass rounded-2xl overflow-hidden group hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02]"
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
              </div>
            ))}
          </div>
        )}

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
