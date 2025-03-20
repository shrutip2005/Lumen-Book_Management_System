
import React from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-4 px-6 border-t mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <p>Created by Shruti Pethe</p>
        <a 
          href="https://github.com/shrutip2005" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-foreground transition-colors mt-2 md:mt-0"
        >
          <Github size={16} />
          <span>github.com/shrutip2005</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
