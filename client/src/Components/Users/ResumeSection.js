import React from 'react';


const ResumeSection = () => {
  return (
    <div className="bg-gray-100 text-black p-8">
      <div className="text-3xl font-bold mb-6 text-center animate-fade-in">
        My <span className="text-orange-600">Resume</span>
      </div>
      <div className="border-b-2 border-orange-500 w-16 mx-auto mb-8 animate-expand"></div>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            <span className="text-orange-500 mr-2">🎓</span>
            Education:
          </h2>
          <div className="space-y-6">
          <EducationItem 
              years="2022 - present"
              university="University of Moratuwa"
              degree="Information Technology and Management"
              description="Pursuing a Bachelor’s degree in Information Technology and Management (ITM) since 2022.   "
            />
            <EducationItem 
              years="2011 - 2019"
              school="Kekirawa Central College"
              description="G.C.E. Advanced Level (2020)
                Stream - Physical Science
                Results - Maths B | Chemistry B | Physics C and 
                G.C.E. Ordinary Level (2016)
                Results - 8 A’s and B"
            />
           
            <EducationItem 
              years="2020-2021"
              university="University of Rajarata"
              degree="Diploma in English"
              description="Developed advanced proficiency in English language and literature and 
                           engaged in comprehensive studies of linguistics, communication skills, and critical analysis"
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            <span className="text-orange-500 mr-2">🌐</span>
            Skills:
          </h2>
          <div className="space-y-6">
            <SkillCategory 
              category="Programming Languages"
              skills={["Java", "C", "C#"]}
            />
            <SkillCategory 
              category="Front End Development"
              skills={["React JS", "HTML", "CSS"]}
            />
            <SkillCategory 
              category="Back End Development"
              skills={[".NET Core", "JavaScript"]}
            />
            <SkillCategory 
              category="Database"
              skills={["MS SQL Server", "MySQL", "MongoDB"]}
            />
            <SkillCategory 
              category="UI/UX Designing"
              skills={["Figma"]}
            />
            <SkillCategory 
              category="Version Controlling"
              skills={["Git"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const EducationItem = ({ years, school, university, degree, description }) => (
  <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-orange-500">
    <p className="text-gray-400">{years}</p>
    <h3 className="text-xl text-orange-500 font-semibold my-2">{school}</h3>
    <h3 className="text-xl text-orange-500 font-semibold my-2">{university}</h3>
    <h3 className="text-xl text-orange-500 font-semibold my-2">{degree}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const SkillCategory = ({ category, skills }) => (
  <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-orange-500">
    <h3 className="text-xl text-orange-500 font-semibold my-2">{category}</h3>
    <ul className="list-disc list-inside text-gray-300">
      {skills.map((skill, index) => (
        <li key={index} className="ml-4">{skill}</li>
      ))}
    </ul>
  </div>
);

export default ResumeSection;
