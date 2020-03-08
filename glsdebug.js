
module.exports = {
    OFF: 0,
    TERSE: 1,
    CHATTY: 2,
    VERBOSE: 4,
    RARELY: 1,
    SOMETIMES: 2 | 1,
    ALWAYS: 4 | 2 | 1,

    _debug: false,
    _begin_end_bool: false,
    _indentOffset: 1,
    _indent: 2,
    _stackLevel: 3,
    _showBreadcrumbs: false,
    _maxLevel: 0, // all levels
    _showname: false,

    _aliases: function() {
        this.rarely = this.terse;
        this.sometimes = this.chatty;
        this.always = this.verbose;
        this.v = this.verbose;
        this.c = this.chatty;
        this.t = this.terse;
        this.r = this.rarely;
        this.s = this.sometimes;
        this.a = this.always;
        return this;
    },

    off: function () {
        this._debug = this.OFF;
        this._begin_end_bool = false;
        this._maxLevel = 0;
        this.showname = false;
        this._aliases();
        return this;
    },
    on: function () {
        this._debug = 7; // all modes
        this._begin_end_bool = true;
        this._maxLevel = 0;
        this._showname = true;
        this._aliases();
        return this;
    },
    set: function (level, begin_end_bool = false, maxLevel = 0, showname = true) {
        this._debug = level;
        this._begin_end_bool = begin_end_bool;
        this._maxLevel = maxLevel;
        this._showname = showname;
        this._aliases();
        return this;
    },
    _log: function (where, data) {
        let debugText = this._debugText(".", false, 2, 1);
        if (debugText === "") return; // no output if we've gone too deep in the stack trace
        if (typeof data === "string") {
            where(debugText + data);
        } else {
            where(debugText + ">");
            where(data);
        }
    },
    // always outputs stdout
    log: function (data) { 
        this._log(console.log, data);
    },

    // always outputs on stderr
    error: function (data) { // always outputs stderr
        this._log(console.error, data);
    },

    // verbose - prints out in verbose mode
    verbose: function (data) {
        if (this._debug & this.VERBOSE) this._log(console.log, data);
    },

    // chatty - prints out only in chatty mode 
    chatty: function (data) {
        if (this._debug & this.CHATTY) this._log(console.log, data);
    },

    // terse/rarely - prints out only in verbose mode
    terse: function (data) {
        if (this._debug & this.TERSE) this._log(console.error, data);
    },

    // always - prints out in any mode
    always: function (data) {
        if (this._debug & (this.TERSE | this.CHATTY | this.VERBOSE)) this._log(console.log, data);
    },

    // sometimes - prints out if it's not terse mode
    sometimes: function (data) {
        if (this._debug & (this.TERSE | this.CHATTY)) this._log(console.log, data);
    },

    // terse/rarely - prints out only in terse mode
    rarely: function (data) {
        if (this._debug & this.TERSE) this._log(console.error, data);
    },

    begin: function (data = undefined) {
        if (this._begin_end_bool) console.log(this._debugText(">", true, 1));
    },

    end: function (data = undefined) {
        if (this._begin_end_bool) console.log(this._debugText("<", true, 1));
    },

    _stack: function (n) {
        var error = new Error();
        var stack = error.stack.split('\n');
        return stack.slice(n);
    },

    _formatCaller: function (line) {
        //console.log(line);
        var longName = line.trim().split(" ")[1] || "";
        var name = longName.split(".").pop();
        return { longName: longName, name: name }
    },
    _callers: function (n) {
        n = n < 0 ? -n : n;
        var stack = this._stack(n + 1);
        var callers = [];
        var prev = "";
        var breadcrumbs = "";
        for (var i in stack) {
            var line = stack[i];
            var caller = this._formatCaller(line);
            callers.push(caller);
            breadcrumbs = breadcrumbs + prev + caller.longName;
            prev = "<-";
        }
        return { stack: stack, breadcrumbs: breadcrumbs, callers: callers, depth: stack.length };
    },

    _caller: function (n) {
        n = n < 0 ? -n : n;
        var stack = this._stack(n + 1);
        var caller = this._formatCaller(stack[0]);
        caller.stack = stack;
        caller.depth = stack.length;
        return caller;
    },

    _debugText: function (indent = ".", showname = false, additionalStackLevel=0, additionalIndentLevel=0) {
        var stack = this._callers(this._stackLevel + additionalStackLevel);
        if (this._maxLevel && (stack.depth - this._indentOffset > this._maxLevel)) return ""; // prune the stack to only so many levels deep
        var functionName = stack.callers[0].name;
        var dots = indent.repeat((stack.depth - this._indentOffset + additionalIndentLevel) * this._indent);
        var result = dots;
        if (showname || this._showname) {
            if (this._showBreadcrumbs) {
                result = dots + functionName + ": breadcrumbs: " + stack.breadcrumbs;
            } else {
                result = dots + functionName + ": ";
            }
        } else {
            result = dots;
        }
        return result;
    }
}