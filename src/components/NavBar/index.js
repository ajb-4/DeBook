import React, { useState } from 'react';
import { utils } from 'ethers/lib.esm';
import { Web3Provider } from '@ethersproject/providers';
import './NavBar.css';
import { Link } from 'react-router-dom';

const NavBar = () => {

    const [balance, setBalance] = useState(null);
    const [connected, setConnected] = useState(false);

    const connectToMetamask = async () => {
        try {
            if (!connected) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } else {
                debugger
                await window.ethereum.request({ method: 'eth_accounts', params: [] });
            }
            const chainId = 5;
            const provider = new Web3Provider(window.ethereum, chainId);
            const signer = provider.getSigner();
            const userBalance = await signer.getBalance();
            setBalance(utils.formatEther(userBalance));
            setConnected(!connected);
        } catch (error) {
            console.error('Error connecting to Metamask:', error.message);
        }
    };


    return (
        <>
            <div id='navbar-outtercontainer'>
                <div id='navbar-leftside'>
                    <div id='navbar-profilebutton'>
                        <Link to='/profile'><i class="fa-thin fa-user"></i></Link>
                    </div>
                    <div id='navbar-userbalance'>
                        <i class="fa-thin fa-dollar-sign"></i>
                        <div id='navbar-userbalancevalue'>{connected ? `${Math.round(balance * 10000)/ 10000} ETH` : 'Add Eth'}</div>
                    </div>
                </div>
                <div id='navbar-middle'>
                    <Link to='/'>DeBook</Link>
                </div>
                <div id='navbar-wallet' onClick={connectToMetamask}>
                    <div id='navbar-connectedheader'>{connected ? 'CONNECTED' : ''}</div>
                    <i class="fa-thin fa-wallet"></i>
                </div>
            </div>
        </>
    )
}

export default NavBar;