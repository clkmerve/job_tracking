import React from 'react'
import TopBar2 from '../components/TopBar/TopBar'
import UserCreate from '../components/user/UserCreate/UserCreate'
import UserTable from '../components/user/UserTable/UserTable'
import Footer from '../components/Footer/Footer'

const Userpage = () => {
  return (
    <div>
      <TopBar2/>
      <UserCreate/>
      <p></p>
      <UserTable/>
      <Footer/>
    </div>
  )
}

export default Userpage
