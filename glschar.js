module.exports = {
    _escapeChars : {
        '0': '\0',
        'b': '\b',
        'f': '\f',
        'n': '\n',
        'r': '\r',
        't': '\t',
        'v': '\v',
        "'": '\'',
        '"': '\"',
        '\\': '\\'
    },
    space : function(c) {
        return /\s/.test(c)
    },
    escapeable: function(c) {
        return this._escapeChars[c];
    },
    var: function(c) {
        return ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_".indexOf(c) !== -1);
    }
}