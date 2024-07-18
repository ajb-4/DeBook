import './WagerModal.css';
import { React, useState, useEffect }from 'react';
import { ethers } from 'ethers';
import DeBookABI from '../DeBookABI.json';


const WagerModal = ({ closeModal }) => {

    const [amount, setAmount] = useState("");
    const [gameId, setGameId] = useState("");
    const [outcome, setOutcome] = useState("");
    const [margin, setMargin] = useState("");
    const [acceptableWager, setAcceptableWager] = useState("");
    const [wagers, setWagers] = useState([]);
    const [celticsWagers, setCelticsWagers] = useState([]);
    const [patriotsWagers, setPatriotsWagers] = useState([]);
    const [filteredWagers, setFilteredWagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const formattedNum = (num) => {
        return num > 0 ? `+${num}` : num;
    };
    
    const formatMargin = (marginHex) => {
        const bigNumber = ethers.BigNumber.from(marginHex);
        const sign = bigNumber.isNegative() ? '-' : '+';
        const absoluteValue = bigNumber.abs().toNumber();
        const formattedMargin = absoluteValue / 10;

        return formattedMargin % 1 === 0 ? `${sign}${Math.abs(formattedMargin)}` : `${sign}${formattedMargin.toFixed(1)}`;
    };

    const clickorderitem = (wager) => {
        setAmount(ethers.utils.formatEther(wager.amount));
        setOutcome(wager.outcome);
        setMargin(ethers.BigNumber.from(wager.margin).toNumber() / 10);
        setAcceptableWager(wager);
    };


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

            // can comment back in when we can identify gameID
    
            // if (gameId === "") {
            //     setError("Please enter a valid game ID");
            //     return;
            // }

    
            if (outcome === "") {
                setError("Please enter a valid outcome");
                return;
            }

            if (margin === "") {
                setError("Please enter a valid margin");
                return;
            }
    
            const marginValue = parseFloat(margin);

            if (isNaN(marginValue)) {
                setError("Please enter a valid margin");
                return;
            }
    
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.enable();
            const signer = provider.getSigner();
            const contractAddress = '0xb134B85cac4fb99223550BC1C486878c4E53801B';
            const contract = new ethers.Contract(contractAddress, DeBookABI, signer);
            const amountInWei = ethers.utils.parseEther(amount);
            const marginInt = Math.round(marginValue * 10);
            
            // Call the createWager function on the smart contract

            const transaction = await contract.createWager(1, 0, marginInt, outcome, { value: amountInWei });
            await transaction.wait();    
            setLoading(false);
            // Add logic to handle successful wager creation
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    const acceptWager = async (wager) => {
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.enable();
            const signer = provider.getSigner();
            const contractAddress = '0xb134B85cac4fb99223550BC1C486878c4E53801B';
            const contract = new ethers.Contract(contractAddress, DeBookABI, signer);

            await contract.acceptWager(wager.wagerId, { value: wager.amount });
            setLoading(false);
        } catch (error) {

            setLoading(false);
            // setError(error.message);
        }
    };

    const cancelWager = () => {
        setAmount("");
        setOutcome("");
        setMargin("");
        setAcceptableWager("");
    };

    const selectedoutcome = (team) => {
        return team === outcome;
    }

    useEffect(() => {
        async function fetchWagers() {
            try {
                setLoading(true);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contractAddress = '0xb134B85cac4fb99223550BC1C486878c4E53801B';
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
        setFilteredWagers(wagers.filter(wager => wager.gameId.toNumber() === 1));
    }, [wagers]);
    
    useEffect(() => {
        const celticsWagers = filteredWagers.filter(wager => wager.outcome === "Celtics").filter(wager=>!wager.isAccepted);
        const patriotsWagers = filteredWagers.filter(wager => wager.outcome === "Patriots").filter(wager=>!wager.isAccepted);

        // Chat GPT's suggestion, don's understand the marginA.sub(marginB) function call 

        celticsWagers.sort((a, b) => {
            const marginA = ethers.BigNumber.from(a.margin);
            const marginB = ethers.BigNumber.from(b.margin);
            return marginA.sub(marginB).toNumber();
        });

        patriotsWagers.sort((a, b) => {
            const marginA = ethers.BigNumber.from(a.margin);
            const marginB = ethers.BigNumber.from(b.margin);
            return marginA.sub(marginB).toNumber();
        });
        
        setCelticsWagers(celticsWagers);
        setPatriotsWagers(patriotsWagers);
    }, [filteredWagers]);


return (
    <div id="wagermodal-container">
        <div id='wagermodal-createwagercontainer'>
            <div id='wagermodal-marketcontainer'>
                <div id='wagermodal-orderbook'>
                    <div id='wagermodal-teamonebids'>
                        <div id='wagermodal-teamheader'>Celtics</div>
                        <div id='wagermodal-marketheader'>
                            <div>Team</div>
                            <div>Spread</div>
                            <div>ETH</div>
                        </div>
                            {celticsWagers.map((wager, index) => (
                                <div key={index} id='wagermodal-orderitemteamone' onClick={() => clickorderitem(wager)}>
                                    <div>{wager.outcome}</div>
                                    <div>{formatMargin(wager.margin)}</div>
                                    <div>{ethers.utils.formatEther(wager.amount)}</div>
                                </div>
                            ))}
                    </div>
                    <div id='wagermodal-teamtwobids'>
                        <div id='wagermodal-teamheader'>Patriots</div>
                        <div id='wagermodal-marketheader'>
                            <div>Team</div>
                            <div>Spread</div>
                            <div>ETH</div>
                        </div>
                            {patriotsWagers.map((wager, index) => (
                                <div key={index} id='wagermodal-orderitemteamtwo' onClick={() => clickorderitem(wager)}>
                                    <div>{wager.outcome}</div>
                                    <div>{formatMargin(wager.margin)}</div>
                                    <div>{ethers.utils.formatEther(wager.amount)}</div>
                                </div>
                            ))}
                        </div>
                </div>
            </div>
            <div id='wagermodal-rightside'>
                <div onClick={closeModal} id='wagermodal-closebutton'>
                    &times;
                </div>
                <div id='wagermodal-wagersummary'>
                    <div>Team(margin)</div>
                    <div>Size(ETH)</div>
                </div>
                <div id='wagermodal-wagersummary'>
                    <div>{outcome}{margin && (<>({formattedNum(margin)})</>)}</div>
                    <div>{amount}</div>
                </div>
                <div id='wagermodal-createwagerform'>
                    {/* <input type="number" value={gameId} onChange={(e) => setGameId(e.target.value)} placeholder="Enter game ID" /> */}
                    {acceptableWager && 
                        <>
                            <button onClick={() => acceptWager(acceptableWager)} disabled={loading} id='wagermodal-createwagerbutton'>Accept Wager</button>
                            <button onClick={() => cancelWager()} disabled={loading} id='wagermodal-cancelwagerbutton'>Cancel Wager</button>
                        </>
                    }
                    {!acceptableWager && 
                        <>
                            <div id="wagermodal-selectoutcome">
                                <div id='wagermodal-Celticsbutton'>
                                    <button onClick={() => setOutcome("Celtics")} className='wagermodal-outcomebutton' id={selectedoutcome("Celtics") ? 'selectedoutcome' : ''}>Celtics</button>
                                </div>
                                <div id='wagermodal-Patriotsbutton'>
                                    <button onClick={() => setOutcome("Patriots")} className='wagermodal-outcomebutton' id={selectedoutcome("Patriots") ? 'selectedoutcome' : ''}>Patriots</button>
                                </div>
                            </div>
                            <input type="number" step='0.5' value={margin} onChange={(e) => setMargin(e.target.value)} placeholder="Enter margin (points)" />
                            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount (ETH)" />
                            <button onClick={createWager} disabled={loading} id='wagermodal-createwagerbutton'>Create Wager</button>
                        </>
                    }
                    {error && <div>{error}</div>}
                </div>
            </div>           
        </div>
    </div>
  );
};

export default WagerModal;