import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogForm = ({ isModalOpen, closeModal, onSuccess, editingBlog }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (editingBlog) {
      setName(editingBlog.name);
      setDescription(editingBlog.description);
      setCategories(editingBlog.categories);
    }
  }, [editingBlog]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Description', description);
    formData.append('Categories', categories);
    Array.from(files).forEach((file) => {
      formData.append('Files', file);
    });

    try {
      if (editingBlog) {
        await axios.put(`https://localhost:7206/api/Blog/${editingBlog.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Blog updated successfully');
      } else {
        await axios.post('https://localhost:7206/api/Blog', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Blog added successfully');
      }
      onSuccess();
      closeModal();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog');
    }
  };

  if (!isModalOpen) return null;

  return (
    <>
      <ToastContainer />
      <form className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-white" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">{editingBlog ? 'Edit Blog' : 'Add Blog'}</h2>
        <div className="mb-4">
          <label className="block text-gray-300">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Categories</label>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Attachments</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
            Save
          </button>
          <button type="button" onClick={closeModal} className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default BlogForm;
