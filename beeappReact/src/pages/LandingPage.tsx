import { useEffect, useState } from "react";
import httpClient from "../httpClient";
import { User } from "../models";


const LandingPage = () => {

    const [user, setUser] = useState<User | null>(null)
  
    const logoutUser = async () => {
      await httpClient.post("//localhost:5000/auth/logout");
      window.location.href = "/";
    }
  
    useEffect(() => {
      (async () => {
        try{
          const resp = await httpClient.get("//localhost:5000/auth/@me");
          setUser(resp.data);
        }catch(error){
          console.log("Not authenticated");
        }
      })();
    }, [])
  
    return (
      <div>
          <h1>Hi mom!</h1>
          {user != null ? (
            <div>
              <h2>Logged in</h2>
              <h3>Email: {user.email}</h3>
              <h3>ID: {user.id}</h3>
                <button onClick={logoutUser}>Logout</button>
            </div>
          ) : (
            <div>
              <br/>
              <p>You are not logged in!</p>
              <a href="login"><button>Login</button></a>
              <a href="register"><button>Register</button></a>
            </div>
          )}
      </div>
    )
  }
  
  export default LandingPage