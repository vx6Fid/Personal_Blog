'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '../../lib/auth';
import { Plus, X, ArrowLeft } from 'lucide-react';

export default function CreateProject() {
  const router = useRouter();
  useAuthGuard();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    github_link: '',
    live_link: '',
    article_link: '',
    tags: [],
    tech_stack: [],
    is_featured: false,
    image_url: '',
    created_at: new Date().toISOString().split('T')[0] // Default to today
  });

  const [newTag, setNewTag] = useState('');
  const [newTech, setNewTech] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddTech = () => {
    if (newTech.trim() && !formData.tech_stack.includes(newTech.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...formData.tech_stack, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter(tech => tech !== techToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic validation
    if (!formData.name || !formData.description || !formData.github_link) {
      setError('Name, description, and GitHub link are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }

      const data = await response.json();
      router.push('/admin'); // Redirect to admin panel after creation
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message || 'An error occurred while creating the project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Create New Project</h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-2">
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Project Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-borders/5 border border-borders/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Creation Date *
              </label>
              <input
                type="date"
                name="created_at"
                value={formData.created_at}
                onChange={handleInputChange}
                className="w-full bg-borders/5 border border-borders/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-borders/5 border border-borders/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent"
              required
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                GitHub Link *
              </label>
              <input
                type="url"
                name="github_link"
                value={formData.github_link}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
                className="w-full bg-borders/5 border border-borders/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Live Demo Link
              </label>
              <input
                type="url"
                name="live_link"
                value={formData.live_link}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full bg-borders/5 border border-borders/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Article Link
              </label>
              <input
                type="url"
                name="article_link"
                value={formData.article_link}
                onChange={handleInputChange}
                placeholder="https://blog.example.com/post"
                className="w-full bg-borders/5 border border-borders/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs px-2 py-1 rounded"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-accent/70 hover:text-accent"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                className="flex-1 bg-borders/5 border border-borders/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent px-3 py-2 rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Tech Stack
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 bg-borders/10 text-secondary text-xs px-2 py-1 rounded"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="text-secondary/70 hover:text-secondary"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Add technology"
                className="flex-1 bg-borders/5 border border-borders/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent px-3 py-2 rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image URL and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-borders/5 border border-borders/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                id="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-accent focus:ring-accent border-borders/30 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-secondary">
                Feature this project
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 ${
                isSubmitting
                  ? 'bg-accent/20 text-accent/70 cursor-not-allowed'
                  : 'bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 hover:border-accent/50 shadow-[0_0_15px_-3px_rgba(0,255,178,0.1)] hover:shadow-[0_0_20px_-3px_rgba(0,255,178,0.2)]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                  Creating Project...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}