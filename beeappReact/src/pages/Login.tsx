import {useContext, useState} from 'react'
import httpClient from '../httpClient'
import { Button, Flex, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react'
import { Form } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

const Login = () => {
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    //const [token, setToken] = useState(sessionStorage.getItem("token"))
    const {token, setToken} = useContext(UserContext)

    const logInUser = async () =>{
        console.log(email, password);

        const data = {
            email,
            password
        }

       const headers = {
        
       }
       console.log("RADI")
        try{
            const resp = await httpClient.post("//localhost:5000/auth/login", data, headers);
            if(resp.status === 200){
                console.log(resp.data.access_token)
                //sessionStorage.setItem("token", resp.data.access_token)
                setToken(resp.data.access_token)
                //window.location.href = "/";
            }
        }
        catch (error: any) {
            if(error.response.status === 401){
                alert("Invalid credentials")
            }
        }
    };

    const logOutUser = async () =>{
        console.log("loggin out user "+token);
        setToken('');
        sessionStorage.removeItem('token');
    };

  return (
    // <div>
    //     <h1>Login</h1>
    //     <form>
    //         <div>
    //             <label>Email</label>
    //             <input  
    //             type="text" 
    //             value={email} 
    //             onChange={(e) => setEmail(e.target.value)} 
    //             id=""/>
    //         </div>
    //         <div>
    //             <label>Password</label>
    //             <input  
    //             type="password" 
    //             value={password} 
    //             onChange={(e) => setPassword(e.target.value)} 
    //             id=""/>
    //         </div>
    //         <button type='button' onClick={() => logInUser()}>Submit</button>
    //     </form>
    // </div>
    <Flex p="10px" mb="60px" flexDirection="column" alignItems="center">
    {token && token !== "" && token !== null ? (
        <>
        <Heading as="h2">Logged in with {token}</Heading>
        <Form>
            <Button type="button" onClick={() => logOutUser()}>
            Logout
            </Button>
        </Form>
        </>
    ) : (
        <>
        <Heading as="h2">Login</Heading>
        <Form>
            <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="text" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button type="button" onClick={() => logInUser()}>
            Login
            </Button>
        </Form>
        </>
    )}
    </Flex>
  )
}

export default Login