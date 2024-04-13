import './UserProfile.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const UserProfile = () => {
    const [userWagers, setUserWagers] = useState([]);

    useEffect(() => {
        async function fetchUserWagers() {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contractAddress = '0xb134B85cac4fb99223550BC1C486878c4E53801B';
                const contract = new ethers.Contract(contractAddress, DeBookABI, provider);
                const wagersCount = await contract.getWagerCounter();

                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                const currentUserAddress = accounts[0];

                const promises = [];
                for (let i = 1; i <= wagersCount; i++) {
                    promises.push(contract.wagers(i));
                }
                const fetchedWagers = await Promise.all(promises);

                // Filter wagers to only include those made by the current user
                const userWagers = fetchedWagers.filter(wager => wager.userAddress === currentUserAddress);

                setUserWagers(userWagers);
            } catch (error) {
                console.error('Error fetching user wagers:', error);
            }
        }
        fetchUserWagers();
    }, []);

    return (
        <div id='userprofile-outtercontainer'>
            <div id='userprofile-activewagerindex'>
                <div>Wager Index</div>
                {userWagers.map((wager, index) => (
                    <div key={index}>{/* Render your active wagers here */}</div>
                ))}
            </div>
            <div id='userprofile-pastwagerindex'>
                {userWagers.map((wager, index) => (
                    <div key={index}>{/* Render your past wagers here */}</div>
                ))}
            </div>
        </div>
    );
};

export default UserProfile;