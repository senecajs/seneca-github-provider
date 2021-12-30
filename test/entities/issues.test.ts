/* Copyright © 2021 Seneca Project Contributors, MIT License. */

import crypto from "crypto"

import GithubProvider from "../../src/github-provider"

const Seneca = require("seneca")
const { provider_options } = require('../provider-options')

describe('github-issues', () => {
  // NOTE: provide a valid ownername/reponame
  let repo_id = ''

  if (!repo_id || repo_id.length === 0) {
    throw new Error('invalid repo_id')
  }

  test("load-issue", async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('entity')
      .use('provider', provider_options)
      .use(GithubProvider)
      
    const attrs = {
      repo_id,
      issue_number: 1
    }

    let entity = await seneca.entity('provider/github/issue').load$(attrs)

    expect(entity.entity$).toBe('provider/github/issue')
    expect(entity.id).toBeDefined()

    // created attributes expectations
    expect(entity.issue_number).toBe(attrs.issue_number)
    expect(entity.repo_id).toBe(entity.repo_id)
  })

  test('save-issue', async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('entity')
      .use('provider', provider_options)
      .use(GithubProvider)

    const attrs = {
      repo_id,
      issue_number: 1
    }

    let entity = await seneca.entity('provider/github/issue').load$(attrs)

    const randomBytes = crypto.randomBytes(10).toString('hex')

    entity.title = randomBytes
    entity.body = randomBytes

    await entity.save$()

    entity = await seneca.entity('provider/github/issue').load$(attrs)

    expect(entity.entity$).toBe('provider/github/issue')
    expect(entity.title).toBe(randomBytes)

    // created attributes expectations
    expect(entity.id).toBeDefined()
    expect(entity.issue_number).toBe(attrs.issue_number)
    expect(entity.repo_id).toBe(entity.repo_id)
  })

})
