import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BlogView = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBlogs, setSelectedBlogs] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentAttachmentIndices, setCurrentAttachmentIndices] = useState({});
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

    useEffect(() => {
        const intervalIds = {};
        blogs.forEach(blog => {
            if (blog.attachments && blog.attachments.length > 1) {
                intervalIds[blog.id] = setInterval(() => {
                    setCurrentAttachmentIndices(prev => ({
                        ...prev,
                        [blog.id]: (prev[blog.id] + 1) % blog.attachments.length
                    }));
                }, 5000);
            }
        });

        return () => {
            Object.values(intervalIds).forEach(clearInterval);
        };
    }, [blogs]);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('https://localhost:7206/api/Blog');
            setBlogs(response.data);
            setLoading(false);
            const initialIndices = {};
            response.data.forEach(blog => {
                initialIndices[blog.id] = 0;
            });
            setCurrentAttachmentIndices(initialIndices);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setLoading(false);
        }
    };

    const renderAttachment = (blog, fullSize = false) => {
        if (blog.attachments && blog.attachments.length > 0) {
            const currentIndex = currentAttachmentIndices[blog.id] || 0;
            const attachment = blog.attachments[currentIndex];
            const fileType = attachment.fileName.split('.').pop().toLowerCase();
            const fileUrl = `https://localhost:7206/api/Blog/attachments/${attachment.id}`;

            const className = fullSize 
                ? "w-full max-h-96 object-contain" 
                : "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105";

            if (['png', 'jpg', 'jpeg', 'gif'].includes(fileType)) {
                return <img src={fileUrl} alt={blog.name} className={className} />;
            } else if (fileType === 'pdf') {
                return <iframe src={fileUrl} title={attachment.fileName} className="w-full h-96"></iframe>;
            } else if (['mp4', 'mov', 'webm'].includes(fileType)) {
                return (
                    <video controls className="w-full max-h-96">
                        <source src={fileUrl} type={`video/${fileType}`} />
                        Your browser does not support the video tag.
                    </video>
                );
            }
        }
        return <div className="h-48 md:h-64 bg-gray-200 flex items-center justify-center">No Attachment</div>;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
                            {renderAttachment(blog, true)}
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

    const handlePrevAttachment = useCallback((blogId) => {
        setCurrentAttachmentIndices(prev => ({
            ...prev,
            [blogId]: (prev[blogId] - 1 + blogs.find(b => b.id === blogId).attachments.length) % blogs.find(b => b.id === blogId).attachments.length
        }));
    }, [blogs]);

    const handleNextAttachment = useCallback((blogId) => {
        setCurrentAttachmentIndices(prev => ({
            ...prev,
            [blogId]: (prev[blogId] + 1) % blogs.find(b => b.id === blogId).attachments.length
        }));
    }, [blogs]);

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
        <div className="bg-gray-100 text-black p-4 sm:p-8">
            <h1 className='text-3xl font-bold mb-6 text-center animate-fade-in'>
                My <span className='text-orange-600'>Blogs</span>
            </h1>
            <div className="border-b-2 border-orange-500 w-16 mx-auto mb-8 animate-expand"></div>
             
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
                </div>
            ) : blogs.length > 0 ? (
            <div className="relative">
                <button 
                    onClick={() => navigateBlogs('prev')}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white rounded-full p-2 shadow-md z-10 hover:bg-orange-600 transition-colors duration-300"
                    aria-label="Previous blog"
                >
                    &#8249;
                </button>
                <button 
                    onClick={() => navigateBlogs('next')}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white rounded-full p-2 shadow-md z-10 hover:bg-orange-600 transition-colors duration-300"
                    aria-label="Next blog"
                >
                    &#8250;
                </button>
                <div className="overflow-hidden">
                    <div 
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${(currentIndex / blogsPerPage) * 100}%)` }}
                    >
                        {blogs.map((blog, index) => (
                            <div 
                                key={blog.id} 
                                className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 p-2 sm:p-4"
                            >
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2">
                                    <div className="h-48 sm:h-64 overflow-hidden relative group">
                                        {renderAttachment(blog)}
                                        {blog.attachments && blog.attachments.length > 1 && (
                                            <>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handlePrevAttachment(blog.id); }}
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    aria-label="Previous attachment"
                                                >
                                                    &#8249;
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleNextAttachment(blog.id); }}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    aria-label="Next attachment"
                                                >
                                                    &#8250;
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-xl font-semibold mb-2 text-gray-800">{blog.name}</h2>
                                        <p className="text-sm text-gray-600 mb-2">{blog.categories}</p>
                                        <p className="text-sm text-gray-500 mb-4">{formatDate(blog.dateModified)}</p>
                                        <button 
                                            onClick={() => setSelectedBlogs(blog)}
                                            className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                        >
                                            Read More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            ) : (
                <div className="text-center text-gray-600 mt-8">
                    <p>There are no blogs yet.</p>
                </div>
            )}

            {selectedBlogs && <Modal blog={selectedBlogs} onClose={() => setSelectedBlogs(null)} />}
        </div>
    );
};

export default BlogView;