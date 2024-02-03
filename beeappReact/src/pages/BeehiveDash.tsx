import { Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import httpClient from "../httpClient";
import { UserContext } from "../context/UserContext";
import { Beehive } from "../models";

const BeehiveDash = () => {
  const { apiaryId } = useParams();
  const {user, } = useContext(UserContext)
  const [beehives, setBeehives] = useState<Beehive[]>([])

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
      {beehives.map((beehive) => (
        <Card key={beehive.id}>
          <CardHeader>
            <Heading size='md'>{beehive.displayname}</Heading>
          </CardHeader>
          <CardBody>
            <Text>Device: {beehive.device}</Text>
            <Text>ID: {beehive.id}</Text>
          </CardBody>
          <CardFooter>
            <Button>View Details</Button>
          </CardFooter>
        </Card>
      ))}
    </SimpleGrid>
  );
};
export default BeehiveDash