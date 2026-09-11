# How-to guides

Each guide here solves one problem, and assumes you already have a
working Seneca instance with this plugin loaded. If you do not, work
through the [tutorial](tutorial.md) first.

These guides show what to do and leave out the reasoning — that is in the
[explanation](explanation.md), and the exact patterns, fields and options
are listed in the [reference](reference.md).

- [List the records of an entity](#list-the-records-of-an-entity)
- [Read one record by id](#read-one-record-by-id)
- [Create a record](#create-a-record)
- [Update a record](#update-a-record)
- [Remove a record](#remove-a-record)
- [Work with nested entities](#work-with-nested-entities)
- [Run offline, without a server](#run-offline-without-a-server)
- [Point at a different server](#point-at-a-different-server)
- [Send an API key](#send-an-api-key)
- [Check which plugin and SDK are running](#check-which-plugin-and-sdk-are-running)
- [Reach the SDK directly](#reach-the-sdk-directly)
- [Develop against a local SDK checkout](#develop-against-a-local-sdk-checkout)
- [Run the test suite](#run-the-test-suite)
- [Build and release](#build-and-release)

## List the records of an entity

Every resource this plugin covers is a Seneca entity under
`provider/github/`, so listing one is `list$`:

```js
const repos = await seneca
  .entity('provider/github/repo')
  .list$({ owner: '0' })
```

You get an ordinary array of Seneca entities back, so `length`, `map`
and `data$()` behave exactly as they do for any other store.

Fields in the query travel to the API as match criteria. Seneca's own
directives — `sort$`, `limit$` and the rest — are stripped before the
call, because they are features of a database store and not of an HTTP
API. If you need ordering or paging, ask the API for it using fields it
recognises, or sort the returned array yourself.

An entity nested under a parent in the API path cannot be listed without
the parent's id; see [Work with nested entities](#work-with-nested-entities).

## Read one record by id

`load$` answers a single record:

```js
const repo = await seneca
  .entity('provider/github/repo')
  .load$({ owner: '0', id: 'repo0' })
```

A record that is not there comes back as `null`. It is not an error and
it does not throw, so test the value rather than wrapping the call:

```js
const missing = await seneca
  .entity('provider/github/repo')
  .load$({ owner: '0', id: 'nosuch' })

if (null == missing) {
  // no such repo
}
```

Everything else that can go wrong — a network failure, a 5xx, a rejected
key — does throw, so an unhandled rejection still means something is
genuinely wrong.

## Create a record

`make$` builds an entity and `save$` writes it. An entity with no id
is a create:

```js
const repo = await seneca
  .entity('provider/github/repo')
  .make$({ archive_url: 'archive_url0', archived: false, assignees_url: 'assignees_url0', blobs_url: 'blobs_url0', branches_url: 'branches_url0', clone_url: 'clone_url0', code_of_conduct: [object Object], collaborators_url: 'collaborators_url0', comments_url: 'comments_url0', commits_url: 'commits_url0', compare_url: 'compare_url0', contents_url: 'contents_url0', contributors_url: 'contributors_url0', created_at: 'created_at0', default_branch: 'default_branch0', deployments_url: 'deployments_url0', description: 'description0', disabled: false, downloads_url: 'downloads_url0', events_url: 'events_url0', fork: false, forks: 100, forks_count: 100, forks_url: 'forks_url0', full_name: 'full_name0', git_commits_url: 'git_commits_url0', git_refs_url: 'git_refs_url0', git_tags_url: 'git_tags_url0', git_url: 'git_url0', has_discussions: false, has_issues: false, has_pages: false, has_projects: false, has_wiki: false, homepage: 'homepage0', hooks_url: 'hooks_url0', html_url: 'html_url0', issue_comment_url: 'issue_comment_url0', issue_events_url: 'issue_events_url0', issues_url: 'issues_url0', keys_url: 'keys_url0', labels_url: 'labels_url0', language: 'language0', languages_url: 'languages_url0', license: [object Object], merges_url: 'merges_url0', milestones_url: 'milestones_url0', mirror_url: 'mirror_url0', name: 'name0', network_count: 100, node_id: 'node_id0', notifications_url: 'notifications_url0', open_issues: 100, open_issues_count: 100, organization: [object Object], owner: 'owner0', parent: [object Object], permissions: [object Object], private: false, pulls_url: 'pulls_url0', pushed_at: 'pushed_at0', releases_url: 'releases_url0', size: 100, source: [object Object], ssh_url: 'ssh_url0', stargazers_count: 100, stargazers_url: 'stargazers_url0', statuses_url: 'statuses_url0', subscribers_count: 100, subscribers_url: 'subscribers_url0', subscription_url: 'subscription_url0', svn_url: 'svn_url0', tags_url: 'tags_url0', teams_url: 'teams_url0', template_repository: [object Object], trees_url: 'trees_url0', updated_at: 'updated_at0', url: 'url0', watchers: 100, watchers_count: 100 })
  .save$()

console.log(repo.id)
```

Note that `owner` travels in the DATA for a write,
not in a query: a `repo` is created inside its parent.

`save$` resolves to the record as the API returned it, which is the only
reliable source of the id. Read it from there rather than predicting it:
what an API does with an id you supply on create is its own business, and
several ignore it entirely.

## Update a record

The same call updates. `save$` dispatches on the id: an entity carrying
one is an update, an entity without one is a create. So the safe shape is
load, change, save:

```js
const repo = await seneca
  .entity('provider/github/repo')
  .load$({ owner: '0', id: 'repo0' })

repo.archive_url = 'archive_url-changed'

await repo.save$()
```

Mutating the record you loaded sends it as it stood plus your change, so
you do not depend on how the API treats a request that omits fields —
some merge, some replace.

## Remove a record

```js
await seneca
  .entity('provider/github/repo')
  .remove$({ owner: '0', id: 'repo0' })
```

As with a read, the parent keys are part of naming the record, so they go
in the query object alongside the id.

A `load$` of the same id afterwards answers `null`.

## Work with nested entities

Some resources live inside a parent, and the API path says so — the
route for `issue` is:

```
/repos/{owner}/{repo}/issues/{issue_number}/comments
```

So a `issue` cannot be addressed at all without its parent's id, and
the provider requires those keys on every command.

- `issue` requires `owner`, `repo`
- `pull` requires `owner`, `repo`
- `pull_request_review` requires `owner`, `pull_number`, `repo`
- `pull_request_simple` requires `owner`, `repo`
- `repo` requires `owner`

For reads the keys go in the query; for writes they go in the data:

```js
await seneca.entity('provider/github/issue').list$({ owner: '0', repo: 'repo0' })

await seneca.entity('provider/github/issue')
  .load$({ owner: '0', repo: 'repo0', id: 'issue0' })

await seneca.entity('provider/github/issue')
  .make$({ assignee: [object Object], closed_at: 'closed_at0', closed_by: [object Object], comments: 100, comments_url: 'comments_url0', created_at: 'created_at0', events_url: 'events_url0', html_url: 'html_url0', issue_dependencies_summary: [object Object], issue_url: 'issue_url0', labels: , labels_url: 'labels_url0', locked: false, milestone: [object Object], minimized: [object Object], node_id: 'node_id0', number: 100, performed_via_github_app: [object Object], pin: [object Object], pinned_comment: [object Object], pull_request: [object Object], reactions: [object Object], repository: [object Object], repository_url: 'repository_url0', state: 'state0', sub_issues_summary: [object Object], title: 'title0', type: [object Object], updated_at: 'updated_at0', url: 'url0', user: [object Object], owner: 'owner0', repo: 'repo0' })
  .save$()

await seneca.entity('provider/github/issue')
  .remove$({ owner: '0', repo: 'repo0', id: 'issue0' })
```

Leave a key out and the call throws at once, naming what is missing:

```
@seneca/github-provider: issue list: owner is required
```

That is deliberate: without it the SDK would build half a URL and the
server would answer 404, which is a much harder message to act on. The
[explanation](explanation.md) covers why this is a guard rather than a
silent default.

## Run offline, without a server

The SDK ships an in-memory mock transport. Turn it on with `test` and
seed it with `testopts`:

```js
.use('@seneca/github-provider', {
  test: true,
  testopts: {
    entity: {
      issue: {
        issue0: { assignee: [object Object], closed_at: 'closed_at0', closed_by: [object Object], comments: 100, comments_url: 'comments_url0', created_at: 'created_at0', events_url: 'events_url0', html_url: 'html_url0', id: 'issue0', issue_dependencies_summary: [object Object], issue_url: 'issue_url0', labels: , labels_url: 'labels_url0', locked: false, milestone: [object Object], minimized: [object Object], node_id: 'node_id0', number: 100, performed_via_github_app: [object Object], pin: [object Object], pinned_comment: [object Object], pull_request: [object Object], reactions: [object Object], repository: [object Object], repository_url: 'repository_url0', state: 'state0', sub_issues_summary: [object Object], title: 'title0', type: [object Object], updated_at: 'updated_at0', url: 'url0', user: [object Object], owner: 'owner0', repo: 'repo0' },
        issue1: { assignee: [object Object], closed_at: 'closed_at1', closed_by: [object Object], comments: 200, comments_url: 'comments_url1', created_at: 'created_at1', events_url: 'events_url1', html_url: 'html_url1', id: 'issue1', issue_dependencies_summary: [object Object], issue_url: 'issue_url1', labels: , labels_url: 'labels_url1', locked: false, milestone: [object Object], minimized: [object Object], node_id: 'node_id1', number: 200, performed_via_github_app: [object Object], pin: [object Object], pinned_comment: [object Object], pull_request: [object Object], reactions: [object Object], repository: [object Object], repository_url: 'repository_url1', state: 'state1', sub_issues_summary: [object Object], title: 'title1', type: [object Object], updated_at: 'updated_at1', url: 'url1', user: [object Object], owner: 'owner0', repo: 'repo0' },
      },
      repo: {
        repo0: { archive_url: 'archive_url0', archived: false, assignees_url: 'assignees_url0', blobs_url: 'blobs_url0', branches_url: 'branches_url0', clone_url: 'clone_url0', code_of_conduct: [object Object], collaborators_url: 'collaborators_url0', comments_url: 'comments_url0', commits_url: 'commits_url0', compare_url: 'compare_url0', contents_url: 'contents_url0', contributors_url: 'contributors_url0', created_at: 'created_at0', default_branch: 'default_branch0', deployments_url: 'deployments_url0', description: 'description0', disabled: false, downloads_url: 'downloads_url0', events_url: 'events_url0', fork: false, forks: 100, forks_count: 100, forks_url: 'forks_url0', full_name: 'full_name0', git_commits_url: 'git_commits_url0', git_refs_url: 'git_refs_url0', git_tags_url: 'git_tags_url0', git_url: 'git_url0', has_discussions: false, has_issues: false, has_pages: false, has_projects: false, has_wiki: false, homepage: 'homepage0', hooks_url: 'hooks_url0', html_url: 'html_url0', id: 'repo0', issue_comment_url: 'issue_comment_url0', issue_events_url: 'issue_events_url0', issues_url: 'issues_url0', keys_url: 'keys_url0', labels_url: 'labels_url0', language: 'language0', languages_url: 'languages_url0', license: [object Object], merges_url: 'merges_url0', milestones_url: 'milestones_url0', mirror_url: 'mirror_url0', name: 'name0', network_count: 100, node_id: 'node_id0', notifications_url: 'notifications_url0', open_issues: 100, open_issues_count: 100, organization: [object Object], owner: 'owner0', parent: [object Object], permissions: [object Object], private: false, pulls_url: 'pulls_url0', pushed_at: 'pushed_at0', releases_url: 'releases_url0', size: 100, source: [object Object], ssh_url: 'ssh_url0', stargazers_count: 100, stargazers_url: 'stargazers_url0', statuses_url: 'statuses_url0', subscribers_count: 100, subscribers_url: 'subscribers_url0', subscription_url: 'subscription_url0', svn_url: 'svn_url0', tags_url: 'tags_url0', teams_url: 'teams_url0', template_repository: [object Object], trees_url: 'trees_url0', updated_at: 'updated_at0', url: 'url0', watchers: 100, watchers_count: 100 },
        repo1: { archive_url: 'archive_url1', archived: false, assignees_url: 'assignees_url1', blobs_url: 'blobs_url1', branches_url: 'branches_url1', clone_url: 'clone_url1', code_of_conduct: [object Object], collaborators_url: 'collaborators_url1', comments_url: 'comments_url1', commits_url: 'commits_url1', compare_url: 'compare_url1', contents_url: 'contents_url1', contributors_url: 'contributors_url1', created_at: 'created_at1', default_branch: 'default_branch1', deployments_url: 'deployments_url1', description: 'description1', disabled: false, downloads_url: 'downloads_url1', events_url: 'events_url1', fork: false, forks: 200, forks_count: 200, forks_url: 'forks_url1', full_name: 'full_name1', git_commits_url: 'git_commits_url1', git_refs_url: 'git_refs_url1', git_tags_url: 'git_tags_url1', git_url: 'git_url1', has_discussions: false, has_issues: false, has_pages: false, has_projects: false, has_wiki: false, homepage: 'homepage1', hooks_url: 'hooks_url1', html_url: 'html_url1', id: 'repo1', issue_comment_url: 'issue_comment_url1', issue_events_url: 'issue_events_url1', issues_url: 'issues_url1', keys_url: 'keys_url1', labels_url: 'labels_url1', language: 'language1', languages_url: 'languages_url1', license: [object Object], merges_url: 'merges_url1', milestones_url: 'milestones_url1', mirror_url: 'mirror_url1', name: 'name1', network_count: 200, node_id: 'node_id1', notifications_url: 'notifications_url1', open_issues: 200, open_issues_count: 200, organization: [object Object], owner: 'owner0', parent: [object Object], permissions: [object Object], private: false, pulls_url: 'pulls_url1', pushed_at: 'pushed_at1', releases_url: 'releases_url1', size: 200, source: [object Object], ssh_url: 'ssh_url1', stargazers_count: 200, stargazers_url: 'stargazers_url1', statuses_url: 'statuses_url1', subscribers_count: 200, subscribers_url: 'subscribers_url1', subscription_url: 'subscription_url1', svn_url: 'svn_url1', tags_url: 'tags_url1', teams_url: 'teams_url1', template_repository: [object Object], trees_url: 'trees_url1', updated_at: 'updated_at1', url: 'url1', watchers: 200, watchers_count: 200 },
      },
    },
  },
})
```

Records are keyed by id under their entity name, and the id inside the
record has to match the key it is filed under. Every command then works
offline, not-found included: an id you did not seed answers `null`,
exactly as it would against a real server.

This is how this plugin's own suite runs, and it is the recommended way
to test application code that uses the provider: no server, no network,
and the same code path as production. See `test/seed.js`, which seeds
every entity this way.

## Point at a different server

The `sdk` option is passed straight to the `GithubSDK`
constructor, so `base` chooses the host:

```js
.use('@seneca/github-provider', {
  sdk: { base: 'https://github.example.com' },
})
```

The API definition declares no server, so there is no default worth
relying on: set `base` explicitly, or run against the mock instead (see
[Run offline, without a server](#run-offline-without-a-server)).

## Send an API key

Credentials are not a plugin option: they come through the provider
convention, so that every provider in an application is configured the
same way. Declare the variable with `env` and set the key under this
provider's name:

```js
  .use('env', {
    var: { $GITHUB_APIKEY: String },
  })
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

Every request then carries `authorization: Bearer <apikey>`. An absent
or empty key adds no header at all, so an API that needs no credentials
is configured in exactly the same shape with an empty value — which is
why it is worth writing even when there is nothing to send. An
application that later moves to an authenticated service then changes one
value rather than its structure.

For a different scheme, set the header yourself. Headers supplied through
`sdk` win over the one the key would have set:

```js
.use('@seneca/github-provider', {
  sdk: { headers: { 'x-api-key': process.env.GITHUB_APIKEY } },
})
```

## Check which plugin and SDK are running

One message, and the thing to reach for when a deployment is behaving
unexpectedly:

```js
const info = await seneca.post(
  'sys:provider,provider:github,get:info')
```

```js
{
  ok: true,
  name: 'github',
  version: '0.0.1',
  sdk: { name: '@voxgig-sdk/github', version: '0.0.1' },
}
```

`version` is this plugin's; `sdk.version` is the SDK it is running
against. That pair is what to quote in a bug report, because the two are
released separately and most surprises live in the gap between them.

## Reach the SDK directly

The entity API covers the operations the API model declares. For
anything else — an endpoint with no entity behind it, a response header
you need to read — take the configured SDK client out of the plugin's
exports:

```js
const sdk = seneca.export('GithubProvider/sdk')()
```

The export is a function, so call it, and it only answers after
`seneca.ready()` — that is when the plugin builds the client with the
resolved key.

SDK operations resolve to SDK ENTITY instances rather than plain data, so
read the record out with `.data()`. The provider does this for you; here
you do it yourself:

```js
const repos = (await sdk.Repo().list({ owner: '0' }))
  .map((r) => r.data())

const one = (await sdk.Repo().load({ owner: '0', id: 'repo0' })).data()
```

For a route the entity model does not cover at all, `direct` sends a
request and hands back the raw response:

```js
const res = await sdk.direct({
  path: '/user/repos',
  method: 'GET',
})

if (res instanceof Error) throw res
if (!res.ok) throw (res.err || new Error('status ' + res.status))

console.log(res.data)
```

`prepare()` builds the same request without sending it, which is the
quickest way to see what the SDK would actually do — url, method, headers
and body, before anything leaves the process.

Raw data becomes a Seneca entity again through `data$`:

```js
const ent = seneca.entity('provider/github/repo').data$(res.data)
```

## Develop against a local SDK checkout

The SDK is an ordinary published dependency, so normal use needs nothing
special:

```sh
$ npm install
```

If you are changing the SDK and this plugin together, point npm at a
local checkout instead. Clone the SDK beside this repository, at the path
this project expects, and build it — it does not commit its build output:

```sh
$ git clone https://github.com/voxgig-sdk/github-sdk.git \
    ../../voxgig-sdk/github-sdk
$ cd ../../voxgig-sdk/github-sdk/ts
$ npm install && npm run build
```

Then link it in, without committing the change to `package.json`:

```sh
$ npm install --no-save ../../voxgig-sdk/github-sdk/ts
```

npm creates a symlink, so a rebuild of the SDK is picked up here with no
reinstall:

```sh
$ ls -l node_modules/@voxgig-sdk/github
```

To go back to the published SDK:

```sh
$ rm -rf node_modules/@voxgig-sdk/github package-lock.json && npm install
```

Removing the lockfile matters. npm will happily keep resolving to the
link if the lockfile still records it and the local version satisfies the
range.

## Run the test suite

```sh
$ npm run build
$ npm test
```

The build comes first: the suite runs against `dist`, so an unbuilt
change is not the change you are testing.

The offline tests use the SDK mock and always run.

Coverage, and a single test by name:

```sh
$ npm run test-coverage
$ TEST_PATTERN=repo-load npm run test-some
```

## Build and release

```sh
$ npm run build      # tsc --build src test
$ npm run watch      # the same, in watch mode
$ npm run reset      # clean, install, build, test
```

Releasing follows the Seneca convention, in one command — clean, install,
build, test, tag from `package.json`, publish:

```sh
$ npm run repo-publish
```

Only `dist`, the TypeScript sources and the licence file are published;
the test suite and its build output stay in the repository.

Before publishing, check that `package.json` still depends on the
published SDK by version range and not on a local path: a `file:`
dependency left behind from local development installs perfectly on your
own machine and cannot be resolved by anybody else.

One last thing: this repository is GENERATED from the GitHub v3 REST API
model by [@voxgig/sdkgen](https://github.com/voxgig/sdkgen). An edit made
here survives exactly as long as the next generation run. Change the
model, or the components that build this target, and regenerate.
