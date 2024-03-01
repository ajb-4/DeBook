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

            if (amount === "") {
                setError("Please enter a valid amount");
                return;
            }
    
            const amountValue = parseFloat(amount);
    
            if (isNaN(amountValue) || amountValue <= 0) {
                setError("Please enter a valid positive amount");
                return;
            }
    
            if (gameId === "") {
                setError("Please enter a valid game ID");
                return;
            }
    
            if (outcome === "") {
                setError("Please enter a valid outcome");
                return;
            }
    
            if (margin === "") {
                setError("Please enter a valid margin");
                return;
            }
    
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.enable();
            const signer = provider.getSigner();
            const contractAddress = '0x2487F8aecA38BEA2B66a3d80f3943BbcAc0A5FF7';
            const contract = new ethers.Contract(contractAddress, DeBookABI, signer);
            const amountInWei = ethers.utils.parseEther(amount);
            
            // Call the createWager function on the smart contract
            const transaction = await contract.createWager(gameId, 0, margin, outcome, { value: amountInWei });
            await transaction.wait();    
            setLoading(false);
            // Add logic to handle successful wager creation
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };
    

    const acceptWager = async (wagerId) => {
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.enable();
            const signer = provider.getSigner();
            const contractAddress = '0x2487F8aecA38BEA2B66a3d80f3943BbcAc0A5FF7';
            const contract = new ethers.Contract(contractAddress, DeBookABI, signer);
            debugger
            await contract.acceptWager(wagerId, { value: wagers[wagerId - 1].amount });
            setLoading(false);
            // Add logic to handle successful acceptance of wager
        } catch (error) {
            debugger
            setLoading(false);
            setError(error.message);
        }
    };

    useEffect(() => {
        async function fetchWagers() {
            try {
                setLoading(true);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contractAddress = '0x2487F8aecA38BEA2B66a3d80f3943BbcAc0A5FF7';
                const contract = new ethers.Contract(contractAddress, DeBookABI, provider);
                const wagersCount = await contract.getWagerCounter();
    
                // Fetch all wagers from the contract
                const promises = [];
                for (let i = 1; i <= wagersCount; i++) {
                    promises.push(contract.wagers(i));
                }
                const fetchedWagers = await Promise.all(promises);
                setWagers(fetchedWagers.map((wager, index) => ({
                    ...wager,
                    wagerId: index + 1
                })));
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        }
    
        fetchWagers();
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
                            {wager.isAccepted ? (
                                <div>Accepted by: {shortenAddress(wager.acceptor)}</div>
                            ) : (
                                <div>
                                    <button onClick={() => acceptWager(wager.wagerId)}>Accept Wager</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default WagerIndex;



