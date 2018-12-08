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
                "Blacklist should be empty since list of banned pairs was empty");
        })
    })

    describe("Odd list length", () => {
        let oddLengthList = ["0x1"];

        it("Creation fails", async () => {
            blacklistToken = await BlacklistToken.new(oddLengthList);
            let receipt = await web3.eth.getTransactionReceipt(blacklistToken.transactionHash);
            let errorCode = receipt.logs[0].data;
            assert.equal(parseInt(errorCode, 16), 0x100,
                "Should have raised ERR_BAD_BANNED_PAIRS since list length was odd");
        })
    })
})
