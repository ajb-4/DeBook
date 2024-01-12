import './NavBar.css'
import { Link } from 'react-router-dom';


const NavBar = () => {


    return (
        <>
            <div id='navbar-outtercontainer'>
                <div id='navbar-leftside'>
                    <div id='navbar-profilebutton'>
                        <Link to='/profile'><i class="fa-thin fa-user"></i></Link>
                    </div>
                    <div id='navbar-userbalance'>
                        <i class="fa-thin fa-dollar-sign"></i>
                    </div>
                </div>
                <div id='navbar-middle'>
                    <Link to='/'>DeBook</Link>
                </div>
                <div id='navbar-wallet'>
                    <i class="fa-thin fa-wallet"></i>
                </div>
            </div>
        </>
    )
}

export default NavBar;