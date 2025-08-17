import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Upload, 
  Sparkles, 
  Save, 
  ArrowLeft,
  FileText,
  Lightbulb
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateSummary = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    originalText: '',
    customPrompt: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPromptSuggestions, setShowPromptSuggestions] = useState(false);

  const promptSuggestions = [
    "Summarize in bullet points for executives",
    "Highlight only action items and deadlines",
    "Create a structured summary with key decisions made",
    "Focus on main topics discussed and outcomes",
    "Summarize for team members who couldn't attend",
    "Extract key insights and learning points",
    "Create a timeline of events discussed",
    "Summarize with emphasis on next steps"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePromptSuggestion = (suggestion) => {
    setFormData({
      ...formData,
      customPrompt: suggestion
    });
    setShowPromptSuggestions(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'text/plain' || file.type === 'text/markdown') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData({
            ...formData,
            originalText: event.target.result
          });
        };
        reader.readAsText(file);
        toast.success('File uploaded successfully!');
      } else {
        toast.error('Please upload a text file (.txt or .md)');
      }
    }
  };

  const handleGenerateSummary = async (e) => {
    e.preventDefault();

    if (!formData.originalText.trim() || !formData.customPrompt.trim()) {
      toast.error('Please provide both the original text and custom prompt');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/summary/generate', {
        originalText: formData.originalText,
        customPrompt: formData.customPrompt,
        title: formData.title || 'Untitled Summary'
      });

      const summary = response.data.summary;

      toast.success('Summary generated successfully!');
      // Navigate to detail page directly
      navigate(`/summary/${summary._id}`);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error(error.response?.data?.message || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Summary</h1>
            <p className="text-gray-600">Upload meeting transcript and generate AI-powered summaries</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              Meeting Details
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Summary Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="input-field"
                  placeholder="e.g., Weekly Team Meeting - March 15"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="originalText" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Transcript
                </label>
                <textarea
                  id="originalText"
                  name="originalText"
                  rows="8"
                  className="input-field resize-none"
                  placeholder="Paste your meeting transcript here or upload a file below..."
                  value={formData.originalText}
                  onChange={handleChange}
                />
                
                <div className="mt-2">
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <div className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700">
                      <Upload className="w-4 h-4" />
                      <span>Upload text file (.txt, .md)</span>
                    </div>
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept=".txt,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Instructions
                </label>
                <div className="relative">
                  <textarea
                    id="customPrompt"
                    name="customPrompt"
                    rows="3"
                    className="input-field resize-none pr-10"
                    placeholder="e.g., Summarize in bullet points for executives"
                    value={formData.customPrompt}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPromptSuggestions(!showPromptSuggestions)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-primary-600 transition-colors"
                    title="Prompt suggestions"
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                </div>

                {showPromptSuggestions && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm font-medium text-gray-700 mb-2">Quick suggestions:</p>
                    <div className="space-y-1">
                      {promptSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handlePromptSuggestion(suggestion)}
                          className="block w-full text-left text-sm text-gray-600 hover:text-primary-600 p-2 rounded hover:bg-white transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={loading || !formData.originalText.trim() || !formData.customPrompt.trim()}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Summary
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="space-y-6">
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-2">💡 Tips for Better Summaries</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific with your custom instructions</li>
              <li>• Include context about the meeting type and participants</li>
              <li>• Mention the desired format (bullet points, paragraphs, etc.)</li>
              <li>• Specify if you want action items highlighted</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSummary;
