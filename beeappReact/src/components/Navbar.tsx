import { 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Spacer, 
  HStack,
  Link,
} from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { UserContext } from '../context/UserContext'
import httpClient from "../httpClient"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  //const toast = useToast()
  const {token, setToken} = useContext(UserContext)
  const [username, setUsername] = useState("")
  const navigate = useNavigate()

  useEffect(()=>{
    async function func(){
    
      try{
        const resp = await httpClient.get("//localhost:5000/auth/@me", {
          headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          }
        });
        if (resp.status !== 200) {
            console.log(resp)
        }
        setUsername(resp.data["username"])
      } catch (error) {
        console.error("Error fetching user:", error);
      }


    }
    func()
  }, [token])


  const logoutUser = async () =>{
      setToken("")
      localStorage.removeItem('jwt_token')
      await httpClient.delete("//localhost:5000/auth/logout", {
        headers:{
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      });
      window.location.href = '/'
  }


  return (
    <Flex as="nav" p="10px" mb="60px" alignItems="center" justifyContent='center'>
    <Heading as="h1" fontSize="1.5em">Bee Smart</Heading>
    <Spacer />
    <HStack spacing="20px">
      {token && token !== "" && token !== null ? (
        <>
          <Button onClick={() => navigate('../dashboard')}>Dashboard</Button>
          <Button onClick={() => navigate('../dashboard/createApiary')}>Add apiary</Button>
          <Spacer/>
          <Text>{username}</Text>
          <Button onClick={() => logoutUser()}>Logout</Button>
        </>
      ) : (   
        <>    
          <Button onClick={()=> window.location.href = 'login'}>Login</Button>
          <Link fontWeight='bold' href="register">Register</Link>
        </>
      )}
    </HStack>
  </Flex>
  )
}