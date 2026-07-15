import React from 'react';
import {
  GraduationCap,
  Database,
  BrainCircuit,
  ShieldCheck } from
'lucide-react';
export const AboutPage: React.FC = () => {
  const features = [
  {
    icon: BrainCircuit,
    title: 'AI-Powered Assistance',
    description:
    'Powered by advanced language models to provide accurate, context-aware answers to your physics queries.'
  },
  {
    icon: Database,
    title: 'Vector Knowledge Base',
    description:
    'AI-powered semantic search over official Department of Physics resources, providing reliable and relevant answers from indexed content.'
  },
  {
    icon: GraduationCap,
    title: 'Student-Centric Design',
    description:
    'Built specifically for USJ Physics students to streamline their academic experience.'
  },
  {
    icon: ShieldCheck,
    title: 'Reliable Information',
    description:
    'Ensures that all academic information provided is verified and sourced from official department records.'
  }];

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl border border-border p-8 md:p-12 shadow-sm text-center mb-12">
        <img
          src="/images.png"
          alt="University of Sri Jayewardenepura crest"
          className="w-24 h-24 object-contain mx-auto mb-6" />
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          USJ Physics Department AI Assistant
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A smart, conversational interface designed to help students navigate
          their academic journey at the University of Sri Jayewardenepura.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) =>
        <div
          key={index}
          className="bg-card p-6 rounded-xl border border-border shadow-sm">
          
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>Version 1.0.0 • Developed for USJ Physics Department</p>
      </div>
    </div>);

};