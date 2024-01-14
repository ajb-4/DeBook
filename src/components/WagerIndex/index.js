import './WagerIndex.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchGames, getGames } from '../../store/games';
import WagerIndexItem from '../WagerIndexItem';


const WagerIndex = () => {

    const dispatch = useDispatch();
    const games = useSelector(getGames);

    useEffect(() => {
        dispatch(fetchGames());
    }, [dispatch])

    const first8Games = games.slice(0, 8);


    return (
        <>
            <div id='wagerindex-outtercontainer'>
                <div id='wagerindex-header'>Games to bet on</div>
                <div id='wagerindex-container'>   
                    {first8Games.map(game =>
                        <div id='wagerindexitem'>
                            <WagerIndexItem game={game} />
                        </div> 
                    )}
                </div>
            </div>

        </>
    )
}

export default WagerIndex;