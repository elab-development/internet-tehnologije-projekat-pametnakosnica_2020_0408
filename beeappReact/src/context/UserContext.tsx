import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import httpClient from "../httpClient";

export interface UserContextInterface {
  user: TokenData;
  setUser: Dispatch<SetStateAction<TokenData>>;
  loading: boolean;
}

type TokenData = {
  token: string | null;
  username: string | null;
  email: string | null;
};

const defaultState: UserContextInterface = {
  user: {
    token: localStorage.getItem("jwt_token"),
    username: null,
    email: null,
  },
  setUser: () => {},
  loading: true
};

export const UserContext = createContext(defaultState);

type UserProviderProps = {
  children: React.ReactNode;
};

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<TokenData>(defaultState.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (user.token) {
        try {
          setLoading(true);

          const resp = await httpClient.get("//localhost:5000/auth/@me", {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + user.token,
            },
          });
  
          if (resp.status === 200) {
            setUser({
              ...user,
              username: resp.data.username,
              email: resp.data.email,
            });
            localStorage.setItem("jwt_token", user.token ?? "");
          }
  
        } catch (error) {
          localStorage.removeItem('jwt_token')
          setUser({
            token: null,
            username: null,
            email: null,
          });
        }
      }
      setLoading(false);
    };
  
    fetchUser();
  }, [user.token]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

