// @ts-check
const { randomUUID } = require('crypto')
const net = require('net')


/**
 * @type {{id:string,client:net.Socket}[]}
 */
const clients = []
const server = net.createServer((socket) => {


    socket.on("data", (data) => {
        clients.forEach(socket => {
            socket.client.write(data)
        })
    })
})

server.on("connection", (socket) => {
    const socketId = randomUUID()
    console.log(`new connection made...${socketId}`)
    socket.write(JSON.stringify({ type: "handshake", payload: { clientId: socketId } }))
    clients.push({ id: socketId, client: socket })
})

server.listen(3000, "localhost", () => {
    console.log("Serve is runing => ", server.address())
})