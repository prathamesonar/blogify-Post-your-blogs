import React from 'react';
import Header from '../components/Header';
import { PenTool, Users, Target, Heart, Shield, Lightbulb, Globe, Award, Mail, Phone, MapPin, Send, MessageCircle, Clock, Users, Heart, Github } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <PenTool className="h-16 w-16 text-indigo-200" />
          </div>
          <h1 className="text-5xl font-bold mb-6">About Blogify</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Empowering writers and creators to share their stories with the world through our innovative blogging platform.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        
        <div className="bg-indigo-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-indigo-900 mb-4">Join Our Growing Community</h3>
          <p className="text-indigo-700 text-lg mb-6 max-w-2xl mx-auto">
            Ready to start your blogging journey with Blogify? Join thousands of writers who trust us 
            to help them share their stories with the world.
          </p>
         
        </div>
      </div>
       <footer className="bg-gray-900 border-t border-gray-800">
  <div className="max-w-6xl mx-auto px-4 py-6">
    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
      {/* Left side - Copyright */}
      <div className="text-gray-400 text-sm">
        © 2025 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 font-semibold">Blogify</span>. All rights reserved.
      </div>
      
      {/* Right side - Developer Credit */}
      <div className="flex items-center space-x-2 text-gray-400 text-sm">
        <span>Built with</span>
        <Heart className="h-4 w-4 text-red-500 fill-current" />
        <span>by</span>
        <a 
          href="https://github.com/prathamesonar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center space-x-1 transition-colors"
        >
          <span>Prathamesh Sonar</span>
          <Github className="h-4 w-4" />
        </a>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
};

export default AboutPage;
