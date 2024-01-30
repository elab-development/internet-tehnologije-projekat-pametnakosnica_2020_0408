import React, { createContext, useEffect, useState, ReactNode } from "react";
import httpClient from "../httpClient";

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<[string | null, React.Dispatch<React.SetStateAction<string | null>>]>([null, () => {}]);

export const UserProvider: React.FC<UserProviderProps> = (props) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("jwt_token"));

  useEffect(() => {
    const fetchUser = async () => {
    //   const requestOptions = {
    //     method: "GET",
    //     mode: 'cors', // corrected from 'RequestMode'
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + token,
    //     },
    //   };
        const data = {}
        console.log(token)
        const options = {
            headers:{
                Authorization: "Bearer " + token,
            }

        }

        try{
        const resp = await httpClient.post("//localhost:5000/auth/@me",data, options);

        if (resp.status !== 200) {
          setToken(null);
        }
        localStorage.setItem("jwt_token", token || "");
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  );
};
