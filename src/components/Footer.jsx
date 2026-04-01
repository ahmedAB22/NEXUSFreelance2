import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Layout, Mail, Facebook } from 'lucide-react';

const WhatsAppIcon = ({ size = 20, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                <Layout size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">NEXUS</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              A creative design and development studio focused on building premium digital experiences for forward-thinking brands.
            </p>
            <div className="flex gap-4">
              <a href="mailto:freelancenexus99@gmail.com" aria-label="Email Me" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-all text-gray-400">
                <Mail size={18} />
              </a>
              <a href="https://wa.me/96744413" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-all text-gray-400">
                <WhatsAppIcon size={18} />
              </a>
              <a href="https://www.instagram.com/nexusfreelancers/" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-all text-gray-400">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61576528306484" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-all text-gray-400">
                <Facebook size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Links</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#home" className="hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-purple-400 transition-colors">About</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Services</a></li>
              <li><a href="#portfolio" className="hover:text-purple-400 transition-colors">Portfolio</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>© 2024 NEXUS Studio. All rights reserved.</p>
          <button
            id="admin-portal-btn"
            onClick={() => navigate('/admin-login')}
            className="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase border border-purple-500/40 text-purple-400 rounded-full hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300"
          >
            Admin Portal
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
