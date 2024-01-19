// @ts-check

const { Writable } = require("node:stream");
const fs = require('fs')


class BigWriter extends Writable {

    constructor({ highWaterMark, filePath, limit }) {
        super({ highWaterMark })
        this.filePath = filePath
        this.limit = limit
        this.fd = null
        this.chunk = Buffer.alloc(highWaterMark)
        this.writeCount = 0
        this.byteWritten = 0
    }

    _construct(callback) {
        console.log("--- inside _construct() -------")
        fs.open(this.filePath, "w", (err, fd) => {
            if (err) {
                callback(err)
                return
            }

            this.fd = fd
            callback()
        })
    }

    _write(chunk, encoding, callback) {
        //write only if buffer is full
        if (!this.fd) {
            callback(Error('no file is opened yet'))
            return
        }
        console.log(this.byteWritten)
        console.log(this.writableHighWaterMark)
        if (this.byteWritten + chunk.length >= this.writableHighWaterMark) {
            fs.write(this.fd, this.chunk, callback)
            ++this.writeCount
            this.byteWritten = 0
            this.chunk = Buffer.alloc(this.writableHighWaterMark)
            callback()
        } else {

            this.byteWritten += this.chunk.write(`${chunk}`)
            callback()
        }
    }

    _final(callback) {
        if (!this.fd) {
            callback(Error('no file opened yet'))
        } else {
            console.log(this.chunk.toString())
            const buffer = this.chunk.subarray(0, this.byteWritten)
            console.log(this.byteWritten)
            console.log(buffer.toString())
            fs.write(this.fd, buffer, callback)
        }

    }
    _destroy(error, callback) {
        console.log("stream in ended => Write Count : ", this.writeCount)
        if (!this.fd) {
            callback(error)
        } else {
            fs.close(this.fd, (err) => callback(err || error))
        }
    }
}

// Example usage:
const writer = new BigWriter({
    highWaterMark: 16384, // Set your desired high water mark
    filePath: 'output.txt',
    limit: 10000 // Set your desired limit
});

writer.write('Hello');
writer.write(' World!');
writer.end();