const PSON = require('./PSON');
const glsfiles = require('glsfiles');

function main() {
    console.error("\n".repeat(5));
    let infile = process.argv[2];
    let s = glsfiles.readFile(infile);
    console.log(JSON.stringify(PSON.parse(s), null, 2));
}

main();