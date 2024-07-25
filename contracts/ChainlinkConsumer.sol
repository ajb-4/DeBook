// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract ChainlinkConsumer is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    uint256 public result;
    string public resultString;

    event RequestFulfilled(bytes32 indexed requestId, string indexed result);

    constructor(address _oracle, bytes32 _jobId) {
        _setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789);
        oracle = _oracle;
        jobId = _jobId;
        fee = (1 * LINK_DIVISIBILITY) / 10;
    }

    function requestData() public returns (bytes32 requestId) {
        Chainlink.Request memory request = _buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request._add("get", "https://rickandmortyapi.com/api/character/1");
        request._add("path", "name");
        return _sendChainlinkRequestTo(oracle, request, fee);
    }

    function fulfill(bytes32 _requestId, bytes memory bytesData) public recordChainlinkFulfillment(_requestId) {
        resultString = abi.decode(bytesData, (string));
        emit RequestFulfilled(_requestId, resultString);
    }

    function getLatestResult() public view returns (string memory) {
        return resultString;
    }
}
