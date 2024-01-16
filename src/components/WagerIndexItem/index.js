import './WagerIndexItem.css';

const WagerIndexItem = ({game}) => {

    const homeMl = game.bookmakers[0].markets[0].outcomes[0].price;
    const awatMl = game.bookmakers[0].markets[0].outcomes[1].price;
    const homeSpread = game.bookmakers[0].markets[1]?.outcomes[0].point;
    const awaySpread = game.bookmakers[0].markets[1]?.outcomes[1].point;

    const formattedNum = (num) => {
        return num >= 0 ? `+${num}` : num;
    };

    return (
        <>

            <div id='wagerindexitem-container'>
                <div id='wagerindexitem-sporttype'>
                    <div>{game.sport_title}</div>
                </div>
                <div id='wagerindexitem-matchup'>
                    <div id='wagerindexitem-hometeam'>{game.home_team.split(' ').pop()}</div>
                    <div id='wagerindexitem-atsign'>@</div>
                    <div id='wagerindexitem-awayteam'>{game.away_team.split(' ').pop()}</div>
                </div>
                <div id='wagerindexitem-moneylines'>
                    <div id='wagerindexitem-betoption'>{formattedNum(homeMl)}</div>
                    <div id='wagerindexitem-mlheader'>ML</div>
                    <div id='wagerindexitem-betoption'>{formattedNum(awatMl)}</div>
                </div>
                <div id='wagerindexitem-spreads'>
                    <div id='wagerindexitem-betoption'>{formattedNum(homeSpread)}</div>
                    <div id='wagerindexitem-spreadheader'>SPREAD</div>
                    <div id='wagerindexitem-betoption'>{formattedNum(awaySpread)}</div>
                </div>
            </div>
        </>
    )
}

export default WagerIndexItem;