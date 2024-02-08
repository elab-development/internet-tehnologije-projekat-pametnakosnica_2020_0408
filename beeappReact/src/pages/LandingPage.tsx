import { Button, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { buttonStyles } from "../utils/themes";
import inside1 from '../assets/inside1.jpg'
import { useNavigate } from "react-router-dom";



const LandingPage = () => {
    const navigate = useNavigate()
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
            height: '100%',
            width: '99vw',
            placeItems: 'center',
          }}
        >
          <Grid
            sx={{
              backgroundColor: 'rgba(255, 189, 33, 0.7)',
              padding: '5vmin',
              borderRadius: '15px',
            }}
            gap={5}
            width="80%"
            maxWidth="80vw"
            mt='2vh'
            mb='2vh'
          >
            <GridItem justifySelf="center">
              <Heading as="h1" fontSize="2xl" marginBottom={5}>
                Welcome to BeeSmart: Your Ultimate IoT Solution for Beekeeping
              </Heading>
            </GridItem>
            <GridItem >
                <Heading as="h2" fontSize="xl" marginBottom={3}>
                    Are you ready to take your beekeeping to the next level? Say hello to BeeSmart, the innovative IoT app designed to revolutionize the way you manage your apiaries and beehives. With BeeSmart, beekeeping has never been easier or more efficient.
                </Heading>
                </GridItem>
                <GridItem >
                <Heading as="h3" fontSize="lg" marginBottom={2}>
                    What is BeeSmart?
                </Heading>
                <Text>
                    BeeSmart is a comprehensive web application tailored specifically for beekeepers, whether you're a hobbyist with a single hive or a commercial operation with multiple apiaries. Our intuitive platform harnesses the power of IoT technology to provide real-time insights into the health and productivity of your bees.
                </Text>
                </GridItem>
                <GridItem >
                <Heading as="h3" fontSize="lg" marginBottom={2}>
                    Key Features:
                </Heading>
                <Text>
                    <b>Live Data Monitoring:</b> Keep a close eye on your bees with real-time data tracking. From hive temperature and humidity to honey production levels, BeeSmart provides you with up-to-the-minute information at your fingertips.
                </Text>
                <Text>
                    <b>Customizable Dashboards:</b> Tailor your dashboard to suit your needs. Choose the metrics that matter most to you and create a personalized view of your beekeeping operation.
                </Text>
                <Text>
                    <b>Historical Analysis:</b> Dive deep into your hive's history with BeeSmart's historical data analysis tools. Track trends over time, identify patterns, and make informed decisions to optimize your beekeeping practices.
                </Text>
                <Text>
                    <b>Remote Hive Management:</b> Whether you're at home or on the go, BeeSmart allows you to manage your hives remotely. Make adjustments, monitor conditions, and ensure the well-being of your bees from anywhere in the world.
                </Text>
                </GridItem>
                <GridItem rowSpan={1}>
                <Heading as="h3" fontSize="lg" marginBottom={2}>
                    Why Choose BeeSmart?
                </Heading>
                <Text>
                    <b>Simplicity:</b> BeeSmart is designed with user-friendliness in mind. Our intuitive interface makes it easy for beekeepers of all experience levels to harness the power of IoT technology.
                </Text>
                <Text>
                    <b>Accuracy:</b> With BeeSmart, you can trust that your data is accurate and reliable. Our state-of-the-art sensors and monitoring systems ensure precision and consistency in every measurement.
                </Text>
                <Text>
                    <b>Insight:</b> Gain valuable insights into your beekeeping operation like never before. From optimizing hive placement to predicting honey flows, BeeSmart empowers you to make data-driven decisions for greater success.
                </Text>
                </GridItem>
            <GridItem rowSpan={1}>
              <Button sx={buttonStyles} onClick={() => {navigate('/register')}}>
                Get Started Today!
              </Button>
            </GridItem>
          </Grid>
        </Grid>
      )
  }
  
  export default LandingPage