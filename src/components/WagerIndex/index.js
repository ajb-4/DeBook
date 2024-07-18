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
                const contractAddress = '0xd9F74B414198f64598221BAf7f968cb4Ee27E01E';
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
    }, [wagers]);

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



