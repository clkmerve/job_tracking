import React from 'react'
import UserProjectsTable from '../components/lists/UserProjectsTable'
import TopBar2 from '../components/TopBar/TopBar'
import Footer from '../components/Footer/Footer'

const UserProjectsTablePage = () => {
  return (
    <div>
      <TopBar2/>
      <UserProjectsTable/>
      <Footer/>
    </div>
  )
}

export default UserProjectsTablePage
