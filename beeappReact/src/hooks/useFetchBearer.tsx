import { useState, useEffect, useContext } from 'react';
import httpClient from '../httpClient';
import { UserContext } from '../context/UserContext';

export type TApiResponse = {
  status: Number;
  statusText: String;
  data: any;
  error: any;
  loading: Boolean;
};

export const useApiGet = (url: string): TApiResponse => {
  const [status, setStatus] = useState<Number>(0);
  const [statusText, setStatusText] = useState<String>('');
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useContext(UserContext);

  const getAPIData = async () => {
    setLoading(true);
    try {
      const apiResponse = await httpClient.get(url, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + user.token,
                },
              });
      setStatus(apiResponse.status);
      setStatusText(apiResponse.statusText);
      setData(apiResponse.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAPIData();
  }, []);

  return { status, statusText, data, error, loading };
};