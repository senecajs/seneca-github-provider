/* Copyright © 2021 Seneca Project Contributors, MIT License. */


// TODO: namespace provider zone; needs seneca-entity feature

import { Octokit } from '@octokit/rest'
import { entities_map as ent_map } from './entities'
import { identify_handler } from './identify-handler'

type GithubProviderOptions = {}


/* Repo ids are of the form 'owner/name'. The internal github id field is
 * moved to github_id.
 *
 *
 */


function GithubProvider(this: any, _options: any) {
  const seneca: any = this

  const ZONE_BASE = 'provider/github/'

  let octokit: Octokit

  // NOTE: sys- zone prefix is reserved.

  seneca
    .message('sys:provider,provider:github,get:info', get_info)

  function add_actions(actions: Record<string, any>) {
    Object.keys(ent_map).forEach(ent_name => {
      const commands = ent_map[ent_name].commands

      commands.forEach(command_details => {
        const common = { zone: "provider", base: "github", role: "entity" }
        const cmd_name = command_details.cmd

        const pattern = {
          name: ent_name,
          cmd: cmd_name,
          ...common,
        }

        const rest_endpoint = command_details.rest_endpoint
        const action_name = command_details.action

        const github_action: CallableFunction = actions[rest_endpoint][action_name]

        if(!github_action) {
          throw new Error(`Invalid ${action_name} method in ${rest_endpoint} endpoint`)
        }

        const cmd_handler = identify_handler(command_details, github_action)

        seneca.message(pattern, cmd_handler)
      })
    })
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

  async function load_repo(this: any, msg: any) {
    let ent: any = null

    let q: any = msg.q
    let [ownername, reponame]: [string, string] = q.id.split('/')

    let res = await octokit.rest.repos.get({
      owner: ownername,
      repo: reponame,
    })

    if (res && 200 === res.status) {
      let data: any = res.data
      data.github_id = data.id
      data.id = q.id
      ent = this.make$(ZONE_BASE + 'repo').data$(data)
    }

    return ent
  }


  async function save_repo(this: any, msg: any) {
    let ent: any = msg.ent

    let [ownername, reponame]: [string, string] = ent.id.split('/')

    let data = {
      owner: ownername,
      repo: reponame,
      description: ent.description
    }

    let res = await octokit.rest.repos.update(data)

    if (res && 200 === res.status) {
      let data: any = res.data
      data.github_id = data.id
      data.id = ownername + '/' + reponame
      ent = this.make$(ZONE_BASE + 'repo').data$(data)
    }

    return ent
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
