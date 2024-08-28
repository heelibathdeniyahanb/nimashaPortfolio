import React, { useState } from 'react';

export default function AboutForm() {
  const [education, setEducation] = useState([{ degree: '', institution: '', graduationYear: '' }]);
  const [workExperience, setWorkExperience] = useState([{ jobTitle: '', company: '', duration: '', responsibilities: '' }]);
  const [skills, setSkills] = useState(['']);
  const [projects, setProjects] = useState([{ title: '', link: '', description: '' }]);
  const [achievements, setAchievements] = useState([{ title: '', description: '' }]);
  const [testimonials, setTestimonials] = useState([{ author: '', text: '' }]);

  const handleChange = (index, type, field, value) => {
    const newEntries = [...type];
    newEntries[index][field] = value;
    switch (type) {
      case education:
        setEducation(newEntries);
        break;
      case workExperience:
        setWorkExperience(newEntries);
        break;
      case skills:
        setSkills(newEntries);
        break;
      case projects:
        setProjects(newEntries);
        break;
      case achievements:
        setAchievements(newEntries);
        break;
      case testimonials:
        setTestimonials(newEntries);
        break;
      default:
        break;
    }
  };

  const handleAddEntry = (type) => {
    const newEntries = [...type, {}];
    switch (type) {
      case education:
        setEducation(newEntries);
        break;
      case workExperience:
        setWorkExperience(newEntries);
        break;
      case skills:
        setSkills([...skills, '']);
        break;
      case projects:
        setProjects(newEntries);
        break;
      case achievements:
        setAchievements(newEntries);
        break;
      case testimonials:
        setTestimonials(newEntries);
        break;
      default:
        break;
    }
  };

  const handleRemoveEntry = (index, type) => {
    const newEntries = [...type];
    newEntries.splice(index, 1);
    switch (type) {
      case education:
        setEducation(newEntries);
        break;
      case workExperience:
        setWorkExperience(newEntries);
        break;
      case skills:
        setSkills(newEntries);
        break;
      case projects:
        setProjects(newEntries);
        break;
      case achievements:
        setAchievements(newEntries);
        break;
      case testimonials:
        setTestimonials(newEntries);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Form Container */}
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Personal Information Section */}
        <div className="border-b border-gray-300 pb-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
        </div>
        
        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Full Name Field */}
          <div>
            <input
              id="full-name"
              name="full-name"
              type="text"
              placeholder="Full Name"
              className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Email Field */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Job Title Field */}
          <div>
            <input
              id="job-title"
              name="job-title"
              type="text"
              placeholder="Job Title"
              className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Country Field */}
          <div>
            <input
              id="country"
              name="country"
              type="text"
              placeholder="Country"
              className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Description Field */}
          <div className="col-span-2">
            <textarea
              id="description"
              name="description"
              placeholder="Briefly introduce yourself"
              className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        {/* Education Section */}
        <div className="border-b border-gray-300 pb-6 mb-4 mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Education</h2>
        </div>
        {education.map((edu, index) => (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2" key={index}>
            <div>
              <input
                id={`degree-${index}`}
                name="degree"
                type="text"
                placeholder="Degree"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={edu.degree}
                onChange={(e) => handleChange(index, education, 'degree', e.target.value)}
              />
            </div>
            <div>
              <input
                id={`institution-${index}`}
                name="institution"
                type="text"
                placeholder="Institution"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={edu.institution}
                onChange={(e) => handleChange(index, education, 'institution', e.target.value)}
              />
            </div>
            <div>
              <input
                id={`graduation-year-${index}`}
                name="graduation-year"
                type="text"
                placeholder="Year of Graduation"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={edu.graduationYear}
                onChange={(e) => handleChange(index, education, 'graduationYear', e.target.value)}
              />
            </div>
            <button type="button" onClick={() => handleRemoveEntry(index, education)} className="text-red-500">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddEntry(education)} className="text-indigo-500 mt-4">
          Add Education
        </button>

        {/* Work Experience Section */}
        <div className="border-b border-gray-300 pb-6 mb-4 mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Work Experience</h2>
        </div>
        {workExperience.map((work, index) => (
          <div className="grid grid-cols-1 gap-6" key={index}>
            <div>
              <input
                id={`work-job-title-${index}`}
                name="job-title"
                type="text"
                placeholder="Job Title"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={work.jobTitle}
                onChange={(e) => handleChange(index, workExperience, 'jobTitle', e.target.value)}
              />
            </div>
            <div>
              <input
                id={`work-company-${index}`}
                name="company"
                type="text"
                placeholder="Company"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={work.company}
                onChange={(e) => handleChange(index, workExperience, 'company', e.target.value)}
              />
            </div>
            <div>
              <input
                id={`work-duration-${index}`}
                name="duration"
                type="text"
                placeholder="Duration"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={work.duration}
                onChange={(e) => handleChange(index, workExperience, 'duration', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <textarea
                id={`work-responsibilities-${index}`}
                name="responsibilities"
                placeholder="Key Responsibilities"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={work.responsibilities}
                onChange={(e) => handleChange(index, workExperience, 'responsibilities', e.target.value)}
              />
            </div>
            <button type="button" onClick={() => handleRemoveEntry(index, workExperience)} className="text-red-500">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddEntry(workExperience)} className="text-indigo-500 mt-4">
          Add Work Experience
        </button>

        {/* Skills Section */}
        <div className="border-b border-gray-300 pb-6 mb-4 mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
        </div>
        {skills.map((skill, index) => (
          <div className="grid grid-cols-1 gap-6" key={index}>
            <div>
              <input
                id={`skill-${index}`}
                name="skill"
                type="text"
                placeholder="Skill"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={skill}
                onChange={(e) => handleChange(index, skills, 'skill', e.target.value)}
              />
            </div>
            <button type="button" onClick={() => handleRemoveEntry(index, skills)} className="text-red-500">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddEntry(skills)} className="text-indigo-500 mt-4">
          Add Skill
        </button>

        {/* Projects Section */}
        <div className="border-b border-gray-300 pb-6 mb-4 mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
        </div>
        {projects.map((project, index) => (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2" key={index}>
            <div>
              <input
                id={`project-title-${index}`}
                name="title"
                type="text"
                placeholder="Project Title"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={project.title}
                onChange={(e) => handleChange(index, projects, 'title', e.target.value)}
              />
            </div>
            <div>
              <input
                id={`project-link-${index}`}
                name="link"
                type="text"
                placeholder="Project Link"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={project.link}
                onChange={(e) => handleChange(index, projects, 'link', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <textarea
                id={`project-description-${index}`}
                name="description"
                placeholder="Project Description"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={project.description}
                onChange={(e) => handleChange(index, projects, 'description', e.target.value)}
              />
            </div>
            <button type="button" onClick={() => handleRemoveEntry(index, projects)} className="text-red-500">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddEntry(projects)} className="text-indigo-500 mt-4">
          Add Project
        </button>

        {/* Achievements Section */}
        <div className="border-b border-gray-300 pb-6 mb-4 mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Achievements</h2>
        </div>
        {achievements.map((achievement, index) => (
          <div className="grid grid-cols-1 gap-6" key={index}>
            <div>
              <input
                id={`achievement-title-${index}`}
                name="title"
                type="text"
                placeholder="Achievement Title"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={achievement.title}
                onChange={(e) => handleChange(index, achievements, 'title', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <textarea
                id={`achievement-description-${index}`}
                name="description"
                placeholder="Achievement Description"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={achievement.description}
                onChange={(e) => handleChange(index, achievements, 'description', e.target.value)}
              />
            </div>
            <button type="button" onClick={() => handleRemoveEntry(index, achievements)} className="text-red-500">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddEntry(achievements)} className="text-indigo-500 mt-4">
          Add Achievement
        </button>

        {/* Testimonials Section */}
        <div className="border-b border-gray-300 pb-6 mb-4 mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Testimonials</h2>
        </div>
        {testimonials.map((testimonial, index) => (
          <div className="grid grid-cols-1 gap-6" key={index}>
            <div>
              <input
                id={`testimonial-author-${index}`}
                name="author"
                type="text"
                placeholder="Author"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={testimonial.author}
                onChange={(e) => handleChange(index, testimonials, 'author', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <textarea
                id={`testimonial-text-${index}`}
                name="text"
                placeholder="Testimonial"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={testimonial.text}
                onChange={(e) => handleChange(index, testimonials, 'text', e.target.value)}
              />
            </div>
            <button type="button" onClick={() => handleRemoveEntry(index, testimonials)} className="text-red-500">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddEntry(testimonials)} className="text-indigo-500 mt-4">
          Add Testimonial
        </button>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
