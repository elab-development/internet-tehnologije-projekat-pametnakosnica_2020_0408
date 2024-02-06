import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { Grid, GridItem } from "@chakra-ui/react"
//import Sidebar from "../components/Sidebar"

const RootLayout = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    </>
  )
}

export default RootLayout