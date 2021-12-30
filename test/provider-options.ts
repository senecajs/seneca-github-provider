import * as Fs from "fs"

const CONFIG: any = {}

if (Fs.existsSync(__dirname + '/local-config-template.js')) {
  Object.assign(CONFIG, require(__dirname + '/local-config-template.js'))
}

const provider_options = {
  provider: {
    github: {
      keys: {
        api: {
          value: CONFIG.key
        }
      }
    }
  }
}

export { provider_options }