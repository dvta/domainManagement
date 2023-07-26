import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

export default function (){

  const {type, id} = useParams();
  const [emailTypes, setEmailTypes] = useState([]);
  const [email, setEmail] = useState({});

  useEffect(() => {
    axios.get('/api/user/emails/filters').then((res) => {
      if (res.status === 200){
        setEmailTypes(res.data.emailTyoes);
      }
    })
  }, [])

  return (
      <>

      </>
  );

}
