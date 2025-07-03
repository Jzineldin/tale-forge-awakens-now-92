import React from 'react';
import { Wand2, MessageSquare, BookOpen, Sparkles, Volume2, Users, GraduationCap, Shield } from 'lucide-react';

const FeatureShowcase: React.FC = () => {
  const steps = [
    {
      icon: Wand2,
      title: "Choose Genre",
      description: "Select from educational, adventure, fantasy, and more storytelling modes"
    },
    {
      icon: MessageSquare,
      title: "Share Your Idea",
      description: "Describe your story concept and our AI will craft a personalized beginning"
    },
    {
      icon: BookOpen,
      title: "Make Choices",
      description: "Guide your story's direction through interactive decision points"
    },
    {
      icon: Sparkles,
      title: "Experience Stories",
      description: "Watch your narrative unfold with AI-generated text and images"
    }
  ];

  const features = [
    {
      icon: GraduationCap,
      title: "Educational Focus",
      description: "Perfect for classrooms and learning environments"
    },
    {
      icon: Shield,
      title: "Safe Content",
      description: "AI-moderated stories appropriate for all ages"
    },
    {
      icon: Volume2,
      title: "Audio Narration",
      description: "Professional voice acting (coming soon)"
    },
    {
      icon: Users,
      title: "Share Stories",
      description: "Collaborate and share with friends and family"
    }
  ];

  return (
    <div className="bg-slate-50 py-16">
      {/* How It Works Section */}
      <section className="px-4 mb-16" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-serif font-bold text-slate-800">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Creating personalized interactive stories is simple and engaging
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-4 group">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800 font-serif">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-serif font-bold text-slate-800">
              Perfect for Education & Creativity
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Designed with safety, learning, and imagination in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4 group">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800 font-serif">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeatureShowcase;