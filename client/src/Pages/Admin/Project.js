import React from 'react'
import AdminNavBar from '../../Components/Admin/AdminNavBar'
import AddProject from '../../Components/Admin/AddProject'
import ProjectsComponent from '../../Components/Admin/ProjectComponet'

export default function Project() {
  return (
    <div><AdminNavBar/>
    <AddProject/>
    <ProjectsComponent/></div>
  )
}
