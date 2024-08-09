import React, { useState } from "react";
import TopBar2 from "../components/TopBar/TopBar";
import ProjectTable from "../components/Project/ProjectTable";
import Footer from "../components/Footer/Footer";

const ProjectPage = () => {
  return (
    <div>
      <TopBar2 />

      <ProjectTable />
      <Footer />
    </div>
  );
};

export default ProjectPage;
