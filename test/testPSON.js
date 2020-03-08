const PSON = require('../PSON');
const gls = require('glstools').files;

function test_files() {
    let files = gls.readDir('.', file => file.endsWith(".pson"));
    for(let file of files) {
        let pson = gls.read(file).trim();
        let result = PSON.parse(pson);
        let json = JSON.stringify(result, null, 2).trim();
        let textFile = file.replace(".pson", ".txt");
        let text = gls.read(textFile);
        console.log(`${json.length} ${text.length}`);
        for(let i=0; i<json.length; i++) {
            if (json[i] !== text[i]) {
                console.log(`${i} ${json[i]} ${text[i]}`);
                break;
            }
        }
        if (json !== text) {
            console.error(pson);
            console.log(json);
            console.error(text);
            console.error(`ERROR: ${file} did not match ${textFile}`);
            break;
        }
    }
}

console.error("\n".repeat(5));
test_files();
console.error("Done.");
