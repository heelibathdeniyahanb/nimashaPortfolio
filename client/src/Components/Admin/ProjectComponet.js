import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid';

const technologiesOptions = [
  { id: 1, name: 'React JS' },
  { id: 2, name: 'HTML' },
  { id: 3, name: 'CSS' },
  { id: 4, name: '.NET Core' },
  { id: 5, name: 'MS SQL Server' },
  { id: 6, name: 'Firebase' },
  { id: 7, name: 'Node JS' },
  { id: 8, name: 'Mongo DB' },
  { id: 9, name: 'React Native' },
  { id: 10, name: 'IOT' },
  { id: 11, name: 'Git' },
];

const ProjectsComponent = (isModalOpen, closeModal, projectToEdit) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState('');
    const [technologies, setTechnologies] = useState([]);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (projectToEdit) {
          setName(projectToEdit.name);
          setDescription(projectToEdit.description);
          setCategories(projectToEdit.categories);
          setTechnologies(projectToEdit.technologies.map(tech => 
            technologiesOptions.find(t => t.name === tech) || { id: Math.random(), name: tech }
          ));
          setSelectedProject(projectToEdit);
        }
      }, [projectToEdit]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('https://localhost:7206/api/Project');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to fetch projects. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7206/api/Project/${id}`);
            fetchProjects();
            toast.success('Project deleted successfully!');
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project. Please try again.');
        }
    };

    const handleEdit = (project) => {
        setSelectedProject(project);
        setName(project.name);
        setDescription(project.description);
        setCategories(project.categories);
        setTechnologies(project.technologies.map(tech => technologiesOptions.find(t => t.name === tech) || { id: Math.random(), name: tech }));
        setFiles([]);
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Id', selectedProject.id);
        formData.append('Name', name);
        formData.append('Description', description);
        formData.append('Categories', categories);
        formData.append('Technologies', technologies.map(t => t.name).join(', '));
        Array.from(files).forEach(file => formData.append('Files', file));

        try {
            await axios.put(`https://localhost:7206/api/Project/${selectedProject.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowModal(false);
            fetchProjects();
            toast.success('Project updated successfully!');
        } catch (error) {
            console.error('Error updating project:', error);
            toast.error('Failed to update project. Please try again.');
        }
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleTechnologiesChange = (selected) => {
        setTechnologies(selected);
    };

    const renderAttachment = (attachment) => {
        const fileType = attachment.fileName.split('.').pop().toLowerCase();
        const fileUrl = `https://localhost:7206/api/Project/attachments/${attachment.id}`;

        switch (fileType) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                return <img src={fileUrl} alt={attachment.fileName} className="w-64 h-64 object-cover" />;
            case 'pdf':
                return (
                    <iframe
                        src={fileUrl}
                        title={attachment.fileName}
                        className="w-full h-80"
                        frameBorder="0"
                    ></iframe>
                );
            case 'mp4':
            case 'mov':
            case 'webm':
                return (
                    <video controls className="w-full h-auto">
                        <source src={fileUrl} type={`video/${fileType}`} />
                        Your browser does not support the video tag.
                    </video>
                );
            default:
                return (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        {attachment.fileName}
                    </a>
                );
        }
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
            {projects.map(project => (
                <div key={project.id} className="border p-4 mb-4 rounded">
                    <h2 className="text-xl font-semibold">{project.name}</h2>
                    <p>{project.description}</p>
                    
                    <p className="font-semibold">Categories:</p>
                    <p>{project.categories}</p>

                    <p className="font-semibold">Technologies:</p>
                    <ul className="list-disc pl-5">
                        {project.technologies.map((tech, index) => (
                            <li key={index}>{tech}</li>
                        ))}
                    </ul>

                    <p className="font-semibold">Date Added:</p>
                    <p>{new Date(project.dateAdded).toLocaleString()}</p>

                    <p className="font-semibold">Date Modified:</p>
                    <p>{new Date(project.dateModified).toLocaleString()}</p>

                    <p className="font-semibold">Attachments:</p>
                    <div className="space-y-2">
                        {project.attachments.map((attachment) => (
                            <div key={attachment.id}>
                                {renderAttachment(attachment)}
                            </div>
                        ))}
                    </div>

                    <div className="mt-2">
                        <button 
                            onClick={() => handleEdit(project)} 
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                            Edit
                        </button>
                        <button 
                            onClick={() => handleDelete(project.id)} 
                            className="bg-red-500 text-white px-4 py-2 rounded">
                            Delete
                        </button>
                    </div>
                </div>
            ))}

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-900 p-6 rounded shadow-lg w-1/2">
                        <h2 className="text-xl font-semibold mb-4 text-white">Edit Project</h2>
                        <form onSubmit={handleUpdate} className="text-white">
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
                                <label className="block text-gray-300">Technologies</label>
                                <Listbox value={technologies} onChange={handleTechnologiesChange} multiple>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 border border-gray-700 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                            <span className="block truncate">
                                                {technologies.length === 0
                                                    ? 'Select Technologies'
                                                    : technologies.map(t => t.name).join(', ')}
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {technologiesOptions.map((tech) => (
                                                    <Listbox.Option
                                                        key={tech.id}
                                                        className={({ active }) =>
                                                            `${active ? 'text-white bg-orange-600' : 'text-gray-300'}
                                                            cursor-default select-none relative py-2 pl-10 pr-4`
                                                        }
                                                        value={tech}
                                                    >
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span
                                                                    className={`${
                                                                        selected ? 'font-medium' : 'font-normal'
                                                                    } block truncate`}
                                                                >
                                                                    {tech.name}
                                                                </span>
                                                                {selected ? (
                                                                    <span
                                                                        className={`${
                                                                            active ? 'text-white' : 'text-orange-600'
                                                                        }
                                                                        absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                    >
                                                                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-300">Category</label>
                                <select
                                    value={categories}
                                    onChange={(e) => setCategories(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Mini Projects">Mini Projects</option>
                                    <option value="Frontend Development">Frontend Development</option>
                                    <option value="Backend Development">Backend Development</option>
                                    <option value="Fullstack">Fullstack</option>
                                    <option value="UI Designing">UI Designing</option>
                                </select>
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
                                <label className="block text-gray-300">Files</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <p className="font-semibold text-gray-300">Existing Attachments:</p>
                                <div className="space-y-2">
                                    {selectedProject.attachments.map((attachment) => (
                                        <div key={attachment.id}>
                                            {renderAttachment(attachment)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsComponent;