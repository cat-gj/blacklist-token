pragma solidity ^0.4.24;

import "./BlacklistToken.sol";

contract BlacklistTokenForTests is BlacklistToken {
    constructor(address[] _bannedPairs) BlacklistToken(_bannedPairs) public {}
}
