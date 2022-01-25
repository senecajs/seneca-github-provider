import { IncludeFromEnum, Entity, FieldModify } from "./types"

function make_actions(reqFn: CallableFunction, body_args: Array<string> = [], modify?: FieldModify[]) {
  async function load(this:any, msg: any) {
    const args = {...msg.q}
    let body: Record<string,any> = {}

    const old_args = {...args}

    body = basic_body(args)

    const res = await reqFn(body)
    
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
    const entity = {...msg.ent}
    const args = {...msg.q}
    let body: Record<string,any> = {}

    body = basic_body({repo_id: entity.repo_id})

    body_args.forEach(attr => {
      body[attr] = entity[attr] 
    })

    const res = await reqFn(body)

    let new_entity: Entity = this.make$(msg.ent.entity$).data$(res.data)

    if(modify) {
      const replacements = modify.filter(mod => mod.replace_for !== undefined)
      new_entity = ent_replacements(new_entity, replacements, {
        entity,
        res,
        args
      })
      
      const renamings = modify.filter(mod => mod.rename !== undefined)      
      new_entity = ent_renamings(new_entity, renamings)
    }

    return new_entity
  }

  function basic_body(source: Record<string, any>) {
    let body = {}

    if(source.repo_id) {
      body = owner_repo(source.repo_id)
      delete source.repo_id
    }

    return {...body, ...source}
  }

  function owner_repo(repo_id: string): Record<string, string> {
    const [owner, repo] = repo_id.split('/')
    return {
      owner,
      repo,
    }
  }

  function modify_object(object: Record<string, any>, field: string, replace_for: string, from: Record<string, any> ) {
    object[field] = from[replace_for] // TODO : attrs existence validation
    return object
  }

  function ent_renamings(entity: Entity, renamings: FieldModify[]) {
    renamings.forEach(renaming => {
      if(!renaming.rename) {
        return entity
      }
      entity = modify_object(entity, renaming.rename, renaming.field,  entity)
      delete entity[renaming.field]
    })

    return entity
  }

  function ent_replacements(entity: Entity, replacements: FieldModify[], sources: Record<string, any>) {
    replacements.forEach(replace => {
      let from: Record<string, any> = {}

      if(!replace.replace_for) {
        return entity
      }

      switch (replace.replace_for.from) {
        case IncludeFromEnum.args:
          from = sources.args
          break;
        case IncludeFromEnum.entity:
          from = sources.entity
          break;
      
        default:
          from = sources.res.data
          break;
      }

      entity = modify_object(entity, replace.field, replace.replace_for.field, from)
    })

    return entity
  }

  return {
    load,
    save
  }
}

export { make_actions }