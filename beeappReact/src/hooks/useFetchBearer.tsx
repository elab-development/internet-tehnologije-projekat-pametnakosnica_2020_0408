import { useEffect, useState, useContext } from "react"
import { UserContext } from "../context/UserContext"
import httpClient from "../httpClient"


export default function useFetchBearer(url: string): { data: any[], error: any, loading: boolean } {
    const { user } = useContext(UserContext);
    const [data, setData] = useState<any[]>([]); // Set initial value as an empty array
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                const response = await httpClient.get(url, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    }
                });
                setData(response.data);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [url]);

    return { data, error, loading };
}