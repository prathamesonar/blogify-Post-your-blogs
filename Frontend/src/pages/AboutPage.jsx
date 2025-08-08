import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to SocialApp</h2>
        <p className="text-gray-600 mb-4">
          SocialApp is a modern social media platform designed to connect people from all around the world. 
          Our mission is to create meaningful connections and foster communities through shared experiences.
        </p>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Story</h3>
        <p className="text-gray-600 mb-4">
          Founded in 2024, SocialApp started as a simple idea to bring people closer together. 
          We believe that everyone has a story to tell, and our platform provides the perfect space 
          to share those stories with the world.
        </p>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Values</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Community First - Building strong, supportive communities</li>
          <li>Innovation - Constantly improving user experience</li>
          <li>Privacy - Protecting user data and maintaining trust</li>
          <li>Inclusivity - Welcoming everyone regardless of background</li>
          <li>Authenticity - Encouraging genuine connections and real conversations</li>
        </ul>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">Join Our Community</h3>
        <p className="text-blue-700">
          Ready to start your journey with SocialApp? Sign up today and become part of our growing community!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
