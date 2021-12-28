import { Players } from './players'
import { Socket } from './socket'

export {}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    overviewer: any;
    overviewerConfig: any;
  }
}

interface Configuration {
  host: string;
  port: string;
  ssl?: boolean;
  worlds: {[key: string]: string}
}

class PlayersLocation {
  socket: Socket
  players: Players

  constructor (config: Configuration) {
    this.socket = new Socket(config.host, config.port, config.ssl)
    this.players = new Players(config.worlds)
    this.socket.onMessage((message) => {
      try {
        this.players.update(JSON.parse(message.data))
      } catch (error) {
        console.error('Error parsing WebSocket message', error)
      }
    })
  }
}

window.overviewer.util.ready(async () => {
  let config: Configuration = {
    host: window.location.host,
    port: '8888',
    worlds: {}
  }
  try {
    config = await (await fetch('playersLocationConfig.json')).json() ?? {}
    console.log('[PlayersLocation] Using config: ', config)
  } catch (e) {
    console.error("[PlayersLocation] Can't retrieve the playersLocationConfig.json file. Using default values.")
  }
  // eslint-disable-next-line no-unused-vars
  const pl = new PlayersLocation(config)
})
