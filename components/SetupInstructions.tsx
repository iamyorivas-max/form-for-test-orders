import React from 'react';
import { Copy, ExternalLink, Check } from 'lucide-react';

export const SetupInstructions: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const codeSnippet = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var blob = Utilities.newBlob(Utilities.base64Decode(data.fileData), data.mimeType, data.fileName);
    
    MailApp.sendEmail({
      to: "YOUR_EMAIL@gmail.com", // REPLACE THIS
      subject: "New PDF: " + data.firstName + " " + data.lastName,
      body: "Sender: " + data.email,
      attachments: [blob]
    });
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 sm:p-10 bg-gray-50/50">
      <h2 className="text-xl font-bold text-gray-900 mb-6">How to Connect to Google Apps Script</h2>
      
      <ol className="relative border-l border-gray-200 space-y-8 ml-3">
        <li className="mb-10 ml-6">
          <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
            <span className="text-blue-600 font-bold text-sm">1</span>
          </span>
          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Create the Script</h3>
          <p className="mb-4 text-base font-normal text-gray-500">
            Go to <a href="https://script.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center">script.google.com <ExternalLink className="w-3 h-3 ml-1"/></a> and create a new project.
          </p>
          <div className="bg-gray-800 rounded-lg p-4 relative group">
            <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                title="Copy simplified code"
            >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre className="text-xs text-gray-300 overflow-x-auto font-mono">
              {codeSnippet}
            </pre>
            <p className="mt-2 text-xs text-gray-400 italic">
                * Copy this code into the Code.gs file. Don't forget to replace YOUR_EMAIL@gmail.com!
            </p>
          </div>
        </li>

        <li className="mb-10 ml-6">
          <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
            <span className="text-blue-600 font-bold text-sm">2</span>
          </span>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">Deploy as Web App</h3>
          <p className="text-base font-normal text-gray-500">
            Click <strong>Deploy</strong> {'>'} <strong>New Deployment</strong>.
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-gray-600 space-y-1">
            <li>Select type: <strong>Web App</strong>.</li>
            <li>Description: "PDF Uploader".</li>
            <li>Execute as: <strong>Me</strong>.</li>
            <li>Who has access: <strong>Anyone</strong> (Important!).</li>
          </ul>
        </li>

        <li className="ml-6">
          <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
            <span className="text-blue-600 font-bold text-sm">3</span>
          </span>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">Get the URL</h3>
          <p className="text-base font-normal text-gray-500">
            Copy the <strong>Web App URL</strong> provided after deployment. Paste this URL into the input field on the <strong>Submission Form</strong> tab.
          </p>
        </li>
      </ol>
    </div>
  );
};