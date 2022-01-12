/* Copyright © 2021 Seneca Project Contributors, MIT License. */

import * as Fs from 'fs'

import GithubProvider from '../src/github-provider'
import { entities_map } from "../src/entities"

const Seneca = require('seneca')
const SenecaMsgTest = require('seneca-msg-test')
const GithubProviderMessages = require('./github-provider.messages').default

const CONFIG: any = {}

if (Fs.existsSync(__dirname + '/local-config.js')) {
  Object.assign(CONFIG, require(__dirname + '/local-config.js'))
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


  test('entity-load', async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('entity')
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

    let repo = await seneca.entity('provider/github/repo')
      .load$('senecajs/seneca')
    expect(repo).toBeDefined()
    expect(repo.id).toEqual('senecajs/seneca')
    expect(repo.name).toEqual('seneca')
    expect(repo.full_name).toEqual('senecajs/seneca')
  })


  test('entity-save', async () => {
    if (CONFIG.key) {
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

      const seneca = Seneca({ legacy: false })
        .test()
        .use('promisify')
        .use('entity')
        .use('provider', provider_options)
        .use(GithubProvider)

      let repo = await seneca.entity('provider/github/repo')
        .load$('senecajs/github-api-test')
      expect(repo).toBeDefined()

      repo.description = repo.description + 'M'

      repo = await repo.save$()
      expect(repo.description.endsWith('M')).toBeTruthy()
    }
  })
})

describe("github-entities", () => {
  Object.keys(entities_map).forEach(ent_name => {
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

  })
})

