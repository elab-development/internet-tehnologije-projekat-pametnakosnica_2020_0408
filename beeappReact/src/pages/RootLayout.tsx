import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { Grid, GridItem } from "@chakra-ui/react"
//import Sidebar from "../components/Sidebar"

const RootLayout = () => {
  return (
    <Grid templateRows="repeat(6, 1fr)" bg="gray.150">
      {/* sidebar */}
      <GridItem
        rowSpan={1}
        bg="gray.500"
        //minHeight={{ lg: '100vh' }}
        p="20px"
        alignItems='center'
        justifyContent='center'
      >
      <Navbar />
      </GridItem>

      {/* main content & navbar */}
      <GridItem
        as="main"
        rowSpan={5} 
        p="40px"
      >
        {/* <Sidebar /> */}
        <Outlet />
      </GridItem>
    </Grid>
  )
}

export default RootLayout