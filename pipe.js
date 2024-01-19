const fs = require("node:fs/promises");

const {pipeline} = require("stream");

(async () => {

    //let play with timeing
    console.time("start")
    const readerFD = await fs.open('./src.txt', 'r')
    const writerFD = await fs.open('./dest.txt', 'w')

    const reader= readerFD.createReadStream()
    const writer = writerFD.createWriteStream()


    // not recommneded
    // reader.pipe(writer)
    // reader.on("end",()=>{
    //     console.timeEnd("start")
    // })

    //recommnedded way

    pipeline(reader,writer,(err)=>{
        console.log(err)
        console.timeEnd("start")
        
    })
    // console.time("start")
    // const writeable = fd.createWriteStream()
    // let i = 0

    // function shouldWrite() {

    //     for (; i < 100_000_000; i++) {
    //         const buffer = Buffer.from(` ${i} `)
    //         if (writeable.writableNeedDrain) {
    //             return
    //         }
    //         writeable.write(buffer)
    //     }
    // }
    // shouldWrite()

    // writeable.on('drain', () => {
    //     // console.log(writeable.writableNeedDrain)
    //     shouldWrite()
    // })


    // writeable.on("finish", () => {
    //     console.timeEnd("start")
    //     fd.close()

    // })

})()