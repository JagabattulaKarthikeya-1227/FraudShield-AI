import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Architecture' },
  { id: 'features', label: 'Features' },
  { id: 'explainability', label: 'Explainability' },
  { id: 'tech', label: 'Technology' },
];

export function StickyNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Section intersection observer logic
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/70 backdrop-blur-xl border-b border-border/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('hero')}>
          <div className="bg-primary/5 p-2 rounded-xl text-primary border border-primary/10">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-primary">FraudShield</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                activeSection === item.id ? 'text-primary' : 'text-muted-foreground hover:text-primary/80'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary/20 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Action */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden md:flex text-primary hover:bg-primary/5">Research</Button>
          <Button variant="default" className="rounded-xl shadow-sm h-10 px-5" asChild>
            <Link to="/dashboard">Sign In</Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
