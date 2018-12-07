pragma solidity ^0.4.24;

import "./IERC20.sol";

contract BlacklistToken {

    // Error codes
    uint constant ERR_BAD_BANNED_PAIRS = 0x100;

    // Events
    event CreationError(uint err);

    struct BlacklistInfo {
        bool defined;
        address[] blacklist;
    }

    mapping (address => BlacklistInfo) private _blacklists;

    constructor(address[] bannedPairs) public {
        uint len = bannedPairs.length;
        if (len % 2 != 0) {
            // In production code, this would be done with a `require` statement,
            // but events are better for testing
            emit CreationError(ERR_BAD_BANNED_PAIRS);
            return;
        }

        if (len > 0) {
            for (uint i = 0; i < len - 1; ++i) {
                addToBlacklist(bannedPairs[i], bannedPairs[i+1]);
                addToBlacklist(bannedPairs[i+1], bannedPairs[i]);
            }
        }
    }

    function addToBlacklist(address blacklistHolder, address toAdd) private {
        BlacklistInfo storage blacklistInfo = _blacklists[blacklistHolder];
        blacklistInfo.blacklist.push(toAdd);
    }

    function getBlacklist(address who) public view returns (address[]) {
        return _blacklists[who].blacklist;
    }

    function hasBlacklist(address who) public view returns (bool) {
        return _blacklists[who].defined;
    }
}
