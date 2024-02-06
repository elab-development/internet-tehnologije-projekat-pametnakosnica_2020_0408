import { Button, Card, CardBody, CardFooter, CardHeader, Flex, FormControl, FormLabel, HStack, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import httpClient from "../httpClient";
import { UserContext } from "../context/UserContext";
import { Beehive } from "../models";

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

  useEffect(() => {
    async function func() {
      try {
        const resp = await httpClient.get(`//localhost:5000/apiary/beehive/get_beehives/${apiaryId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
        });

        if (resp.status === 200) {
          setBeehives(resp.data["beehives"]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    func();
  }, []);

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
    <>
    <HStack>
      <Button onClick={() => navigate(`/dashboard`)}>Back</Button>
      <Button onClick={onOpen}>Create new beehive</Button>
    </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new beehive</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
          <Flex p="10px" mb="10px" flexDirection="column" alignItems="center">
                <Form>
                    <FormControl>
                    <FormLabel>Controller name</FormLabel>
                    <Input type="text" onChange={handleDNameChange}/>
                    </FormControl>
                    <FormControl>
                    <FormLabel>Beehive name</FormLabel>
                    <Input type="text" onChange={handleBNameChange}/>
                    </FormControl>
                </Form>
            </Flex>
          </ModalBody>
          <ModalFooter justifyContent='center'>
            <Button colorScheme='blue' mr={3} onClick={()=> {onClose(); createBeehive();}}>
              Create beehive
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
      {beehives.map((beehive, index) => (
        <Card key={beehive.id}>
          <CardHeader>
            <Heading size='md'>{beehive.displayname}</Heading>
          </CardHeader>
          <CardBody>
            <Text>Device: {beehive.device}</Text>
            <Text>ID: {index + 1}</Text>
          </CardBody>
          <CardFooter>
            <Button onClick={() => navigate(`beehivestats/${index + 1}`)}>Check stats</Button>
          </CardFooter>
        </Card>
      ))}
    </SimpleGrid></>
  );
};
export default Beehives