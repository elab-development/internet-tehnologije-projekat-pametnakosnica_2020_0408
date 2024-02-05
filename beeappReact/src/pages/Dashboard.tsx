import { useContext, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import httpClient from '../httpClient';
import { UserContext } from '../context/UserContext';
import { Button, Grid, GridItem, HStack, Heading, Spacer } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [apiaryMeasurements, setApiaryMeasurements] = useState([]);
  const [apiary, setApiary] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const {user, } = useContext(UserContext)
  const navigate = useNavigate()

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

  return (
    <Grid alignItems="center" justifyContent='center'>
      <GridItem>
      <Heading as="h3">Measurements in the {apiary && apiary["name"]} apiary in {apiary && apiary["location"]}</Heading>
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
        <Spacer/>
        <Button onClick={()=> setCurrentPage(currentPage+1)}>Next</Button>
        </HStack>
      </GridItem>
    </Grid>
  );
};

export default Dashboard;