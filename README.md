# blacklist-token
An ERC-20 token implementation that forbids transactions between certain addresses.

## Motivation
This is a coding exercise for a job interview with Protofire (Altoros). The focus is on implementing and testing the blacklist functionality; thus, the rest of the token was made as simple as possible, with just the minimal features required to test the methods where that comes into play (for example, a method for distributing tokens among an initial set of addresses).

Core ERC-20 functionality is largely based on OpenZeppelin's [open source implementation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/ERC20.sol).

## Running

```
git clone https://github.com/cat-gj/blacklist-token && cd blacklist-token
npm install
ganache-cli &> /dev/null
truffle test
```
