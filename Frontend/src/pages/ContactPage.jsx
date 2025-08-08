import React from 'react';

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-4">
          We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, we're here to help.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Information</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: <a href="mailto:info@socialapp.com" className="text-blue-600 hover:text-blue-800">info@socialapp.com</a></li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Social Street, Social City, SC 12345</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Form</h3>
            <p className="text-gray-600">
              Ready to start your journey with SocialApp? Sign up today and become part of our growing community!
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Get in Touch</h3>
          <p className="text-gray-600">
            Ready to start your journey with SocialApp? Sign up today and become part of our growing community!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
