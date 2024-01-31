import { useContext } from "react";
import { UserContext } from "../context/UserContext";


const LandingPage = () => {

    const {token, } = useContext(UserContext)
  
    // const logoutUser = async () => {
    //   await httpClient.post("//localhost:5000/auth/logout");
    //   window.location.href = "/";
    // }
  
    // useEffect(() => {
    //   (async () => {
    //     try{
    //       const resp = await httpClient.get("//localhost:5000/auth/@me");
    //       setUser(resp.data);
    //     }catch(error){
    //       console.log("Not authenticated");
    //     }
    //   })();
    // }, [])
  
    return (
      <div>
          <h1>Hi mom!</h1>
          {(token != null && token != "" ) ? (
            <div>
              <h2>Logged in</h2>
              {/* <h3>Email: {user.email}</h3>
              <h3>ID: {user.id}</h3> */}
                {/* <button onClick={logoutUser}>Logout</button> */}
                <button>Logout</button>
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