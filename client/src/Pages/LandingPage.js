import React, { useState, useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import NavBar from '../Components/Common/NavBar';
import BackgroundImg from '../Images/Background.jpg';
import ContactForm from '../Components/Common/ContactForm';
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaBriefcase } from "react-icons/fa";
import ProjectView from '../Components/Users/ProjectView';
import AboutMe from '../Components/Users/AboutMe';
import ResumeSection from '../Components/Users/ResumeSection';
import BlogView from '../Components/Users/BlogView';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Create refs for each section
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const resumeRef = useRef(null);
  const projectRef = useRef(null);
  const blogRef = useRef(null);


  const socialLinks = [
    { icon: FaFacebook, href: 'https://web.facebook.com/people/Nimasha-Heelibathdeniya/pfbid0MAbKovsok5W1sm2zSrZfdWQSzmw88WUsdpeEVtB3Y1mV4mpo1X3oViWqSgZTLTLal/', color: 'text-blue-600' },
    { icon: FaInstagram, href: 'https://www.instagram.com/', color: 'text-pink-600' },
    { icon: FaLinkedin, href: 'http://www.linkedin.com/in/nimasha-heelibathdeniya-696060267', color: 'text-blue-700' },
    { icon: FaGithub, href: 'https://github.com/heelibathdeniyahanb', color: 'text-gray-800' },
  ];

  // Function to scroll to a section
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const Footer = () => (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-2xl font-bold">Nimasha Heelibathdeniya</h3>
            <p className="mt-2">Full Stack Developer</p>
          </div>
          <div className="w-full md:w-1/3 text-center mb-4 md:mb-0">
            <p>&copy; 2024 All Rights Reserved</p>
          </div>
          <div className="w-full md:w-1/3 text-center md:text-right">
            <a href="#" className="text-white hover:text-orange-500 mx-2">Privacy Policy</a>
            <a href="#" className="text-white hover:text-orange-500 mx-2">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div>
      <NavBar 
        scrollToHome={() => scrollToSection(homeRef)}
        scrollToAbout={() => scrollToSection(aboutRef)}
        scrollToResume={() => scrollToSection(resumeRef)}
        scrollToProjects={() => scrollToSection(projectRef)}
        scrollToBlogs={() => scrollToSection(blogRef)}
      />
      
      <div
      
        ref={homeRef}
        className="relative min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${BackgroundImg})`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex-grow flex items-center justify-center text-center md:text-left px-4 md:px-20">
          <div className="flex flex-col items-center justify-items-start">
            <div className="mb-8 ml-5 justify-items-start">
              <TypeAnimation
                sequence={[
                  "I'm Nimasha Heelibathdeniya",
                  1000,
                  "I'm a Full Stack Developer",
                  1000,
                ]}
                speed={50}
                repeat={Infinity}
                style={{ fontSize: '4rem', fontWeight: 'bold', display: 'inline-block' }}
              />
            </div>
            <div className="flex flex-col items-center">
              <button
                className="px-6 py-3 border-2 border-black bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-transparent hover:border-orange-500 hover:text-orange-500 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400"
                onClick={openModal}
              >
                <FaBriefcase className="text-lg" />
                <span className="text-lg font-semibold">Hire Me</span>
              </button>
              <div className="mt-8 flex justify-center space-x-6">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`${social.color} hover:text-orange-500 transition duration-300 transform hover:scale-110`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent className="w-8 h-8" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContactForm isModalOpen={isModalOpen} closeModal={closeModal} />
      <div ref={aboutRef}><AboutMe /></div>
      <div ref={resumeRef}><ResumeSection /></div>
      <div ref={projectRef}><ProjectView /></div>
      <div ref={blogRef}><BlogView/></div>

      <Footer /> 
    </div>
  );
}