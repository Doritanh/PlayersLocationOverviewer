export class Socket {
  private url: string

  private onMessageCallbacks: { (message: MessageEvent): void; } []

  constructor (host: string, port: string, secure = false) {
    this.url = `${secure ? 'wss' : 'ws'}://${host}:${port}`
    this.onMessageCallbacks = []
    this.connect()
  }

  private connect () {
    const connection = new WebSocket(this.url)
    connection.onopen = () => {
      console.info('[PlayersLocation] Websocket - Connected')
    }
    connection.onerror = (error) => {
      console.error('[PlayersLocation] WebSocket - Error', error)
      setTimeout(this.connect, 3000)
    }
    connection.onmessage = (message: MessageEvent<any>) => {
      this.onMessageCallbacks.forEach((callback) => {
        callback(message)
      })
    }
    connection.onclose = () => {
      console.info('[PlayersLocation] Websocket - Closed')
      setTimeout(this.connect, 3000)
    }
  }

  onMessage (callback: (message: MessageEvent) => void) {
    this.onMessageCallbacks.push(callback)
  }
}
