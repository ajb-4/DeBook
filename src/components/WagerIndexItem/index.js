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

    function hexToSignedInt(hex) {
        const bigNumber = ethers.BigNumber.from(hex);
        const sign = bigNumber.isNegative() ? '-' : '+';
        const absoluteValue = bigNumber.abs().toString();
        return `${sign}${absoluteValue}`;
    } 

    return (
        <>
        <div id='wagerindexitem-container'>
            <div id='wagerindexitem-game'>
                <div>GameId: {hexToSignedInt(wager.gameId)}</div>
            </div>
            <div id='wagerindexitem-outcome'>
                <div>{wager.outcome}</div>
                <div>{wagerTypeName(wager.wagerType)}:  {hexToSignedInt(wager.margin)}</div>
            </div>
            <div id='wagerindexitem-money'>
                <div>Risk: {ethers.utils.formatEther(wager.amount)} ETH</div>
                <div>Win: {ethers.utils.formatEther(wager.amount)} ETH</div>
            </div>
            <div id='wagerindexitem-participants'>
                <div>
                    <div>Maker:</div>
                    <div>{shortenAddress(wager.creator)}</div>
                </div>
                {/* <div>Is Accepted: {wager.isAccepted ? 'Yes' : 'No'}</div> */}
                {wager.isAccepted ? (
                <div>
                    <div>Taker:</div>
                    <div>{shortenAddress(wager.acceptor)}</div>
                </div>
                ) : (
                    <div onClick={() => acceptWager(wager.wagerId)} disabled={loading}  id='wagerindexitem-acceptbutton'>Accept Wager</div>
                )}
            </div>
           
        </div>
        </>
    )
}

export default WagerIndexItem;