import { Flex, Grid, GridItem, Heading } from '@chakra-ui/react'
import bees_staring from '../assets/bees_staring2.png'

const Generic404 = () => {
  return (
    <Grid
    alignItems="center"
    justifyContent="center"
    height="100vh"
    sx={{
      backgroundImage: bees_staring,
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'top',
      backgroundSize: 'cover',
      backdropFilter: 'blur(5px)',
    }}
    >
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
                <Heading>404 PAGE NOT FOUND</Heading>
              </Flex>
        </GridItem>
    </Grid>
)
  
}

export default Generic404