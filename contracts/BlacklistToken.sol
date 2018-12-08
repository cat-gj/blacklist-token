pragma solidity ^0.4.24;

import "./IERC20.sol";

contract BlacklistToken {

    // Error codes, mostly for testing
    uint constant SUCCESS = 0x0;
    uint constant ERR_BAD_BANNED_PAIRS = 0x100;

    // Events
    event BlacklistTokenCreation(uint err);

    mapping (address => address[]) private _blacklists;

    constructor(address[] bannedPairs) public {
        uint len = bannedPairs.length;
        if (len % 2 != 0) {
            // In production code, this would be done with a `require` statement,
            // but it's done with an event in order to test the constructor.
            // Of course this would not work in production
            // because the contract is created anyway.
            emit BlacklistTokenCreation(ERR_BAD_BANNED_PAIRS);
            return;
        }

        for (uint i = 0; i < len/2; ++i) {
            addToBlacklist(bannedPairs[2*i], bannedPairs[2*i + 1]);
            addToBlacklist(bannedPairs[2*i + 1], bannedPairs[2*i]);
        }

        emit BlacklistTokenCreation(SUCCESS);
    }

    function addToBlacklist(address blacklistHolder, address toAdd) private {
        _blacklists[blacklistHolder].push(toAdd);
    }

    function getBlacklist(address who) public view returns (address[]) {
        return _blacklists[who];
    }
}
