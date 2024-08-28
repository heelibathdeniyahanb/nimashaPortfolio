import React, { useState } from 'react';
import Logo from '../../Images/nima 1.png'

const NavBar = ({ scrollToHome, scrollToAbout, scrollToResume, scrollToProjects,scrollToBlogs }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-100 text-black fixed top-0 w-full z-10 shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          <img
            alt="logo"
            src={Logo}
            className="h-10"
          />
        </div>
        <div className="hidden md:flex space-x-4 font-semibold">
          <button onClick={scrollToHome} className="hover:text-orange-500 transition duration-300">Home</button>
          <button onClick={scrollToAbout} className="hover:text-orange-500 transition duration-300">About</button>
          <button onClick={scrollToResume} className="hover:text-orange-500 transition duration-300">Resume</button>
          <button onClick={scrollToProjects} className="hover:text-orange-500 transition duration-300">Projects</button>
          <button onClick={scrollToBlogs} className="hover:text-orange-500 transition duration-300">Blogs</button>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none" aria-label="Toggle Menu">
            ☰
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 bg-gray-200 p-4">
          <button onClick={scrollToHome} className="block py-2 px-4 hover:text-orange-500 transition duration-300 w-full text-left">Home</button>
          <button onClick={scrollToAbout} className="block py-2 px-4 hover:text-orange-500 transition duration-300 w-full text-left">About</button>
          <button onClick={scrollToResume} className="block py-2 px-4 hover:text-orange-500 transition duration-300 w-full text-left">Resume</button>
          <button onClick={scrollToProjects} className="block py-2 px-4 hover:text-orange-500 transition duration-300 w-full text-left">Projects</button>
          <button onClick={scrollToBlogs} className="block py-2 px-4 hover:text-orange-500 transition duration-300 w-full text-left">Blogs</button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;