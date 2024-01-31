import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import httpClient from "../httpClient";

// interface UserProviderProps {
//   children: ReactNode;
// }

// export const UserContext = createContext<[string | null, React.Dispatch<React.SetStateAction<string | null>>]>([null, () => {}]);

// export const UserProvider: React.FC<UserProviderProps> = (props) => {
//   const [token, setToken] = useState<string | null>(localStorage.getItem("jwt_token"));

//   useEffect(() => {
//     const fetchUser = async () => {
//     //   const requestOptions = {
//     //     method: "GET",
//     //     mode: 'cors', // corrected from 'RequestMode'
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: "Bearer " + token,
//     //     },
//     //   };
//         const data = {}
//         console.log(token)
//         const options = {
//             headers:{
//                 Authorization: "Bearer " + token,
//             }
//         }

//         try{
//         const resp = await httpClient.post("//localhost:5000/auth/@me",data, options);

//         if (resp.status !== 200) {
//           setToken(null);
//         }
//         localStorage.setItem("jwt_token", token || "");
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       }
//     };

//     fetchUser();
//   }, [token]);

//   return (
//     <UserContext.Provider value={[token, setToken]}>
//       {props.children}
//     </UserContext.Provider>
//   );
// };

export interface UserContextInterface {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
}

const defaultState: UserContextInterface = {
  token: "",
  setToken: () => {},
};

export const UserContext = createContext(defaultState);

type UserProviderProps = {
  children: React.ReactNode
}

export default function UserProvider({children} : UserProviderProps){
  const [token, setToken] = useState<string | null>(localStorage.getItem("jwt_token"))
    useEffect(() => {
    const fetchUser = async () => {
      
      console.log("RADI")
      console.log(token)

        
        try{
        const resp = await httpClient.get("//localhost:5000/auth/@me", {
          headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          }
        });
          console.log(resp)
        if (resp.status !== 200) {
          setToken(null);
        }
        localStorage.setItem("jwt_token", token ?? "");
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={{token, setToken}}>
      {children}
    </UserContext.Provider>
  )
}