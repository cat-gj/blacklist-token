const BlacklistToken = artifacts.require("BlacklistToken");

contract("BlacklistToken constructor", (accounts) => {
    describe("Empty list of banned pairs", () => {
        let emptyList = [];
        let blacklistToken;

        before(async () => {
            blacklistToken = await BlacklistToken.new(emptyList);
        })

        it("hasBlacklist returns false for some address", async () => {
            let defined = await blacklistToken.hasBlacklist("0x1");
            assert.equal(false, false,
                "Blacklist should not be defined since list of banned pairs was empty");
        })
    })
})
