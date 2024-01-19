// @ts-check
const fs = require('fs/promises')


const path = "./src.txt";


// function *counter(limit){
//     for (let i = 0; i < limit; i++) {
//         let v=yield i
//         console.log(v);
//     }
// }

// const c1=counter(5)

// console.log(c1.next("valu"))
// console.log(c1.next("valu"))
// console.log(c1.next("valu"))
// console.log(c1.next("valu"))

(async () => {
    console.time("start")
    console.log("function is runing....")
    const fd = await fs.open(path, "w")
    const stream = fd.createWriteStream()


    let i = 0;

    function* writeFile(bytes) {
        for (; i < bytes; i++) {
            let b = Buffer.from(` ${i} `)
            if (stream.writableNeedDrain) yield i
            stream.write(b)

        }
    }

    const writeFileGen = writeFile(1_000_000)
    writeFileGen.next()
    stream.on("drain", () => {
        console.count("you should write here")
        let response = writeFileGen.next()
        if (response.done) {
            stream.end()
        }
        console.log("writeable => ", stream.writableHighWaterMark)
        console.log("writeable => ", stream.writableLength)
        console.log("need drain => ", stream.writableNeedDrain)

    })

    // const buf = Buffer.alloc(stream.writableHighWaterMark+100)
    // buf.write("malik")
    // stream.on("drain",()=>{
    //     console.log("safe to write more content => ",stream.writable)
    //     fd.close()
    // })
    // stream.write(buf)
    // console.log(stream.writable)
    // console.log(stream.writableHighWaterMark)
    // console.log(stream.writableFinished)
    // console.log(stream.writableLength)
    // console.log(stream.writableNeedDrain)
    // stream.write("adnan")
    console.timeEnd("start")
})()