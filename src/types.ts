type ActionType = "load" | "save"

type ActionDetails = {
  cb_name: string
  body_args?: string[]
}

type ActionData = {
  sdk_params: SdkParams
  action_details: ActionDetails
  pattern: Record<string, any>
}

type Entity = { [key: string]: any }

type EntityMap = {
  [name: string] : {
    name?: string
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
  | "secretScanning"
  | "teams"
  | "users"

export type { ActionType, ActionDetails, EntityMap, Entity, ActionData, SdkParams }
