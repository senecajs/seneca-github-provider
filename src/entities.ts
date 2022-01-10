import { EntityMap } from "./types"

const entities_map: EntityMap = {
  gist: {
    active: true,
    commands: [
      {
        cmd: "load",
        rest_endpoint: "gists",
        action: "get",
        include: []
      }
    ]
  }
}

export {
  entities_map
}