export const RECEIVE_GAME = 'games/recieveGame';
export const RECEIVE_GAMES = 'games/recieveGames';

const receiveGame = game => ({
    type: RECEIVE_GAME,
    game
})

const receiveGames = games => ({
    type: RECEIVE_GAMES,
    games
})

export const getGame = gameId => state => {
    return state.games ? state.games[gameId] : null;
}

export const getGames = state => {
    return state.games ? Object.values(state.games) : [];
}

export const fetchGame = (gameId) => async dispatch => {
    const response = await fetch()

    if (response.ok) {
        const game = await response.json();
        dispatch(receiveGame(game))
    }
}

export const fetchGames = () => async dispatch => {
    const apiKey = 'a1a74e05fc54445bbb59e3f10bd275ee';

    const url = `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads&oddsFormat=american`;

    try {
        const response = await fetch(url);
        
        if (response.ok) {
        
            const games = await response.json();
            dispatch(receiveGames(games));
        } else {
            console.error('Error fetching games: JSON issue', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching games:', error.message);
    }
};




const gamesReducer = (state = {}, action ) => {
    switch (action.type) {
        case RECEIVE_GAME:
            return {...state, [action.game.id]: action.game};
        case RECEIVE_GAMES:
            return {...action.games};
        default: 
            return state;
    }
}

export default gamesReducer;