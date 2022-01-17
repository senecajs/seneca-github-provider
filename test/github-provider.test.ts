/* Copyright © 2021 Seneca Project Contributors, MIT License. */

import * as Fs from 'fs'

import GithubProvider from '../src/github-provider'
import { entities_map } from "../src/entities"
import { set_mock_worker } from './set-mock-worker'
import mocks from '../src/mocks'

const Seneca = require('seneca')
const SenecaMsgTest = require('seneca-msg-test')
const GithubProviderMessages = require('./github-provider.messages').default

const CONFIG: any = {}

if (Fs.existsSync(__dirname + '/local-config.js')) {
  Object.assign(CONFIG, require(__dirname + '/local-config.js'))
}

// Configure mock service worker
const worker = set_mock_worker(mocks)

beforeAll(() => worker.listen())
afterAll(() => worker.close())

// Separate entities details by their command type
const entities_load = {}
const entities_save = {}

Object.keys(entities_map).forEach(ent_name => {
  const entity = entities_map[ent_name]
  entity.commands.forEach(cmd => {
    if(cmd.cmd === 'load') {
      entities_load[ent_name] = entity
    }
    if(cmd.cmd === 'save') {
      entities_save[ent_name] = entity
    }
  })
})

// Set common structure between tests
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

describe('github-provider', () => {

  test('happy', async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('provider', {
        provider: {
          github: {
            keys: {
              api: {
                value: CONFIG.key
              }
            }
          }
        }
      })
      .use(GithubProvider)
    await seneca.ready()
  })


  test('messages', async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('provider', {
        provider: {
          github: {
            keys: {
              api: {
                value: CONFIG.key
              }
            }
          }
        }
      })
      .use(GithubProvider)
    await (SenecaMsgTest(seneca, GithubProviderMessages)())
  })


  test('native', async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('provider', {
        provider: {
          github: {
            keys: {
              api: {
                value: CONFIG.key
              }
            }
          }
        }
      })
      .use(GithubProvider)
    await seneca.ready()

    let native = seneca.export('GithubProvider/native')
    expect(native().octokit).toBeDefined()
  })
})

describe("github-entities-load", () => {
  Object.keys(entities_load).forEach(ent_name => {
    let entity = entities_map[ent_name]
    const full = "provider/github/" + ent_name

    test(`load-${ent_name}` , async () => {
      const seneca = Seneca({ legacy: false })
        .test()
        .use("promisify")
        .use("entity")
        .use("provider", provider_options)
        .use(GithubProvider)

      const tests = entity.tests

      let res_data = await seneca.entity(full).load$(tests['load'].args)

      expect(res_data.entity$).toBe(full)
      
      const expectations = tests['load'].expectations

      if(expectations) {
        assert(expectations, res_data)
      } else {
        expect(res_data.id).toBeDefined()
      }
    })
  })
})

describe("github-entities-save", () => {
  Object.keys(entities_save).forEach(ent_name => {
    let entity_details = entities_map[ent_name]
    const full = "provider/github/" + ent_name

    test(`save-${ent_name}` , async () => {
      const seneca = Seneca({ legacy: false })
        .test()
        .use("promisify")
        .use("entity")
        .use("provider", provider_options)
        .use(GithubProvider)

      const load_test = entity_details.tests['load']
      const save_test = entity_details.tests['save']

      let entity = await seneca.entity(full).load$(load_test.args)

      expect(entity.entity$).toBe(full)

      // Apply changes and save
      const changes = save_test.changes
      Object.keys(save_test.changes).forEach(change => {
        entity[change] = changes[change] 
      })
      entity = await entity.save$(save_test.args)

      // Assertions
      const expectations = save_test.expectations
      expectations
        ? assert(expectations, entity)
        : expect(entity.id).toBeDefined() // check for a ID when no expectations were set
    })
  })
})

function assert(expectations: any, against: any) {
  Object.keys(expectations).forEach(field_to_assert => {
    Object.keys(expectations[field_to_assert]).forEach(assertion => {
      switch (assertion) {
        case 'sameAs':                
          expect(against[field_to_assert]).toBe(expectations[field_to_assert]['sameAs'])
          break

        default:
          break
      }
    })
  })
}

