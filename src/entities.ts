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
        action: 'get',
        include: ['repo_id as id', 'repo_id']
      },
      save: {
        action: 'update',
        body_args: ['description'],
        include: ['repo_id as id', 'repo_id']
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
        include: ['repo_id', 'alert_number']
      },
      save: {
        action: 'updateAlert',
        include: ['repo_id', 'alert_number'],
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
        include: ['repo_id']
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
        include: []
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
        include: ['repo_id']
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
        include: ['gist_id']
      },
      save: {
        action: 'update',
        include: ['gist_id'],
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
        include: ['repo_id', 'issue_number']
      },
      save: {
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
        include: []
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
        include: ['org']
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
        include: ['repo_id', 'pull_number']
      },
      save: {
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
        include: ['repo_id', 'release_id']
      },
      save: {
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
        include: []
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
        include: ['repo_id', 'check_run_id']
      },
      save: {
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
      },
      save: {
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
      },
      save: {
        action: 'updateAlert',
        include: ['alert_number', 'repo_id'],
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
