const PSON = require('./PSON');
const glsfiles = require('glstools').files;

function main() {
    console.error("\n".repeat(5));
    let infile = process.argv[2];
    let s = glsfiles.read(infile);
    console.log(JSON.stringify(PSON.parse(s), null, 2));
}

main();