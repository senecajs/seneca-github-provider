type Command = "load" | "save"

type CommandFn = (
  reqFn: CallableFunction,
  msg: any,
  args: any,
  include?: string[]
) => (msg: any) => Promise<any>

type CommandTest = {
  args: Record<string, any>
  expectations?: Record<string, Assertions>
}

type Assertions = {
  sameAs?: any,
  toBe?: TestToBe[]
}

type TestToBe = "defined" | "falsy"

type CommandDetails = {
  cmd: string
  action: string
  rest_endpoint: GithubRestEndpoints
  body_args?: string[]
  test?: CommandTest
  include?: string[]
}

type EntityMap = {
  [name: string] : {
    fields: string[]
    commands: CommandDetails[]
  }
}

type GithubRestEndpoints =
  | "repos"
  | "repos.branches"
  | "checks"
  | "codesOfConduct"
  | "codeScanning"
  | "git"
  | "gists"
  | "issues"
  | "licenses"
  | "orgs"
  | "projects"
  | "pulls"
  | "releases"
  | "secretScanning"
  | "teams"
  | "users"

export type { Command, CommandFn, CommandDetails, EntityMap }
