export default {
  repo: {
    patch: {
      method: "PATCH",
      url: "/repos/:owner/:repo",
      mock_data: {
        id: 123456,
      },
    },
    get: {
      method: "GET",
      url: "/repos/:owner/:repo",
      mock_data: {
        id: 123456,
      },
    },
  },
  code_scanning: {
    patch: {
      method: "PATCH",
      url: "/repos/:owner/:repo/code-scanning/alerts/:alert_number",
      mock_data: {
        dismissed_reason: "used in tests",
      },
    },
    get: {
      method: "GET",
      url: "/repos/:owner/:repo/code-scanning/alerts/:alert_number",
      mock_data: {
        number: 1,
      },
    },
  },
  gist: {
    patch: {
      method: "PATCH",
      url: "/gists/:gist_id",
      mock_data: {
        id: "some-gist-id",
      },
    },
    get: {
      method: "GET",
      url: "/gists/:gist_id",
      mock_data: {
        id: "some-gist-id",
      },
    },
  },
  issue: {
    patch: {
      method: "PATCH",
      url: "/repos/:owner/:repo/issues/:issue_number",
      mock_data: {
        repo_id: "senecajs/seneca",
      },
    },
    get: {
      method: "GET",
      url: "/repos/:owner/:repo/issues/:issue_number",
      mock_data: {
        repo_id: "senecajs/seneca",
        number: 1,
      },
    },
  },
  pull: {
    patch: {
      method: "PATCH",
      url: "/repos/:owner/:repo/pulls/:pull_number",
      mock_data: {
        repo_id: "senecajs/seneca",
      },
    },
    get: {
      method: "GET",
      url: "/repos/:owner/:repo/pulls/:pull_number",
      mock_data: {
        id: 819532044,
      },
    },
  },
  release: {
    patch: {
      method: "PATCH",
      url: "/repos/:owner/:repo",
      mock_data: {
        repo_id: "senecajs/seneca",
      },
    },
    get: {
      method: "GET",
      url: "/repos/:owner/:repo/releases/:release_id",
      mock_data: {
        id: 123456,
      },
    },
  },
  branch: {
    get: {
      method: "GET",
      url: "/repos/:owner/:repo/branches/:branch",
      mock_data: {
        repo_id: "senecajs/seneca",
        name: "master",
      },
    },
  },
  code_of_conduct: {
    get: {
      method: "GET",
      url: "/codes_of_conduct/:key",
      mock_data: {
        key: "contributor_covenant",
      },
    },
  },
  commit: {
    get: {
      method: "GET",
      url: "/repos/:owner/:repo/git/commits/:commit_sha",
      mock_data: {
        repo_id: "senecajs/seneca",
        sha: "commit-sha",
      },
    },
  },
  license: {
    get: {
      method: "GET",
      url: "/licenses/:license",
      mock_data: {
        key: "mit",
      },
    },
  },
  org: {
    get: {
      method: "GET",
      url: "/orgs/:org",
      mock_data: {
        login: "Organization123",
      },
    },
  },
  user: {
    get: {
      method: "GET",
      url: "/users/:username",
      mock_data: {
        id: 45415308,
      },
    },
  },
  check: {
    get: {
      method: "GET",
      url: "/repos/:owner/:repo/check-runs/:check_run_id",
      mock_data: {
        id: 1,
      },
    },
    patch: {
      method: "PATCH",
      url: "/repos/:owner/:repo/check-runs/:check_run_id",
      mock_data: {
        id: 1,
      },
    },
  },
  project: {
    get: {
      method: "GET",
      url: "/projects/:project_id",
      mock_data: {
        id: 10,
      },
    },
    patch: {
      method: "PATCH",
      url: "/projects/:project_id",
      mock_data: {
        id: 10,
      },
    },
  },
  secret_scanning: {
    get: {
      method: "GET",
      url: "/repos/:owner/:repo/secret-scanning/alerts/:alert_number",
      mock_data: {
        number: 11,
        state: 'resolved',
        resolution: 'used in tests',
      },
    },
    patch: {
      method: "PATCH",
      url: "/repos/:owner/:repo/secret-scanning/alerts/:alert_number",
      mock_data: {
        number: 11,
        state: 'resolved',
        resolution: 'used in tests',
      },
    },
  },
}
