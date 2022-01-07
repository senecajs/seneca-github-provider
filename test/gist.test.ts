/* Copyright © 2021 Seneca Project Contributors, MIT License. */

import * as Fs from "fs"

import GithubProvider from "../src/github-provider"

const Seneca = require("seneca")

const CONFIG: any = {}

if (Fs.existsSync(__dirname + "/local-config-template.js")) {
  Object.assign(CONFIG, require(__dirname + "/local-config-template.js"))
}

let provider_options = {
  provider: {
    github: {
      keys: {
        api: {
          value: CONFIG.key,
        },
      },
    },
  },
}

describe("github-gist", () => {
  // Note: provide a gist_id
  // For state changin tests : the authenticated user should be the Gist owner
  const gist_id = "330f54a87cb723ae51db9a011ed338ad"

  test("load-gist", async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .use("promisify")
      .use("entity")
      .use("provider", provider_options)
      .use(GithubProvider)

    const id = gist_id

    let entity = await seneca.entity("provider/github/gist").load$(id)

    expect(entity.entity$).toBe("provider/github/gist")
    expect(entity.id).toBeDefined()
    expect(entity.id).toBe(id)
  })
})
