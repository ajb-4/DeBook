// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract ChainlinkConsumer is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    uint256 public result;

    event RequestFulfilled(bytes32 indexed requestId, uint256 indexed result);

    constructor(address _oracle, bytes32 _jobId, uint256 _fee) {
        setPublicChainlinkToken();
        oracle = _oracle;
        jobId = _jobId;
        fee = _fee;
    }

    function requestData(string memory _url, string memory _path) public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request.add("get", _url);
        request.add("path", _path);
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function fulfill(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId) {
        result = _result;
        emit RequestFulfilled(_requestId, _result);
    }

    function getLatestResult() public view returns (uint256) {
        return result;
    }
}
