pragma solidity ^0.4.24;

import "./IERC20.sol";

contract BlacklistToken {

    // Private variables
    uint private supply = 1000000; // fixed supply for simplicity

    // Error codes, mostly for testing
    uint constant SUCCESS = 0x0;
    uint constant ERR_BAD_BANNED_PAIRS = 0x100;

    // Events
    event BlacklistTokenCreation(uint err);

    // Private mappings
    mapping (address => address[]) private blacklists;
    mapping (address => uint) balances;

    constructor(address[] _bannedPairs) public {
        uint len = _bannedPairs.length;

        if (len % 2 != 0) {
            // In production code, this would be done with a `require` statement,
            // but it's done with an event in order to test the constructor.
            // Of course this would not work in production
            // because the contract is created anyway.
            emit BlacklistTokenCreation(ERR_BAD_BANNED_PAIRS);
            return;
        }

        for (uint i = 0; i < len/2; ++i) {
            addToBlacklist(_bannedPairs[2*i], _bannedPairs[2*i + 1]);
            addToBlacklist(_bannedPairs[2*i + 1], _bannedPairs[2*i]);
        }

        emit BlacklistTokenCreation(SUCCESS);
    }

    function totalSupply() external view returns (uint256) {
        return supply;
    }

    function balanceOf(address _who) external view returns (uint) {
        return balances[_who];
    }

    function addToBlacklist(address _blacklistHolder, address _toAdd) private {
        address[] storage blacklist = blacklists[_blacklistHolder];

        if (!contains(blacklist, _toAdd)) {
            blacklist.push(_toAdd);
        }
    }

    function getBlacklist(address _who) public view returns (address[]) {
        return blacklists[_who];
    }

    function contains(address[] _blacklist, address _element) private pure returns (bool) {
        uint len = _blacklist.length;

        for (uint i = 0; i < len; ++i) {
            if (_blacklist[i] == _element) {
                return true;
            }
        }

        return false;
    }
}
