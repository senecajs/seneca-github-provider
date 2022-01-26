/* Copyright © 2021 Seneca Project Contributors, MIT License. */


// TODO: namespace provider zone; needs seneca-entity feature

import { Octokit } from '@octokit/rest'
import { make_actions } from './cmd-handlers'
import { ents } from './entities'

type GithubProviderOptions = {}


/* Repo ids are of the form 'owner/name'. The internal github id field is
 * moved to github_id.
 *
 *
 */


function GithubProvider(this: any, _options: any) {
  const seneca: any = this

  let octokit: Octokit

  // NOTE: sys- zone prefix is reserved.

  seneca
    .message('sys:provider,provider:github,get:info', get_info)

  function add_actions(github_actions: Record<string, any>) {
    for(const [ent_name, data] of Object.entries(ents)) {
      const { actions } = data
      const { subpath } = data.sdk.rest

      for(const [action, action_data] of Object.entries(actions)) {
        const common = { zone: "provider", base: "github", role: "entity" }

        const pattern = {
          name: ent_name,
          cmd: action,
          ...common,
        }

        const github_action: CallableFunction = github_actions[subpath][action_data.action]

        if(!github_action) {
          throw new Error(`Invalid action ${action} in ${subpath} endpoint`)
        }

        const handlers: Record<string, CallableFunction> = make_actions(github_action, action_data.body_args, action_data.modify)

        const action_handler = handlers[action]

        seneca.message(pattern, action_handler)
      }
    }
  }

  async function get_info(this: any, _msg: any) {
    return {
      ok: true,
      name: 'github',
      details: {
        sdk: '@octokit/rest'
      }
    }
  }

  seneca.prepare(async function(this: any) {
    let out = await this.post('sys:provider,get:key,provider:github,key:api')
    if (!out.ok) {
      this.fail('api-key-missing')
    }

    let config = {
      auth: out.value
    }

    octokit = new Octokit(config)

    const actions = octokit.rest

    add_actions(actions)
  })


  return {
    exports: {
      native: () => ({
        octokit
      })
    }
  }
}


// Default options.
const defaults: GithubProviderOptions = {

  // TODO: Enable debug logging
  debug: false
}


Object.assign(GithubProvider, { defaults })

export default GithubProvider

if ('undefined' !== typeof (module)) {
  module.exports = GithubProvider
}
