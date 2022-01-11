import { EntityMap } from "./types"

const args = {
  gist_id: '96f365d8195e519eaba80ba88013badf',
  repo_id: 'guhmerces/hiringTest',
  code_of_conduct_key: 'contributor_covenant',
  branch_id: 'master',
  commit_sha: '371e16e62fd72613d6d16902616f5fbe2b7a27a3',
  issue_number: 1,
  license: 'mit',
  org: 'DemoOrganization20',
  release_id: 56800302,
  username: 'guhmerces',
  pull_number: 1,
}

const entities_map: EntityMap = {
  gist: {
    active: true,
    commands: [
      {
        cmd: "load",
        rest_endpoint: "gists",
        action: "get",
        include: []
      }
    ]
  }
}

export {
  entities_map
}