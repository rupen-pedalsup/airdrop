// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Simba is ERC20 {
    constructor() ERC20("Simba", "S") {
        _mint(address(this), 10 * 10 ** 18);
    }

    function transferSome(address from, address to, uint amount) public {
        super._transfer(from, to, amount);
    }
}
