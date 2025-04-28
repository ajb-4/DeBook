import './WagerIndexItem.css'
import { useState} from 'react';
import { ethers } from 'ethers';
import DeBookABI from '../DeBookABI.json';
import MockUSDCAbi from '../MockUSDCABI.json';

const WagerIndexItem = ({wager, game}) => {

    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState("");

    console.log("Game:",{game});

    //still unable to work through the 'extent react app'
    const acceptWager = async (wager) => {
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.enable();
            const signer = provider.getSigner();
            const deBookAddress = process.env.REACT_APP_DEBOOK_CONTRACT_ADDRESS;
            const deBookContract = new ethers.Contract(deBookAddress, DeBookABI, signer);
            const usdcAddress = process.env.REACT_APP_MOCKUSDC_CONTRACT_ADDRESS;
            const usdcContract = new ethers.Contract(usdcAddress, MockUSDCAbi, signer);
            const usdcAmount = wager.amount;
            debugger
            // Wait for USDC spend approval
            const approveTx = await usdcContract.approve(deBookAddress, usdcAmount);
            await approveTx.wait();

            const transaction = await deBookContract.acceptWager(wager.wagerId, { value: 0 }); // Passing 0 value as no ETH is needed
            await transaction.wait();
    
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
            // setError(error.message);
        }
    };

    const settleWager = async () => {
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.enable();
            const signer = provider.getSigner();
            const contractAddress = process.env.REACT_APP_DEBOOK_CONTRACT_ADDRESS;
            const contract = new ethers.Contract(contractAddress, DeBookABI, signer);
            debugger
            await contract.settleWager(wager.wagerId, { value: 0 });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error.message);
        }
    };

    const requestData = async () => {
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.enable();
            const signer = provider.getSigner();
            const contractAddress = process.env.REACT_APP_DEBOOK_CONTRACT_ADDRESS;
            const contract = new ethers.Contract(contractAddress, DeBookABI, signer);
            debugger
            await contract.requestWagerResult(wager.wagerId, {
                gasLimit: 10000000
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error.message);
        }
    };


    function wagerTypeName(wagerType) {
        switch (wagerType) {
            case 0:
                return 'Spread';
            case 1:
                return 'Moneyline';
            case 2:
                return 'OverUnder';
            default:
                return 'Unknown';
        }
    }

    function shortenAddress(address) {
        if (!address) return '';
        return address.slice(0, 6) + '...' + address.slice(-4);
    }

    function hexToSignedInt(hex) {
        const bigNumber = ethers.BigNumber.from(hex);
        const absoluteValue = bigNumber.abs().toString();
        return `${absoluteValue}`;
    }
    
    const formatMargin = (marginHex) => {
        const bigNumber = ethers.BigNumber.from(marginHex);
        const sign = bigNumber.isNegative() ? '-' : '+';
        const absoluteValue = bigNumber.abs().toNumber();
        const formattedMargin = absoluteValue / 10;

        return formattedMargin % 1 === 0 ? `${sign}${Math.abs(formattedMargin)}` : `${sign}${formattedMargin.toFixed(1)}`;
    };

    return (
        <>
        <div id='wagerindexitem-container'>
            <div id='wagerindexitem-game'>
            <div>GameId: {wager.gameId.slice(0, 10)}</div>
            {game && <div>{game.home_team}</div>}
            </div>
            <div id='wagerindexitem-outcome'>
                <div>{wager.outcome}</div>
                <div>{wagerTypeName(wager.wagerType)}:  {formatMargin(wager.margin)}</div>
            </div>
            <div id='wagerindexitem-money'>
                <div>Risk: {Number(ethers.utils.formatUnits(wager.amount, 6)).toFixed(2)} USDC</div>
                <div>Win: {Number(ethers.utils.formatUnits(wager.amount, 6)).toFixed(2)} USDC</div>
            </div>
            <div id='wagerindexitem-participants'>
                <div>
                    <div>Maker:</div>
                    <div>{shortenAddress(wager.creator)}</div>
                </div>
                <div onClick={() => settleWager()} disabled={loading}  id='wagerindexitem-acceptbutton'>Settle</div>
                <div onClick={() => requestData()} disabled={loading}  id='wagerindexitem-acceptbutton'>Get Data</div>
                {/* <div>Is Accepted: {wager.isAccepted ? 'Yes' : 'No'}</div> */}
                {wager.isAccepted ? (
                <div>
                    <div>Taker:</div>
                    <div>{shortenAddress(wager.acceptor)}</div>
                </div>
                ) : (
                    <div onClick={() => acceptWager(wager)} disabled={loading}  id='wagerindexitem-acceptbutton'>Accept Wager</div>
                )}
            </div>
           
        </div>
        </>
    )
}

export default WagerIndexItem;