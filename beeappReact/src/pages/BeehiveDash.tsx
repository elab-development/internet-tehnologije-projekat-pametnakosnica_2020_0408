import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Beehives from "../components/Beehives";
import { UserContext } from "../context/UserContext";

const BeehiveDash = () => {
  const {user } = useContext(UserContext)
  const navigate = useNavigate()
  
  return (
    <>
    {user.token == null ?? user.token == "" ? navigate('/login') : <Beehives/>}
    </>
  );
};
export default BeehiveDash