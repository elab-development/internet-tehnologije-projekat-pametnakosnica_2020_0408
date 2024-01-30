import {useState} from 'react'
import httpClient from '../httpClient'
import { Button, Flex, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react'
import { Form } from 'react-router-dom'

const Register = () => {
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const[username, setUsername] = useState("")
    const[firstname, setFirstName] = useState("")
    const[lastname, setLastName]  = useState("")
    

    const registerUser = async () =>{
        // console.log(email, password);

        try{
            await httpClient.post("//localhost:5000/auth/register", {
                email,
                password,
                username,
                firstname,
                lastname
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
    // <div>
    //     <h1>Create a new account</h1>
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
    //         <div>
    //             <label>Username</label>
    //             <input  
    //             type="username" 
    //             value={username} 
    //             onChange={(e) => setUsername(e.target.value)} 
    //             id=""/>
    //         </div>
    //         <div>
    //             <label>First name</label>
    //             <input  
    //             type="firstname" 
    //             value={firstname} 
    //             onChange={(e) => setFirstName(e.target.value)} 
    //             id=""/>
    //         </div>
    //         <div>
    //             <label>Last name</label>
    //             <input  
    //             type="lastname" 
    //             value={lastname} 
    //             onChange={(e) => setLastName(e.target.value)} 
    //             id=""/>
    //         </div>
    //         <button type='button' onClick={() => registerUser()}>Submit</button>
    //     </form>
    // </div>
    <Flex p="10px" mb="60px" flexDirection='column' alignItems='center'>
    <Heading as="h2" marginBottom={5}>Register</Heading>
    <Form>
        <FormControl display='flex' flexDir='column' alignItems='center'>
            <FormLabel>Email</FormLabel>
            <Input type="text" onChange={(e)=> setEmail(e.target.value)}/>
        </FormControl>
        <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" onChange={(e)=> setPassword(e.target.value)}/>
        </FormControl>
        <FormControl>
            <FormLabel>Username</FormLabel>
            <Input type="password" onChange={(e)=> setUsername(e.target.value)}/>
        </FormControl>
        <FormControl>
            <FormLabel>Firstname</FormLabel>
            <Input type="password" onChange={(e)=> setFirstName(e.target.value)}/>
        </FormControl>
        <FormControl>
            <FormLabel>Lastname</FormLabel>
            <Input type="password" onChange={(e)=> setLastName(e.target.value)}/>
        </FormControl>
        <Button type='button' onClick={()=>registerUser()}>Register</Button>
    </Form>
</Flex>
  )
}

export default Register