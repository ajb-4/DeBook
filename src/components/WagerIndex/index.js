import './WagerIndex.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DeBookABI from '../DeBookABI.json';
import WagerModal from '../WagerModal';
import WagerIndexItem from '../WagerIndexItem';

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
                    {loading ? 'Loading or having an ESLINT error' : ''}
                    {wagers.map((wager, index) => (
                        <div id='wagerindexitem' key={index}>
                            <WagerIndexItem wager={wager}/>
                        </div>
                    ))}
                    {error && <div>{error}</div>}
                </div>
            </div>
        </>
    );
};

export default WagerIndex;



