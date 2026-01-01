import { Music } from 'lucide-react';
import Login from '../ui/Login';
import { useState } from 'react';
import Signup from '../ui/Signup';

export default function ConcertDiscoveryApp () {
  const [modalType, setModalType] = useState<"login" | "signup" | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Jeopardy!
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Login bro please.... login and give me your information i can be trusted with it</p>
        </header>

        {/* User Profile Header */}
      
        <Login modalType={modalType} setModalType={setModalType}></Login>

        <Signup modalType={modalType} setModalType={setModalType} />
     

        {/* Login Button */}
        
        <div className="text-center mb-12">
          <button
            // onClick={handleLogIn}
            onClick={() => {setModalType("login")}}
            className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-full text-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            <Music className="w-5 h-5" />
            Login to my app
          </button>
          
          <p className="text-gray-400 text-sm mt-4">
            Makeeee uhhhhh Jeopardy boards or some shit
          </p>
          
        </div>

      </div>
    </div>
  );
};

