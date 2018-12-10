const utils = require("./utils");
const BlacklistTokenForTests = artifacts.require("BlacklistTokenForTests");

contract("BlacklistToken", (accounts) => {
    let blacklistToken;

    describe("Constructor: empty list of banned pairs", () => {
        let emptyList = [];

        before(async () => {
            blacklistToken = await BlacklistTokenForTests.new(emptyList);
        })

        it("Blacklist is empty for some address", async () => {
            let expected = [];
            let actual = await blacklistToken.getBlacklist("0x1");

            utils.compareBlacklists(expected, actual, "0x1");
        })

        it("Total supply", async () => {
            let expected = 1000;
            let actual = await blacklistToken.totalSupply();

            assert.equal(expected, actual, "Total supply failed");
        })
    })

    describe("Constructor: odd list length", () => {
        let oddLengthList = ["0x1"];

        before(async () => {
            blacklistToken = await BlacklistTokenForTests.new(oddLengthList);
        })

        it("Creation fails", async () => {
            let receipt = await web3.eth.getTransactionReceipt(blacklistToken.transactionHash);
            let errorCode = receipt.logs[0].data;

            assert.equal(parseInt(errorCode, 16), 0x100,
            "Expected ERR_BAD_BANNED_PAIRS since list length was odd");
        })
    })

    describe("Constructor: single pair list", () => {
        let singlePairList = ["0x1", "0x2"];

        before(async () => {
            blacklistToken = await BlacklistTokenForTests.new(singlePairList);
        })

        it ("Contract creation successful", async () => {
            let receipt = await web3.eth.getTransactionReceipt(blacklistToken.transactionHash);
            let errorCode = receipt.logs[0].data;

            assert.equal(parseInt(errorCode, 16), 0x0, "Expected SUCCESS");
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

    describe("Constructor: several pairs", () => {
        let pairs = [
            ["0x1", "0x3"],
            ["0x1", "0x5"],
            ["0x1", "0x6"],
            ["0x2", "0x4"],
            ["0x3", "0x5"]
        ];
        let flattenedPairs = utils.flattenPairs(pairs);

        before(async () => {
            blacklistToken = await BlacklistTokenForTests.new(flattenedPairs);
        })

        it ("Contract creation successful", async () => {
            let receipt = await web3.eth.getTransactionReceipt(blacklistToken.transactionHash);
            let errorCode = receipt.logs[0].data;

            assert.equal(parseInt(errorCode, 16), 0x0, "Expected SUCCESS");
        })

        it ("Blacklists created", async () => {
            let blacklist1Expected = ["0x3", "0x5", "0x6"].map(utils.padAddr);
            let blacklist2Expected = [utils.padAddr("0x4")];
            let blacklist3Expected = ["0x1", "0x5"].map(utils.padAddr);
            let blacklist4Expected = [utils.padAddr("0x2")];
            let blacklist5Expected = ["0x1", "0x3"].map(utils.padAddr);
            let blacklist6Expected = [utils.padAddr("0x1")];

            let addresses = ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6"];
            let expectedBlacklists = [
                blacklist1Expected,
                blacklist2Expected,
                blacklist3Expected,
                blacklist4Expected,
                blacklist5Expected,
                blacklist6Expected
            ];

            let actual;
            let who;

            for (let i = 0; i < addresses.length; ++i) {
                who = addresses[i];
                actual = await blacklistToken.getBlacklist(who);
                utils.compareBlacklists(expectedBlacklists[i], actual, who);
            }
        })

        it ("Empty blacklist for another address", async() => {
            let expected = [];
            let actual = await blacklistToken.getBlacklist("0x7");

            utils.compareBlacklists(expected, actual, "0x7");
        })
    })

    describe("Constructor: repeated edges in list of pairs", () => {
        let pairs = [["0x1", "0x2"], ["0x2", "0x1"]];
        let flattenedPairs = utils.flattenPairs(pairs);

        before(async () => {
            blacklistToken = await BlacklistTokenForTests.new(flattenedPairs);
        })

        it ("Contract creation successful", async () => {
            let receipt = await web3.eth.getTransactionReceipt(blacklistToken.transactionHash);
            let errorCode = receipt.logs[0].data;

            assert.equal(parseInt(errorCode, 16), 0x0, "Expected SUCCESS");
        })

        it("Blacklists created", async () => {
            let blacklist1Expected = [utils.padAddr("0x2")];
            let blacklist2Expected = [utils.padAddr("0x1")];
            let blacklist1Actual = await blacklistToken.getBlacklist("0x1");
            let blacklist2Actual = await blacklistToken.getBlacklist("0x2");

            utils.compareBlacklists(blacklist1Expected, blacklist1Actual, "0x1");
            utils.compareBlacklists(blacklist2Expected, blacklist2Actual, "0x2");
        })
    })
})
