import * as L from 'leaflet'

interface Player {
  name: string,
  uuid: string,
  world: string,
  health: number,
  location: {
    x: number,
    y: number,
    z: number,
  }
}

export class Players {
  markers: {[key: string]: L.Marker}
  worlds: {[key: string]: string}

  constructor (worlds: {[key: string] : string}) {
    this.markers = {}
    this.worlds = worlds
  }

  update (players: Array<Player>) {
    for (const playerName in this.markers) {
      const player: Player | undefined = players.find(player => player.name === playerName)
      if (player === undefined || this.worlds[player.world] !== window.overviewer.current_world) {
        this.markers[playerName].remove()
        delete this.markers[playerName]
      }
    }
    players.forEach(p => {
      if (this.worlds[p.world] !== window.overviewer.current_world) return
      const latlng = window.overviewer.util.fromWorldToLatLng(
        p.location.x,
        p.location.y,
        p.location.z,
        this.getCurrentTileSet())

      if (this.markers[p.name]) {
        this.markers[p.name].setLatLng(latlng)
      } else {
        const icon = L.icon({
          iconUrl: 'https://crafatar.com/renders/body/' + p.uuid + '?default=MHF_Steve',
          iconSize: [16, 36],
          iconAnchor: [15, 17]
        })
        this.markers[p.name] = L.marker(latlng, {
          icon: icon,
          title: p.name
        })
        this.markers[p.name].addTo(window.overviewer.map)
      }
    })
  }

  getCurrentTileSet () {
    for (const index in window.overviewerConfig.tilesets) {
      const tileset = window.overviewerConfig.tilesets[index]
      if (tileset.world === window.overviewer.current_world) {
        return tileset
      }
    }
  }
}
