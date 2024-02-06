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
  CircularProgress,
  Image,
} from "@chakra-ui/react"
import { useContext, useState } from "react"
import { UserContext } from '../context/UserContext'
import httpClient from "../httpClient"
import { Form, useNavigate } from "react-router-dom"
import logo from '../assets/logo.png'
import CustomButton from "./CustomButton"

export default function Navbar() {
  const {user, setUser} = useContext(UserContext)
  const {loading, } = useContext(UserContext)
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
            toast({
              title: 'Apiary created successfully.',
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'top'
            })
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

  const flexStyles = {
    p: "30px",
    alignItems: "center",
    justifyContent: 'center',
    background: "#ffbd21"
  }

  const buttonStyles = {
    bg: '#352f31',
    color:'wheat',
    _hover: {bg:'#ffd77a'}
  }

  return (
    <Flex sx={flexStyles} as="nav">
      <HStack>
        <Image src={logo} />
        <Heading as="h1" fontSize="1.5em">Bee Smart</Heading>
      </HStack>
      <Spacer />  
      <HStack spacing="20px">
        {loading ? (
          <CircularProgress isIndeterminate color='green.300' thickness='12px'/>
        ) : (
          <>
            {user.token && user.token !== null ? (
  <>
    <Heading>Welcome {user.username}</Heading>
    <Spacer />
    <HStack>
      <Button sx={buttonStyles} onClick={() => navigate('../dashboard')}>Apiary Dashboard</Button>
      <Button sx={buttonStyles} onClick={onOpen}>Create new apiary</Button>
    </HStack>
    <Spacer />
    <Button sx={buttonStyles} onClick={() => logoutUser()}>Logout</Button>

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

          </>
        )}
      </HStack>
    </Flex>
  )
}