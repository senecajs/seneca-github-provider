function make_actions(reqFn: CallableFunction, body_args: Array<string> = [], include?: string[]) {
  async function load(this:any, msg: any) {
    const source = {...msg.q}
    let body: Record<string,any> = {}

    const old_source = {...source}

    if(source.repo_id) {
      body = owner_repo(source.repo_id)
      delete source.repo_id
    }

    let res = await reqFn({...body, ...source})
    res = res.data

    if (include) {
      include.forEach((item) => {
        if (item.indexOf(' as ') !== -1) {
          const [attr, new_attr_name] = item
            .split(' as ')
            .map((item) => item.trim())
          res[new_attr_name] = old_source[attr]
        } else {
          res[item] = old_source[item]
        }
      })
    }

    return this.make$(msg.ent.entity$).data$(res)
  }

  async function save(this:any, msg: any) {
    const source = {...msg.ent}
    const args = {...msg.q}
    let body: Record<string,any> = {}

    const old_source = {...source}

    if(source.repo_id) {
      body = owner_repo(source.repo_id)
      delete source.repo_id
    }

    body = fill_obj(source, body, body_args)

    let res = await reqFn({...body, ...args})
    res = res.data

    if (include) {
      include.forEach((item) => {
        if (item.indexOf(' as ') !== -1) {
          const [attr, new_attr_name] = item
            .split(' as ')
            .map((item) => item.trim())
          res[new_attr_name] = old_source[attr]
        } else {
          res[item] = old_source[item]
        }
      })
    }

    return this.make$(msg.ent.entity$).data$(res)
  }

  function owner_repo(repo_id: string): Record<string, string> {
    const [owner, repo] = repo_id.split('/')
    return {
      owner,
      repo,
    }
  }

  function fill_obj(from: Record<string, any>, to: Record<string, any>, attributes: Array<string>) {
    attributes.forEach(attr => {
      to[attr] = from[attr] 
    })

    return to
  }

  return {
    load,
    save
  }
}

export { make_actions }