type Action = "load" | "save"

type CommandFn = (
  reqFn: CallableFunction,
  msg: any,
  args: any,
  include?: string[]
) => (msg: any) => Promise<any>

type CommandTest = {
  args?: Record<string, any>
  expectations?: Record<string, Assertions>
}

type Assertions = {
  sameAs?: any,
  toBe?: TestToBe[]
}

type TestToBe = "defined" | "falsy"

type ActionDetails = {
  action: string
  body_args?: string[]
  include?: string[]
}

type EntityMap = {
  [name: string] : {
    fields: string[]
    sdk: SdkParams
    actions: EntityAction
    tests?: EntityCommandTest
  }
}

type EntityAction = {
  "load": ActionDetails
} | {
  "save": ActionDetails
}

type EntityCommandTest = {
  "load": CommandTest
} | {
  "save": SaveCommandTest
}

interface SaveCommandTest extends CommandTest {
  changes: Record<string, any>
}

type SdkParams = {
  rest: {
    subpath: GithubRestEndpoints
  }
}

type GithubRestEndpoints =
  | "repos"
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

export type { Action, CommandFn, ActionDetails, EntityMap }
