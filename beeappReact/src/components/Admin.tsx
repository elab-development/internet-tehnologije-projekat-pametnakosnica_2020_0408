import { useContext, useEffect, useState } from 'react';
import httpClient from '../httpClient';
import { UserContext } from '../context/UserContext';
import { Button, Card, CardBody, CardFooter, CardHeader, CircularProgress, Flex, Grid, GridItem, Heading, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import inside1 from '../assets/inside1.jpg'
import { cardStyles, buttonStyles } from '../utils/themes';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const {user, } = useContext(UserContext)
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function func() {
    setLoading(true)
      try {
        const resp = await httpClient.get(`//localhost:5000/auth/admin`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
        });

        if (resp.status === 200) {
          setUsers(resp.data["users"]);
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
            title: "Unauthorized!",
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top'
          })
        navigate('/dashboard')
      }
      setLoading(false)
    }
    func();
  }, [])

  const changeBanStatus = async (uname: string) => {
    try {
      const resp = await httpClient.put(`//localhost:5000/auth/admin/banstatus/${uname}`,{}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        }
      });
      if (resp.status === 200) {
        console.log(resp)
        toast({
            title: resp.statusText,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top'
          })
          window.location.reload();
      } else {
        toast({
          title: resp.statusText,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
      }
    }
    catch (error: any) {
      console.log(error)
    }
  }

  const changeRole = async (uname: string) => {
    try {
      const resp = await httpClient.put(`//localhost:5000/auth/admin/role/${uname}`,{}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        }
      });
      if (resp.status === 200) {
        console.log(resp)
        toast({
            title: resp.statusText,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top'
          })
          window.location.reload();
      } else {
        toast({
          title: resp.statusText,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
      }
    }
    catch (error: any) {
      console.log(error)
    }
  }

  return (
    <Grid
    alignItems="center"
    justifyContent="center"
    height="100vh"
    sx={{
      backgroundImage: inside1,
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'top',
      backgroundSize: 'cover',
      backdropFilter: 'blur(5px)',
    }}
    templateRows='repeat(8, 1fr)'
    gap={5}
    >
       {loading ? (
        <GridItem rowSpan={6} justifySelf="center">
            <CircularProgress isIndeterminate color='#352f31' thickness='12px' />
        </GridItem>
       ):(
         <GridItem mt='10vw' colSpan={6}>
         <Flex sx={{
                 backgroundColor: 'rgba(255, 189, 33, 0.4)',
                 padding: '5vmin',
                 borderRadius: "15px",
                 direction: "row",
                 flexWrap: "wrap",
                 justifyContent: "center",
                 gap: 5,
                 width: "90vw"
               }}>
                 {users.map((u) => (
                   <Card sx={cardStyles} key={u["id"]}>
                     <CardHeader justifyContent='center'>
                       <Grid>
                         <GridItem justifySelf='center'>
                             <Heading size='md'>{u["username"]}</Heading>
                         </GridItem>
                       </Grid>
                     </CardHeader>
                     <CardBody>
                       <Grid templateColumns="repeat(3, 1fr)" gap={1}>
                         <GridItem colSpan={1} justifySelf='center'>
                             {u["banned"] == false ? (
                                 <Button sx={{...buttonStyles, bg: "red"}} onClick={() => {changeBanStatus(u["username"])}}>BAN</Button>
                             ):(
                                 <Button sx={{...buttonStyles, bg: "green"}} onClick={() => {changeBanStatus(u["username"])}}>UNBAN</Button>
                             )}
                         </GridItem>
                       </Grid>
                     </CardBody>
                     <CardFooter justifyContent='center'>
                       {u["rolename"] == "Administrator" ? (
                         <Button sx={{...buttonStyles, bg: "red"}} onClick={() => {changeRole(u["username"])}}>Revoke ADMIN</Button>
                       ):(
                         <Button sx={{...buttonStyles, bg: "green"}} onClick={() => {changeRole(u["username"])}}>Give ADMIN</Button>                       
                       )}
                     </CardFooter>
                   </Card>
                 ))}
               </Flex>
         </GridItem>
       )}
    </Grid>
  )
}

export default Admin;