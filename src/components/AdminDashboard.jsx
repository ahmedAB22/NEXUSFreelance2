import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Image,
  Type,
  Tag,
  Link as LinkIcon,
  LogOut,
  FolderOpen,
  X,
  Upload,
  Film,
} from 'lucide-react';

const CATEGORIES = ['Web Design', 'Video Editing', 'Photo Editing', 'Other'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const screenshotInputRef = useRef(null);

  // Guard: redirect if not authenticated
  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') !== 'true') {
      navigate('/admin-login');
    }
  }, [navigate]);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Web Design',
    description: '',
    imageUrl: '',    // for Web Design projects
    mediaData: '',   // base64 data URL for preview
    mediaType: '',   // 'image' or 'video'
    mediaName: '',   // original file name
    mediaFile: null, // RAW FILE OBJECT FOR UPLOAD
    liveUrl: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const processFile = (file) => {
    setUploadError('');

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      setUploadError('Please upload an image or video file.');
      return;
    }

    // Higher limit for videos/photos (e.g. 200MB)
    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('File is too large. Please use files under 200MB for best performance.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((prev) => ({
        ...prev,
        mediaData: e.target.result,
        mediaType: isImage ? 'image' : 'video',
        mediaName: file.name,
        mediaFile: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearMedia = () => {
    setForm((prev) => ({ ...prev, mediaData: '', mediaType: '', mediaName: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadError('');

    let mediaUrl = '';

    try {
      // 1. Upload file to Supabase Storage if exists
      if (form.mediaFile) {
        const fileExt = form.mediaName.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`; // bucket is portfolio_media

        const { error: uploadError } = await supabase.storage
          .from('portfolio_media')
          .upload(filePath, form.mediaFile);

        if (uploadError) throw new Error('Upload failed: ' + uploadError.message);

        const { data: urlData } = supabase.storage
          .from('portfolio_media')
          .getPublicUrl(filePath);
        
        mediaUrl = urlData.publicUrl;
      }

      // 2. Insert into Database
      const { error: dbError } = await supabase
        .from('projects')
        .insert([{
          title: form.title,
          category: form.category,
          description: form.description,
          media_url: mediaUrl,
          media_type: form.mediaType,
          media_name: form.mediaName,
          live_url: form.liveUrl
        }]);

      if (dbError) throw new Error('Database save failed: ' + dbError.message);

      // 3. Cleanup and refresh
      setForm({ title: '', category: 'Web Design', description: '', imageUrl: '', mediaData: '', mediaType: '', mediaName: '', mediaFile: null, liveUrl: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setProjects(projects.filter((p) => p.id !== id));
    } else {
      setUploadError('Failed to delete: ' + error.message);
    }
    setDeleteConfirm(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to site</span>
          </button>

          <h1 className="text-lg font-bold tracking-tight">
            <span className="gradient-text">Admin</span> Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {['All', ...CATEGORIES].map((cat) => {
            const count =
              cat === 'All'
                ? projects.length
                : projects.filter((p) => p.category === cat).length;
            return (
              <div key={cat} className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-xs text-gray-500 mt-1">{cat}</p>
              </div>
            );
          })}
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Projects</h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage your portfolio projects
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-[0.97]"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? 'Cancel' : 'Add Project'}
          </button>
        </div>

        {/* Add Project Form */}
        {showForm && (
          <div className="glass rounded-2xl p-6 md:p-8 mb-10 border border-purple-500/20 animate-fade-in">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-purple-400" />
              New Project
            </h3>
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Type size={14} /> Title
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Project title"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Tag size={14} /> Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#09090b]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Type size={14} /> Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of the project"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all resize-none"
                />
              </div>

              {/* Website Link (Only for Web Design) */}
              {form.category === 'Web Design' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <LinkIcon size={14} /> Website Link
                  </label>
                  <input
                    type="url"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://project-link.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>
              )}

              {/* Upload Media (For all projects) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Upload size={14} /> {form.category === 'Web Design' ? 'Upload Website Screenshot' : 'Upload Image or Video'}
                </label>

                {!form.mediaData ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 p-10 text-center ${
                      isDragging
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-purple-500/40 hover:bg-white/5'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-purple-600/10 flex items-center justify-center">
                        <Upload size={24} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {isDragging ? 'Drop your file here' : 'Drag & drop or click to browse'}
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          Supports images (JPG, PNG, GIF, WebP) and videos (MP4, WebM) — max 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Preview */
                  <div className="relative rounded-xl overflow-hidden border border-white/10">
                    {form.mediaType === 'image' ? (
                      <img
                        src={form.mediaData}
                        alt="Preview"
                        className="w-full h-52 object-cover"
                      />
                    ) : (
                      <video
                        src={form.mediaData}
                        className="w-full h-52 object-cover"
                        controls
                        muted
                      />
                    )}
                    {/* File info + remove */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-black/60 backdrop-blur-sm text-white flex items-center gap-1">
                        {form.mediaType === 'video' ? <Film size={12} /> : <Image size={12} />}
                        {form.mediaType}
                      </span>
                      <button
                        type="button"
                        onClick={clearMedia}
                        className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-black/60 backdrop-blur-sm">
                      <p className="text-white text-xs truncate">{form.mediaName}</p>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                    {uploadError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-[0.98] ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? 'Uploading...' : 'Add Project'}
              </button>
            </form>
          </div>
        )}

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="glass rounded-2xl flex flex-col items-center justify-center py-20">
            <FolderOpen size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg font-medium">No projects yet</p>
            <p className="text-gray-600 text-sm mt-1">Click "Add Project" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass rounded-2xl overflow-hidden group hover:border-purple-500/30 transition-all duration-300 relative"
              >
                {/* Media */}
                <div className="h-44 bg-gradient-to-br from-purple-900/30 to-blue-900/30 relative overflow-hidden">
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
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <Image size={36} />
                    </div>
                  )}
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full bg-purple-600/80 backdrop-blur-sm text-white">
                    {project.category}
                  </span>
                  {/* Media type badge */}
                  {project.media_type === 'video' && (
                    <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded bg-black/60 backdrop-blur-sm text-white flex items-center gap-1">
                      <Film size={10} /> VIDEO
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h4 className="font-bold text-white text-lg mb-1">{project.title}</h4>
                  {project.description && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{project.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1 transition-colors"
                      >
                        <LinkIcon size={14} /> Visit
                      </a>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(project.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors ml-auto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Delete Confirm Overlay */}
                {deleteConfirm === project.id && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-2xl z-10">
                    <p className="text-white font-medium">Delete this project?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-500 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
