const PSON = require('./PSON');

let preprocessorLineTrimTestCases = [
    ["", ""],
    ["{", "{"],
    ["}", "}"],
    ["\\n", "\n"],
    ["key:value", "key:value"],
    ["key:this should trim extra spaces    ", "key:this should trim extra spaces"],
    ["key:this should still trim extra spaces    // a comment is removed    ", "key:this should still trim extra spaces"],
    [
        "key:this \\n has \\v some \\r spe\\ cial \\\\ characters",
        "key:this \n has \v some \r spe cial \\ characters"],
    [
        "key:this \\n has \\v some \\r special \\\\ characters and spaces at the end  // and a comment at the end",
        "key:this \n has \v some \r special \\ characters and spaces at the end"],
    [
        "key:this \\n has \\v some \\r special \\\\ characters and escaped spaces at the end\\s\\s// and a comment at the end",
        "key:this \n has \v some \r special \\ characters and escaped spaces at the end  "],
    [
        "         key:this \\n has whitespace at the front of the key and \\v some \\r special \\\\ characters and escaped spaces at the end\\s\\s// and a comment at the end",
        "key:this \n has whitespace at the front of the key and \v some \r special \\ characters and escaped spaces at the end  "],
    [
        "         key:This has a continuation line    \\      ",
        "key:This has a continuation line    \\"],
];

function test_preprocessLineTrim() {
    for (testcase of preprocessorLineTrimTestCases) {
        let test = testcase[0];
        let expected = testcase[1];
        let got = PSON._preprocessLine(test);
        if (got !== expected) {
            console.error(`ERROR: _preprocessLine: '${test}'\nEXPECTED '${expected}'\nGOT      '${got}'`);
        }
    }
}

/*
{
    key:this is a value //this is a comment
    key: this is a \
value
}
*/
console.log("\n".repeat(5));
test_preprocessLineTrim();
console.log("Done.");
