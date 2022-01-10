type Command = "load" | "save"

type CommandFn = (
  reqFn: Action,
  msg: any,
  args: any,
  include?: string[]
) => (msg: any) => Promise<any>

type Action = (arg: any) => Promise<any>

type CommandDetails = {
  cmd: string
  action: string
  body_args?: string[]
  include?: string[]
}

type EntityMap = {
  [name: string] : {
    active: Boolean
    commands: CommandDetails[]
  }
}

export type {
    Command,
    CommandFn,
    CommandDetails,
    Action,
    EntityMap,
}