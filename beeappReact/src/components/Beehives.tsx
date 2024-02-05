import { Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import httpClient from "../httpClient";
import { UserContext } from "../context/UserContext";
import { Beehive } from "../models";

const Beehives = () => {
  const { apiaryId } = useParams();
  const {user, } = useContext(UserContext)
  const [beehives, setBeehives] = useState<Beehive[]>([])
  const navigate = useNavigate()

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
  
  
  return (
    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
      {beehives.map((beehive, index) => (
        <Card key={beehive.id}>
          <CardHeader>
            <Heading size='md'>{beehive.displayname}</Heading>
          </CardHeader>
          <CardBody>
            <Text>Device: {beehive.device}</Text>
            <Text>ID: {index+1}</Text>
          </CardBody>
          <CardFooter>
          <Button onClick={() => navigate(`beehivestats/${index+1}`)}>Check stats</Button>
          </CardFooter>
        </Card>
      ))}
    </SimpleGrid>
  );
};
export default Beehives