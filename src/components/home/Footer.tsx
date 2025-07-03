
import React from 'react';
import { BookOpen, Linkedin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="redesign-footer">
      <div className="redesign-container">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
          {/* Brand Section - Left Side */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-amber-400" />
              <span className="text-2xl font-bold text-white">Tale Forge</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Where every word weaves worlds, every choice crafts destiny, and every story becomes legend.
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/kevin-el-zarka-92bb5b260/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="redesign-sr-only">LinkedIn</span>
              </a>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-sm">Support us: <span className="text-amber-400">@zinfinityhs</span></p>
            </div>
          </div>

          {/* Support Section - Right Side */}
          <div className="space-y-4 flex-1 lg:max-w-md">
            <h3 className="text-xl font-semibold text-white">A Solo Endeavor</h3>
            <p className="text-gray-400 leading-relaxed">
              Tale Forge is a self-funded project driven by a passion for storytelling. If you enjoy the experience, any support is greatly appreciated and helps fuel future development.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <a 
                  href="https://www.linkedin.com/in/kevin-el-zarka-92bb5b260/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  Connect on LinkedIn
                </a>
              </Button>
              <Button
                asChild
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              >
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  💝 Support on PayPal
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>© {currentYear} Tale Forge. Made with</span>
              <Heart className="h-4 w-4 text-red-400 fill-red-400" />
              <span>by storytellers, for storytellers.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
