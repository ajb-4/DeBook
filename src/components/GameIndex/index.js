import './GameIndex.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchGames, getGames } from '../../store/games';
import GameIndexItem from '../GameIndexItem';
import WagerModal from '../WagerModal';

const GameIndex = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const dispatch = useDispatch();
    const games = useSelector(getGames);

    useEffect(() => {
        dispatch(fetchGames());
    }, [dispatch])

    const first8Games = games.slice(0, 8);

    const openModal = (game) => {
        setSelectedGame(game);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedGame(null);
    };

    return (
        <>
            <div id='gameindex-outtercontainer'>
                <div id='gameindex-header'>Games</div>
                <div id='gameindex-container'>   
                    {first8Games.map(game =>
                        <div id='gameindexitem' key={game.id} onClick={() => openModal(game)}>
                            <GameIndexItem game={game} />
                        </div> 
                    )}
                </div>
                {showModal && (
                    <WagerModal
                        closeModal={closeModal}
                        game={selectedGame}
                    />
                )}
            </div>
        </>
    )
}

export default GameIndex;
