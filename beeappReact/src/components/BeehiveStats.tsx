import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Bar, BarChart } from 'recharts';
import httpClient from '../httpClient';
import { UserContext } from '../context/UserContext';
import { Button, Grid, GridItem, Heading } from '@chakra-ui/react';

const BeehiveStats = () => {
  const { apiaryId, beehiveId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [beehive, setBeehive] = useState()
  const [beehiveMeasurements, setBeehiveMeasurements] = useState([]);

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
          setBeehiveMeasurements(response.data.beehive_measurements);
          setBeehive(response.data.beehive)
        } else {
          console.error('Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      {beehiveMeasurements.length > 0 ? (
          <><><Heading as="h3">Measurements in the {beehive && beehive["displayname"]}</Heading><Grid templateColumns='repeat(3, 1fr)'>
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                {/* <Legend /> */}
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
        <Button onClick={()=>navigate(`/beehivedash/${apiaryId}`)}>Back</Button></>
      ) : (
        <Heading>No data</Heading>
      )}
    </>
  );
};

export default BeehiveStats
