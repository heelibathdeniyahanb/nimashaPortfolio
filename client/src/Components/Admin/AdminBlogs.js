import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogForm from './BlogForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const blogsPerPage = 3;

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(1, blogs.length - blogsPerPage + 1));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [blogs]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://localhost:7206/api/Blog');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
    }
  };

  const renderAttachment = (blog) => {
    if (blog.blogAttachments && blog.blogAttachments.length > 0) {
      const attachment = blog.blogAttachments[0];
      const fileType = attachment.fileName.split('.').pop().toLowerCase();
      const fileUrl = `https://localhost:7206/api/Blog/attachments/${attachment.id}`;

      const className = "w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105";

      if (['png', 'jpg', 'jpeg', 'gif'].includes(fileType)) {
        return <img src={fileUrl} alt={attachment.name} className={className} />;
      } else if (fileType === 'pdf') {
        return <iframe src={fileUrl} title={attachment.fileName} className="w-full h-48"></iframe>;
      } else if (['mp4', 'mov', 'webm'].includes(fileType)) {
        return (
          <video controls className="w-full h-48">
            <source src={fileUrl} type={`video/${fileType}`} />
            Your browser does not support the video tag.
          </video>
        );
      }
    }
    return <div className="h-48 bg-gray-200 flex items-center justify-center">No Attachment</div>;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingBlog(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`https://localhost:7206/api/Blog/${id}`);
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog');
      }
    }
  };

  const Modal = ({ blog, onClose }) => {
    if (!blog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scaleIn">
          <div className="p-6 bg-gray-100">
            <h2 className="text-3xl font-bold mb-2 text-orange-600">{blog.name}</h2>
            <p className="text-gray-600 text-sm">{blog.categories}</p>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="mb-6">
              {renderAttachment(blog)}
            </div>
            <p className="text-gray-700 leading-relaxed">{blog.description}</p>
          </div>
          <div className="p-6 bg-gray-100 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const navigateBlogs = (direction) => {
    setCurrentIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % Math.max(1, blogs.length - blogsPerPage + 1);
      } else {
        return (prevIndex - 1 + Math.max(1, blogs.length - blogsPerPage + 1)) % Math.max(1, blogs.length - blogsPerPage + 1);
      }
    });
  };

  return (
    <div className="bg-gray-100 text-black min-h-screen p-8">
      <ToastContainer />
      <div className='text-4xl font-bold mb-6 text-center'>
        My <span className='text-orange-500'>Blogs</span>
      </div>
      <div className="border-b-2 border-orange-500 w-24 mx-auto mb-12"></div>
      <div className='flex justify-end mb-8'>
        <button
          className="px-6 py-3 bg-orange-500 text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300"
          onClick={openAddModal}
        >
          Add Blog
        </button>
      </div>
      
      <div className="relative">
        <button 
          onClick={() => navigateBlogs('prev')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
        >
          &#8249;
        </button>
        <button 
          onClick={() => navigateBlogs('next')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
        >
          &#8250;
        </button>
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / blogsPerPage)}%)` }}
          >
            {blogs.map((blog) => (
              <div 
                key={blog.id} 
                className="w-1/3 flex-shrink-0 px-4"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                  <div className="h-48 overflow-hidden relative">
                    {renderAttachment(blog)}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => openEditModal(blog)}
                        className="mx-2 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(blog.id)}
                        className="mx-2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">{blog.name}</h2>
                    <p className="text-sm text-gray-600 mb-2">{blog.categories}</p>
                    <p className="text-sm text-gray-500 mb-4">{formatDate(blog.dateModified)}</p>
                    <button 
                      onClick={() => setEditingBlog(blog)}
                      className="w-full px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <BlogForm 
        isModalOpen={isAddModalOpen}
        closeModal={closeAddModal} 
          onSuccess={fetchBlogs} 
        />
      )}

      {isEditModalOpen && editingBlog && (
        <BlogForm 
          blog={editingBlog} 
          onClose={closeEditModal} 
          onSuccess={fetchBlogs} 
        />
      )}

      {editingBlog && (
        <Modal 
          blog={editingBlog} 
          onClose={() => setEditingBlog(null)} 
        />
      )}
    </div>
  );
}
