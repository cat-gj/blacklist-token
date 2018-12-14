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
    mapping (address => mapping (address => uint)) private allowances;
    mapping (address => mapping (address => bool)) internal banned; // made internal for testing

    // Events for debugging
    event BlacklistTokenCreation(uint err);
    event InitialSupplyDistribution(uint err);
    event TransferCalled(uint err);


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


    /* ----- ERC20 FUNCTIONS ----- */

    function totalSupply() external view returns (uint256) {
        return initialSupply;
    }

    function balanceOf(address _who) external view returns (uint) {
        return balances[_who];
    }

    function allowance(address _owner, address _spender) external view returns (uint256) {
        return allowances[_spender][_owner];
    }

    // Would be external in production, made public for mock class
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(!banned[msg.sender][_to]);

        transferHelper(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        require (_spender != address(0));

        allowances[_spender][msg.sender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        // The first line will `throw` if _to isn't allowed to transfer this much
        allowances[_to][_from] = allowances[_to][_from].sub(_value);

        transferHelper(_from, _to, _value);
        return true;
    }


    /* ----- OTHER PUBLIC FUNCTIONS ----- */

    function getBlacklist(address _who) public view returns (address[]) {
        return blacklists[_who];
    }


    /* ----- PRIVATE FUNCTIONS ----- */

    function addToBlacklist(address _blacklistHolder, address _toAdd) private {
        address[] storage blacklist = blacklists[_blacklistHolder];

        if (!banned[_blacklistHolder][_toAdd]) {
            blacklist.push(_toAdd);
            banned[_blacklistHolder][_toAdd] = true;
        }
    }

    // Helper function for making prohibition transitive
    function blacklistNeighbours(address _neighbourHaver, address _other) private {
        address[] memory neighbours = blacklists[_neighbourHaver];

        for (uint i = 0; i < neighbours.length; ++i) {
            addToBlacklist(neighbours[i], _other);
            addToBlacklist(_other, neighbours[i]);
        }
    }

    // Moves _value tokens from _from's account to _to's account
    function transferHelper(address _from, address _to, uint _value) private {
        // _from's blacklisted addresses can't send tokens to _to
        // and vice versa
        blacklistNeighbours(_from, _to);

        // _to's blacklisted addresses can't send tokens to _from
        // and vice versa
        blacklistNeighbours(_to, _from);

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);

        emit Transfer(_from, _to, _value);
    }
}
