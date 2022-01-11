function cmd_handlers(reqFn: CallableFunction, args: any = {}, include?: string[]) {
  async function load (this: any, msg: any) {
    const repo_id = msg.q.repo_id
    const id = msg.q.id
    let res: any

    if(repo_id) {
      const [owner, repo] = repo_id.split('/')
      const body = {
        owner,
        repo,
        ...args,
      }
      res = await reqFn(body)
    }

    if(id) {
      const ent_id = msg.ent.entity$.split('/')[2] + '_id'
      const body = {
        ...args,
      }
      body[ent_id] = id
      res = await reqFn(body)
    }   

    res = res.data

    if (include) {
      include.forEach((item) => {
        if (item.indexOf(' as ') !== -1) {
          const [attr, new_attr_name] = item
            .split(' as ')
            .map((item) => item.trim())
          res[new_attr_name] = msg.q[attr]
        } else {
          res[item] = msg.q[item]
        }
      })
    }

    return this.make$(msg.ent.entity$).data$(res)
  }

  async function save(this: any, msg: any) {
    const [owner, repo] = msg.ent.repo_id.split('/')
    const body = fulfill_body(args, msg.ent)
    let res = await reqFn({
      owner,
      repo,
      ...body,
    })

    return this.make$(msg.ent.entity$).data$(res)
  }

  function fulfill_body(
    body_args: Record<string, any> = {},
    from: Record<string, any>
  ) {
    let body: any = {}
    body_args.forEach((arg: string) => (body[arg] = from[arg]))
    return body
  }

  return {
    load,
    save
  }
}

export default cmd_handlers
