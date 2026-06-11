import React, { useState } from 'react';
import ChatBox from '../Componnets/ChatBox';

const CarSellLandingPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">CarFinder</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-600">How it Works</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Reviews</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Find Your Dream Car</span>
              <span className="block text-blue-600">Fast and Easy</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Browse our huge inventory of top-quality vehicles. We help you find the perfect car at the right price. No hassle, no stress.
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4">
              <button 
                onClick={toggleChat}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-colors shadow-md"
              >
                Chat with an Expert Now
              </button>
              <button className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:text-lg transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Features section could go here */}
      </main>

      {/* Floating Chat Button (optional, but good for UX) */}
      {!isChatOpen && (
        <button 
          onClick={toggleChat}
          className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-xl hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none z-50"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* ChatBox Component */}
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default CarSellLandingPage;
