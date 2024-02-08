import {useContext, useEffect, useState} from 'react'
import httpClient from '../httpClient'
import { Button, Flex, FormControl, FormLabel, Heading, Input, useToast } from '@chakra-ui/react'
import { Form, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

const Login = () => {
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate()
    const toast = useToast()

    useEffect(() => {
        if (user.token && user.token !== '' && user.token !== null) {
          navigate('/dashboard');
        }
        console.log("EVE GA ODJE")
      }, [user.token, navigate]);

    const logInUser = async () =>{
        console.log(email, password);

        const data = {
            email,
            password
        }

       const headers = {
        
       }
        try{
            const resp = await httpClient.post("//localhost:5000/auth/login", data, headers);
            if(resp.status === 200){
                console.log(resp.data.access_token)
                setUser({token: resp.data.access_token, username: null, email: null, role: null})
                navigate('../dashboard')
            }
        }
        catch (error: any) {
            if(error.response.status === 401){
                toast({
                    title: 'Bad credentials',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                  })
            }
        }
    };


  return (
    <Flex p="10px" mb="60px" flexDirection="column" alignItems="center">
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
    </Flex>
  )
}

export default Login