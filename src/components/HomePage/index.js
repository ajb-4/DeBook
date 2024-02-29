import './HomePage.css';
import GameIndex from '../GameIndex';
import WagerIndex from '../WagerIndex';

const HomePage = () => {



    return (
        <>
            <div id='homepage-outtercontainer'>
                <div id='homepage-gameindex'>
                    <GameIndex/>
                </div>
                <div id='homepage-wagerindex'>
                    <WagerIndex/>
                </div>
            </div>
        </>
    )
}

export default HomePage;