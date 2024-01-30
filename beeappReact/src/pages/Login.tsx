import {useState} from 'react'
import httpClient from '../httpClient'

const Login = () => {
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")

    const logInUser = async () =>{
        console.log(email, password);

        try{
            await httpClient.post("//localhost:5000/auth/login", {
                email,
                password
            });

            window.location.href = "/";
        }
        catch (error: any) {
            if(error.response.status === 401){
                alert("Invalid credentials")
            }
        }
    };

  return (
    <div>
        <h1>Login</h1>
        <form>
            <div>
                <label>Email</label>
                <input  
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                id=""/>
            </div>
            <div>
                <label>Password</label>
                <input  
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                id=""/>
            </div>
            <button type='button' onClick={() => logInUser()}>Submit</button>
        </form>
    </div>
  )
}

export default Login