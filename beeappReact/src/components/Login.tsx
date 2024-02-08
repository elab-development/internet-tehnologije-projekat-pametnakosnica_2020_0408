import {useContext, useEffect, useState} from 'react'
import httpClient from '../httpClient'
import { Button, FormLabel, Grid, GridItem, Heading, Input, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { buttonStyles } from '../utils/themes'
import inside1 from '../assets/inside1.jpg'

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
                    title: 'Bad credentials or user is banned!',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                  })
            }
        }
    };


    return (
      <Grid    
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundImage: `url(${inside1})`,
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'top',
          backgroundSize: 'cover',
          backdropFilter: 'blur(5px)',
          height: '99vh',
          width: '99vw',
          placeItems: 'center',
        }}
      >
        <Grid
          sx={{ backgroundColor: 'rgba(255, 189, 33, 0.7)', padding: '5vmin', borderRadius: "15px"}}
          templateRows='repeat(4, 1fr)'
          gap={5}
          height='75hv'
          width='20vw'
        >
          <GridItem rowSpan={1} justifySelf='center'>
            <Heading as="h2" marginBottom={5}>Log in</Heading>
          </GridItem>
          <GridItem rowSpan={1}>
            <FormLabel>Email</FormLabel>
            <Input sx={buttonStyles} _focus={{bg:'#ffd77a', color: '#352f31'}} type="text" onChange={(e)=> setEmail(e.target.value)}/>
          </GridItem>
          <GridItem rowSpan={1}>
            <FormLabel>Password</FormLabel>
            <Input sx={buttonStyles} _focus={{bg:'#ffd77a', color: '#352f31'}} type="password" onChange={(e)=> setPassword(e.target.value)}/>
          </GridItem>
          <GridItem rowSpan={1}>
            <Button sx={buttonStyles} type='button' onClick={() => logInUser()}>Login</Button>
          </GridItem>
        </Grid>
      </Grid>
    )
}

export default Login