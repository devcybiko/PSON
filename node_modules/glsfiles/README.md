# glsfiles

This is a collection of 'useful' file-io methods I use over and over again. They aren't particularly well-written, but are good for quick file-io solutions or examples.

All calls are synchronous.

NOTE: There's not much error processing done here. Pretty much any failing `read` operation returns an empty String, Object, or Array. Any failing `write` operation will likely throw an exception (so you should wrap `write` operations with `try/catch` if you care about exceptions).

## readFile: function (fname) : String

Read the file as one long string of text

## readTextFile: function (fname) : String[]

Reads the file and returns each line as a string in the array.

## readListFile: function (fname) : String[]

Just like readTextFile but filters out blank lines and lines beginning with '#' signs (comments)

## readJSONFile: function (fname) : Object

Reads the file and calls JSON.parse on the results and returns a JavaScript object.

## readJSONCFile: function (fname) : Object

Super simplistic JSONC reader. Not very bright.

Same as readJSONFile but filters out any comments (`//`). 

NOTE: It gets confused if the file contains URLS with full domain specs (eg: http://google.com - because the `//` looks like a comment). Or if `//` appears on the values.

## readCSVFile: function (CSVFname) : Object[]

Super simplistic CSV file reader. Not very bright. Doesn't handle quoted values in columns, for example. Also, doesn't handle commas as a character in the field (it would split the field into two colums).

Reads a file that is formatted as a CSV. Assumes the first row is the header and subsequent rows are comma-separated.

Returns an array of 'objects' with key/value pairs such that each key is a column name from the header.

## readRegExpFile: function (fname) : String[]

Performs a `readListFile` on `fname` and returns a list of JavaScript regular expressions. (This may seem like a very unique use case, but it is good for a file of whitelist or blacklist names).

## writeTextFile: function (fname, list) : undefined

The converse of `readTextFile`, takes a list of strings and writes them to a file (separated by newlines).

NOTE: creates all intermediary directories up to the filename.

## writeFile: function (fname, str) : undefined

The converse of `readFile`, takes a single string and writes it to a file.

NOTE: creates all intermediary directories up to the filename

## createFile: function (fname) : undefined

Creates (or overwrites) an empty file onto `fname`.

NOTE: creates all intermediary directories up to the filename.

## createDir: function (dirname) : undefined

Creates the directory specified by `dirname`

NOTE: creates all intermediary directories up to the dirname.

## readDir: function (dirname) : String[]

Reads the specified directory and returns an array of strings, each one a file/directory in the specified directory.

NOTE: Includes all 'dot' files (those beginning with a period) including the current (.) and previous (..) directories. Does not include the directory name leading up to the filenames.

NOTE: Use [fs.statSync](https://nodejs.org/api/fs.html#fs_fs_statsync_path_options) to determine if a file is a regular file or directory.

## run: function (cmd) : String

Runs the `bash` command on the supplied `cmd` and returns the results from `stdout` as one long string. (NOTE: You and use `.split()` to break the results into an array of lines). Also, if there is an error `stderr` is returned instead without warning. You'll have to somehow parse the returned string to determine if things went well or not

## Usage

```javascript
const gls = require('glsfiles');
...
	gls.writeFile("grades.json", JSON.stringify(data));
...
    var json = gls.readJSONFile(fname);
    console.log(json.someField);
...
    var lines = gls.readTextFile(infname);
    for(let i=0; i<lines.length; i++) console.log(lines[i]);
    lines.map(line => console.log(line));
...
    // file looks like this...
    // name,week,assignment,grade
    // GSmith,1,Project 1,A
    // HJones,2,Project 2,B
    var rows = gls.readCSVFile(csvFname);
    
    console.log(rows[0].name); //output => GSmith
    console.log(rows[0].week); //output => 1
    console.log(rows[0].assignment); //output => Project 1
    console.log(rows[0].grade); //output => A

    console.llg(rows[1].name); // output => HJones
    console.llg(rows[1].week); // output => 2
    console.llg(rows[1].assignment); // output => Project 2
    console.llg(rows[1].grade); // output => B
```