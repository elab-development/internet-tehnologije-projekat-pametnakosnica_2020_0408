import { 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Spacer, 
  HStack,
  Link,
} from "@chakra-ui/react"
import { useContext } from "react"
import { UserContext } from '../context/UserContext'
import httpClient from "../httpClient"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const {user, setUser} = useContext(UserContext)
  const navigate = useNavigate()

  const logoutUser = async () =>{
      localStorage.removeItem('jwt_token')
      try{
        await httpClient.delete("//localhost:5000/auth/logout", {
          headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          }
        });
      }catch (error){
        console.log(error)
      }
      setUser({
        token: null,
        username: null,
        email: null,
      })
      window.location.href = '/'
  }


  return (
    <Flex as="nav" p="10px" mb="60px" alignItems="center" justifyContent='center'>
    <Heading as="h1" fontSize="1.5em">Bee Smart</Heading>
    <Spacer />
    <HStack spacing="20px">
      {user.token && user.token !== "" && user.token !== null ? (
        <>
          <Button onClick={() => navigate('../dashboard')}>Dashboard</Button>
          <Button onClick={() => navigate('../dashboard/createApiary')}>Add apiary</Button>
          <Spacer/>
          <Text>{user.username}</Text>
          <Button onClick={() => logoutUser()}>Logout</Button>
        </>
      ) : (   
        <>    
          <Button onClick={()=> window.location.href = '/login'}>Login</Button>
          <Link fontWeight='bold' onClick={()=> window.location.href = '/register'}>Register</Link>
        </>
      )}
    </HStack>
  </Flex>
  )
}