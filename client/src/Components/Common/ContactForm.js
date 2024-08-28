import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContactForm({ isModalOpen, closeModal }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('https://localhost:7206/api/Email/SendContactFormEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        setTimeout(() => {
          closeModal();
          setFormData({ name: '', email: '', mobileNo: '', message: '' });
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to send message: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      toast.error(`Error sending email: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-lg p-8 shadow-2xl z-10 relative w-full max-w-md transform transition-all duration-300 ease-out scale-95 hover:scale-100">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-orange-500 transition duration-300 transform hover:rotate-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-3xl mb-6 text-black font-bold text-center">Contact Me</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 px-3 py-2 focus:border-orange-500 transition-colors duration-300 outline-none"
              placeholder="Name"
              required
            />
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 px-3 py-2 focus:border-orange-500 transition-colors duration-300 outline-none"
              placeholder="Email"
              required
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 px-3 py-2 focus:border-orange-500 transition-colors duration-300 outline-none"
              placeholder="Mobile No"
              required
            />
          </div>
          <div className="relative">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-orange-500 transition-colors duration-300 outline-none resize-none h-32"
              placeholder="Message"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-200 text-black px-6 py-2 rounded-full hover:bg-gray-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}