const PSON = require('../PSON');
const gls = require('glstools').files;

function test_files() {
    let files = gls.readDir('.', file => file.endsWith(".pson"));
    for(let file of files) {
        let pson = gls.read(file);
        console.log(pson);
        let result = PSON.parse(pson);
        let json = JSON.stringify(result, null, 2);
        console.log(result);
        let textFile = file.replace(".pson", ".txt");
        let text = gls.read(textFile);
        console.log(text);
        if (json !== text) {
            console.log(`ERROR: ${file} did not match ${textFile}`);
            break;
        }
    }
}

console.error("\n".repeat(5));
test_files();
console.log("Done.");
