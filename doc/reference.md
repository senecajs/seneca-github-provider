# Reference

Complete description of the interface exposed by
`@seneca/github-provider` version 0.0.1.

This document describes the machinery and assumes you know what you are
looking for. To learn the plugin, start with the [tutorial](tutorial.md);
for recipes, see the [how-to guides](how-to.md); for the reasoning behind
the design, see the [explanation](explanation.md). The package overview is
the [README](../README.md), and the document index is [here](README.md).

- [Requirements](#requirements)
- [Registration](#registration)
- [Options](#options)
- [Entities](#entities)
- [Actions](#actions)
- [Action patterns](#action-patterns)
- [Plugin exports](#plugin-exports)
- [Errors](#errors)
- [Authentication keys](#authentication-keys)
- [Environment variables](#environment-variables)
- [Package scripts](#package-scripts)

## Requirements

| Item | Value |
| ---- | ----- |
| Node.js | `>=24` |
| Module format | CommonJS |
| SDK | [`@voxgig-sdk/github`](https://www.npmjs.com/package/@voxgig-sdk/github) `^0.0.1` |

The SDK is an ordinary published dependency, installed by `npm install`
like any other.

### Peer dependencies

All must be present in the host application. The accepted version ranges are
declared in this package's `package.json`.

| Package | Purpose |
| ------- | ------- |
| `seneca` | The host framework. The plugin runs inside the host's instance, never its own. |
| `seneca-entity` | The entity API the canons below are served through. |
| `seneca-promisify` | The promise-returning message API. |
| `@seneca/provider` | The provider convention, including `provider/entityBuilder`. |
| `@seneca/env` | Resolves `$`-prefixed key values from the environment. |

## Registration

The plugin name is `GithubProvider`. It must be registered after
`entity`, `promisify` and `provider`:

```js
Seneca({ legacy: false })
  .use('promisify')
  .use('entity')
  .use('provider', { ... })
  .use('@seneca/github-provider', { sdk: { base: BASE } })
```

The GitHub v3 REST definition declares no server, so there is no default
base URL: `BASE` is the URL of the API you are talking to, and it must be
supplied through the `sdk` option.

The SDK client is constructed during plugin startup and is not available
until `seneca.ready()` resolves.

## Options

| Option | Type | Default | Effect |
| ------ | ---- | ------- | ------ |
| `sdk` | object | `{}` | Passed straight to the `GithubSDK` constructor. Most usefully `base`. |
| `test` | boolean | `false` | Run the SDK against its in-memory mock transport instead of HTTP. |
| `testopts` | object | `{}` | Test-feature options, used only when `test` is true. `{entity: {...}}` seeds the mock. |

### `sdk`

Any option the `GithubSDK` constructor accepts:

| Key | Effect |
| --- | ------ |
| `base` | Base URL for API requests. There is no default: this API declares no server, so it must be set. |
| `prefix` / `suffix` | URL fragments placed around the path. |
| `headers` | Headers sent on every request. These win over the `authorization` header the provider adds from a configured key. |
| `system` | System overrides, e.g. a custom `fetch`. |

### `test` and `testopts`

```js
.use('@seneca/github-provider', {
  test: true,
  testopts: {
    entity: {
      pull: { pull0: {"additions":100,"assignee":{},"author_association":"author_association0","auto_merge":{},"base":{},"body":"body0","changed_files":100,"closed_at":"closed_at0","comments":100,"comments_url":"comments_url0","commits":100,"commits_url":"commits_url0","created_at":"created_at0","deletions":100,"diff_url":"diff_url0","head":{},"html_url":"html_url0","id":"pull0","issue_url":"issue_url0","labels":[],"links":{},"locked":false,"maintainer_can_modify":false,"merge_commit_sha":"merge_commit_sha0","mergeable":false,"mergeable_state":"mergeable_state0","merged":false,"merged_at":"merged_at0","merged_by":{},"message":"message0","milestone":{},"node_id":"node_id0","number":100,"patch_url":"patch_url0","review_comment_url":"review_comment_url0","review_comments":100,"review_comments_url":"review_comments_url0","sha":"sha0","stack":{},"state":"state0","statuses_url":"statuses_url0","title":"title0","updated_at":"updated_at0","url":"url0","user":{},"owner":"owner0","repo":"repo0"} },
      repo: { repo0: {"archive_url":"archive_url0","archived":false,"assignees_url":"assignees_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","clone_url":"clone_url0","code_of_conduct":{},"collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","created_at":"created_at0","default_branch":"default_branch0","deployments_url":"deployments_url0","description":"description0","disabled":false,"downloads_url":"downloads_url0","events_url":"events_url0","fork":false,"forks":100,"forks_count":100,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","git_url":"git_url0","has_discussions":false,"has_issues":false,"has_pages":false,"has_projects":false,"has_wiki":false,"homepage":"homepage0","hooks_url":"hooks_url0","html_url":"html_url0","id":"repo0","issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels_url":"labels_url0","language":"language0","languages_url":"languages_url0","license":{},"merges_url":"merges_url0","milestones_url":"milestones_url0","mirror_url":"mirror_url0","name":"name0","network_count":100,"node_id":"node_id0","notifications_url":"notifications_url0","open_issues":100,"open_issues_count":100,"organization":{},"owner":"owner0","parent":{},"permissions":{},"private":false,"pulls_url":"pulls_url0","pushed_at":"pushed_at0","releases_url":"releases_url0","size":100,"source":{},"ssh_url":"ssh_url0","stargazers_count":100,"stargazers_url":"stargazers_url0","statuses_url":"statuses_url0","subscribers_count":100,"subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","svn_url":"svn_url0","tags_url":"tags_url0","teams_url":"teams_url0","template_repository":{},"trees_url":"trees_url0","updated_at":"updated_at0","url":"url0","watchers":100,"watchers_count":100} },
    },
  },
})
```

Mock records are keyed by id under their entity name. In this mode no
network calls are made, and an unseeded id produces the same not-found
behaviour as a live server. This package's own `test/seed.js` is generated
in exactly this shape.

A nested record's parent key must name a record the parent entity also
seeds: the mock resolves the path literally, so an unmatched parent id
yields nothing rather than an error.

## Entities

The plugin registers 2 entity canons.
A canon carries only the commands its API operations support — an entity the
API offers no delete for has no `remove$` — so the tables below are the
whole of what each one answers.

| Seneca canon | SDK accessor | Route | Id field | Parent keys | Commands |
| ------------ | ------------ | ----- | -------- | ----------- | -------- |
| `provider/github/pull` | `sdk.Pull()` | `/repos/{owner}/{repo}/pulls` | `id` | `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/repo` | `sdk.Repo()` | `/user/repos` | `null` | `owner` | `list$`, `load$`, `save$`, `remove$` |

### `provider/github/pull`

Backed by `sdk.Pull()`, whose results are `PullEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`pull` is nested under `/repos/{owner}/{repo}/pulls` in the API, so **every**
`pull` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: pull <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `pull` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `pull`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created or updated `pull`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `additions` | number |  |
| `assignee` | object |  |
| `author_association` | string |  |
| `auto_merge` | object |  |
| `base` | object |  |
| `body` | string |  |
| `changed_files` | number |  |
| `closed_at` | string |  |
| `comments` | number |  |
| `comments_url` | string |  |
| `commits` | number |  |
| `commits_url` | string |  |
| `created_at` | string |  |
| `deletions` | number |  |
| `diff_url` | string |  |
| `head` | object |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `issue_url` | string |  |
| `labels` | array |  |
| `links` | object |  |
| `locked` | boolean |  |
| `maintainer_can_modify` | boolean |  |
| `merge_commit_sha` | string |  |
| `mergeable` | boolean |  |
| `mergeable_state` | string |  |
| `merged` | boolean |  |
| `merged_at` | string |  |
| `merged_by` | object |  |
| `message` | string |  |
| `milestone` | object |  |
| `node_id` | string |  |
| `number` | number |  |
| `patch_url` | string |  |
| `review_comment_url` | string |  |
| `review_comments` | number |  |
| `review_comments_url` | string |  |
| `sha` | string |  |
| `stack` | object |  |
| `state` | string |  |
| `statuses_url` | string |  |
| `title` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `user` | object |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const pulls = await seneca
  .entity('provider/github/pull')
  .list$({ owner: '...', repo: '...' })
const pull = await seneca
  .entity('provider/github/pull')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/repo`

Backed by `sdk.Repo()`, whose results are `RepoEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`repo` is nested under `/user/repos` in the API, so **every**
`repo` command requires `owner`. Omitting one throws —
`@seneca/github-provider: repo <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` **required**, plus optional match fields | Array of `repo` entities. |
| `load$(q)` | `owner` and `null`, both **required** | One `repo`, or `null` if not found. |
| `save$()` | entity data, including `owner` | Created or updated `repo`. |
| `remove$(q)` | `owner` and `null`, both **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `archive_url` | string |  |
| `archived` | boolean |  |
| `assignees_url` | string |  |
| `blobs_url` | string |  |
| `branches_url` | string |  |
| `clone_url` | string |  |
| `code_of_conduct` | object |  |
| `collaborators_url` | string |  |
| `comments_url` | string |  |
| `commits_url` | string |  |
| `compare_url` | string |  |
| `contents_url` | string |  |
| `contributors_url` | string |  |
| `created_at` | string |  |
| `default_branch` | string |  |
| `deployments_url` | string |  |
| `description` | string |  |
| `disabled` | boolean |  |
| `downloads_url` | string |  |
| `events_url` | string |  |
| `fork` | boolean |  |
| `forks` | number |  |
| `forks_count` | number |  |
| `forks_url` | string |  |
| `full_name` | string |  |
| `git_commits_url` | string |  |
| `git_refs_url` | string |  |
| `git_tags_url` | string |  |
| `git_url` | string |  |
| `has_discussions` | boolean |  |
| `has_issues` | boolean |  |
| `has_pages` | boolean |  |
| `has_projects` | boolean |  |
| `has_wiki` | boolean |  |
| `homepage` | string |  |
| `hooks_url` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `issue_comment_url` | string |  |
| `issue_events_url` | string |  |
| `issues_url` | string |  |
| `keys_url` | string |  |
| `labels_url` | string |  |
| `language` | string |  |
| `languages_url` | string |  |
| `license` | object |  |
| `merges_url` | string |  |
| `milestones_url` | string |  |
| `mirror_url` | string |  |
| `name` | string |  |
| `network_count` | number |  |
| `node_id` | string |  |
| `notifications_url` | string |  |
| `open_issues` | number |  |
| `open_issues_count` | number |  |
| `organization` | object |  |
| `owner` | object | Parent key. Required by every command. |
| `parent` | object |  |
| `permissions` | object |  |
| `private` | boolean |  |
| `pulls_url` | string |  |
| `pushed_at` | string |  |
| `releases_url` | string |  |
| `size` | number |  |
| `source` | object |  |
| `ssh_url` | string |  |
| `stargazers_count` | number |  |
| `stargazers_url` | string |  |
| `statuses_url` | string |  |
| `subscribers_count` | number |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `svn_url` | string |  |
| `tags_url` | string |  |
| `teams_url` | string |  |
| `template_repository` | object |  |
| `trees_url` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `watchers` | number |  |
| `watchers_count` | number |  |

```js
const repos = await seneca
  .entity('provider/github/repo')
  .list$({ owner: '...' })
const repo = await seneca
  .entity('provider/github/repo')
  .load$({ owner: '...', null: '...' })
```

### Create versus update

`save$` follows the Seneca convention: an entity **without** an id is
created, an entity **with** one is updated. The provider dispatches on the
id field, so the same call does both.

```js
// Create — no null.
const repo = await seneca
  .entity('provider/github/repo')
  .make$({ owner: '...', archive_url: 'archive_url-value', archived: false, assignees_url: 'assignees_url-value', blobs_url: 'blobs_url-value', branches_url: 'branches_url-value', clone_url: 'clone_url-value', code_of_conduct: 'code_of_conduct-value', collaborators_url: 'collaborators_url-value', comments_url: 'comments_url-value', commits_url: 'commits_url-value', compare_url: 'compare_url-value', contents_url: 'contents_url-value', contributors_url: 'contributors_url-value', created_at: 'created_at-value', default_branch: 'default_branch-value', deployments_url: 'deployments_url-value', description: 'description-value', disabled: false, downloads_url: 'downloads_url-value', events_url: 'events_url-value', fork: false, forks: 1234, forks_count: 1234, forks_url: 'forks_url-value', full_name: 'full_name-value', git_commits_url: 'git_commits_url-value', git_refs_url: 'git_refs_url-value', git_tags_url: 'git_tags_url-value', git_url: 'git_url-value', has_discussions: false, has_issues: false, has_pages: false, has_projects: false, has_wiki: false, homepage: 'homepage-value', hooks_url: 'hooks_url-value', html_url: 'html_url-value', issue_comment_url: 'issue_comment_url-value', issue_events_url: 'issue_events_url-value', issues_url: 'issues_url-value', keys_url: 'keys_url-value', labels_url: 'labels_url-value', language: 'language-value', languages_url: 'languages_url-value', license: 'license-value', merges_url: 'merges_url-value', milestones_url: 'milestones_url-value', mirror_url: 'mirror_url-value', name: 'name-value', network_count: 1234, node_id: 'node_id-value', notifications_url: 'notifications_url-value', open_issues: 1234, open_issues_count: 1234, organization: 'organization-value', parent: 'parent-value', permissions: 'permissions-value', private: false, pulls_url: 'pulls_url-value', pushed_at: 'pushed_at-value', releases_url: 'releases_url-value', size: 1234, source: 'source-value', ssh_url: 'ssh_url-value', stargazers_count: 1234, stargazers_url: 'stargazers_url-value', statuses_url: 'statuses_url-value', subscribers_count: 1234, subscribers_url: 'subscribers_url-value', subscription_url: 'subscription_url-value', svn_url: 'svn_url-value', tags_url: 'tags_url-value', teams_url: 'teams_url-value', template_repository: 'template_repository-value', trees_url: 'trees_url-value', updated_at: 'updated_at-value', url: 'url-value', watchers: 1234, watchers_count: 1234 })
  .save$()

// Update — null present.
repo.archive_url = 'archive_url-changed'
await repo.save$()
```

Whether a client-supplied id survives a create is a property of the API, not
of this plugin: many assign the id themselves and ignore the one sent. Read
the id back off the returned entity rather than assuming the one you set.

### Command to SDK operation

| Seneca command | SDK call | Notes |
| -------------- | -------- | ----- |
| `list$(q)` | `.list(q)` | Query keys are passed through as match fields. |
| `load$(q)` | `.load({ ...keys })` | Only the keys the route needs are sent. |
| `save$()` on an entity with no id | `.create(data)` | Data is the entity's own fields, without Seneca metadata. |
| `save$()` on an entity with an id | `.update(data)` | |
| `remove$(q)` | `.remove({ ...keys })` | Resolves to `null` whatever the API returns. |

Every SDK operation resolves to an SDK entity instance, or a list of them,
rather than raw data. The provider calls `.data()` on each and hands the
plain record to `entize`, so what comes back is an ordinary Seneca entity
under this plugin's canon, carrying none of the SDK's own markers.

### Query fields

Seneca query directives — any key ending in `$`, such as `sort$` or
`limit$` — are stripped before the query reaches the SDK. They are
instructions to a store, not match fields for the API, and are not
otherwise supported.

`action$` is the one this plugin reads. It is stripped from the match
fields like the rest, but it is read FIRST, and it selects a custom API
action instead of the plain command. See
[Actions](#actions) below.

### Actions

An action is an API route folded into an ordinary operation as an
alternative point — a verb that is not create, read, update or delete.
Select one with the `action$` directive; the rest of the call is that
action's own payload.

| Entity | Action | Route | Operation | Command |
| --- | --- | --- | --- | --- |
| `pull` | `merge` | `/repos/{owner}/{repo}/pulls/{pull_number}/merge` | `update` | `save$` |

On a read command (`list$`, `load$`, `remove$`) `action$` is a key of
the query. On `save$` it is a directive on the entity, set with
`directive$({ action$: '...' })` or assigned as a property —
`make$({ action$ })` does NOT work, because `seneca-entity`'s `make$`
drops any trailing-`$` key it does not know by name.

Routing is by the operation the action belongs to, not by the command:
`save$` covers both create and update, so an action folded into `create`
is called as a create even when the entity carries an id.

An action name the entity does not have throws, naming the entity, the
command and the valid actions. It never falls back to the plain command.


## Action patterns

### `sys:provider,provider:github,get:info`

Returns metadata about the plugin and SDK. Answered locally; makes no API
call.

```js
await seneca.post('sys:provider,provider:github,get:info')
```

```js
{
  ok: true,
  name: 'github',
  version: '0.0.1',
  sdk: {
    name: '@voxgig-sdk/github',
    version: '0.0.1',
  },
}
```

Both versions are read at runtime from the respective `package.json`, so
they describe what is installed rather than what was generated.

### Entity patterns

Registered by `@seneca/provider`. Normally reached through the entity API
rather than posted directly.

| Pattern |
| ------- |
| `sys:entity,zone:provider,base:github,name:pull,cmd:list` |
| `sys:entity,zone:provider,base:github,name:pull,cmd:load` |
| `sys:entity,zone:provider,base:github,name:pull,cmd:save` |
| `sys:entity,zone:provider,base:github,name:repo,cmd:list` |
| `sys:entity,zone:provider,base:github,name:repo,cmd:load` |
| `sys:entity,zone:provider,base:github,name:repo,cmd:save` |
| `sys:entity,zone:provider,base:github,name:repo,cmd:remove` |

### Inherited from `@seneca/provider`

| Pattern | Purpose |
| ------- | ------- |
| `sys:provider,get:key` | Fetch one named key for a provider. |
| `sys:provider,get:keymap` | Fetch all keys for a provider. |
| `sys:provider,list:provider` | List registered providers and their key names. |

## Plugin exports

### `GithubProvider/sdk`

A function returning the configured `GithubSDK` instance.

```js
const sdk = seneca.export('GithubProvider/sdk')()

// Every SDK operation resolves to an SDK entity (or a list of them),
// not raw data; `.data()` gives the plain record.
const repos = (await sdk.Repo().list()).map((e) => e.data())

// `direct` reaches endpoints outside the entity model.
const res = await sdk.direct({ path: '/user/repos', method: 'GET' })
```

Available only after `seneca.ready()`. Use it for SDK features the entity
API does not surface — notably `direct()` and `prepare()` for endpoints
the entity model does not cover.

## Errors

| Situation | Behaviour |
| --------- | --------- |
| `load$` for a non-existent id | Resolves to `null`. |
| `remove$` for a non-existent id | Resolves to `null`; not an error. |
| A nested entity command missing a parent key | Throws before any request is made. |
| A 404 from `list$` or `save$` | Thrown. Only single-record reads and removes map a 404 to `null`. |
| Any other non-2xx response | Thrown as raised by the SDK. |
| A request that never got a response | Thrown, with `status` `-1`. |

SDK errors are `GithubError` instances carrying
`isGithubError: true`, a `code` (e.g. `request_status`), the
HTTP `status` at the top level (`-1` when the request never got a
response), a `notFound` flag, and a `ctx` holding the request context and
its `result` — `status`, `statusText`, `headers` and `body`. The
`null`-on-missing behaviour is triggered by `err.notFound`, not by
inspecting the status at the call site.

```js
try {
  await seneca.entity('provider/github/repo').list$({ owner: '...' })
}
catch (err) {
  console.error(err.code, err.status, err.notFound)
}
```

The missing-parent-key guard is this plugin's own, thrown before the SDK is
called at all. Its message names the entity, the command and the key:

| Entity | Message |
| ------ | ------- |
| `pull` | `@seneca/github-provider: pull <cmd>: owner is required` |
| `pull` | `@seneca/github-provider: pull <cmd>: repo is required` |
| `repo` | `@seneca/github-provider: repo <cmd>: owner is required` |

where `<cmd>` is the command that was called. A key counts as missing if
it is absent, `null` or the empty string.

## Authentication keys

The plugin follows the provider convention: if an `apikey` key is
configured and non-empty, it is sent as `authorization: Bearer <apikey>`
on every request. If the provider is not registered, or the key is absent or
empty, no header is added and startup proceeds normally — an API that needs
no credential exercises the same path.

```js
  .use('provider', {
    provider: {
      github: {
        keys: {
          apikey: { value: '$GITHUB_APIKEY' },
        },
      },
    },
  })
```

The key is read once, during `seneca.prepare()`, by posting
`sys:provider,get:keymap,provider:github`. An `authorization`
header supplied through the `sdk.headers` option takes precedence over it.

## Environment variables

The plugin never reads the environment itself. These are the variables the
surrounding convention and tooling resolve:

| Variable | Read by | Purpose |
| -------- | ------- | ------- |
| `$GITHUB_APIKEY` | `@seneca/env` | Supplies the `apikey` value when the key is declared as `'$GITHUB_APIKEY'`, as above. |

## Package scripts

| Script | Action |
| ------ | ------ |
| `npm run build` | `tsc --build src test` — compiles to `dist` and `dist-test`. |
| `npm run watch` | The same, in watch mode. |
| `npm test` | Runs the `node:test` suite. |
| `npm run test-some` | Runs tests matching `$TEST_PATTERN`. |
| `npm run test-watch` | Test suite in watch mode. |
| `npm run test-coverage` | Test suite with Node's built-in coverage. |
| `npm run clean` | Removes `node_modules`, `dist`, `dist-test`, `.tsbuildinfo`, lockfiles. |
| `npm run reset` | `clean`, then install, build and test. |
| `npm run repo-tag` | Commits, tags and pushes `v<version>` taken from `package.json`. |
| `npm run repo-publish` | Clean install, then `repo-publish-quick`. |
| `npm run repo-publish-quick` | Build, test, tag, and publish to npm. |

### Repository layout

| Path | Contents |
| ---- | -------- |
| `src/` | TypeScript source, with its own `tsconfig.json`. |
| `test/` | Test suite (`.js`, run by `node:test`) and TypeScript fixtures. |
| `dist/` | Compiled source. Committed; published. |
| `dist-test/` | Compiled test fixtures. Committed; **not** published. |
| `.tsbuildinfo/` | Incremental build cache. Not committed. |
| `doc/` | This documentation. |

This repository is generated by
[@voxgig/sdkgen](https://github.com/voxgig/sdkgen) from the GitHub v3 REST
API definition. Anything edited here is overwritten by the next generation
run; changes belong in the model.
