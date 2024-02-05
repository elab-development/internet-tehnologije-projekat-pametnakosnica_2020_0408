import { 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Spacer, 
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react"
import { useContext, useState } from "react"
import { UserContext } from '../context/UserContext'
import httpClient from "../httpClient"
import { Form, useNavigate } from "react-router-dom"

export default function Navbar() {
  const {user, setUser} = useContext(UserContext)
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [apiaryName, setApiaryName] = useState('')
  const [apiaryLocation, setApiaryLocation ] = useState('')
  const handleNameChange = (event: any) => setApiaryName(event.target.value)
  const handleLocationChange = (event: any) => setApiaryLocation(event.target.value)
  const toast = useToast()

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

  const createApiary = async () =>{
    try{
        const resp = await httpClient.post("//localhost:5000/apiary/create", {
          "name": apiaryName,
        "location": apiaryLocation
      }, {
          headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          }
        });
        if(resp.status === 200){
            console.log(resp)
        }else{
          toast({
            title: resp.statusText,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top'
          })
        }
    }
    catch (error: any) {
      console.log(error)
    }
  }


  return (
    <Flex as="nav" p="10px" mb="60px" alignItems="center" justifyContent='center'>
    <Heading as="h1" fontSize="1.5em">Bee Smart</Heading>
    <Spacer />
    <HStack spacing="20px">
      {user.token && user.token !== "" && user.token !== null ? (
        <>
          <Button onClick={() => navigate('../dashboard')}>Apiary Dashboard</Button>
          <Button onClick={onOpen}>Create new apiary</Button>
          <Spacer/>
          <Text>{user.username}</Text>
          <Button onClick={() => logoutUser()}>Logout</Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create new apiary</ModalHeader>
              <ModalCloseButton/>
              <ModalBody>
              <Flex p="10px" mb="10px" flexDirection="column" alignItems="center">
                    <Form>
                        <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input type="text" onChange={handleNameChange}/>
                        </FormControl>
                        <FormControl>
                        <FormLabel>Location</FormLabel>
                        <Input type="text" onChange={handleLocationChange}/>
                        </FormControl>
                    </Form>
                </Flex>
              </ModalBody>
              <ModalFooter justifyContent='center'>
                <Button colorScheme='blue' mr={3} onClick={()=> {onClose(); createApiary();}}>
                  Create
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
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