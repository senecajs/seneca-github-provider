import { EntityMap } from './types'
import crypto from 'crypto'

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
  pull_number: 4,
  alert_number: 1
}

const rand = crypto.randomBytes(10).toString('hex')

const entities_map: EntityMap = {
  repo: {
    fields: [],
    rest_endpoint: 'repos',
    commands: [
      {
        cmd: 'load',
        action: 'get',
        include: ['repo_id as id', 'repo_id']
      },
      {
        cmd: 'save',
        action: 'update',
        body_args: ['description'],
        include: ['repo_id as id', 'repo_id']
      }
    ],
    tests: {
      load: {
        args: {
          repo_id: args.repo_id
        },
        expectations: {
          id: {
            sameAs: args.repo_id
          }
        }
      },
      save: {
        changes: {
          description: rand
        },
        expectations: {
          description: {
            sameAs: rand
          }
        }
      }
    }
  },
  code_scanning: {
    fields: [],
    rest_endpoint: 'codeScanning',
    commands: [
      {
        cmd: 'load',
        action: 'getAlert',
        include: ['repo_id', 'alert_number']
      },
      {
        cmd: 'save',
        action: 'updateAlert',
        include: ['repo_id', 'alert_number'],
        body_args: ['alert_number', 'state', 'dismissed_reason']
      }
    ],
    tests: {
      load: {
        args: {
          repo_id: args.repo_id,
          alert_number: args.alert_number
        },
        expectations: {
          number: {
            sameAs: args.alert_number
          }
        }
      },
      save: {
        changes: {
          state: 'dismissed',
          dismissed_reason: 'used in tests'
        },
        expectations: {
          dismissed_reason: {
            sameAs: 'used in tests'
          }
        }
      }
    }
  },
  branch: {
    rest_endpoint: 'repos',
    fields: [],
    commands: [
      {
        cmd: 'load',
        action: 'getBranch',
        include: ['repo_id']
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
      }
    }
  },
  code_of_conduct: {
    fields: [],
    rest_endpoint: 'codesOfConduct',
    commands: [
      {
        cmd: 'load',
        action: 'getConductCode',
        include: []
      },
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
      }
    }
  },
  commit: {
    fields: [],
    rest_endpoint: 'git',
    commands: [
      {
        cmd: 'load',
        action: 'getCommit',
        include: ['repo_id']
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
        include: ['gist_id']
      },
      {
        cmd: 'save',
        action: 'update',
        include: ['gist_id'],
        body_args: ['gist_id', 'description', 'files']
      }
    ],
    tests: {
      load: {
        args: {
          gist_id: args.gist_id
        }
      },
      save: {
        changes: {
          description: rand
        },
        expectations: {
          description: {
            sameAs: rand
          }
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
        include: ['repo_id', 'issue_number']
      },
      {
        cmd: 'save',
        action: 'update',
        include: ['repo_id', 'issue_number'],
        body_args: [
          'issue_number',
          'title',
          'body',
          'state',
          'milestone',
          'labels',
          'assigness',
        ]
      }
    ],
    tests: {
      load: {
        args: {
          repo_id: args.repo_id,
          issue_number: args.issue_number
        },
        expectations: {
          repo_id: {
            sameAs: args.repo_id
          }
        }
      },
      save: {
        changes: {
          title: rand
        },
        expectations: {
          title: {
            sameAs: rand
          }
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
        include: []
      }
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
        include: ['org']
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
        include: ['repo_id', 'pull_number']
      },
      {
        cmd: 'save',
        action: 'update',
        include: ['repo_id'],
        body_args: [
          'pull_number',
          'title',
          'body',
          'state',
          'base',
          'maintainer_can_modify',
        ],
      }
    ],
    tests: {
      load: {
        args: {
          repo_id: args.repo_id,
          pull_number: args.pull_number,
        }
      },
      save: {
        changes: {
          body: rand
        },
        expectations: {
          body: {
            sameAs: rand
          }
        },
        args: {
          base: 'master'
        }
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
        include: ['repo_id', 'release_id']
      },
      {
        cmd: 'save',
        action: 'update',
        include: ['repo_id', 'release_id'],
        body_args: [
          'release_id',
          'tag_name',
          'target_commitish',
          'name',
          'body',
          'draft',
          'prerelease',
          'discussion_category_name',
        ],
      }
    ],
    tests: {
      load: {
        args: {
          repo_id: args.repo_id,
          release_id: args.release_id
        }
      },
      save: {
        changes: {
          name: rand
        },
        expectations: {
          name: {
            sameAs: rand
          }
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
        include: []
      },
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

export { entities_map }
