function cmd_handlers(reqFn: CallableFunction, body_args: Array<string> = [], include?: string[]) {
  async function handler(this:any, msg: any) {
    let body: any = {}
    let source: any
    let args

    switch (msg.cmd) {
      case 'load':
        source = {...msg.q}
        args = source
        break;
      case 'save':
        source = {...msg.ent}
        args = {...msg.q}
        break;
    
      default:
        throw new Error('Unknown command : ' + msg.cmd)
    }

    if(source.repo_id) {
      const [owner, repo] = source.repo_id.split('/')
      body = {
        owner,
        repo,
      }
    }

    const old_source = {...source}
    delete source.repo_id

    body_args.forEach(body_arg => {
      body[body_arg] = source[body_arg] 
    })
    
    body = {...body, ...args}

    let res = await reqFn(body)
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

  return handler
}

export default cmd_handlers
