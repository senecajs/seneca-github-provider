import { EntityMap } from './types'
import crypto from 'crypto'
import fields from './fields'

let test_args = {
  gist_id: 'some-gist-id',
  repo_id: 'senecajs/seneca',
  code_of_conduct_key: 'contributor_covenant',
  branch_id: 'master',
  commit_sha: 'commit-sha',
  issue_number: 1,
  license: 'mit',
  org: 'Organization123',
  release_id: 123456,
  username: 'senecajs',
  pull_number: 4,
  alert_number: 1,
  secret_scanning_alert_number: 11,
  check_run_id: 1,
  project_id: 10
}

const rand = crypto.randomBytes(10).toString('hex')

const ents: EntityMap = {
  repo: {
    fields: fields.repo,
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
          repo_id: test_args.repo_id
        },
        expectations: {
          repo_id: {
            sameAs: test_args.repo_id
          }
        }
      },
      save: {
        changes: {
          description: rand
        },
        expectations: {
          repo_id: {
            sameAs: test_args.repo_id
          }
        }
      }
    }
  },
  code_scanning: {
    fields: fields.code_scanning,
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
          repo_id: test_args.repo_id,
          alert_number: test_args.alert_number
        },
        expectations: {
          number: {
            sameAs: test_args.alert_number
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
    fields: fields.branch,
    rest_endpoint: 'repos',
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
          repo_id: test_args.repo_id,
          branch: test_args.branch_id
        },
        expectations: {
          repo_id: {
            sameAs: test_args.repo_id
          },
          name: {
            sameAs: test_args.branch_id
          }
        }
      }
    }
  },
  code_of_conduct: {
    fields: fields.code_of_conduct,
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
          key: test_args.code_of_conduct_key
        },
        expectations: {
          key: {
            sameAs: test_args.code_of_conduct_key
          }
        }
      }
    }
  },
  commit: {
    fields: fields.commit,
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
          repo_id: test_args.repo_id,
          commit_sha: test_args.commit_sha
        },
        expectations: {
          repo_id: {
            sameAs: test_args.repo_id
          },
          sha: {
            sameAs: test_args.commit_sha
          }
        }
      }
    }
  },
  gist: {
    fields: fields.gist,
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
          gist_id: test_args.gist_id
        }
      },
      save: {
        changes: {
          description: rand
        },
        expectations: {
          gist_id: {
            sameAs: test_args.gist_id
          }
        }
      }
    }
  },
  issue: {
    fields: fields.issue,
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
          repo_id: test_args.repo_id,
          issue_number: test_args.issue_number
        },
        expectations: {
          repo_id: {
            sameAs: test_args.repo_id
          },
          number: {
            sameAs: test_args.issue_number
          }
        }
      },
      save: {
        changes: {
          title: rand
        },
        expectations: {
          repo_id: {
            sameAs: test_args.repo_id
          }
        }
      }
    }
  },
  license: {
    fields: fields.license,
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
          license: test_args.license
        },
        expectations: {
          key: {
            sameAs: test_args.license
          }
        }
      }
    }
  },
  org: {
    fields: fields.org,
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
          org: test_args.org
        },
        expectations: {
          login: {
            sameAs: test_args.org
          }
        }
      }
    }
  },
  pull: {
    fields: fields.pull,
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
          repo_id: test_args.repo_id,
          pull_number: test_args.pull_number,
        }
      },
      save: {
        changes: {
          body: rand
        },
        expectations: {
          repo_id: {
            sameAs: test_args.repo_id
          }
        },
        args: {
          base: 'master'
        }
      }
    }
  },
  release: {
    fields: fields.release,
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
          repo_id: test_args.repo_id,
          release_id: test_args.release_id
        }
      },
      save: {
        changes: {
          name: rand
        },
        expectations: {
          repo_id: {
            sameAs: test_args.repo_id
          }
        }
      }
    }
  },
  user: {
    fields: fields.user,
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
          username: test_args.username
        }
      }
    }
  },
  check: {
    fields: [],
    rest_endpoint: 'checks',
    commands: [
      {
        cmd: 'load',
        action: 'get',
        include: ['repo_id', 'check_run_id']
      },
      {
        cmd: 'save',
        action: 'update',
        include: ['repo_id', 'check_run_id'],
        body_args: [
          'check_run_id',
          'name',
          'head_sha',
          'details_url',
          'external_id',
          'status',
          'started_at',
          'conclusion',
          'completed_a',
          'output',
        ],
      }
    ],
    tests: {
      load: {
        args: {
          repo_id: test_args.repo_id,
          check_run_id: test_args.check_run_id
        },
        expectations: {
          id: {
            sameAs: test_args.check_run_id
          }
        }
      },
      save: {
        changes: {
          name: rand
        },
        expectations: {
          repo_id: {
            sameAs: test_args.repo_id
          },
          check_run_id: {
            sameAs: test_args.check_run_id
          },
          id: {
            sameAs: test_args.check_run_id
          }
        }
      }
    }
  },
  project: {
    fields: [],
    rest_endpoint: 'projects',
    commands: [
      {
        cmd: 'load',
        action: 'get',
        include: ['project_id'],
      },
      {
        cmd: 'save',
        action: 'update',
        include: ['project_id'],
        body_args: [
          'project_id',
          'name',
          'body',
          'state',
          'organization_permission',
          'private',
        ],
      }
    ],
    tests: {
      load: {
        args: {
          project_id: test_args.project_id
        },
        expectations: {
          id: {
            sameAs: test_args.project_id
          }
        }
      },
      save: {
        changes: {
          name: rand
        },
        expectations: {
          id: {
            sameAs: test_args.project_id
          }
        }
      }
    }
  },
  secret_scanning: {
    fields: [],
    rest_endpoint: 'secretScanning',
    commands: [
      {
        cmd: 'load',
        action: 'getAlert',
        include: ['alert_number', 'repo_id'],
      },
      {
        cmd: 'save',
        action: 'updateAlert',
        include: ['alert_number', 'repo_id'],
        body_args: [
          'alert_number',
          'state',
          'resolution'
        ],
      }
    ],
    tests: {
      load: {
        args: {
          repo_id: test_args.repo_id,
          alert_number: test_args.secret_scanning_alert_number
        },
        expectations: {
          number: {
            sameAs: test_args.secret_scanning_alert_number
          }
        }
      },
      save: {
        changes: {
          state: 'resolved',
          resolution: 'used in tests'
        },
        expectations: {
          number: {
            sameAs: test_args.secret_scanning_alert_number
          },
          state: {
            sameAs: 'resolved'
          },
          resolution: {
            sameAs: 'used in tests'
          }
        }
      }
    }
  }
}

export { ents }
