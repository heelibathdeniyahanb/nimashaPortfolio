import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import LandingPage from './Pages/LandingPage';
import AboutForm from './Components/Admin/AboutForm';
import Login from './Pages/Admin/Login';
import Dashboard from './Pages/Admin/Dashboard';
import Project from './Pages/Admin/Project';
import ProjectsComponent from './Components/Admin/ProjectComponet';

import ProjectViewUser from './Pages/Users/ProjectView';
import AboutMe from './Components/Users/AboutMe';
import ResumeSection from './Components/Users/ResumeSection';
import ProjectView from './Components/Users/ProjectView';
import AdminProject from './Components/Admin/AdminProject';

function App() {
  return (
    <div className="App">
      <Router>
        {/* <nav>
          <Link to='/'>Home</Link>
        </nav> */}
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/portfolio' element={<AboutForm/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          {/* <Route path='/projects' element={<Project/>}></Route> */}
          <Route path='/project-view' element={<ProjectView/>}></Route>
          <Route path='/user-projects' element={<ProjectViewUser/>}></Route>
          <Route path='/about-me' element={<AboutMe/>}></Route>
          <Route path='/resume' element={<ResumeSection/>}></Route>
          {/* <Route path='/projects' element={<ProjectView/>}></Route> */}
          <Route path='/admin-projects' elemen={<AdminProject/>}></Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
