import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  FileText, 
  Calendar, 
  Search,
  Edit,
  Trash2,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await axios.get('/api/summary');
      const data = Array.isArray(response.data) 
        ? response.data 
        : response.data.data || []; // fallback if wrapped
      setSummaries(data);
    } catch (error) {
      console.error('Error fetching summaries:', error);
      toast.error('Failed to load summaries');
      setSummaries([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this summary?')) {
      try {
        await axios.delete(`/api/summary/${id}`);
        toast.success('Summary deleted successfully');
        fetchSummaries();
      } catch (error) {
        console.error('Error deleting summary:', error);
        toast.error('Failed to delete summary');
      }
    }
  };

  const filteredSummaries = Array.isArray(summaries)
  ? summaries.filter(summary =>
      (summary.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (summary.customPrompt || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage and organize your meeting summaries
          </p>
        </div>
        <Link
          to="/create"
          className="mt-4 sm:mt-0 btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Summary
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Summaries</p>
              <p className="text-2xl font-bold text-gray-900">{summaries.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {summaries.filter(s => {
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return new Date(s.createdAt) > monthAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Share2 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shared</p>
              <p className="text-2xl font-bold text-gray-900">
                {summaries.filter(s => s.isPublic).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Summaries */}
      <div className="card">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search summaries..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredSummaries.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No summaries found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first summary.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link to="/create" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Summary
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSummaries.map((summary) => (
              <div
                key={summary._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {summary.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Prompt:</strong> {summary.customPrompt}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created {formatDate(summary.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/summary/${summary._id}`}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(summary._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 