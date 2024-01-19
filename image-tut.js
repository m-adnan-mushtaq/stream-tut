// // @ts-check
const fs = require('fs');

function convertToGrayScale(inputFile, outputFile) {
  // Read the JPG file
  const data = fs.readFileSync(inputFile);

  // Find the start of the image data (usually after the SOI marker)
  let startIndex = 2; // Start after the SOI marker
  while (startIndex < data.length - 1) {
    const marker = data.readUInt16BE(startIndex);
    if ((marker & 0xff00) !== 0xff00) {
      console.error('Invalid JPG file format');
      return;
    }

    if (marker === 0xffc0 || marker === 0xffc2) {
      // Found the Start of Frame (SOF) marker
      startIndex += 2; // Skip marker
      const height = data.readUInt16BE(startIndex + 3);
      const width = data.readUInt16BE(startIndex + 5);

      // Process image data
      const imageData = data.slice(startIndex + 8);

      // Convert to grayscale
      for (let i = 0; i < imageData.length; i += 3) {
        const avg = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
        imageData[i] = avg;
        imageData[i + 1] = avg;
        imageData[i + 2] = avg;
      }

      // Write the result to a new JPG file
      const outputData = Buffer.alloc(startIndex + 8);
      data.copy(outputData, 0, 0, startIndex + 8);
      imageData.copy(outputData, startIndex + 8);

      fs.writeFileSync(outputFile, outputData);
      return;
    } else {
      // Skip to the next marker
      const size = data.readUInt16BE(startIndex + 2);
      startIndex += size + 2;
    }
  }

  console.error('SOF marker not found');
}

const inputFile = 'download.jpg'; // Replace with your input file name
const outputFile = 'output_gray.jpg'; // Replace with your output file name

convertToGrayScale(inputFile, outputFile);

// const { randomUUID } = require("crypto")
// const fs = require("fs/promises")
// const { extname } = require('path')


// function getGrayscaleValue(red, green, blue) {
//     return Math.round(0.299 * red + 0.587 * green + 0.114 * blue);
// }


// const pixelBytes = 3;

// function getPixelColor(imageData, index) {
//     const blue = imageData[index];
//     const green = imageData[index + 1];
//     const red = imageData[index + 2];
//     return [red, green, blue];
// }
// async function convertToGrayScale(filePath) {
//     const ext = extname(filePath)
//     const readFd = await fs.open(filePath, "r")
//     const writeFd = await fs.open(`${randomUUID()}-output${ext}`,"w")
//     const readStream = readFd.createReadStream(filePath)
//     const writeStream = writeFd.createWriteStream()

//     readStream.on("data", (imageData) => {
//         if(writeStream.writableNeedDrain){
//             readStream.pause()
//             return
//         }
//         const grayscaleData=Buffer.alloc(imageData.length)
//         for (let i = 0; i < imageData.length; i += pixelBytes) {
//             const pixelColor = getPixelColor(imageData, i);
//             const grayscaleValue = getGrayscaleValue(pixelColor[0], pixelColor[1], pixelColor[2]);
//             console.log(pixelColor)
//             console.log(grayscaleValue)
//             grayscaleData[i] = grayscaleValue;
//             grayscaleData[i + 1] = grayscaleValue;
//             grayscaleData[i + 2] = grayscaleValue;
//         }
//         writeStream.write(grayscaleData)
//     })

//     writeStream.on("drain",()=>{
//         readStream.resume()
//     })

//     readStream.on("end", () => {
//         console.log(`${filePath} is converted to gray scale`)
//     })
// }

// convertToGrayScale('download.jpg')