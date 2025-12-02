
import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, Send, FileText } from 'lucide-react';

interface FormDataState {
  firstName: string;
  lastName: string;
  email: string;
}

export const ApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormDataState>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [scriptUrl, setScriptUrl] = useState<string>('');

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError('');

    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setFileError('Please upload a valid PDF file.');
        setFile(null);
        e.target.value = ''; // Reset input
        return;
      }
      // Optional: Check file size (e.g., limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setFileError('File size exceeds the 10MB limit.');
        setFile(null);
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  // Convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the "data:application/pdf;base64," prefix for GAS
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFileError('A PDF file is required.');
      return;
    }
    if (!scriptUrl) {
        setErrorMessage('Please enter your Google Apps Script Web App URL first.');
        return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const base64File = await fileToBase64(file);

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        fileName: file.name,
        mimeType: file.type,
        fileData: base64File,
      };

      // Using fetch with 'no-cors' mode is common for GAS web apps to avoid CORS errors on the browser side,
      // but it yields an opaque response. To get a real response, the GAS script must handle OPTIONS and return proper headers.
      // Or we send text/plain to avoid preflight options.
      
      const response = await fetch(scriptUrl, {
        method: 'POST',
        // Important: set content-type to text/plain so browser doesn't trigger a complex preflight check that GAS might fail
        headers: {
            'Content-Type': 'text/plain', 
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setStatus('success');
      } else {
        throw new Error(data.message || 'Unknown error occurred on the server.');
      }

    } catch (error: any) {
      console.error('Submission Error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to submit the form. Please check the URL and try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-96">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h2>
        <p className="text-gray-600 max-w-md">
          Thank you, {formData.firstName}. Your document has been securely uploaded and emailed to the administrator.
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setFile(null);
            setFormData({ firstName: '', lastName: '', email: '' });
          }}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Apps Script URL <span className="text-red-500">*</span>
        </label>
        <input 
            type="text" 
            value={scriptUrl}
            onChange={(e) => setScriptUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-600"
        />
        <p className="text-xs text-gray-400 mt-1">Paste your deployed Web App URL here (see Backend Setup tab).</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Jane"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="jane.doe@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Upload PDF Document
          </label>
          <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${fileError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}`}>
            <div className="space-y-1 text-center">
              {file ? (
                <div className="flex flex-col items-center text-blue-600">
                    <FileText className="w-12 h-12 mb-2" />
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button 
                        type="button" 
                        onClick={() => setFile(null)} 
                        className="text-xs text-red-500 mt-2 hover:underline"
                    >
                        Remove
                    </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="application/pdf"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 10MB</p>
                </>
              )}
            </div>
          </div>
          {fileError && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {fileError}
            </div>
          )}
        </div>

        {status === 'error' && (
          <div className="p-4 bg-red-50 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
            status === 'submitting' ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Sending...
            </>
          ) : (
            <>
              Send Application <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
