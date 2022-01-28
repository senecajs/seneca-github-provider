/* Copyright © 2021 Seneca Project Contributors, MIT License. */


// TODO: namespace provider zone; needs seneca-entity feature

import { Octokit } from '@octokit/rest'
import { make_actions } from './cmd-handlers'
import { ents } from './entities'
import { ActionData, EntityMap } from './types'

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

  function add_actions() {
    const actions = prepare_actions(ents)

    for (const action of actions) {
      switch (action.pattern.cmd) {
        case 'load':
          seneca.message(action.pattern, make_load(action))
          break
      
        case 'save':
          seneca.message(action.pattern, make_save(action))
          break
      }
    }
  }

  function make_load(action: ActionData) {
    return make_actions(
      action.octokit_cb,
      action.action_details
    )['load']
  }

  function make_save(action: ActionData) {
    return make_actions(
      action.octokit_cb,
      action.action_details
    )['save']
  }

  function prepare_actions(entities: EntityMap): Array<ActionData> {
    const rest: Record<string, any> = octokit.rest
    const actions_data = []

    for (const [ent_name, data] of Object.entries(entities)) {
      const { actions } = data
      const { subpath } = data.sdk.rest
      data.name = ent_name

      for (const [action_name, action_details] of Object.entries(actions)) {
        const pattern = {
          name: ent_name,
          cmd: action_name,
          zone: 'provider',
          base: 'github',
          role: 'entity',
        }

        const octokit_cb: CallableFunction = rest[subpath][action_details.cb_name]

        if (!octokit_cb) {
          throw new Error(
            `Invalid action ${action_name} in ${subpath} endpoint`
          )
        }

        actions_data.push({
          pattern,
          octokit_cb,
          action_details,
        })
      }
    }

    return actions_data
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

    add_actions()
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
