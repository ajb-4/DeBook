import './WagerIndexItem.css'
import { useState} from 'react';
import { ethers } from 'ethers';
import DeBookABI from '../DeBookABI.json';

const WagerIndexItem = ({wager}) => {

    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState("");

    const acceptWager = async (wagerId) => {
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.enable();
            const signer = provider.getSigner();
            const contractAddress = '0xb134B85cac4fb99223550BC1C486878c4E53801B';
            const contract = new ethers.Contract(contractAddress, DeBookABI, signer);
            debugger
            await contract.acceptWager(wagerId, { value: wager.amount });
            setLoading(false);
        } catch (error) {
            debugger
            setLoading(false);
            // setError(error.message);
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

    return (
        <>
        <div id='wagerindexitem-container'>
            <div id='wagerindexitem-game'>
                <div>GameId: {wager.gameId._hex.toString()}</div>
            </div>
            <div id='wagerindexitem-outcome'>
                <div>Margin: {wager.margin._hex.toString()}</div>
                <div>Outcome: {wager.outcome}</div>
                <div>Wager Type: {wagerTypeName(wager.wagerType)}</div>
            </div>
            <div id='wagerindexitem-money'>
                <div>Amount: {ethers.utils.formatEther(wager.amount)} ETH</div>
            </div>
            <div id='wagerindexitem-participants'>
                <div>Creator: {shortenAddress(wager.creator)}</div>
                <div>Is Accepted: {wager.isAccepted ? 'Yes' : 'No'}</div>
                {wager.isAccepted ? (
                    <div>Accepted by: {shortenAddress(wager.acceptor)}</div>
                ) : (
                    <div>
                        <button onClick={() => acceptWager(wager.wagerId)} disabled={loading}>Accept Wager</button>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}

export default WagerIndexItem;