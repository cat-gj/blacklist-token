const utils = require("./utils");
const BlacklistToken = artifacts.require("BlacklistToken");

contract("BlacklistToken constructor", (accounts) => {
    let blacklistToken;

    describe("Empty list of banned pairs", () => {
        let emptyList = [];

        before(async () => {
            blacklistToken = await BlacklistToken.new(emptyList);
        })

        it("Blacklist is empty for some address", async () => {
            let blacklist = await blacklistToken.getBlacklist("0x1");
            assert.equal(blacklist.length, 0,
                "Expected empty blacklist since list of banned pairs was empty");
        })
    })

    describe("Odd list length", () => {
        let oddLengthList = ["0x1"];

        it("Creation fails", async () => {
            blacklistToken = await BlacklistToken.new(oddLengthList);
            let receipt = await web3.eth.getTransactionReceipt(blacklistToken.transactionHash);
            let errorCode = receipt.logs[0].data;
            assert.equal(parseInt(errorCode, 16), 0x100,
                "Expected ERR_BAD_BANNED_PAIRS since list length was odd");
        })
    })

    describe("Single pair list", () => {
        let singlePairList = ["0x1", "0x2"];

        it ("Contract creation successful", async () => {
            blacklistToken = await BlacklistToken.new(singlePairList);
            let receipt = await web3.eth.getTransactionReceipt(blacklistToken.transactionHash);
            let errorCode = receipt.logs[0].data;
            assert.equal(parseInt(errorCode, 16), 0x0,
                "Expected SUCCESS");
        })

        it ("Blacklists created", async () => {
            let blacklist1Expected = [utils.padAddr("0x2")];
            let blacklist2Expected = [utils.padAddr("0x1")];
            let blacklist1Actual = await blacklistToken.getBlacklist("0x1");
            let blacklist2Actual = await blacklistToken.getBlacklist("0x2");

            utils.compareBlacklists(blacklist1Expected, blacklist1Actual, "0x1");
            utils.compareBlacklists(blacklist2Expected, blacklist2Actual, "0x2");
        })

        it ("Empty blacklist for another address", async() => {
            let expected = [];
            let actual = await blacklistToken.getBlacklist("0x3");

            utils.compareBlacklists(expected, actual, "0x3");
        })
    })
})
