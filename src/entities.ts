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
    rest_endpoint: 'repos',
    commands: [
      {
        cmd: 'load',
        action: 'get',
        include: ['repo_id as id', 'repo_id'],
      },
    ],
    tests: {
      load: {
        args: {
          repo_id: args.repo_id
        },
        expectations: {
          id: {
            sameAs: args.repo_id
          },
        }
      },
    }
  },
  branch: {
    rest_endpoint: 'repos',
    fields: [],
    commands: [
      {
        cmd: 'load',
        action: 'getBranch',
        include: ['repo_id'],
      }
    ],
    tests: {
      load: {
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
      },
    }
  },
  code_of_conduct: {
    fields: [],
    rest_endpoint: 'codesOfConduct',
    commands: [
      {
        cmd: 'load',
        action: 'getConductCode',
        include: [],
      }
    ],
    tests: {
      load: {
        args: {
          key: args.code_of_conduct_key
        },
        expectations: {
          key: {
            sameAs: args.code_of_conduct_key
          }
        }
      },
    }
  },
  commit: {
    fields: [],
    rest_endpoint: 'git',
    commands: [
      {
        cmd: 'load',
        action: 'getCommit',
        include: ['repo_id'],
      }
    ],
    tests: {
      load: {
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
  },
  gist: {
    fields: [],
    rest_endpoint: 'gists',
    commands: [
      {
        cmd: 'load',
        action: 'get',
        include: [],
      }
    ],
    tests: {
      load: {
        args: {
          gist_id: args.gist_id
        }
      }
    }
  },
  issue: {
    fields: [],
    rest_endpoint: 'issues',
    commands: [
      {
        cmd: 'load',
        action: 'get',
        include: ['repo_id'],
      }
    ],
    tests: {
      load: {
        args: {
          repo_id: args.repo_id,
          issue_number: args.issue_number
        }
      }
    }
  },
  license: {
    fields: [],
    rest_endpoint: 'licenses',
    commands: [
      {
        cmd: 'load',
        action: 'get',
        include: [],
      },
    ],
    tests: {
      load: {
        args: {
          license: args.license
        },
        expectations: {
          key: {
            sameAs: args.license
          }
        }
      }
    }
  },
  org: {
    fields: [],
    rest_endpoint: 'orgs',
    commands: [
      {
        cmd: 'load',
        action: 'get',
        include: [],
      }
    ],
    tests: {
      load: {
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
  },
  pull: {
    fields: [],
    rest_endpoint: 'pulls',
    commands: [
      {
        cmd: 'load',
        action: 'get',
        include: ['repo_id'],
      }
    ],
    tests: {
      load: {
        args: {
          repo_id: args.repo_id,
          pull_number: args.pull_number
        },
      }
    }
  },
  release: {
    fields: [],
    rest_endpoint: 'repos',
    commands: [
      {
        cmd: 'load',
        action: 'getRelease',
        include: ['repo_id'],
      }
    ],
    tests: {
      load: {
        args: {
          repo_id: args.repo_id,
          release_id: args.release_id
        }
      }
    }
  },
  user: {
    fields: [],
    rest_endpoint: 'users',
    commands: [
      {
        cmd: 'load',
        action: 'getByUsername',
        include: [],
      }
    ],
    tests: {
      load: {
        args: {
          username: args.username
        }
      }
    }
  }
}

export {
  entities_map
}