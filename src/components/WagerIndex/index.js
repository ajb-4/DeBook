import './WagerIndex.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import DeBookABI from '../DeBookABI.json';

const WagerIndex = () => {
    const [amount, setAmount] = useState("");
    const [gameId, setGameId] = useState("");
    const [outcome, setOutcome] = useState("");
    const [margin, setMargin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const createWager = async () => {
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.enable();
            const signer = provider.getSigner();
            const contractAddress = '0x9411aE3F27FC8d03A126A4005eA3C7b43cEC883E';
            const contract = new ethers.Contract(contractAddress, DeBookABI, signer);
            const amountInWei = ethers.utils.parseEther(amount);
            await contract.createWager(amountInWei, gameId, 0, margin, outcome);
            setLoading(false);
            debugger
            // Add logic to handle successful wager creation
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    return (
        <>
            <div id='wagerindex-outtercontainer'>
                <div id='wagerindex-header'>Wagers</div>
                <div id='wagerindex-container'>
                    <div id='wagerindexitem'>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
                        <input type="number" value={gameId} onChange={(e) => setGameId(e.target.value)} placeholder="Enter game ID" />
                        <input type="text" value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Enter outcome" />
                        <input type="number" value={margin} onChange={(e) => setMargin(e.target.value)} placeholder="Enter margin" />
                        <button onClick={createWager} disabled={loading}>Create Wager</button>
                        {error && <div>{error}</div>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default WagerIndex;

