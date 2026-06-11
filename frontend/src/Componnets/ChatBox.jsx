import React, { useState, useEffect } from 'react';

import { backendurl } from '../Url';

const ChatBox = ({ isOpen, onClose }) => {

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const Handleclick_searchcars = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    setMessages((prevMessages) => [...prevMessages, { text: currentInput, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${backendurl}/api/cars/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: currentInput }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessages((prev) => [...prev, {
          text: data.error || "Sorry, I encountered an error while searching. Please try again.",
          sender: 'bot'
        }]);
        return;
      }

      let botText = data.reply || `Found ${data.matchedCarsCount || 0} cars matching your criteria.`;
      setMessages((prev) => [...prev, {
        text: botText,
        sender: 'bot',
        cars: data.carDetails || []
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Network error. Make sure the backend is running.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden h-[80vh] md:h-[70vh]">
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <h3 className="font-semibold text-2xl">Chat with an Expert</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-xl p-4 text-lg max-w-[80%]">
              Hello! How can we help you find your next car today?
            </div>
          </div>
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-xl p-4 text-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p>{msg.text}</p>
                {msg.cars && msg.cars.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {msg.cars.map(car => (
                      <div key={car._id} className="bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-800 shadow-sm">
                        <div className="font-bold text-base text-blue-600">{car.make} {car.model}</div>
                        <div className="font-medium">{car.variant}</div>
                        <div className="mt-1 font-semibold">${car.price?.toLocaleString()}</div>
                        <div className="text-gray-500 text-xs mt-1 flex flex-wrap gap-1">
                          <span className="bg-gray-100 px-2 py-1 rounded">{car.mileage} MPG</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">{car.fueltype}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">{car.bodytype}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start flex-col items-start">
              <div className="rounded-xl p-4 text-lg max-w-[80%] bg-gray-200 text-gray-800">
                <p className="animate-pulse">Searching...</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  Handleclick_searchcars();
                }
              }}
              className="flex-1 border border-gray-300 rounded-full px-6 py-4 text-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button
              onClick={Handleclick_searchcars}
              disabled={isLoading}
              className="bg-blue-600 text-white rounded-full p-4 hover:bg-blue-700 transition-colors focus:outline-none flex items-center justify-center disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
