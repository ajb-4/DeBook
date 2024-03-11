import './WagerModal.css';
import { React, useState, useEffect }from 'react';
import { ethers } from 'ethers';
import DeBookABI from '../DeBookABI.json';


const WagerModal = ({ closeModal }) => {

    const [amount, setAmount] = useState("");
    const [gameId, setGameId] = useState("");
    const [outcome, setOutcome] = useState("");
    const [margin, setMargin] = useState("");
    const [wagers, setWagers] = useState([]);
    const [celticsWagers, setCelticsWagers] = useState([]);
    const [patriotsWagers, setPatriotsWagers] = useState([]);
    const [filteredWagers, setFilteredWagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function hexToSignedInt(hex) {
        
        const bigNumber = ethers.BigNumber.from(hex);

        const signedInt = bigNumber.toTwos(256).toNumber();
    
        const sign = signedInt >= 0 ? '+' : '-';
        const absoluteValue = Math.abs(signedInt);
    
        return `${sign}${absoluteValue}`;
    }
    

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

    useEffect(() => {
        async function fetchWagers() {
            try {
                setLoading(true);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contractAddress = '0x2487F8aecA38BEA2B66a3d80f3943BbcAc0A5FF7';
                const contract = new ethers.Contract(contractAddress, DeBookABI, provider);
                const wagersCount = await contract.getWagerCounter();
    
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

    useEffect(() => {
        setFilteredWagers(wagers.filter(wager => wager.gameId.toNumber() === 3));
        const celticsWagers = wagers.filter(wager => wager.outcome === "Celtics");
        const patriotsWagers = wagers.filter(wager => wager.outcome === "Patriots");

        // Set the filtered wagers into separate states
        setCelticsWagers(celticsWagers);
        setPatriotsWagers(patriotsWagers);
    }, [wagers]);


return (
    <div id="wagermodal-container">
        <div id='wagermodal-createwagercontainer'>
            <div id='wagermodal-marketcontainer'>
                <div id='wagermodal-orderbook'>
                    <div id='wagermodal-teamonebids'>
                        <div>Celtics</div>
                        <div id='wagermodal-marketheader'>
                            <div>Team</div>
                            <div>Spread</div>
                            <div>Size</div>
                        </div>
                            {celticsWagers.map((wager, index) => (
                                <div key={index} id='wagermodal-orderitemteamone'>
                                    <div>{wager.outcome}</div>
                                    <div>{hexToSignedInt(wager.margin)}</div>
                                    <div>{ethers.utils.formatEther(wager.amount)} ETH</div>
                                </div>
                            ))}
                    </div>
                    <div id='wagermodal-teamtwobids'>
                        <div>Patriots</div>
                        <div id='wagermodal-marketheader'>
                            <div>Team</div>
                            <div>Spread</div>
                            <div>Size</div>
                        </div>
                            {patriotsWagers.map((wager, index) => (
                                <div key={index} id='wagermodal-orderitemteamtwo'>
                                    <div>{wager.outcome}</div>
                                    <div>{hexToSignedInt(wager.margin)}</div>
                                    <div>{ethers.utils.formatEther(wager.amount)} ETH</div>
                                </div>
                            ))}
                        </div>
                </div>
            </div>
            <div id='wagermodal-rightside'>
                <div onClick={closeModal} id='wagermodal-closebutton'>
                    &times;
                </div>
                <div id='wagermodal-createwagerform'>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
                    <input type="number" value={gameId} onChange={(e) => setGameId(e.target.value)} placeholder="Enter game ID" />
                    <input type="text" value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Enter outcome" />
                    <input type="number" value={margin} onChange={(e) => setMargin(e.target.value)} placeholder="Enter margin" />
                    <button onClick={createWager} disabled={loading} id='wagermodal-createwagerbutton'>Create Wager</button>
                    {error && <div>{error}</div>}
                </div>
            </div>           
        </div>
    </div>
  );
};

export default WagerModal;