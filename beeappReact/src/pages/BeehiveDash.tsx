import { Heading } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

const BeehiveDash = () => {
    const { apiaryId } = useParams();
  return (
    <Heading>APIARY ID: {apiaryId}</Heading>
  )
}

export default BeehiveDash