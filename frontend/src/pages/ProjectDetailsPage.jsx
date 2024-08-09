import React from 'react'
import TopBar2 from '../components/TopBar/TopBar'
import ProjectDetails from '../components/Project/Details/ProjectDetails'
import TaskPackages from '../components/TaskPackage/TaskPackages';
import Footer from '../components/Footer/Footer';
import ProjectTrackingTable from "../components/ProjectTracking/ProjectTrackingTable"
const ProjectDetailsPage = () => {
  
    return (
      <div>
     <TopBar2/>
      
        <ProjectDetails />
        <TaskPackages/>
        <ProjectTrackingTable/>      
        <Footer/>
      </div>
    );
  };
  

export default ProjectDetailsPage
