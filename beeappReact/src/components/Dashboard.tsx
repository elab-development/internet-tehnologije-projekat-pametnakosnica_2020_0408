import { useContext, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import httpClient from '../httpClient';
import { UserContext } from '../context/UserContext';
import { Button, CircularProgress, Flex, FormControl, FormLabel, Grid, GridItem, HStack, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, VStack, useDisclosure, useToast } from '@chakra-ui/react';
import { Form, useNavigate } from 'react-router-dom';
import { Apiary } from '../models';
import { buttonStyles, modalStyles, prevNextButtonStyles } from '../utils/themes';
import inside1 from '../assets/inside1.jpg'
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

const Dashboard = () => {
  const [apiaryMeasurements, setApiaryMeasurements] = useState([]);
  const [apiary, setApiary] = useState<Apiary>();
  const [currentApiary, setCurrentApiary] = useState(1);
  const {user, } = useContext(UserContext)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const handleNameChange = (event: any) => setName(event.target.value)
  const handleLocationChange = (event: any) => setLocation(event.target.value)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function func() {
    setLoading(true)
      try {
        const resp = await httpClient.get(`//localhost:5000/apiary/get_measurements/${currentApiary}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
        });

        if (resp.status === 200) {
          setApiaryMeasurements(resp.data["measurements"]);
          setApiary(resp.data["apiary"]);
        } else if (resp.status === 204) {
          setCurrentApiary(1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false)
    }
    func();
  }, [currentApiary]);

  const editApiary = async () =>{
    try{
        const resp = await httpClient.put(`//localhost:5000/apiary/edit/${currentApiary}`, {
          "name": name,
        "location": location
      }, {
          headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          }
        });
        if(resp.status === 200){
            console.log(resp)
            setApiary({name: name, location: location, id: ''})
            toast({
              title: resp.statusText,
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

  const deleteApiary = async () => {
    try{
      const resp = await httpClient.delete(`//localhost:5000/apiary/delete/${currentApiary}`, {
        headers:{
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        }
      });
      if(resp.status === 200){
          setCurrentApiary(1);
          toast({
            title: 'Apiary successfully deleted.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top'
          })
      }else{
        toast({
          title: 'Error deleting the apiary.',
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
    alignItems="center"
    justifyContent="center"
    height="100vh"
    sx={{
        backgroundImage: inside1,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'top',
        backgroundSize: 'cover',
        backdropFilter: 'blur(5px)',
    }}
    templateColumns='repeat(8, 1fr)'
    gap={5}
    >
    {loading ? (
        <GridItem colSpan={8} justifySelf='center'>
            <CircularProgress isIndeterminate color='#352f31' thickness='12px'/>
        </GridItem>
        ) : (
            <>
            <GridItem colSpan={1} justifySelf="end"> 
                <Button rightIcon={<ArrowLeftIcon/>} sx={prevNextButtonStyles} onClick={()=> {if (currentApiary > 1) {setCurrentApiary(currentApiary-1)}}}>Previous</Button>
            </GridItem>
            <GridItem colSpan={6}> 
                {apiaryMeasurements.length > 0 ? (
                <Grid sx={{ backgroundColor: 'rgba(255, 189, 33, 0.7)', padding: '5vmin', borderRadius: "15px"}}>
                <GridItem justifySelf='center'>
                  <Heading as="h2">Temperature and humidity in {apiary && apiary["name"]} apiary in {apiary && apiary["location"]}</Heading>
                </GridItem>
                <ResponsiveContainer aspect={2}>
                    <LineChart data={apiaryMeasurements} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={{backgroundColor: "#ffbd21", borderRadius: "15px"}} itemStyle={{ color: "#352f31", fontWeight: 'bold'}} />
                    <Legend />
                    <Line type="linear" dataKey="temperature" stroke="#fc1a0a" name="Temperature" strokeWidth='4px'/>
                    <Line type="linear" dataKey="humidity" stroke="#4284f5" name="Humidity" strokeWidth='4px'/>
                    </LineChart>
                </ResponsiveContainer>
                <HStack>
                <Spacer/>
                <Button sx={buttonStyles} onClick={()=> navigate(`/beehivedash/${currentApiary}`)}>Check Beehives</Button>
                <Button sx={buttonStyles} onClick={onOpen}>Edit apiary</Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay/>
                    <ModalContent sx={modalStyles}>
                    <ModalHeader>Edit apiary {apiary && apiary["name"]}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Flex  >
                        <Form>
                            <FormControl>
                              <FormLabel>New name</FormLabel>
                              <Input type="text" placeholder={apiary && apiary["name"]} onChange={handleNameChange}/>
                            </FormControl>
                            <FormControl>
                              <FormLabel>Location</FormLabel>
                              <Input type="text" placeholder={apiary && apiary["location"]} onChange={handleLocationChange}/>
                            </FormControl>
                        </Form>
                        </Flex>
                    </ModalBody>
                    <ModalFooter justifyContent='center'>
                        <Button colorScheme='red' mr={3} onClick={()=> {onClose(); deleteApiary()}}>Delete apiary</Button>
                        <Button colorScheme='blue' mr={3} onClick={()=> {onClose(); editApiary()}}>
                        Save changes
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
                <Spacer/>
                </HStack>
                </Grid>
                ) : (
                <Grid sx={{ backgroundColor: 'rgba(255, 189, 33, 0.7)', padding: '5vmin', borderRadius: "15px"}}>
                  <GridItem justifySelf='center'>
                    <VStack>
                      <Heading >{apiary && apiary["name"]} apiary in {apiary && apiary["location"]}</Heading>
                      <Heading margin='10px'>No data</Heading>
                    </VStack>
                  </GridItem>
                  <HStack>
                    <Spacer/>
                    <Button sx={buttonStyles} onClick={onOpen}>Edit apiary</Button>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay/>
                        <ModalContent sx={modalStyles}>
                        <ModalHeader>Edit apiary {apiary && apiary["name"]}</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <Flex  >
                            <Form>
                                <FormControl>
                                  <FormLabel>New name</FormLabel>
                                  <Input type="text" placeholder={apiary && apiary["name"]} onChange={handleNameChange}/>
                                </FormControl>
                                <FormControl>
                                  <FormLabel>Location</FormLabel>
                                  <Input type="text" placeholder={apiary && apiary["location"]} onChange={handleLocationChange}/>
                                </FormControl>
                            </Form>
                            </Flex>
                        </ModalBody>
                        <ModalFooter justifyContent='center'>
                            <Button colorScheme='red' mr={3} onClick={()=> {onClose(); deleteApiary()}}>Delete apiary</Button>
                            <Button colorScheme='blue' mr={3} onClick={()=> {onClose(); editApiary()}}>
                            Save changes
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <Spacer/>
                    </HStack>
                </Grid>
                )}
            </GridItem >
            <GridItem colSpan={1} justifySelf="start">
                <Button  leftIcon={<ArrowRightIcon/>} sx={prevNextButtonStyles} onClick={()=> setCurrentApiary(currentApiary+1)}>Next</Button>
            </GridItem>
            </>
        )}
    </Grid>
  )
};

export default Dashboard;