import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import httpClient from '../httpClient';

const Dashboard = () => {
  const [apiaryMeasurements, setApiaryMeasurements] = useState([]);
  const [apiary, setApiary] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function func() {
      try {
        const resp = await httpClient.get(`//localhost:5000/apiary/get_measurements/${currentPage}`);
        if (resp.status === 200) {
          setApiaryMeasurements(resp.data["measurements"]);
          setApiary(resp.data["apiary"]);
        } else {
          setCurrentPage(1);
          console.log(resp);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    func();
  }, [currentPage]);

  return (
    <div>
      <h2>Measurements in the {apiary && apiary["name"]} apiary in {apiary && apiary["location"]}</h2>
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
      <button onClick={()=> setCurrentPage(currentPage+1)}>Next Apiary</button>
    </div>
  );
};

export default Dashboard;