import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import './NavBar.css';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [balance, setBalance] = useState(null);
    const [connected, setConnected] = useState(false);

    const connectToMetamask = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                setConnected(true);
                const chainId = 11155111;
                const provider = new Web3Provider(window.ethereum, chainId);
                const signer = provider.getSigner();
                const userBalance = await signer.getBalance();
                setBalance(parseFloat(ethers.utils.formatEther(userBalance)).toFixed(3));
            } else {
                setConnected(false);
                setBalance(null);
            }
        } catch (error) {
            console.error('Error connecting to MetaMask:', error.message);
        }
    };    

    const mintUsdc = async () => {
        try {
            const chainId = 11155111;
            const provider = new ethers.providers.Web3Provider(window.ethereum, chainId);
            const signer = provider.getSigner();
            const mockUSDCContract = new ethers.Contract(process.env.REACT_APP_MOCKUSDC_CONTRACT_ADDRESS, ['function mint(address account, uint256 amount)'], signer);

            const receiverAddress = await signer.getAddress();
            const amountToMint = ethers.utils.parseUnits("1000", 6);

            const tx = await mockUSDCContract.mint(receiverAddress, amountToMint);
            await tx.wait();
            console.log(`Minted ${ethers.utils.formatUnits(amountToMint, 6)} MockUSDC tokens to ${receiverAddress}`);

            // Optionally update balance after minting
            const userBalance = await signer.getBalance();
            setBalance(parseFloat(ethers.utils.formatEther(userBalance)).toFixed(3));
        } catch (error) {
            console.error('Error minting USDC:', error.message);
        }
    };

    // Check connection and balance on component mount
    useEffect(() => {
        const checkConnectionAndBalance = async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setConnected(true);
                    const chainId = 11155111;
                    const provider = new Web3Provider(window.ethereum, chainId);
                    const signer = provider.getSigner();
                    const userBalance = await signer.getBalance();
                    setBalance(parseFloat(ethers.utils.formatEther(userBalance)).toFixed(3));
                }
            } catch (error) {
                console.error('Error checking connection and balance:', error.message);
            }
        };

        checkConnectionAndBalance();
    }, []);

    useEffect(() => {
        if (window.ethereum) {
            const handleAccountsChanged = async (accounts) => {
                if (accounts.length === 0) {
                    setConnected(false);
                    setBalance(null);
                } else {
                    setConnected(true);
                    const chainId = 11155111;
                    const provider = new Web3Provider(window.ethereum, chainId);
                    const signer = provider.getSigner();
                    const userBalance = await signer.getBalance();
                    setBalance(parseFloat(ethers.utils.formatEther(userBalance)).toFixed(3));
                }
            };
    
            window.ethereum.on('accountsChanged', handleAccountsChanged);
    
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, []);
    

    return (
        <>
            <div id='navbar-outtercontainer'>
                <div id='navbar-leftside'>
                    <div id='navbar-profilebutton'>
                        <Link to='/profile'><i className="fa-thin fa-user"></i></Link>
                    </div>
                    <div id='navbar-userbalance'>
                        <i className="fa-thin fa-money-bill-trend-up"></i>
                        <div id='navbar-userbalancevalue'>{connected ? `${balance} ETH` : 'Add ETH'}</div>
                    </div>
                </div>
                <div id='navbar-middle'>
                    <Link to='/'>BLCK MRKT</Link>
                </div>
                <div id='navbar-wallet' onClick={connectToMetamask}>
                    <button onClick={mintUsdc} id="navbar-mintbutton">MINT USDC</button>
                    <div id='navbar-connectedheader'>{connected ? 'CONNECTED' : ''}</div>
                    <i className="fa-thin fa-wallet"></i>
                </div>
            </div>
        </>
    );
}

export default NavBar;
