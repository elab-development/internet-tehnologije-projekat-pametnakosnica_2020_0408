import { useContext, useEffect, useState } from 'react';
import { Form, useNavigate, useParams } from 'react-router-dom';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Bar, BarChart, Legend } from 'recharts';
import httpClient from '../httpClient';
import { UserContext } from '../context/UserContext';
import { Box, Button, CircularProgress, Flex, FormControl, FormLabel, Grid, GridItem, HStack, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import { Beehive } from '../models';
import inside1 from "../assets/inside1.jpg"
import { buttonStyles, modalStyles } from '../utils/themes';
import { CSVLink } from 'react-csv';
import { useApiGet } from '../hooks/useFetchBearer';

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
  const { data, loading, } = useApiGet(`//localhost:5000/apiary/beehive/get_measurements/${apiaryId}/${beehiveId}`);

  useEffect(() => {
      if (data){
        setBeehiveMeasurements(data.beehive_measurements);
        setBeehive(data.beehive);
      }
  }, [data]);

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
            window.location.reload()
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
    <Grid
      alignItems="center"
      justifyContent="center"
      height="130vh"
      sx={{
        backgroundImage: inside1,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'top',
        backgroundSize: 'cover',
        backdropFilter: 'blur(5px)',
      }}
      templateRows='repeat(8, 1fr)'
      gap={5}
    >
        <GridItem rowSpan={1} justifySelf='center' mt="8vh">
        <HStack gap={10}>
            <Button sx={buttonStyles} onClick={() => navigate(`/beehivedash/${apiaryId}`)} >Back</Button>
            <Button sx={buttonStyles} onClick={onOpen}>Edit beehive</Button>
            {beehiveMeasurements.length > 0 && (
                <CSVLink data={beehiveMeasurements} filename={`${beehive?.displayname}.csv`}>
                    <b>DOWNLOAD DATA</b>
                </CSVLink>
            )}
            <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent sx={modalStyles}>
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
        </GridItem>
      {loading ? (
        <GridItem rowSpan={6} justifySelf="center">
          <CircularProgress isIndeterminate color='#352f31' thickness='12px'/>
        </GridItem>
      ) : (
        <>
          {beehiveMeasurements.length > 0 ? (
            <Box width="90vw" sx={{ backgroundColor: 'rgba(255, 189, 33, 0.7)',
              padding: '5vmin',
              borderRadius: "15px",
              direction: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 5
            }}>
              <GridItem rowSpan={3}>
                <HStack justifyContent='center' alignItems='center' mb='2vh'>
                  <Heading>Beehive ID: {beehive?.id ?? ""}</Heading>
                </HStack>
                <HStack>
                  <ResponsiveContainer width="90%" height={300}>
                    <LineChart data={beehiveMeasurements} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip contentStyle={{backgroundColor: "#ffbd21", borderRadius: "15px"}} itemStyle={{ color: "#352f31", fontWeight: 'bold'}} />
                      <Legend/>
                      <Line type="linear" dataKey="temperature" stroke="#fc1a0a" name="Temperature" strokeWidth='3px'/>
                      <Line type="linear" dataKey="humidity" stroke="#4284f5" name="Humidity" strokeWidth='3px'/>
                    </LineChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="90%" height={300}>
                    <BarChart data={beehiveMeasurements} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid enableBackground='blue' strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip contentStyle={{backgroundColor: "#ffbd21", borderRadius: "15px"}} itemStyle={{ color: "#352f31", fontWeight: 'bold'}} />
                      <Legend/>
                      <Bar dataKey="weight" stackId="a" fill="#24272b" name='Weight' />
                      <Bar dataKey="food_remaining" stackId="a" fill="#63702e" name='Food remaining' />
                    </BarChart>
                  </ResponsiveContainer>
                </HStack>
              </GridItem>
              <GridItem rowSpan={3} justifySelf='center' ml="5vw">
                <ResponsiveContainer width="90%" height={300}>
                  <LineChart data={beehiveMeasurements} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={{backgroundColor: "#ffbd21", borderRadius: "15px"}} itemStyle={{ color: "#352f31", fontWeight: 'bold'}} />
                    <Legend />
                    <Line type="monotone" dataKey="air_pressure" stroke="#bed4fa" name="Air pressure" strokeWidth="3px"/>
                  </LineChart>
                </ResponsiveContainer>
              </GridItem>
            </Box>
          ) : (
            <GridItem colSpan={6} justifySelf='center'>
                <Heading>No data</Heading>
                <Heading>Beehive ID: {beehive?.id ?? ""}</Heading>
            </GridItem>
          )}
        </>
      )}
      <GridItem rowSpan={1}>

      </GridItem>
    </Grid>
  )
};

export default BeehiveStats
