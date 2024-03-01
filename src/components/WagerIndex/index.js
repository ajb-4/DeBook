import './WagerIndex.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DeBookABI from '../DeBookABI.json';

const WagerIndex = () => {
    const [wagers, setWagers] = useState([]);
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
            const contractAddress = '0x7C70063f53995719fd6620572CFe1D63159599ee';
            const contract = new ethers.Contract(contractAddress, DeBookABI, signer);
            const amountInWei = ethers.utils.parseEther(amount);
            await contract.createWager(amountInWei, gameId, 0, margin, outcome);
            setLoading(false);
            // Add logic to handle successful wager creation
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    useEffect(() => {
        async function fetchWagers() {
            try {
                setLoading(true);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contractAddress = '0x7C70063f53995719fd6620572CFe1D63159599ee';
                const contract = new ethers.Contract(contractAddress, DeBookABI, provider);
                const wagersCount = await contract.getWagerCounter();
    
                // Fetch all wagers from the contract
                const promises = [];
                for (let i = 1; i <= wagersCount; i++) {
                    promises.push(contract.wagers(i));
                }
                const fetchedWagers = await Promise.all(promises);
                setWagers(fetchedWagers);
                setLoading(false);
                debugger
            } catch (error) {
                setLoading(false);
                debugger
                setError(error.message);
            }
        }
    
        fetchWagers();
        debugger
    }, []);

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
                    {wagers.map((wager, index) => (
                        <div id='wagerindexitem' key={index}>
                            <div>Outcome: {wager.outcome}</div>
                            <div>Is Accepted: {wager.isAccepted ? 'Yes' : 'No'}</div>
                            <div>Wager Type: {wagerTypeName(wager.wagerType)}</div>
                            <div>Amount: {ethers.utils.formatEther(wager.amount)} ETH</div>
                            <div>Creator: {shortenAddress(wager.creator)}</div>
                            {/* <div>Acceptor: {wager.acceptor}</div> */}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default WagerIndex;


