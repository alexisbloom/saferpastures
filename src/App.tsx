import React, { useState } from 'react';
import { Brain, Heart, Coffee, Cigarette, Wine, ShoppingBag, Cookie, MessageSquareHeart, Send } from 'lucide-react';
import { getChatGPTResponse } from './lib/openai';

interface CravingType {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const cravingTypes: CravingType[] = [
  {
    id: 'food',
    icon: <Cookie className="w-8 h-8" />,
    label: 'Food',
    description: 'Dealing with food cravings'
  },
  {
    id: 'shopping',
    icon: <ShoppingBag className="w-8 h-8" />,
    label: 'Shopping',
    description: 'Managing shopping urges'
  },
  {
    id: 'alcohol',
    icon: <Wine className="w-8 h-8" />,
    label: 'Alcohol',
    description: 'Support for alcohol cravings'
  },
  {
    id: 'smoking',
    icon: <Cigarette className="w-8 h-8" />,
    label: 'Smoking',
    description: 'Help with nicotine cravings'
  },
  {
    id: 'caffeine',
    icon: <Coffee className="w-8 h-8" />,
    label: 'Caffeine',
    description: 'Managing caffeine dependency'
  },
  {
    id: 'other',
    icon: <Brain className="w-8 h-8" />,
    label: 'Other',
    description: 'Support for other cravings'
  }
];

function App() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCravingSelect = (id: string) => {
    setSelectedType(id);
    setShowChat(true);
    setMessages([{
      role: 'assistant',
      content: `I'm here to help you with your ${id} cravings. How are you feeling right now?`
    }]);
  };

  const resetSelection = () => {
    setSelectedType(null);
    setShowChat(false);
    setMessages([]);
    setInputMessage('');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedType) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getChatGPTResponse(selectedType, userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">Craving Coach</h1>
          </div>
          <p className="text-lg text-gray-600">Immediate support when you need it most</p>
        </header>

        {!showChat ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
              What are you experiencing right now?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cravingTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleCravingSelect(type.id)}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="text-purple-600 mb-3">{type.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{type.label}</h3>
                    <p className="text-gray-600 text-sm">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Chat Support</h2>
              <button
                onClick={resetSelection}
                className="text-purple-600 hover:text-purple-800"
              >
                ← Back
              </button>
            </div>
            
            <div className="h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
                      Typing...
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-purple-600 text-white rounded-lg p-2 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;