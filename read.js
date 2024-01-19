const fs = require("fs/promises");

(async () => {
  const readHandler = await fs.open("src.txt", "r");
  const writeHandler = await fs.open("dest.txt", "w");

  let split=''

  const rStream = readHandler.createReadStream({ highWaterMark: 64 * 1024 });
  const wStream = writeHandler.createWriteStream({ highWaterMark: 64 * 1024 });
  rStream.on("data", (chunk) => {
    // console.log("chunk Length => ",chunk.byteLength)
    // console.log("Total Length => ",rStream.readableHighWaterMark)
    // console.log("should Continue => ",rStream.readable)
    // console.log("Total File read => ", (rStream.bytesRead / 1024) * 1024);
    if (wStream.writableNeedDrain) {
      rStream.pause();
    }

    //write only even numbers in dest file
    const numArr = chunk.toString("utf-8").split("  ");
    const len = numArr.length;

    if (!len || len < 1) return;
    //check if any character mismatches
    if((+numArr[0]) !== (+numArr[1])-1 && split){
        numArr[0] = `${split}${numArr[0]}`.trim()
    }
    
    if ((+numArr[len - 2]) + 1 != (+numArr[len - 1])) {
        split = numArr.pop()
    }

    let str=''
    numArr.forEach(n=>{
        n = +n
        if(n%2==0) str +=` ${n} `
    })
    wStream.write(Buffer.from(str));
    console.log("should pause wriing : ", wStream.writableNeedDrain);
  });
  wStream.on("drain", () => {
    rStream.resume();
  });
  wStream.on("finish", () => {
    writeHandler.close();
  });
  rStream.on("end", () => {
    readHandler.close();
    console.log("stream is ended");
  });
})();
