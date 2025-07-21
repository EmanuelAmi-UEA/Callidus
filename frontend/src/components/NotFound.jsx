import React, {} from "react"
import { Link } from 'react-router-dom';

const NotFound = () => {

 /* const[isLoading,setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return() => clearTimeout(timer)
  }, []);*/




  return (
    <div>
      <img src="/imagens/funny.gif" width="300" />
      <p>
        <Link to ="/">Sai daqui muleke doido</Link>
      </p>
    </div>
  );
};


export default NotFound