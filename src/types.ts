type Action = "load" | "save"

type ActionDetails = {
  action: string
  body_args?: string[]
  modify?: FieldModify
}

type FieldModify = {
  include?: FieldInclude[]
  rename?: FieldRename[]
}

type FieldRename = {
  field: string,
  rename: string
}

type FieldInclude = {
  field: string
  from: IncludeFromEnum
  rename?: string
}

enum IncludeFromEnum {
  args,
  HttpResponseData,
  entity,
}

type Arguments = { [key: string]: any }

type Source = { [key: string]: any }

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

export type { Action, ActionDetails, EntityMap, FieldModify, Entity, Arguments, Source, FieldInclude, FieldRename }

export {
  IncludeFromEnum
}
