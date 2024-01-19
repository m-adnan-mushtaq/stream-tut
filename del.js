


let buffer = Buffer.alloc(16384)

let bytesWritten=0
bytesWritten += buffer.write 
bytesWritten += Buffer.concat([buffer,Buffer.from(' world')])


console.log(buffer.toString())
console.log('Bytes written:', bytesWritten);
console.log('Buffer length:', buffer.length);