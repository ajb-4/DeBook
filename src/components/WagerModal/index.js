import './WagerModal.css';
import { React, useState }from 'react';
import { ethers } from 'ethers';
import DeBookABI from '../DeBookABI.json';


const WagerModal = ({ closeModal }) => {

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
return (
    <div id="wagermodal-container">
        <div id='wagermodal-createwagercontainer'>
            <div id='wagermodal-marketcontainer'>
                <div id='wagermodal-marketheader'>
                    <div>Price</div>
                    <div>Amount</div>
                </div>
                <div id='wagermodal-orderbook'>
                    <div>Offer 1</div>
                    <div>Offer 2</div>
                    <div>Offer 3</div>
                    <div>Offer 4</div>
                    <div>Offer 5</div>
                </div>
            </div>           
            <div id='wagermodal-createwagerform'>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
                <input type="number" value={gameId} onChange={(e) => setGameId(e.target.value)} placeholder="Enter game ID" />
                <input type="text" value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Enter outcome" />
                <input type="number" value={margin} onChange={(e) => setMargin(e.target.value)} placeholder="Enter margin" />
                <button onClick={createWager} disabled={loading}>Create Wager</button>
                {error && <div>{error}</div>}
                <span className="close" onClick={closeModal}>&times;</span>
            </div>
        </div>
    </div>
  );
};

export default WagerModal;