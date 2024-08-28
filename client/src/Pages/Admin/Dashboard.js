import React from 'react'
import AdminNavBar from '../../Components/Admin/AdminNavBar'
import ProjectView from '../../Components/Users/ProjectView'
import AdminProject from '../../Components/Admin/AdminProject'
import AdminBlogs from '../../Components/Admin/AdminBlogs'

export default function Dashboard() {
  return (
    <div><AdminNavBar/>
    <AdminProject/>
    <AdminBlogs/>
   </div>
    
  )
}
