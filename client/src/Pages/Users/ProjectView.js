import React from 'react';
import NavBar from '../../Components/Common/NavBar';
import ProjectView from '../../Components/Users/ProjectView';

export default function ProjectViewUser() {
  return (
    <div className=''>
        <div className='fixed top-0 left-0 w-full z-50'> <NavBar /></div>
     
      <div className="mt-20">
        <ProjectView />
      </div>
    </div>
  );
}
