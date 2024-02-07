import { Button, Card, CardBody, CardFooter, CardHeader, CircularProgress, Flex, FormControl, FormLabel, Grid, GridItem, HStack, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import httpClient from "../httpClient";
import { UserContext } from "../context/UserContext";
import { Beehive } from "../models";
import inside1 from "../assets/inside1.jpg"
import { buttonStyles, cardStyles, modalStyles } from "../utils/themes";
import { FaTemperatureLow, FaMicrochip } from "react-icons/fa6";
import { GiSlicedBread, GiWeight } from "react-icons/gi";
import { WiHumidity } from "react-icons/wi";
import { RiMistFill } from "react-icons/ri";

const Beehives = () => {
  const { apiaryId } = useParams();
  const {user, } = useContext(UserContext)
  const [beehives, setBeehives] = useState<Beehive[]>([])
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [devicename, setDeviceName] = useState('')
  const [beehivename, setBeehiveName] = useState('')
  const handleDNameChange = (event: any) => setDeviceName(event.target.value)
  const handleBNameChange = (event: any) => setBeehiveName(event.target.value)
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function func() {
      setLoading(true)
      try {
        const resp = await httpClient.get(`//localhost:5000/apiary/beehive/get_beehives/${apiaryId}/${currentPage}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
        });

        if (resp.status === 200) {
          setBeehives(resp.data["beehives"]);
        }
        if (resp.status === 204){
            setCurrentPage(currentPage-1)
            toast({
                title: "No more beehives",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
              })
        }
      } catch (error) {
        toast({
          title: "Unable to get measurements.",
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
      }
      setLoading(false)
    }
    func();
  }, [currentPage]);

  const createBeehive = async () =>{
    try{
        const resp = await httpClient.post(`//localhost:5000/apiary/beehive/create/${apiaryId}`, {
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
            setBeehives((prevBeehives) => [
              ...prevBeehives,
              { device: devicename, displayname: beehivename, id: '' },
            ]);
        }else{
            setCurrentPage(1)
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
      templateRows='repeat(8, 1fr)'
      gap={5}
    >
      <GridItem rowSpan={1} justifySelf='center' mt="8vh">
        <HStack gap={10}>
          <Button sx={buttonStyles} onClick={() => navigate(`/dashboard`)}>Back</Button>
          <Button sx={buttonStyles} onClick={onOpen}>Create new beehive</Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent sx={modalStyles}>
              <ModalHeader>Create new beehive</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Flex p="10px" mb="10px" flexDirection="column" alignItems="center">
                  <Form>
                    <FormControl>
                      <FormLabel>Controller name</FormLabel>
                      <Input type="text" onChange={handleDNameChange} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Beehive name</FormLabel>
                      <Input type="text" onChange={handleBNameChange} />
                    </FormControl>
                  </Form>
                </Flex>
              </ModalBody>
              <ModalFooter justifyContent='center'>
                <Button colorScheme='blue' mr={3} onClick={() => { onClose(); createBeehive(); }}>
                  Create beehive
                </Button>
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
        <GridItem rowSpan={6}>
        <Flex sx={{ backgroundColor: 'rgba(255, 189, 33, 0.4)',
        padding: '5vmin',
        borderRadius: "15px",
        direction: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 5,
        width: "90vw"
        }}>
          {beehives.map((beehive, index) => (
            <Card sx={cardStyles} key={beehive.id}>
              <CardHeader>
                <Heading size='md'>{beehive.displayname}</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    <GridItem colSpan={1}>
                    <HStack justifyContent="center" alignItems="center">
                        <FaMicrochip color="grey" size='1.2em'/>
                        <Text>{beehive.device}</Text>
                    </HStack>
                    </GridItem>
                    <GridItem colSpan={1}>
                    <HStack justifyContent="center" alignItems="center">
                        <FaTemperatureLow color="#fc1a0a" size='1.2em'/>
                        <Text>{beehive.temperature ? `${beehive.temperature}°C` : 'N/A'}</Text>
                    </HStack>
                    </GridItem>
                    <GridItem colSpan={1}>
                    <HStack justifyContent="center" alignItems="center">
                        <WiHumidity color="#4284f5" size='1.5em'/>
                        <Text>{beehive.humidity ? `${beehive.humidity}%` : 'N/A'}</Text>
                    </HStack>
                    </GridItem>
                    <GridItem colSpan={1}>
                    <HStack justifyContent="center" alignItems="center">
                        <RiMistFill color="#bed4fa" size='1.5em'/>
                        <Text>{beehive.air_pressure ? `${beehive.air_pressure} hPa` : 'N/A'}</Text>
                    </HStack>
                    </GridItem>
                    <GridItem colSpan={1}>
                    <HStack justifyContent="center" alignItems="center">
                        <GiWeight color="#24272b" size='1.5em'/>
                        <Text>{beehive.weight ? `${beehive.weight} kg` : 'N/A'}</Text>
                    </HStack>
                    </GridItem>
                    <GridItem colSpan={1}>
                    <HStack justifyContent="center" alignItems="center">
                        <GiSlicedBread color="#63702e" size='1.5em'/>
                        <Text>{beehive.food_remaining ? `${beehive.food_remaining} kg` : 'N/A'}</Text>
                    </HStack>
                    </GridItem>
                </Grid>
                </CardBody>
              <CardFooter justifyContent='center'>
                <Button sx={buttonStyles} onClick={() => navigate(`beehivestats/${index + 1}`)}>Check stats</Button>
              </CardFooter>
            </Card>
          ))}
        </Flex>
      </GridItem>
      )}
      <GridItem rowSpan={1}>
        <Grid templateColumns='repeat(2, 1fr)'>
            <GridItem colSpan={1} justifySelf='center'>
                <Button sx={buttonStyles} onClick={()=> {if (currentPage > 1) {setCurrentPage(currentPage-1)}}}>Previous</Button>
            </GridItem>
            <GridItem colSpan={1} justifySelf='center'>
                <Button sx={buttonStyles} onClick={()=> setCurrentPage(currentPage+1)}>Next</Button>
            </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  )
  
};
export default Beehives