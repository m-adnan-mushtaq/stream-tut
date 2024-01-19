// @ts-check

// -------data section-------
const net = require('net')
const readline = require('readline/promises')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
let clientId = ""

const client = net.createConnection({ port: 3000, host: "localhost" })

const art = `  _____ _           _      ____            _    
/ ____(_)         | |    |  _ \          | |   
| |     _ _ __ ___ | |__  | |_) | ___  ___| | __
| |    | | '_ ' _ \| '_ \ |  _ < / _ \/ __| |/ /
| |____| | | | | | | |_) || |_) |  __/ (__|   < 
\_____|_|_| |_| |_|_.__(_)/____/ \___|\___|_|\_\
`

/**
 * 
 * @param {number} dx 
 * @param {number} dy 
 * @returns 
 */
function moveCursor(dx, dy) {
    return new Promise((res) => process.stdout.moveCursor(dx, dy, () => {
        res("")
    }))
}

function clearScreen() {
    return new Promise((res, rej) => {
        process.stdout.clearLine(0, () => {
            res("resolved")
        })
    })
}

/**
 * @typedef {{type:"handshake"|"message",payload:object}} Message
 */


async function askMessage() {
    const message = await rl.question("Type a message > ")
    if (message == "exit") {
        process.exit(0)
    }
    client.write(JSON.stringify({ type: "message", payload: { message, clientId } }))
    return message
}

client.on("data", async (data) => {

    /**
     * @type {Message}
     */
    const recievedData = JSON.parse(data.toString())
    if (recievedData.type === "handshake") {
        clientId = recievedData.payload.clientId
        return
    }

    let senderId = recievedData.payload.clientId
    let sender = senderId == clientId ? "You" : senderId

    /**
     * @type {[number,number]}
     */
    let cords = [0, 0]

    if (sender == "You") {
        cords = [0, -1]
    }else{
        process.stdout.write('\x1b[0G'); 
    }
    await Promise.all([moveCursor(...cords), clearScreen(),clearScreen()])
    //show message
    console.log(`${sender.slice(0, 5)}: ${recievedData.payload.message}`)
    askMessage()
})


async function main() {
    console.log(art)
    console.log("\nWelcome, Type exit to leave room!")
    await askMessage()
}


client.on("connect", () => {
    console.log("client is connected ....")
    main()
})