import { Button, Card, CardBody, CardFooter, CardHeader, CircularProgress, Flex, FormControl, FormLabel, Grid, GridItem, HStack, Heading, IconButton, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import httpClient from "../httpClient";
import { UserContext } from "../context/UserContext";
import { Beehive } from "../models";
import inside1 from "../assets/inside1.jpg"
import { buttonStyles, cardStyles, modalStyles } from "../utils/themes";
import { FaTemperatureLow, FaMicrochip, FaSort, FaMagnifyingGlass } from "react-icons/fa6";
import { GiSlicedBread, GiWeight } from "react-icons/gi";
import { WiHumidity } from "react-icons/wi";
import { RiMistFill } from "react-icons/ri";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { TbAbc } from "react-icons/tb";

const Beehives = () => {
  const { apiaryId } = useParams();
  const { user } = useContext(UserContext)
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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [sortBy, setSortBy] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function func() {
      setLoading(true)
      try {
        const resp = await httpClient.get(`//localhost:5000/apiary/beehive/get_beehives/${apiaryId}/${currentPage}?search=${searchQuery}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
        });

        if (resp.status === 200) {
          setBeehives(resp.data["beehives"]);
        }
        if (resp.status === 204) {
          toast({
            title: "No beehives",
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
  }, [currentPage, searchQuery]);

  const createBeehive = async () => {
    try {
      const resp = await httpClient.post(`//localhost:5000/apiary/beehive/create/${apiaryId}`, {
        "device": devicename,
        "displayname": beehivename
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        }
      });
      if (resp.status === 200) {
        console.log(resp)
        if (beehives.length < 8){
          setBeehives((prevBeehives) => [
            ...prevBeehives,
            { device: devicename, displayname: beehivename, id: '' },
          ]);
        }
      } else {
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


  const handleSort = (criteria: string) => {

      setSortBy(criteria);
  }


  const sortedBeehives = [...beehives].sort((a, b) => {
    const numA = parseFloat(a.temperature ?? '');
    const numB = parseFloat(b.temperature ?? '');
    if (sortBy === 'displayname') {
      return sortOrder === 'asc' ? a.displayname.localeCompare(b.displayname) : b.displayname.localeCompare(a.displayname);
    } else if (sortBy === 'device') {
      return sortOrder === 'asc' ? a.device.localeCompare(b.device) : b.device.localeCompare(a.device);
    } else if (sortBy === 'temperature') {

      if (!isNaN(numA) && !isNaN(numB)) {
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      } else if (!isNaN(numA) && isNaN(numB)) {
        return sortOrder === 'desc' ? -1 : 1;
      } else if (isNaN(numA) && !isNaN(numB)) {
        return sortOrder === 'desc' ? 1 : -1;
      } else {
        return 0;
      }
    } else if (sortBy === 'food') {

      if (!isNaN(numA) && !isNaN(numB)) {
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      } else if (!isNaN(numA) && isNaN(numB)) {
        return sortOrder === 'desc' ? -1 : 1;
      } else if (isNaN(numA) && !isNaN(numB)) {
        return sortOrder === 'desc' ? 1 : -1;
      } else {
        return 0;
      }
    }
    return 0;
  });

  return (
    <Grid
      alignItems="center"
      justifyContent="center"
      height="170vh"
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
          <InputGroup width="10vw">
            <InputLeftElement pointerEvents='none'>
              <FaMagnifyingGlass color='gray.300'/>
            </InputLeftElement>
            <Input sx={buttonStyles} _focus={{bg:'#ffd77a', color: '#352f31'}}  type='tel' placeholder='Search' onChange={(e) => setSearchQuery(e.target.value)}/>
          </InputGroup>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<FaSort />}
              variant='outline'
              sx={buttonStyles}
              _active={{bg:'#ffd77a', color: '#352f31'}}
            >Sort</MenuButton>
            <MenuList backgroundColor="#ffbd21">
              <MenuItem backgroundColor="#ffbd21" _hover={{bg: "#352f31"}} icon={<TbAbc/>} onClick={()=>{setSortOrder('desc'); handleSort('displayname')}}>
                {<ChevronDownIcon />} Name desc 
              </MenuItem>
              <MenuItem backgroundColor="#ffbd21" _hover={{bg: "#352f31"}} icon={<TbAbc/>} onClick={()=>{setSortOrder('asc'); handleSort('displayname')}}>
                {<ChevronUpIcon />} Name asc 
              </MenuItem>
              <MenuItem backgroundColor="#ffbd21" _hover={{bg: "#352f31"}} icon={<FaMicrochip />} onClick={()=>{setSortOrder('desc'); handleSort('device')}}>
              {<ChevronDownIcon />} Controller desc 
              </MenuItem>
              <MenuItem backgroundColor="#ffbd21" _hover={{bg: "#352f31"}} icon={<FaMicrochip />} onClick={()=>{setSortOrder('asc'); handleSort('device')}}>
              {<ChevronUpIcon />} Controller asc
              </MenuItem>
              <MenuItem backgroundColor="#ffbd21" _hover={{bg: "#352f31"}} icon={<FaTemperatureLow />} onClick={()=>{setSortOrder('desc'); handleSort('temperature')}}>
              {<ChevronDownIcon />} Temperature desc
              </MenuItem>
              <MenuItem backgroundColor="#ffbd21" _hover={{bg: "#352f31"}} icon={<FaTemperatureLow />} onClick={()=>{setSortOrder('asc'); handleSort('temperature')}}>
              {<ChevronUpIcon />} Temperature asc
              </MenuItem>
              <MenuItem backgroundColor="#ffbd21" _hover={{bg: "#352f31"}} icon={<GiSlicedBread />} onClick={()=>{setSortOrder('desc'); handleSort('food')}}>
              {<ChevronDownIcon />} Food remaining desc
              </MenuItem>
              <MenuItem backgroundColor="#ffbd21" _hover={{bg: "#352f31"}} icon={<GiSlicedBread />} onClick={()=>{setSortOrder('asc'); handleSort('food')}}>
              {<ChevronUpIcon />} Food remaining asc
              </MenuItem>
            </MenuList>
          </Menu>
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
          <CircularProgress isIndeterminate color='#352f31' thickness='12px' />
        </GridItem>
      ) : (
        <>
          {sortedBeehives.length > 0 ? (
            <GridItem rowSpan={6}>
              <Flex sx={{
                backgroundColor: 'rgba(255, 189, 33, 0.4)',
                padding: '5vmin',
                borderRadius: "15px",
                direction: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 5,
                width: "90vw"
              }}>
                {sortedBeehives.map((beehive, index) => (
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
          ) : (
            <Grid sx={{ backgroundColor: 'rgba(255, 189, 33, 0.7)', padding: '5vmin', borderRadius: "15px"}}>
            <GridItem justifySelf='center'>
                <Heading margin='10px'>No data</Heading>
            </GridItem>
          </Grid>
          )}
        </>
      )}
      <GridItem rowSpan={1}>
        <Grid templateColumns='repeat(2, 1fr)'>
          <GridItem colSpan={1} justifySelf='center'>
            <Button sx={buttonStyles} onClick={() => { if (currentPage > 1) { setCurrentPage(currentPage - 1) } }}>Previous</Button>
          </GridItem>
          <GridItem colSpan={1} justifySelf='center'>
            <Button sx={buttonStyles} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  )

};
export default Beehives;



