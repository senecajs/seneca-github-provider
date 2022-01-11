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
  repo: {
    fields: [],
    commands: [
      {
        cmd: 'load',
        rest_endpoint: 'repos',
        action: 'get',
        include: ['repo_id as id'],
        test: {
          args: {
            repo_id: args.repo_id
          },
          expectations: {
            id: {
              sameAs: args.repo_id
            },
          }
        }
      }
    ]
  },
  branch: {
    fields: [],
    commands: [
      {
        cmd: 'load',
        rest_endpoint: 'repos',
        action: 'getBranch',
        include: ['repo_id'],
        test: {
          args: {
            repo_id: args.repo_id,
            branch: args.branch_id
          },
          expectations: {
            repo_id: {
              sameAs: args.repo_id
            },
            name: {
              sameAs: args.branch_id
            }
          }
        }
      }
    ]
  },
  code_of_conduct: {
    fields: [],
    commands: [
      {
        cmd: 'load',
        rest_endpoint: 'codesOfConduct',
        action: 'getConductCode',
        include: [],
        test: {
          args: {
            key: args.code_of_conduct_key
          },
          expectations: {
            key: {
              sameAs: args.code_of_conduct_key
            }
          }
        }
      }
    ]
  },
  commit: {
    fields: [],
    commands: [
      {
        cmd: 'load',
        rest_endpoint: 'git',
        action: 'getCommit',
        include: ['repo_id'],
        test: {
          args: {
            repo_id: args.repo_id,
            commit_sha: args.commit_sha
          },
          expectations: {
            repo_id: {
              sameAs: args.repo_id
            },
            sha: {
              sameAs: args.commit_sha
            }
          }
        }
      }
    ]
  },
  gist: {
    fields: [],
    commands: [
      {
        cmd: 'load',
        rest_endpoint: 'gists',
        action: 'get',
        include: [],
        test: {
          args: {
            gist_id: args.gist_id
          }
        }
      }
    ]
  },
  issue: {
    fields: [],
    commands: [
      {
        cmd: 'load',
        rest_endpoint: 'issues',
        action: 'get',
        include: ['repo_id'],
        test: {
          args: {
            repo_id: args.repo_id,
            issue_number: args.issue_number
          }
        }
      }
    ]
  },
  license: {
    fields: [],
    commands: [
      {
        cmd: 'load',
        rest_endpoint: 'licenses',
        action: 'get',
        include: [],
        test: {
          args: {
            license: args.license
          },
          expectations: {
            key: {
              sameAs: args.license
            }
          }
        }
      },
    ]
  },
  org: {
    fields: [],
    commands: [
      {
        cmd: 'load',
        rest_endpoint: 'orgs',
        action: 'get',
        include: [],
        test: {
          args: {
            org: args.org
          },
          expectations: {
            login: {
              sameAs: args.org
            }
          }
        }
      }
    ]
  },
  pull: {
    fields: [],
    commands: [
      {
        cmd: 'load',
        rest_endpoint: 'pulls',
        action: 'get',
        include: ['repo_id'],
        test: {
          args: {
            repo_id: args.repo_id,
            pull_number: args.pull_number
          },
        }
      }
    ]
  },
  release: {
    fields: [],
    commands: [
      {
        cmd: 'load',
        rest_endpoint: 'repos',
        action: 'getRelease',
        include: ['repo_id'],
        test: {
          args: {
            repo_id: args.repo_id,
            release_id: args.release_id
          }
        }
      }
    ]
  },
  user: {
    fields: [],
    commands: [
      {
        cmd: 'load',
        rest_endpoint: 'users',
        action: 'getByUsername',
        include: [],
        test: {
          args: {
            username: args.username
          }
        }
      }
    ]
  }
}

export {
  entities_map
}