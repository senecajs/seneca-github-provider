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
  rest_endpoint: GithubRestEndpoints
  body_args?: string[]
  include?: string[]
}

type EntityMap = {
  [name: string] : {
    active: Boolean
    commands: CommandDetails[]
  }
}

type GithubRestEndpoints = "repos" | "branches" | "checks" | "codesOfConduct" | "codeScanning" | "commit" | "gists" | "issues" | "licenses" | "orgs" | "projects" | "pulls" | "releases" | "secretScanning" | "teams" | "users"

export type {
    Command,
    CommandFn,
    CommandDetails,
    Action,
    EntityMap,
}