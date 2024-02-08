import { 
  Flex, Heading, Button, Spacer, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, FormControl, FormLabel, Input, useToast, CircularProgress ,Image, Grid, GridItem,
} from "@chakra-ui/react"
import { useContext, useState } from "react"
import { UserContext } from '../context/UserContext'
import httpClient from "../httpClient"
import { Form, useNavigate } from "react-router-dom"
import logo from '../assets/logo.png'
import { buttonStyles, flexStyles } from "../utils/themes"

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

  return (
    <Grid
      sx={{
        ...flexStyles,
        borderBottom: '5px solid #352f31',
        textAlign: 'center',
      }}
      as="nav"
      templateColumns='repeat(3, 1fr)'
      gap={1}
    >
      <GridItem>
        <Link onClick={() => {navigate('/') }} _hover={{fontStyle: 'normal'}}>
          <HStack>
            <Image src={logo} />
            <Heading as="h1" fontSize="3.5em" fontStyle='bold'>Bee Smart</Heading>
          </HStack>
        </Link>
      </GridItem>
        <Heading>
        {loading ? (
            <CircularProgress isIndeterminate color='#352f31' thickness='12px'/>
        ) : (
            user.username !== "" && user.username !== null ? `Welcome ${user.username}` : ""
        )}
        </Heading>
      <GridItem justifySelf="end">
        <HStack spacing="20px">
          {loading ? (
            <></>
          ) : (
            <>
              {user.token && user.token !== null ? (
                <>
                  <HStack>
                    <Button sx={buttonStyles} onClick={() => navigate('../dashboard')}>Apiary Dashboard</Button>
                    <Button sx={buttonStyles} onClick={onOpen}>Create new apiary</Button>
                    <Spacer/>
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
                  </HStack>
                </>
              ) : (   
                <>    
                  <Button sx={buttonStyles} onClick={()=> window.location.href = '/login'}>Login</Button>
                  <Link fontWeight='bold' onClick={()=> window.location.href = '/register'}>Register</Link>
                </>
              )}
            </>
          )}
        </HStack>
      </GridItem>
    </Grid>
  )
}