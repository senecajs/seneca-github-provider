import { EntityMap, IncludeFromEnum } from './types'
import fields from './fields'

const ents: EntityMap = {
  repo: {
    fields: fields.repo,
    sdk: {
      rest: {
        subpath: 'repos',
      }
    },
    actions: {
      load : {
        action: 'get',
        modify: [
          {
            field: 'github_id',
            replace_for: {
              field: 'id',
              from: IncludeFromEnum.ResponseData
            },
          },
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: IncludeFromEnum.args
            },
          },
          {
            field: 'id',
            replace_for: {
              field: 'repo_id',
              from: IncludeFromEnum.args
            },
          },
        ],
      },
      save: {
        action: 'update',
        modify: [
          {
            field: 'github_id',
            replace_for: {
              field: 'id',
              from: IncludeFromEnum.ResponseData
            },
          },
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: IncludeFromEnum.entity
            },
          },
          {
            field: 'id',
            replace_for: {
              field: 'repo_id',
              from: IncludeFromEnum.entity
            },
          },
        ],
        body_args: ['description'],
      }
    },
  },
  code_scanning: {
    fields: fields.code_scanning,
    sdk: {
      rest: {
        subpath: 'codeScanning',
      }
    },
    actions: {
      load : {
        action: 'getAlert',
        include: ['repo_id', 'alert_number'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      },
      save: {
        action: 'updateAlert',
        include: ['repo_id', 'alert_number'],
        modify: {
          rename: [
            {
              field: 'repo_id',
              from: DataSourceEnum.args,
            }
          ]
        },
        body_args: ['alert_number', 'state', 'dismissed_reason']
      }
    },
  },
  branch: {
    fields: fields.branch,
    sdk: {
      rest: {
        subpath: 'repos',
      }
    },
    actions: {
      load : {
        action: 'getBranch',
        include: ['repo_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      }
    },
  },
  code_of_conduct: {
    fields: fields.code_of_conduct,
    sdk: {
      rest: {
        subpath: 'codesOfConduct',
      }
    },
    actions: {
      load : {
        action: 'getConductCode',
        include: [],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      },
    },
  },
  commit: {
    fields: fields.commit,
    sdk: {
      rest: {
        subpath: 'git',
      }
    },
    actions: {
      load : {
        action: 'getCommit',
        include: ['repo_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      }
    },
  },
  gist: {
    fields: fields.gist,
    sdk: {
      rest: {
        subpath: 'gists',
      }
    },
    actions: {
      load : {
        action: 'get',
        include: ['gist_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      },
      save: {
        action: 'update',
        include: ['gist_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
        body_args: ['gist_id', 'description', 'files']
      }
    },
  },
  issue: {
    fields: fields.issue,
    sdk: {
      rest: {
        subpath: 'issues',
      }
    },
    actions: {
      load : {
        action: 'get',
        include: ['repo_id', 'issue_number'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      },
      save: {
        action: 'update',
        include: ['repo_id', 'issue_number'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
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
    },
  },
  license: {
    fields: fields.license,
    sdk: {
      rest: {
        subpath: 'licenses',
      }
    },
    actions: {
      load : {
        action: 'get',
        include: [],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      }
    },
  },
  org: {
    fields: fields.org,
    sdk: {
      rest: {
        subpath: 'orgs',
      }
    },
    actions: {
      load : {
        action: 'get',
        include: ['org'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      }
    },
  },
  pull: {
    fields: fields.pull,
    sdk: {
      rest: {
        subpath: 'pulls',
      }
    },
    actions: {
      load : {
        action: 'get',
        include: ['repo_id', 'pull_number'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      },
      save: {
        action: 'update',
        include: ['repo_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
        body_args: [
          'pull_number',
          'title',
          'body',
          'state',
          'base',
          'maintainer_can_modify',
        ],
      }
    },
  },
  release: {
    fields: fields.release,
    sdk: {
      rest: {
        subpath: 'repos',
      }
    },
    actions: {
      load : {
        action: 'getRelease',
        include: ['repo_id', 'release_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      },
      save: {
        action: 'update',
        include: ['repo_id', 'release_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
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
    },
  },
  user: {
    fields: fields.user,
    sdk: {
      rest: {
        subpath: 'users',
      }
    },
    actions: {
      load : {
        action: 'getByUsername',
        include: [],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      },
    },
  },
  check: {
    fields: fields.check,
    sdk: {
      rest: {
        subpath: 'checks',
      }
    },
    actions: {
      load : {
        action: 'get',
        include: ['repo_id', 'check_run_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      },
      save: {
        action: 'update',
        include: ['repo_id', 'check_run_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
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
    },
  },
  project: {
    fields: fields.project,
    sdk: {
      rest: {
        subpath: 'projects',
      }
    },
    actions: {
      load : {
        action: 'get',
        include: ['project_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      },
      save: {
        action: 'update',
        include: ['project_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
        body_args: [
          'project_id',
          'name',
          'body',
          'state',
          'organization_permission',
          'private',
        ],
      }
    },
  },
  secret_scanning: {
    fields: fields.secret_scanning,
    sdk: {
      rest: {
        subpath: 'secretScanning',
      }
    },
    actions: {
      load : {
        action: 'getAlert',
        include: ['alert_number', 'repo_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
      },
      save: {
        action: 'updateAlert',
        include: ['alert_number', 'repo_id'],
        modify: {
          rename: [
            {
              field: '',
              rename: '',
            }
          ]
        },
        body_args: [
          'alert_number',
          'state',
          'resolution'
        ],
      }
    },
  }
*/}

export { ents }
