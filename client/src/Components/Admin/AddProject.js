import React, { useState, Fragment } from 'react';
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

const ProjectForm = ({ isModalOpen, closeModal }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleTechnologiesChange = (selected) => {
    setTechnologies(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Description', description);
    formData.append('Categories', categories);
    formData.append('Technologies', technologies.map(t => t.name).join(', '));
    Array.from(files).forEach(file => formData.append('Files', file));

    try {
      const response = await axios.post('https://localhost:7206/api/Project', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Project created:', response.data);
      toast.success('Project created successfully!');
      // Reset form fields after successful submission
      setName('');
      setDescription('');
      setCategories('');
      setTechnologies([]);
      setFiles([]);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    }
  };

  if (!isModalOpen) return null;

  return (
    <>
      <ToastContainer />
      <form className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-white" onSubmit={handleSubmit} >
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
        <div className="flex gap-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default ProjectForm;
