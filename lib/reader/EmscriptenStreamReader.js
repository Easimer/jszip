'use strict';
var DataReader = require('./DataReader');
var utils = require('../utils');

/**
 * 
 * @param {object} emscriptenFileContext Emscripten file
 * @param {object} emscriptenFileContext.fs Emscripten FS module
 * @param {object} emscriptenFileContext.stream Emscripten FS stream
 * @param {number} emscriptenFileContext.length Length of the file
 */
function EmscriptenStreamReader(emscriptenFileContext) {
    DataReader.call(this, emscriptenFileContext);
}
utils.inherits(EmscriptenStreamReader, DataReader);

/**
 * @see DataReader.byteAt
 */
EmscriptenStreamReader.prototype.byteAt = function (i) {
    var buf = new Uint8Array(1);
    this.data.fs.read(this.data.stream, buf, 0, 1, i);
    return buf[0];
};

/**
 * @see DataReader.lastIndexOfSignature
 */
EmscriptenStreamReader.prototype.lastIndexOfSignature = function (sig) {
    var sig0 = sig.charCodeAt(0),
        sig1 = sig.charCodeAt(1),
        sig2 = sig.charCodeAt(2),
        sig3 = sig.charCodeAt(3);
    var buf = new Uint8Array(4);
    for (var i = this.length - 4; i >= 0; --i) {
        this.data.fs.read(this.data.stream, buf, 0, 4, i);
        if (buf[0] === sig0 &&
            buf[1] === sig1 &&
            buf[2] === sig2 &&
            buf[3] === sig3
        ) {
            return i - this.zero;
        }
    }

    return -1;
};

/**
 * @see DataReader.readAndCheckSignature
 */
EmscriptenStreamReader.prototype.readAndCheckSignature = function (sig) {
    var sig0 = sig.charCodeAt(0),
        sig1 = sig.charCodeAt(1),
        sig2 = sig.charCodeAt(2),
        sig3 = sig.charCodeAt(3),
        data = this.readData(4);
    return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
};

/**
 * @see DataReader.readData
 */
EmscriptenStreamReader.prototype.readData = function (size) {
    this.checkOffset(size);
    if (size === 0) {
        return [];
    }
    var buf = new Uint8Array(size);
    this.data.fs.read(this.data.stream, buf, 0, size, this.index);
    this.index += size;
    return Array.from(buf);
};
module.exports = EmscriptenStreamReader;
