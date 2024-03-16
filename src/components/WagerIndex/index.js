import './WagerIndex.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DeBookABI from '../DeBookABI.json';
import WagerModal from '../WagerModal';

const WagerIndex = () => {
    const [wagers, setWagers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    

    const acceptWager = async (wagerId) => {
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.enable();
            const signer = provider.getSigner();
            const contractAddress = '0xb134B85cac4fb99223550BC1C486878c4E53801B';
            const contract = new ethers.Contract(contractAddress, DeBookABI, signer);
            debugger
            await contract.acceptWager(wagerId, { value: wagers[wagerId - 1].amount });
            setLoading(false);
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
                const contractAddress = '0xb134B85cac4fb99223550BC1C486878c4E53801B';
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
                <div id='wagerindex-header'>
                    <div>Wagers</div>
                    <button onClick={openModal} id='wagerindex-createwager'>Create Wager</button>
                </div>
                <div id='wagerindex-container'>
                    {showModal && (
                        <WagerModal
                        closeModal={closeModal}
                        />
                    )}
                    {wagers.map((wager, index) => (
                        <div id='wagerindexitem' key={index}>
                            <div>GameId: {wager.gameId._hex.toString()}</div>
                            <div>Margin: {wager.margin._hex.toString()}</div>
                            <div>Outcome: {wager.outcome}</div>
                            <div>Wager Type: {wagerTypeName(wager.wagerType)}</div>
                            <div>Amount: {ethers.utils.formatEther(wager.amount)} ETH</div>
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
                    ))}
                    {error && <div>{error}</div>}
                </div>
            </div>
        </>
    );
};

export default WagerIndex;



