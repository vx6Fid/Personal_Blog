'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthGuard } from '../../../lib/auth';
import { ArrowLeft, Plus, X, Eye, EyeOff, Save } from 'lucide-react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import dynamic from 'next/dynamic';

// Dynamically import the Markdown editor for better performance
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

export default function EditBlog() {
  const router = useRouter();
  const { slug } = useParams();
  useAuthGuard();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    tags: [],
    is_featured: false,
    read_time: null
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blog post data on mount
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${slug}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }

        const data = await response.json();
        setFormData({
          id: data.id,
          title: data.title,
          slug: data.slug,
          content: data.content,
          tags: data.tags || [],
          is_featured: data.is_featured || false,
          read_time: data.read_time || null
        });
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.message || 'An error occurred while loading the blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  // Validate slug format
  useEffect(() => {
    if (formData.slug) {
      const isValid = /^[a-z0-9-]+$/.test(formData.slug);
      setSlugError(isValid ? '' : 'Slug can only contain lowercase letters, numbers, and hyphens');
    }
  }, [formData.slug]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      content: value || ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validation
    if (!formData.title || !formData.slug || !formData.content) {
      setError('Title, slug, and content are required');
      setIsSubmitting(false);
      return;
    }

    if (slugError) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update blog post');
      }

      router.push('/admin'); // Redirect to admin panel after update
    } catch (err) {
      console.error('Error updating blog:', err);
      setError(err.message || 'An error occurred while updating the blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-2xl font-bold">Edit Blog Post</h1>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-1 bg-borders/10 hover:bg-borders/20 border border-borders/20 text-secondary px-3 py-1.5 rounded-lg text-sm"
            >
              {previewMode ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Exit Preview
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Preview
                </>
              )}
            </button>
          </div>
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

        {previewMode ? (
          /* Preview Mode */
          <div className="bg-borders/5 rounded-lg p-6 border border-borders/30">
            <article className="prose prose-invert max-w-none">
              <h1 className="text-3xl font-bold mb-2">{formData.title || 'Untitled Post'}</h1>
              
              <div className="flex items-center gap-4 text-secondary text-sm mb-6">
                <span>{new Date().toLocaleDateString()}</span>
                <span>•</span>
                <span>{formData.read_time || '5 min'} read</span>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex gap-2 mb-6">
                  {formData.tags.map(tag => (
                    <span key={tag} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <MarkdownPreview 
                source={formData.content || '*Start writing your content...*'} 
                className="!bg-transparent !text-primary"
              />
            </article>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-borders/5 border border-borders/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className={`w-full bg-borders/5 border ${slugError ? 'border-red-500/50' : 'border-borders/30'} rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent`}
                  required
                />
                {slugError && (
                  <p className="mt-1 text-xs text-red-500">{slugError}</p>
                )}
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

            {/* Read Time and Featured */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Read Time
                </label>
                <input
                  type="text"
                  name="read_time"
                  value={formData.read_time || ''}
                  onChange={handleInputChange}
                  placeholder="5 min"
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
                  Feature this post
                </label>
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Content *
              </label>
              <div className="border border-borders/30 rounded-lg overflow-hidden">
                <MDEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  height={500}
                  preview="edit"
                  visibleDragbar={false}
                  style={{ backgroundColor: 'rgba(31, 31, 31, 0.5)' }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !!slugError}
                className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  isSubmitting || slugError
                    ? 'bg-accent/20 text-accent/70 cursor-not-allowed'
                    : 'bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 hover:border-accent/50 shadow-[0_0_15px_-3px_rgba(0,255,178,0.1)] hover:shadow-[0_0_20px_-3px_rgba(0,255,178,0.2)]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                    Updating Post...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Blog Post
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}