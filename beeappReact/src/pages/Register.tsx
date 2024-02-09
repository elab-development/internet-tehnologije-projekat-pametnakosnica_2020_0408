import {useState} from 'react'
import httpClient from '../httpClient'
import { Button, FormLabel, Grid, GridItem, Heading, Input } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import inside1 from '../assets/inside1.jpg'
import { buttonStyles } from '../utils/themes'

const Register = () => {
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const[username, setUsername] = useState("")
    const[firstname, setFirstName] = useState("")
    const[lastname, setLastName]  = useState("")
    const navigate = useNavigate()
    

    const registerUser = async () =>{

        try{
            await httpClient.post("//localhost:5000/auth/register", {
                email,
                password,
                username,
                firstname,
                lastname
            });

            navigate('../login')
        }
        catch (error: any) {
            console.log(error)
            if(error.response.status === 401){
                alert("BAD")
            }
        }
    };

  return (
    <Grid    
    alignItems="center"
    justifyContent="center"
    sx={{
        backgroundImage: inside1,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'top',
        backgroundSize: 'cover',
        backdropFilter: 'blur(5px)',
    }}>
    <Grid
    sx={{ backgroundColor: 'rgba(255, 189, 33, 0.7)', padding: '5vmin', borderRadius: "15px"}}
    templateRows='repeat(8, 1fr)'
    gap={5}
    mt='5vh'
    mb='5vh'
    height='75vh'
    >
        <GridItem rowSpan={1} justifySelf='center'>
            <Heading as="h2" marginBottom={5}>Register</Heading>
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
            <FormLabel>Username</FormLabel>
            <Input sx={buttonStyles} _focus={{bg:'#ffd77a', color: '#352f31'}} type="text" onChange={(e)=> setUsername(e.target.value)}/>
        </GridItem>
        <GridItem rowSpan={1}>
            <FormLabel>Firstname</FormLabel>
            <Input sx={buttonStyles} _focus={{bg:'#ffd77a', color: '#352f31'}} type="text" onChange={(e)=> setFirstName(e.target.value)}/>
        </GridItem>
        <GridItem rowSpan={1}>
            <FormLabel>Lastname</FormLabel>
            <Input sx={buttonStyles} _focus={{bg:'#ffd77a', color: '#352f31'}} type="text" onChange={(e)=> setLastName(e.target.value)}/>
        </GridItem>
        <GridItem rowSpan={1}>
            <Button sx={buttonStyles} type='button' onClick={()=>registerUser()}>Register</Button>
        </GridItem>
    </Grid>
    </Grid>
  )
}

export default Register