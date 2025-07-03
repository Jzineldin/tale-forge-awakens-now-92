
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, BookOpen, Wand2 } from 'lucide-react';
import { Linkedin } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 px-4 relative" id="about">
      {/* Clean background without purple overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)]"></div>
      
      <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
        {/* Header with enhanced styling */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Wand2 className="h-10 w-10 text-amber-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg font-heading">
              About Tale Forge
            </h2>
            <BookOpen className="h-10 w-10 text-purple-400" />
          </div>
          
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Main content with better contrast */}
        <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl">
          <p className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-4xl mx-auto mb-8 font-body">
            Tale Forge is an <span className="text-amber-300 font-semibold">innovative platform</span> that combines 
            artificial intelligence with interactive storytelling to create truly personalized narrative experiences.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white font-heading">AI-Powered</h3>
              <p className="text-gray-300 text-sm font-body">Advanced AI generates rich, contextual narratives</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-purple-400/20 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white font-heading">Interactive</h3>
              <p className="text-gray-300 text-sm font-body">Your choices shape the story's direction</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto">
                <Wand2 className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white font-heading">Immersive</h3>
              <p className="text-gray-300 text-sm font-body">Rich visuals and dynamic storytelling</p>
            </div>
          </div>

          <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto font-body">
            Built with modern web technologies, Tale Forge adapts to your imagination, 
            creating unique adventures that evolve with every choice you make.
          </p>
        </div>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            className="bg-[#0077B5] hover:bg-[#005885] text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all font-body" 
          >
            <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-3 h-5 w-5" />
              Connect on LinkedIn
            </a>
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 text-lg rounded-xl backdrop-blur-sm transition-all font-body"
          >
            <a href="https://paypal.me/zinfinityhs" target="_blank" rel="noopener noreferrer">
              <Heart className="mr-3 h-5 w-5" />
              Support on PayPal
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
