import { EntityMap } from './types'
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
        cb_name:'get',
        modify: [
          {
            field: 'github_id',
            replace_for: {
              field: 'id',
              from: 'responseData'
            },
          },
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'args'
            },
          },
          {
            field: 'id',
            replace_for: {
              field: 'repo_id',
              from: 'args'
            },
          },
        ],
      },
      save: {
        cb_name:'update',
        modify: [
          {
            field: 'github_id',
            replace_for: {
              field: 'id',
              from: 'responseData'
            },
          },
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'entity'
            },
          },
          {
            field: 'id',
            replace_for: {
              field: 'repo_id',
              from: 'entity'
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
        cb_name:'getAlert',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'args',
            }
          },
          {
            field: 'number',
            rename: 'alert_number'
          }
        ],
      },
      save: {
        cb_name:'updateAlert',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'args',
            }
          },
          {
            field: 'number',
            rename: 'alert_number'
          }
        ],
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
        cb_name:'getBranch',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'args',
            }
          }
        ],
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
        cb_name:'getConductCode',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'args',
            }
          }
        ],
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
        cb_name:'getCommit',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'args',
            }
          }
        ],
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
        cb_name:'get',
        modify: [
          {
            field: 'gist_id',
            replace_for: {
              field: 'gist_id',
              from: 'args',
            }
          },
          {
            field: 'id',
            rename: 'gist_id'
          }
        ],
      },
      save: {
        cb_name:'update',
        modify: [
          {
            field: 'gist_id',
            replace_for: {
              field: 'gist_id',
              from: 'args',
            }
          },
          {
            field: 'id',
            rename: 'gist_id'
          }
        ],
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
        cb_name:'get',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'args',
            }
          },
          {
            field: 'number',
            rename: 'issue_number'
          }
        ],
      },
      save: {
        cb_name:'update',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'entity',
            }
          },
          {
            field: 'number',
            rename: 'issue_number'
          }
        ],
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
        cb_name:'get',
        modify: []
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
        cb_name:'get',
        modify: [
          {
            field: 'org',
            replace_for: {
              field: 'og',
              from: 'args',
            }
          }
        ],
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
        cb_name:'get',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'args',
            }
          },
          {
            field: 'number',
            rename: 'pull_number'
          }
        ],
      },
      save: {
        cb_name:'update',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'entity',
            }
          },
          {
            field: 'number',
            rename: 'pull_number'
          }
        ],
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
        cb_name:'getRelease',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'args',
            }
          },
          {
            field: 'id',
            rename: 'release_id'
          }
        ],
      },
      save: {
        cb_name:'update',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'entity',
            }
          },
          {
            field: 'id',
            rename: 'release_id'
          }
        ],
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
        cb_name:'getByUsername',
        modify: [],
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
        cb_name:'get',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'args',
            }
          },
          {
            field: 'id',
            rename: 'check_run_id'
          }
        ],
      },
      save: {
        cb_name:'update',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'entity',
            }
          },
          {
            field: 'id',
            rename: 'check_run_id'
          }
        ],
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
        cb_name:'get',
        modify: [
          {
            field: 'id',
            rename: 'project_id'
          }
        ],
      },
      save: {
        cb_name:'update',
        modify: [
          {
            field: 'id',
            rename: 'project_id'
          }
        ],
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
        cb_name:'getAlert',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'args',
            }
          },
          {
            field: 'number',
            rename: 'alert_number',
          }
        ],
      },
      save: {
        cb_name:'updateAlert',
        modify: [
          {
            field: 'repo_id',
            replace_for: {
              field: 'repo_id',
              from: 'entity',
            }
          },
          {
            field: 'number',
            rename: 'alert_number',
          }
        ],
        body_args: [
          'alert_number',
          'state',
          'resolution'
        ],
      }
    },
  }
}

export { ents }
