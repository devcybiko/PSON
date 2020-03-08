const PSON = require('../PSON');
const gls = require('glstools').files;

function test_files() {
    let files = gls.readDir('.', file => file.endsWith(".pson"));
    for(let file of files) {
        let text = gls.read(file).trim();
        let obj = PSON.parse(text);
        let pson = JSON.stringify(obj, null, 2).trim();
        let jsonFile = file.replace(".pson", ".json");
        let json = gls.read(jsonFile).trim();
        for(let i=0; i<json.length; i++) {
            if (json[i] !== pson[i]) {
                console.error(`ERROR-NO-MATCH ${i} ${json[i]} ${pson[i]}`);
                break;
            }
        }
        if (json !== text) {
            console.error(`ERROR: ${file} did not match ${jsonFile}`);
            break;
        }
    }
}

console.error("\n".repeat(5));
test_files();
console.error("Done.");
