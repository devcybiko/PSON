const PSON = require('../PSON');
const gls = require('glstools').files;

function test_files() {
    let files = gls.readDir('.', file => file.endsWith(".pson"));
    for(let psonFile of files) {
        let psonText = gls.read(psonFile).trim();
        let obj = PSON.parse(psonText);
        let pson = JSON.stringify(obj, null, 2).trim();
        let jsonFile = psonFile.replace(".pson", ".json");
        let json = gls.read(jsonFile).trim();
        for(let i=0; i<json.length; i++) {
            if (json[i] !== pson[i]) {
                console.error(`ERROR-NO-MATCH char:${i} pson:${pson[i]} json:${json[i]}`);
                break;
            }
        }
        if (json !== pson) {
            console.error(`ERROR: ${psonFile} did not match ${jsonFile}`);
            break;
        }
    }
}

console.error("\n".repeat(5));
test_files();
console.error("Done.");
