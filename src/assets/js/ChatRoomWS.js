export const ChatRoomWS = class {
  #ws

  constructor (origin) {
    this.toString = () => '[object ChatRoomWS]'
    this.wsURL = new URL('/socket.io/?EIO=1&transport=websocket', 'wss://' + new URL(origin).host).toString()
    this.#ws = new WebSocket(this.wsURL)
  }

  static isChatRoomWS = obj => typeof obj === 'object' && obj.toString() === '[object ChatRoomWS]'

  on = (es, f) => this.#ws.addEventListener(es, f)

  send = (m) => this.#ws.send(m)
  close = (m) => this.#ws.close(m)
}
