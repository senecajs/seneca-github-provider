type Action = "load" | "save"

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
  }
}

type EntityAction = {
  "load": ActionDetails
} | {
  "save": ActionDetails
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

export type { Action, ActionDetails, EntityMap }
