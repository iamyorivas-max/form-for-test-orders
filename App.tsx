import React, { useState } from 'react';
import { ApplicationForm } from './components/ApplicationForm';
import { SetupInstructions } from './components/SetupInstructions';
import { FileText, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'setup'>('setup');

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Secure PDF Uploader
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Submit your documents securely directly to our email system.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
              activeTab === 'form'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Submission Form
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
              activeTab === 'setup'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Backend Setup
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          {activeTab === 'form' ? <ApplicationForm /> : <SetupInstructions />}
        </div>
        
        <p className="text-center text-xs text-gray-400">
          Powered by React, Tailwind CSS, and Google Apps Script
        </p>
      </div>
    </div>
  );
};

export default App;