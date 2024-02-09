import { extendTheme } from '@chakra-ui/react'
import "@fontsource-variable/roboto-flex";

export const theme = extendTheme({
  fonts: {
    heading: `'Roboto Mono Variable', sans-serif`,
  }
})

export const buttonStyles = {
  bg: '#352f31',
  color:'#ffbd21',
  _hover: {bg:'#ffd77a', color: '#352f31'}
}

export const prevNextButtonStyles = {
  bg: 'rgba(53, 47, 49, 0.7)',
  color: '#ffbd21',
  height: "88vmin",
  width: "13vmin",
  _hover: { bg: 'rgba(255, 215, 122, 0.7)', color: '#352f31' } 
};


export const flexStyles = {
  p: "30px",
  alignItems: "center",
  justifyContent: 'center',
  background: "#ffbd21"
}

export const modalStyles = {
  p: "10px",
  mb: "10px",
  flexDirection: "column",
  alignItems: "center",
  bg: 'rgba(53, 47, 49)',
  color: '#ffbd21'
}

export const cardStyles = {
  bg: 'rgba(53, 47, 49, 0.95)',
  border: "4px",
  color: "#ffbd21",
  borderColor: 'rgba(53, 47, 49, 0.9)',
  _hover: { bg: 'rgba(255, 215, 122, 0.7)', color: '#352f31', border: "4px", borderColor: "white"} 
}