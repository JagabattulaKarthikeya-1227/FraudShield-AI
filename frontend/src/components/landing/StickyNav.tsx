import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'platform', label: 'Platform' },
  { id: 'ai-engine', label: 'AI Engine' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'demo', label: 'Live Demo' },
  { id: 'pricing', label: 'Pricing', badge: 'Coming Soon' },
  { id: 'docs', label: 'Documentation' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export function StickyNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Hide nav on scroll down, show on scroll up
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    setIsScrolled(latest > 50);

    // Section intersection logic
    const sections = navItems.map(item => document.getElementById(item.id));
    const scrollPosition = latest + 200;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(navItems[i].id);
        break;
      }
    }
  });

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
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => scrollTo('hero')}>
          <img src="/logo.svg" alt="FraudShield AI Logo" className="w-6 h-6 dark:invert" />
          <span className="font-semibold text-lg tracking-tight text-primary">FraudShield</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                activeSection === item.id ? 'text-primary' : 'text-zinc-500 hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.label}
                {item.badge && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              {activeSection === item.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute left-3 right-3 -bottom-[1.2rem] h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden md:flex text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg h-9 px-4 text-sm font-medium transition-all" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="default" className="rounded-lg shadow-sm h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-all" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
