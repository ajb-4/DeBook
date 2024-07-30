// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract ChainlinkConsumer is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    bytes32 private jobId;
    uint256 private fee;
    string public resultString;

    event RequestFulfilled(bytes32 indexed requestId, string indexed result);

    constructor() {
        _setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789);
        _setChainlinkOracle(0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD);
        jobId = "7d80a6386ef543a3abb52817f6707e3b"; // GET >> STRING
        fee = (1 * LINK_DIVISIBILITY) / 10;
    }
    // fetch function
    function requestData() public returns (bytes32 requestId) {
        Chainlink.Request memory request = _buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request._add("get", "https://rickandmortyapi.com/api/character/1");
        request._add("path", "name");
        return _sendChainlinkRequest(request, fee);
    }
    // handle response function
    function fulfill(bytes32 _requestId, bytes memory bytesData) public recordChainlinkFulfillment(_requestId) {
        // resultString = abi.decode(bytesData, (string));
        resultString = string(bytesData);
        emit RequestFulfilled(_requestId, resultString);
    }
    // public getter
    function getLatestResult() public view returns (string memory) {
        return resultString;
    }
}
