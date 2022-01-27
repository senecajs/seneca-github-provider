import { Octokit } from "@octokit/rest"
import { Entity, FieldModify, ActionDetails, SdkParams } from "./types"

function make_actions(sdk_params: SdkParams, action_details: ActionDetails, sdk: Record<string, any>) {
  const { subpath } = sdk_params.rest

  async function load(this:any, msg: any) {
    const { modify, cb_name } = action_details

    const old_args = msg.q

    let body = basic_body({...msg.q})

    const endpoint_methods: Record<string, any> = sdk.octokit.rest[subpath]

    const res = await endpoint_methods[cb_name](body)
    
    let entity: Entity = this.make$(msg.ent.entity$).data$(res.data)

    if(modify) {
      const replacements = modify.filter(mod => mod.replace_for !== undefined)
      entity = ent_replacements(entity, replacements, {
        args: old_args,
        res
      })
      
      const renamings = modify.filter(mod => mod.rename !== undefined)
      entity = ent_renamings(entity, renamings)
    }

    return entity
  }

  async function save(this:any, msg: any) {
    const { modify, cb_name } = action_details
    const entity = msg.ent

    let body = basic_body({repo_id: entity.repo_id})

    if(action_details.body_args) {
      action_details.body_args.forEach(attr => {
        body[attr] = entity[attr] 
      })
    }

    const endpoint_methods: Record<string, any> = sdk.octokit.rest[subpath]

    const res = await endpoint_methods[cb_name](body)

    let new_entity: Entity = this.make$(entity.entity$).data$(res.data)

    if(modify) {
      const replacements = modify.filter(mod => mod.replace_for !== undefined)
      new_entity = ent_replacements(new_entity, replacements, {
        entity,
        res,
        args: msg.q
      })
      
      const renamings = modify.filter(mod => mod.rename !== undefined)      
      new_entity = ent_renamings(new_entity, renamings)
    }

    return new_entity
  }

  function basic_body(source: Record<string, any>) {
    let body: Record<string,any> = {}

    if(source.repo_id) {
      body = owner_repo(source.repo_id)
    }

    delete source.repo_id

    return {...body, ...source}
  }

  function owner_repo(repo_id: string): Record<string, string> {
    const [owner, repo] = repo_id.split('/')
    return {
      owner,
      repo,
    }
  }

  function ent_renamings(entity: Entity, renamings: FieldModify[]) {
    renamings.forEach(renaming => {
      if(!renaming.rename) {
        return
      }
      entity[renaming.rename] = entity[renaming.field]
      delete entity[renaming.field]
    })

    return entity
  }

  function ent_replacements(entity: Entity, replacements: FieldModify[], sources: Record<string, any>) {
    replacements.forEach(replace => {
      let from: Record<string, any> = {}

      if(!replace.replace_for) {
        return
      }

      switch (replace.replace_for.from) {
        case 'args':
          from = sources.args
          break;
        case 'entity':
          from = sources.entity
          break;
      
        default:
          from = sources.res.data
          break;
      }

      entity[replace.field] = from[replace.replace_for.field]
    })

    return entity
  }

  return {
    load,
    save
  }
}

export { make_actions }