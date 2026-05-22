import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const AdminNavbar = () => {
  return (
    <Link to='/'>
        {<img src={assets.logo} alt="logo" className="w-26 h-auto" />}
    </Link>
  )
}

export default AdminNavbar