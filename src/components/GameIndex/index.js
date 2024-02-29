import './GameIndex.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchGames, getGames } from '../../store/games';
import GameIndexItem from '../GameIndexItem';


const GameIndex = () => {

    const dispatch = useDispatch();
    const games = useSelector(getGames);

    useEffect(() => {
        dispatch(fetchGames());
    }, [dispatch])

    const first8Games = games.slice(0, 8);


    return (
        <>
            <div id='gameindex-outtercontainer'>
                <div id='gameindex-header'>Games to bet on</div>
                <div id='gameindex-container'>   
                    {first8Games.map(game =>
                        <div id='gameindexitem'>
                            <GameIndexItem game={game} />
                        </div> 
                    )}
                </div>
            </div>

        </>
    )
}

export default GameIndex;