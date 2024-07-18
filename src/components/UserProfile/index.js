import './UserProfile.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const UserProfile = () => {
    const [wagers, setWagers] = useState([]);
    const [filteredWagers, setFilteredWagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        async function fetchWagers() {
            try {
                setLoading(true);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contractAddress = '0xd9F74B414198f64598221BAf7f968cb4Ee27E01E';
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
        debugger
    }, [wagers]);

    return (
        <div id='userprofile-outtercontainer'>
            <div id='userprofile-activewagerindex'>
                <div>Wager Index</div>
                {filteredWagers.map((wager, index) => (
                    <div key={index}>{/* Render your active wagers here */}</div>
                ))}
            </div>
            <div id='userprofile-pastwagerindex'>
                {filteredWagers.map((wager, index) => (
                    <div key={index}>{/* Render your past wagers here */}</div>
                ))}
            </div>
        </div>
    );
};

export default UserProfile;