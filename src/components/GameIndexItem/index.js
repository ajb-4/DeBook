import './GameIndexItem.css';

const GameIndexItem = ({game}) => {

    const homeMl = game.bookmakers[0].markets[0].outcomes[0].price;
    const awatMl = game.bookmakers[0].markets[0].outcomes[1].price;
    const homeSpread = game.bookmakers[0].markets[1]?.outcomes[0].point;
    const awaySpread = game.bookmakers[0].markets[1]?.outcomes[1].point;

    const formattedNum = (num) => {
        return num > 0 ? `+${num}` : num;
    };

    return (
        <>

            <div id='gameindexitem-container'>
                <div id='gameindexitem-sporttype'>
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