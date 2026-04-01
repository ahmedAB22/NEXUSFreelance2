import React from 'react';
import { Layout } from 'lucide-react';

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Portfolio', id: 'portfolio' },
  { label: 'Contact', id: 'contact' },
];

const Header = () => {
  const handleScroll = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <nav className="max-w-7xl mx-auto glass rounded-full px-8 py-3 flex items-center justify-between">
        <button
          onClick={(e) => handleScroll(e, 'home')}
          className="flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
            <Layout size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">NEXUS</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleScroll(e, id)}
              className="text-sm font-medium hover:text-purple-400 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <button
          onClick={(e) => handleScroll(e, 'contact')}
          className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Get in Touch
        </button>
      </nav>
    </header>
  );
};

export default Header;
