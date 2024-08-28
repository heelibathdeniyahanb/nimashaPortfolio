import React, { useState } from 'react';
import axios from 'axios';

const UpdateProjectForm = ({ project, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    id: project.id,
    name: project.name,
    description: project.description,
    categories: project.categories,
    technologies: project.technologies.join(', '),
    isTagged: project.isTagged,
  });
  const [files, setFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState(project.attachments || []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach(key => {
      if (key === 'technologies') {
        formDataToSend.append(key, JSON.stringify(formData[key].split(',').map(tech => tech.trim())));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (files.length > 0) {
      files.forEach(file => {
        formDataToSend.append('Files', file);
      });
    } else {
      formDataToSend.append('Files', new File([""], "dummy.txt", { type: "text/plain" }));
    }

    try {
      const response = await axios.put(`https://localhost:7206/api/Project/${project.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const removeExistingAttachment = (attachmentId) => {
    setExistingAttachments(prevAttachments => prevAttachments.filter(att => att.id !== attachmentId));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Update Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="4"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categories">
              Categories
            </label>
            <input
              type="text"
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="technologies">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isTagged"
                checked={formData.isTagged}
                onChange={handleChange}
                className="mr-2 form-checkbox text-orange-500"
              />
              <span className="text-gray-700 text-sm font-bold">Is Tagged</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="files">
              Add New Attachments (Optional)
            </label>
            <input
              type="file"
              id="files"
              name="files"
              onChange={handleFileChange}
              multiple
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {existingAttachments.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Existing Attachments</h3>
              <ul className="bg-gray-100 rounded-lg p-4">
                {existingAttachments.map((attachment) => (
                  <li key={attachment.id} className="flex items-center justify-between mb-2 last:mb-0">
                    <span className="text-gray-700">{attachment.fileName}</span>
                    <button
                      type="button"
                      onClick={() => removeExistingAttachment(attachment.id)}
                      className="text-orange-500 hover:text-orange-700 font-medium"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-200"
            >
              Update Project
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProjectForm;