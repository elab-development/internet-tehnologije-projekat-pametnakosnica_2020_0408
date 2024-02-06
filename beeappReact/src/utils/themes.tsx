import { extendTheme } from '@chakra-ui/react'
import "@fontsource-variable/roboto-flex";

export const theme = extendTheme({
  fonts: {
    heading: `'Roboto Mono Variable', sans-serif`,
  },
})

export const buttonStyles = {
  bg: '#352f31',
  color:'#ffbd21',
  _hover: {bg:'#ffd77a', color: '#352f31'}
}

export const flexStyles = {
  p: "30px",
  alignItems: "center",
  justifyContent: 'center',
  background: "#ffbd21"
}