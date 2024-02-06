import { extendTheme } from '@chakra-ui/react'
import "@fontsource-variable/roboto-flex";

const theme = extendTheme({
  fonts: {
    heading: `'Roboto Mono Variable', sans-serif`,
  },
})

export default theme