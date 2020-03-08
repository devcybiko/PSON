const fs = require('fs');
const { execSync } = require('child_process');

module.exports = {
    /**
     * simplistic CSV reader
     * @param {} pagesCSVFname
     */
    readCSVFile: function (pagesCSVFname) {
        let lines = this.readListFile(pagesCSVFname);
        let header = [];
        let rows = [];
        for (const i in lines) {
            let line = lines[i];
            let cols = line.split(',');
            if (i == 0) {
                header = cols;
                continue;
            }
            let row = {};
            for (const i in header) {
                row[header[i]] = cols[i];
            }
            rows.push(row);
        }
        return rows;
    },

    // reads a file removing all comments (#) and blank lines
    // and converts each line to a regexp
    readRegExpFile: function (fname) {
        let lines = this.readListFile(fname);
        let rows = [];
        for (const i in lines) {
            let line = lines[i];
            let regexp = new RegExp(line, 'i');
            console.log(regexp);
            rows.push(regexp);
        }
        return rows;
    },

    /**
     *  reads a file removing all comments (#) and blank lines
     */
    readListFile: function (fname) {
        let lines = this.readTextFile(fname);
        let rows = [];
        for (const i in lines) {
            let line = lines[i];
            if (line[0] === '#') continue;
            if (line.trim().length === 0) continue;
            rows.push(line);
        }
        return rows;
    },

    /**
     * read a text file as an array of strings
     */
    readTextFile: function (fname) {
        let text = this.readFile(fname);
        let textByLine = text.split('\n');
        return textByLine;
    },

    /**
     * read a text file as one long string
     */
    readFile: function (fname) {
        let text = "";
        try {
            text = fs.readFileSync(fname).toString('utf-8');
        } catch(ex) {
            // do nothing
        }
        return text;
    },

    /**
     * write an array of strings to a text file
     */
    writeTextFile: function (fname, list) {
        let buffer = new Buffer.from(list.join('\n'));

        let fd = fs.openSync(fname, 'w');
        fs.writeSync(fd, buffer, 0, buffer.length, null);
        fs.closeSync(fd);
    },

    /**
     * write a string directly to a text file
     * create the fully-qualified directory if it doesn't exist
     */
    writeFile: function (fname, str) {
        let lastSlash = fname.lastIndexOf('/');
        if (lastSlash > -1) {
            dirname = fname.substring(0, lastSlash);
            this.createDir(dirname);
        }
        let buffer = new Buffer.from(str);
        let fd = fs.openSync(fname, 'w');
        fs.writeSync(fd, buffer, 0, buffer.length, null);
        fs.closeSync(fd);
    },

    /**
     * create an empty file and all associated directories
     */
    createFile: function (fname) {
        console.log(`fname=${fname}`);
        this.writeFile(fname, '');
    },

    /**
     * recursively create all associated directories
     */
    createDir: function (dirname) {
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true }, err => {
                if (err) throw err;
            });
        }
    },

    /**
     * read all the filenames and directory-names (including . and ..)
     */
    readDir: function (dirname, theFilter = (fname => fname[0] !== '.')) {
        return fs.readdirSync(dirname).filter(theFilter);
    },

    /**
     * run the command and return the stdout
     * if there's an error, returns stderr
     */
    run: function (cmd) {
        let result = "Error..."
        try {
            result = execSync(cmd, {encoding: 'utf8'});
        } catch(e) {
            return e;
        }
        return result;

        // return execSync(cmd, (err, stdout, stderr) => {
        //     if (err) {
        //         return stderr;
        //     }
        //     return stdout;
        // });
    },
    /**
     * read a text file as a JSON object
     */
    readJSONFile: function (fname) {
        let text = this.readFile(fname);
        let json = JSON.parse(text);
        return json;
    },
    /**
     * read a text file as a JSONC (JSON w/ comments) object
     * WARNING: Doesn't like http://urls.... (because of //)
     */
    readJSONCFile: function (fname) {
        let lines = this.readListFile(fname);
        for (let i = 0; i < lines.length; i++) {
            let jsonLine = lines[i];
            let index = jsonLine.indexOf('//');
            if (index > -1) {
                lines[i] = jsonLine.substring(0, index);
            }
        }
        let jsonline = lines.join('\n');
        //console.error(jsonline);
        let json = JSON.parse(jsonline || '{}');
        return json;
    }
}
