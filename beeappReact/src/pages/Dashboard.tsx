import { useContext, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import httpClient from '../httpClient';
import { UserContext } from '../context/UserContext';
import { Button, Flex, FormControl, FormLabel, Grid, GridItem, HStack, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, useDisclosure, useToast } from '@chakra-ui/react';
import { Form, useNavigate } from 'react-router-dom';
import { Apiary } from '../models';

const Dashboard = () => {
  const [apiaryMeasurements, setApiaryMeasurements] = useState([]);
  const [apiary, setApiary] = useState<Apiary>();
  const [currentPage, setCurrentPage] = useState(1);
  const {user, } = useContext(UserContext)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const handleNameChange = (event: any) => setName(event.target.value)
  const handleLocationChange = (event: any) => setLocation(event.target.value)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    async function func() {
      try {
        const resp = await httpClient.get(`//localhost:5000/apiary/get_measurements/${currentPage}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
        });

        if (resp.status === 200) {
          setApiaryMeasurements(resp.data["measurements"]);
          setApiary(resp.data["apiary"]);
        } else if (resp.status === 204) {
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    func();
  }, [currentPage]);

  const editApiary = async () =>{
    try{
        const resp = await httpClient.put(`//localhost:5000/apiary/edit/${currentPage}`, {
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

  return (
    <Grid alignItems="center" justifyContent='center'>
      <GridItem>
      <Heading as="h3">Measurements in the {apiary && apiary["name"]} apiary in {apiary && apiary["location"]}</Heading>
      {/* <Spacer/>
      <Button>Change the apiary</Button> */}
      {apiaryMeasurements.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={apiaryMeasurements}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {/* <Legend /> */}
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature" />
            <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidity" />
            {/* Add more lines for other measurements if needed */}
          </LineChart>
        </ResponsiveContainer>
      )}
      </GridItem>
      <GridItem alignItems="center" justifyContent='center'>
        <HStack>
        <Button onClick={()=> {if (currentPage > 1) {setCurrentPage(currentPage-1)}}}>Previous</Button>
        <Spacer/>
        <Button onClick={()=> navigate(`/beehivedash/${currentPage}`)}>Check Beehives</Button>
        <Button onClick={onOpen}>Edit apiary</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit apiary {apiary && apiary["name"]}</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                <Flex p="10px" mb="10px" flexDirection="column" alignItems="center">
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
                  <Button colorScheme='blue' mr={3} onClick={()=> {onClose(); editApiary()}}>
                    Save changes
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
        <Spacer/>
        <Button onClick={()=> setCurrentPage(currentPage+1)}>Next</Button>
        </HStack>
      </GridItem>
    </Grid>
  );
};

export default Dashboard;