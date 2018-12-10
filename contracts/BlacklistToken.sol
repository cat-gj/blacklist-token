pragma solidity ^0.4.24;

import {SafeMath} from "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./IERC20.sol";
import "./ErrorCodes.sol";

contract BlacklistToken is IERC20, ErrorCodes {

    using SafeMath for uint;

    // Private variables
    uint private initialSupply = 1000; // fixed supply for simplicity
    bool internal distributed = false; // for initial distribution, made internal for testing

    // Private mappings
    mapping (address => address[]) private blacklists;
    mapping (address => uint) private balances;
    mapping (address => mapping (address => uint)) allowances;

    // Events
    event BlacklistTokenCreation(uint err);
    event InitialSupplyDistribution(uint err);

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

    function distributeInitialSupply(address[] receivers) public {
        require (!distributed);

        uint len = receivers.length;
        require(len == 10);

        uint received = initialSupply / 10;
        address current;

        for (uint i = 0; i < len; ++i) {
            current = receivers[i];
            balances[current] = balances[current].add(received);
        }

        distributed = true;
    }

    function totalSupply() external view returns (uint256) {
        return initialSupply;
    }

    function balanceOf(address _who) external view returns (uint) {
        return balances[_who];
    }

    // TODO
    function allowance(address _owner, address _spender) external view returns (uint256) {
        return DUMMY;
    }

    // TODO
    function transfer(address _to, uint256 _value) external returns (bool) {
        return true;
    }

    // TODO
    function approve(address _spender, uint256 _value) external returns (bool) {
        return true;
    }

    // TODO
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        return true;
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
