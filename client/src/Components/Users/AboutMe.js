import React, { useEffect, useRef, useState } from 'react';
import myImage from '../../Images/myimage.jpg';
import { FaFileDownload } from "react-icons/fa";

export default function AboutMe() {
  const [isVisible, setIsVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState([false, false, false, false, false]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timeouts = detailsVisible.map((_, index) => 
        setTimeout(() => {
          setDetailsVisible(prev => {
            const newVisibility = [...prev];
            newVisibility[index] = true;
            return newVisibility;
          });
        }, index * 500)
      );
      
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    } else {
      setDetailsVisible([false, false, false, false, false]);
    }
  }, [isVisible]);

  return (
    <div ref={sectionRef} className="p-8 bg-white shadow-lg rounded-lg">
      <div className='text-4xl font-bold mb-6 text-center animate-fade-in'>
        About <span className='text-orange-600'>Myself</span>
      </div>
      <div className="border-b-2 border-orange-500 w-16 mx-auto mb-8 animate-expand"></div>
     
      <div className='flex flex-col md:flex-row items-center md:items-start text-black'>
        {/* Image Section */}
        <div className={`w-full md:w-1/2 mb-6 md:mb-0 transition-all duration-1000 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
          <img
            src={myImage}
            alt="Profile"
            className="w-full h-auto rounded-lg shadow-xl"
          />
        </div>
       
        {/* Text Section */}
        <div className={`w-full md:w-1/2 md:pl-8 transition-all duration-1000 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <h1 className="text-xl md:text-4xl font-bold mb-4">
            Hello, I Am <span className="text-orange-600">Nimasha Heelibathdeniya</span>
          </h1>
          <p className="text-lg mb-6 leading-relaxed">
          I am a dedicated and passionate software developer with a calm and focused approach to problem-solving. My enthusiasm for coding drives me to continuously enhance my skills and stay updated with the latest technologies. I am committed to personal growth and professional development, always seeking opportunities to learn and take on new challenges.
          </p>
         
          <div className="flex flex-col space-y-2 text-lg">
            <div className={`flex items-center transition-opacity duration-500 ${detailsVisible[0] ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-bold text-gray-700 w-24">Name:</span>
              <span className="ml-2">Nimasha Heelibathdeniya</span>
            </div>
            <div className={`flex items-center transition-opacity duration-500 ${detailsVisible[1] ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-bold text-gray-700 w-24">Age:</span>
              <span className="ml-2">23</span>
            </div>
            <div className={`flex items-center transition-opacity duration-500 ${detailsVisible[2] ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-bold text-gray-700 w-24">Address:</span>
              <span className="ml-2">Anuradhapura, Sri Lanka</span>
            </div>
            <div className={`flex items-center transition-opacity duration-500 ${detailsVisible[3] ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-bold text-gray-700 w-24">Phone No.:</span>
              <span className="ml-2">078 373 9971 / 071 213 5326</span>
            </div>
            <div className={`flex items-center transition-opacity duration-500 ${detailsVisible[4] ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-bold text-gray-700 w-24">Email:</span>
              <span className="ml-2">nimashabhn@gmail.com</span>
            </div>
          </div>

          <div className='mt-6'>
            <a 
              href="/CV.pdf"
              download
              className="
                inline-flex items-center px-6 py-3
                border-2 border-black
                bg-orange-500
                text-white
                rounded-lg
                hover:bg-transparent
                hover:border-orange-500
                hover:text-orange-500
                transition duration-300
                text-lg
                font-semibold
              ">
              <FaFileDownload className="mr-2" />
              Download CV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
