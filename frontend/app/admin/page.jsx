'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '../lib/auth';
import { 
  Plus, Edit, Trash2, 
  ExternalLink, Github, BookOpen,
  ArrowRight, Settings, FileText,
  HardDrive, Terminal, Smartphone
} from 'lucide-react';

function AdminPanel() {
  const router = useRouter();
  useAuthGuard();
  
  // State for different sections
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [adminData, setAdminData] = useState({
    about_mobile: '',
    about_desktop: '',
    doing_content: [],
    doing_date: '',
    software_tools: {},
    hardware_tools: {},
    extras: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === 'projects') {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`);
          const data = await res.json();
          setProjects(data.data || []);
        } else if (activeTab === 'blogs') {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`);
          const data = await res.json();
          setBlogs(data.blogs || []);
        } else if (activeTab === 'settings') {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/data`);
          const data = await res.json();
          setAdminData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Handle project deletion
  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.ok) {
        setProjects(projects.filter(project => project.id !== id));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.ok) {
        setBlogs(blogs.filter(blog => blog.id !== id));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  // Handle admin data update
  const handleAdminUpdate = async (field, value) => {
    try {
      const endpoint = field === 'doing' 
        ? `{process.env.NEXT_PUBLIC_API_BASE_URL}/admin/doing` 
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/${field}`;
      
      const body = field === 'doing' 
        ? { doing: value }
        : { [field]: value };

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const updatedData = await res.json();
        setAdminData(prev => ({
          ...prev,
          ...(field === 'doing' ? {
            doing_content: updatedData.doing.content,
            doing_date: updatedData.doing.date
          } : {
            [field]: updatedData[field]
          })
        }));
        console.log('Admin data updated successfully');
      }
    } catch (error) {
      console.error('Error updating admin data:', error);
    }
  };

  // Navigation functions
  const navigateToCreateBlog = () => router.push('/admin/create-blog');
  const navigateToEditBlog = (slug) => router.push(`/admin/edit-blog/${slug}`);
  const navigateToEditProject = (id) => router.push(`/admin/edit-project/${id}`);

  return (
    <div className="min-h-screen bg-background text-primary p-6">
      <header className="border-b border-borders pb-6 mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-secondary">Manage your portfolio content</p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <nav className="md:w-64 bg-borders/10 rounded-lg p-4 h-fit sticky top-6">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center gap-2 p-3 rounded-lg ${activeTab === 'projects' ? 'bg-accent/10 text-accent border border-accent/20' : 'hover:bg-borders/5'}`}
              >
                <HardDrive className="w-5 h-5" />
                Projects
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`w-full flex items-center gap-2 p-3 rounded-lg ${activeTab === 'blogs' ? 'bg-accent/10 text-accent border border-accent/20' : 'hover:bg-borders/5'}`}
              >
                <FileText className="w-5 h-5" />
                Blog Posts
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2 p-3 rounded-lg ${activeTab === 'settings' ? 'bg-accent/10 text-accent border border-accent/20' : 'hover:bg-borders/5'}`}
              >
                <Settings className="w-5 h-5" />
                Site Settings
              </button>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="bg-borders/5 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Projects</h2>
                <button
                  onClick={() => router.push('/admin/create-project')}
                  className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  New Project
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                </div>
              ) : projects.length === 0 ? (
                <p className="text-secondary">No projects found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-borders/30 rounded-lg p-4 hover:border-accent/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">{project.name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigateToEditProject(project.id)}
                            className="text-secondary hover:text-accent p-1"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-secondary hover:text-red-500 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-secondary text-sm mt-2 line-clamp-2">{project.description}</p>
                      <div className="flex gap-2 mt-4">
                        {project.github_link && (
                          <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent">
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.live_link && (
                          <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {project.article_link && (
                          <a href={project.article_link} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent">
                            <BookOpen className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Blogs Tab */}
          {activeTab === 'blogs' && (
            <div className="bg-borders/5 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Blog Posts</h2>
                <button
                  onClick={navigateToCreateBlog}
                  className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  New Blog Post
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                </div>
              ) : blogs.length === 0 ? (
                <p className="text-secondary">No blog posts found</p>
              ) : (
                <div className="space-y-4">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="border border-borders/30 rounded-lg p-4 hover:border-accent/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{blog.title}</h3>
                          <p className="text-secondary text-sm mt-1">
                            {new Date(blog.created_at).toLocaleDateString()} • {blog.read_time || '5 min'} read
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigateToEditBlog(blog.slug)}
                            className="text-secondary hover:text-accent p-1"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="text-secondary hover:text-red-500 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {blog.tags?.map(tag => (
                          <span key={tag} className="text-xs bg-borders/10 text-secondary px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-borders/5 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Site Settings</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* About Section */}
                  <section>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-accent" />
                      About Section
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-secondary mb-2">Mobile Version</label>
                        <textarea
                          value={adminData.about_mobile}
                          onChange={(e) => setAdminData({...adminData, about_mobile: e.target.value})}
                          className="w-full bg-borders/5 border border-borders/30 rounded-lg p-3 text-sm min-h-[150px]"
                        />
                        <button
                          onClick={() => handleAdminUpdate('about_mobile', adminData.about_mobile)}
                          className="mt-2 flex items-center gap-1 text-sm bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent px-3 py-1.5 rounded-lg"
                        >
                          Save Mobile About
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm text-secondary mb-2">Desktop Version</label>
                        <textarea
                          value={adminData.about_desktop}
                          onChange={(e) => setAdminData({...adminData, about_desktop: e.target.value})}
                          className="w-full bg-borders/5 border border-borders/30 rounded-lg p-3 text-sm min-h-[150px]"
                        />
                        <button
                          onClick={() => handleAdminUpdate('about_desktop', adminData.about_desktop)}
                          className="mt-2 flex items-center gap-1 text-sm bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent px-3 py-1.5 rounded-lg"
                        >
                          Save Desktop About
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Currently Doing Section */}
                  <section>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-accent" />
                      Currently Doing
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-secondary mb-2">Content (one per line)</label>
                        <textarea
                          value={adminData.doing_content?.join('\n') || ''}
                          onChange={(e) => setAdminData({
                            ...adminData, 
                            doing_content: e.target.value.split('\n')
                          })}
                          className="w-full bg-borders/5 border border-borders/30 rounded-lg p-3 text-sm min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-secondary mb-2">Last Updated Date</label>
                        <input
                          type="date"
                          value={adminData.doing_date || ''}
                          onChange={(e) => setAdminData({
                            ...adminData, 
                            doing_date: e.target.value
                          })}
                          className="bg-borders/5 border border-borders/30 rounded-lg p-2 text-sm"
                        />
                      </div>
                      <button
                        onClick={() => handleAdminUpdate('doing', {
                          content: adminData.doing_content,
                          date: adminData.doing_date
                        })}
                        className="flex items-center gap-1 text-sm bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent px-3 py-1.5 rounded-lg"
                      >
                        Save Currently Doing
                      </button>
                    </div>
                  </section>

                  {/* Tools Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Software Tools */}
                    <section>
                      <h3 className="text-lg font-medium mb-4">Software Tools</h3>
                      <div className="space-y-3">
                        {Object.entries(adminData.software_tools || {}).map(([tool, level]) => (
                          <div key={tool} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={tool}
                              onChange={(e) => {
                                const newTools = {...adminData.software_tools};
                                delete newTools[tool];
                                newTools[e.target.value] = level;
                                setAdminData({...adminData, software_tools: newTools});
                              }}
                              className="flex-1 bg-borders/5 border border-borders/30 rounded-lg p-2 text-sm"
                            />
                            <input
                              type="text"
                              value={level}
                              onChange={(e) => setAdminData({
                                ...adminData, 
                                software_tools: {
                                  ...adminData.software_tools,
                                  [tool]: e.target.value
                                }
                              })}
                              className="w-20 bg-borders/5 border border-borders/30 rounded-lg p-2 text-sm"
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => setAdminData({
                            ...adminData,
                            software_tools: {
                              ...adminData.software_tools,
                              ['New Tool']: 'Beginner'
                            }
                          })}
                          className="flex items-center gap-1 text-sm text-secondary hover:text-accent"
                        >
                          <Plus className="w-4 h-4" />
                          Add Software Tool
                        </button>
                      </div>
                      <button
                        onClick={() => handleAdminUpdate('software_tools', adminData.software_tools)}
                        className="mt-4 flex items-center gap-1 text-sm bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent px-3 py-1.5 rounded-lg"
                      >
                        Save Software Tools
                      </button>
                    </section>

                    {/* Hardware Tools */}
                    <section>
                      <h3 className="text-lg font-medium mb-4">Hardware Tools</h3>
                      <div className="space-y-3">
                        {Object.entries(adminData.hardware_tools || {}).map(([item, description]) => (
                          <div key={item} className="space-y-1">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const newTools = {...adminData.hardware_tools};
                                delete newTools[item];
                                newTools[e.target.value] = description;
                                setAdminData({...adminData, hardware_tools: newTools});
                              }}
                              className="w-full bg-borders/5 border border-borders/30 rounded-lg p-2 text-sm"
                              placeholder="Item name"
                            />
                            <textarea
                              value={description}
                              onChange={(e) => setAdminData({
                                ...adminData, 
                                hardware_tools: {
                                  ...adminData.hardware_tools,
                                  [item]: e.target.value
                                }
                              })}
                              className="w-full bg-borders/5 border border-borders/30 rounded-lg p-2 text-sm"
                              placeholder="Description"
                              rows={2}
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => setAdminData({
                            ...adminData,
                            hardware_tools: {
                              ...adminData.hardware_tools,
                              ['New Item']: 'Description'
                            }
                          })}
                          className="flex items-center gap-1 text-sm text-secondary hover:text-accent"
                        >
                          <Plus className="w-4 h-4" />
                          Add Hardware Item
                        </button>
                      </div>
                      <button
                        onClick={() => handleAdminUpdate('hardware_tools', adminData.hardware_tools)}
                        className="mt-4 flex items-center gap-1 text-sm bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent px-3 py-1.5 rounded-lg"
                      >
                        Save Hardware Tools
                      </button>
                    </section>
                  </div>

                  {/* Extras Section */}
                  <section>
                    <h3 className="text-lg font-medium mb-4">Extras Content</h3>
                    <textarea
                      value={adminData.extras || ''}
                      onChange={(e) => setAdminData({...adminData, extras: e.target.value})}
                      className="w-full bg-borders/5 border border-borders/30 rounded-lg p-3 text-sm min-h-[100px]"
                    />
                    <button
                      onClick={() => handleAdminUpdate('extras', adminData.extras)}
                      className="mt-2 flex items-center gap-1 text-sm bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent px-3 py-1.5 rounded-lg"
                    >
                      Save Extras
                    </button>
                  </section>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;