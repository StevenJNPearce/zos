pragma solidity ^0.4.24;

import "openzeppelin-zos/contracts/token/ERC20/StandardToken.sol";

contract TokenExchange {
  uint256 constant rate = 10;

  StandardToken public token;
  address public beneficiary;

  function initialize(address _beneficiary, StandardToken _token) public {
    require(token == address(0));
    token = _token;
    beneficiary = _beneficiary;
  }
  
  function () public payable {
    require(token.transfer(msg.sender, msg.value * rate));
    beneficiary.transfer(msg.value);
  }
}

