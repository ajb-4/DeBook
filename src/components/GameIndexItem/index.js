import './GameIndexItem.css';

const GameIndexItem = ({game}) => {

    const homeMl = game.bookmakers[0].markets[0].outcomes[0].price;
    const awatMl = game.bookmakers[0].markets[0].outcomes[1].price;
    const homeSpread = game.bookmakers[0].markets[1]?.outcomes[0].point;
    const awaySpread = game.bookmakers[0].markets[1]?.outcomes[1].point;

    const formattedNum = (num) => {
        return num > 0 ? `+${num}` : num;
    };

    const formatTime = (isoString) => {

        const dateObj = new Date(isoString);

        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getUTCDate()).padStart(2, '0');

        let hours = dateObj.getUTCHours();
        const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format

        return `${month}/${day} ${hours}:${minutes} ${ampm}`;
    }

    return (
        <>

            <div id='gameindexitem-container'>
                <div id='gameindexitem-top'>
                    <div id='gameindexitem-starttime'>{formatTime(game.commence_time)}</div>
                    <div>{game.sport_title}</div>
                </div>
                <div id='gameindexitem-matchup'>
                    <div id='gameindexitem-awayteam'>{game.away_team.split(' ').pop()}</div>
                    <div id='gameindexitem-atsign'>@</div>
                    <div id='gameindexitem-hometeam'>{game.home_team.split(' ').pop()}</div>
                </div>
                <div id='gameindexitem-moneylines'>
                    <div id='gameindexitem-betoption'>{formattedNum(homeMl)}</div>
                    <div id='gameindexitem-mlheader'>ML</div>
                    <div id='gameindexitem-betoption'>{formattedNum(awatMl)}</div>
                </div>
                <div id='gameindexitem-spreads'>
                    <div id='gameindexitem-betoption'>{formattedNum(homeSpread)}</div>
                    <div id='gameindexitem-spreadheader'>SPREAD</div>
                    <div id='gameindexitem-betoption'>{formattedNum(awaySpread)}</div>
                </div>
            </div>
        </>
    )
}

export default GameIndexItem;