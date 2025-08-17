import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  Share2, 
  Trash2,
  Mail,
  Calendar,
  FileText,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const SummaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState({
    recipients: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`/api/summary/${id}`);
    
        // Fix: response.data is the summary object directly
        setSummary(response.data);
        setEditedSummary(response.data.editedSummary || response.data.generatedSummary);
      } catch (error) {
        console.error('Error fetching summary:', error);
        toast.error('Failed to load summary');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!editedSummary.trim()) {
      toast.error('Summary cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.put(`/api/summary/${id}`, {
        editedSummary,
        title: summary.title
      });
      
      // Fix: Access the summary from the correct response structure
      setSummary(response.data.summary);
      setEditing(false);
      toast.success('Summary updated successfully!');
    } catch (error) {
      console.error('Error updating summary:', error);
      toast.error('Failed to update summary');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this summary? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/summary/${id}`);
        toast.success('Summary deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting summary:', error);
        toast.error('Failed to delete summary');
      }
    }
  };

  const handleShare = async () => {
    const recipients = shareData.recipients.split(',').map(email => email.trim()).filter(email => email);
    
    if (recipients.length === 0) {
      toast.error('Please enter at least one recipient email');
      return;
    }

    try {
      await axios.post('/api/email/share', {
        summaryId: id,
        recipients,
        subject: shareData.subject || `Meeting Summary: ${summary.title}`,
        message: shareData.message
      });
      
      toast.success('Summary shared successfully!');
      setShowShareModal(false);
      setShareData({ recipients: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sharing summary:', error);
      toast.error('Failed to share summary');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!summary) {
    return <div>Summary not found</div>;
  }

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
            <h1 className="text-3xl font-bold text-gray-900">{summary.title}</h1>
            <p className="text-gray-600">View and edit your meeting summary</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditedSummary(summary.editedSummary || summary.generatedSummary);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="btn-secondary flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="btn-primary flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </>
          )}
        </div>
      </div>

      {/* Summary Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Created</p>
              <p className="text-sm text-gray-900">{formatDate(summary.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Original Prompt</p>
              <p className="text-sm text-gray-900 truncate">{summary.customPrompt}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <User className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-sm text-gray-900">
                {summary.editedSummary ? 'Edited' : 'Generated'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Content */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Summary Content</h2>
          {!editing && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 p-2 transition-colors"
              title="Delete summary"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {editing ? (
          <textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            rows="12"
            className="input-field resize-none"
            placeholder="Edit your summary here..."
          />
        ) : (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {summary.editedSummary || summary.generatedSummary}
            </div>
          </div>
        )}
      </div>

      {/* Original Text */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Original Meeting Transcript</h2>
        <div className="bg-gray-50 rounded-lg p-6 max-h-64 overflow-y-auto">
          <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
            {summary.originalText}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-primary-600" />
              Share Summary
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Emails
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="email1@example.com, email2@example.com"
                  value={shareData.recipients}
                  onChange={(e) => setShareData({...shareData, recipients: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (optional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder={`Meeting Summary: ${summary.title}`}
                  value={shareData.subject}
                  onChange={(e) => setShareData({...shareData, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Please find the meeting summary attached."
                  value={shareData.message}
                  onChange={(e) => setShareData({...shareData, message: e.target.value})}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleShare}
                className="btn-primary flex-1"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryDetail; 