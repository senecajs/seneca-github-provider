import { Action } from './types'

function cmd_handlers(reqFn: Action, args: any = {}, include?: string[]) {
  async function load (this: any, msg: any) {
    const repo_id = msg.q.repo_id
    const id = msg.q.id
    let res: any

    

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
