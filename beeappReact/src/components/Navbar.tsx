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

export default function Navbar() {
  //const toast = useToast()
  const {token, setToken} = useContext(UserContext)
  const [username, setUsername] = useState("")

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


  const logoutUser = () =>{
      setToken("")
      localStorage.removeItem('jwt_token')
      window.location.href = '/'
  }


  return (
    <Flex as="nav" p="10px" mb="60px" alignItems="center" justifyContent='center'>
    <Heading as="h1" fontSize="1.5em">Bee Smart</Heading>
    <Spacer />
    <HStack spacing="20px">
      {token && token !== "" && token !== null ? (
        <>
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