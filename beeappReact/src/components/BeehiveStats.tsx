import { useContext, useEffect, useState } from 'react';
import { Form, useNavigate, useParams } from 'react-router-dom';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Bar, BarChart } from 'recharts';
import httpClient from '../httpClient';
import { UserContext } from '../context/UserContext';
import { Button, Flex, FormControl, FormLabel, Grid, GridItem, HStack, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import { Beehive } from '../models';

const BeehiveStats = () => {
  const { apiaryId, beehiveId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [beehive, setBeehive] = useState<Beehive>()
  const [beehiveMeasurements, setBeehiveMeasurements] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [devicename, setDeviceName] = useState('')
  const [beehivename, setBeehiveName] = useState('')
  const handleDNameChange = (event: any) => setDeviceName(event.target.value)
  const handleBNameChange = (event: any) => setBeehiveName(event.target.value)
  const toast = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await httpClient.get(`//localhost:5000/apiary/beehive/get_measurements/${apiaryId}/${beehiveId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token,
          },
        });

        if (response.status === 200) {
          console.log(response.data['beehive'])
          setBeehiveMeasurements(response.data.beehive_measurements);
          setBeehive(response.data['beehive'])
        } else {
          console.error('Error fetching data'); 
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }

    fetchData();
  }, []);

  const editBeehive = async () =>{
    try{
        const resp = await httpClient.put(`//localhost:5000/apiary/beehive/edit/${apiaryId}/${beehiveId}`, {
          "device": devicename,
        "displayname": beehivename
      }, {
          headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          }
        });
        if(resp.status === 200){
            console.log(resp)
            setBeehive({device: devicename, displayname: beehivename, id: ''})
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

  const deleteBeehive = async () => {
    try{
        const resp = await httpClient.delete(`//localhost:5000/apiary/beehive/delete/${apiaryId}/${beehiveId}`, {
          headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          }
        });
        if(resp.status === 200){
            toast({
              title: 'Beehive successfully deleted.',
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'top'
            })
        }else{
          toast({
            title: 'Error deleting a beehive.',
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
    <>
      {beehiveMeasurements.length > 0 ? (
        <>
          <Heading as="h3">Measurements in the {beehive && beehive.displayname}</Heading>
          <Grid templateColumns="repeat(3, 1fr)">
            <GridItem>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={beehiveMeasurements} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature" />
                  <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidity" />
                </LineChart>
              </ResponsiveContainer>
            </GridItem>
            <GridItem>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={beehiveMeasurements} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid enableBackground='blue' strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="weight" stackId="a" fill="#8884d8" />
                  <Bar dataKey="food_remaining" stackId="a" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </GridItem>
            <GridItem>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={beehiveMeasurements} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="air_pressure" stroke="#8884d8" name="Temperature" />
                </LineChart>
              </ResponsiveContainer>
            </GridItem>
          </Grid>
        </>
      ) : (
        <Heading>No data</Heading>
      )}
      <HStack>
            <Button onClick={() => navigate(`/beehivedash/${apiaryId}`)}>Back</Button>
            <Button onClick={onOpen}>Edit beehive</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit beehive {beehive && beehive["displayname"]}</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                <Flex p="10px" mb="10px" flexDirection="column" alignItems="center">
                      <Form>
                          <FormControl>
                          <FormLabel>Beehive name</FormLabel>
                          <Input type="text" placeholder={beehive && beehive["displayname"]} onChange={handleBNameChange}/>
                          </FormControl>
                          <FormControl>
                          <FormLabel>Controller model</FormLabel>
                          <Input type="text" placeholder={beehive && beehive["device"]} onChange={handleDNameChange}/>
                          </FormControl>
                      </Form>
                  </Flex>
                </ModalBody>
                <ModalFooter justifyContent='center'>
                  <Button colorScheme='red' mr={3} onClick={()=> {onClose(); deleteBeehive(); navigate(`/beehivedash/${apiaryId}`);}}>Delete</Button>
                  <Button colorScheme='blue' mr={3} onClick={()=> {onClose(); editBeehive()}}>Save changes</Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </HStack>
    </>
  );
  
};

export default BeehiveStats
