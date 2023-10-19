// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop is Ownable {
    address public tokenAddr;

    constructor(address _tokenAddr) Ownable(msg.sender) {
        tokenAddr = _tokenAddr;
    }

    function dropTokens(
        address[] memory _recipients,
        uint256[] memory _amounts
    ) public onlyOwner returns (bool) {
        for (uint256 i = 0; i < _recipients.length; i++) {
            require(_recipients[0] != address(0));
            require(IERC20(tokenAddr).transfer(_recipients[i], _amounts[i]));
        }

        return true;
    }

    function updateTokenAddress(address newTokenAddress) public {
        tokenAddr = newTokenAddress;
    }
}
