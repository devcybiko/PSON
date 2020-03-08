const PSON = require('./PSON');
const glsfiles = require('glsfiles');

function main() {
    console.log("\n".repeat(5));
    let infile = process.argv[2];
    let s = glsfiles.readFile(infile);
    console.log(PSON.parse(s));
}

main();