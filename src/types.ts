type Action = "load" | "save"

type ActionDetails = {
  action: string
  body_args?: string[]
  modify?: FieldModify[]
}
type ActionData = {
  octokit_cb: CallableFunction
  action_details: ActionDetails
  pattern: Record<string, any>
}

type FieldModify = {
  field: string
  rename?: string,
  replace_for?: {
    field: string,
    from: IncludeFromEnum
  }
}

enum IncludeFromEnum {
  args,
  ResponseData,
  entity,
}

type Entity = { [key: string]: any }

type EntityMap = {
  [name: string] : {
    fields: { [entity: string]: Record<string, Record<string, any>> }
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

export type { Action, ActionDetails, EntityMap, FieldModify, Entity, ActionData }

export {
  IncludeFromEnum
}
