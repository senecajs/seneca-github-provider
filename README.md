![Seneca Github-Provider](http://senecajs.org/files/assets/seneca-logo.png)

> _Seneca Github-Provider_ is a plugin for [Seneca](http://senecajs.org)

Provides access to the GitHub v3 REST API using the Seneca _provider_
convention. GitHub v3 REST entities are represented as Seneca entities so that
they can be accessed using the Seneca entity API and messages.

Requests are handled by the [GitHub v3 REST SDK](https://github.com/voxgig-sdk/github-sdk),
which is generated from the API's OpenAPI specification. This plugin is
generated from the same specification by
[@voxgig/sdkgen](https://github.com/voxgig/sdkgen) — do not edit it by hand,
change the model and regenerate.

See [seneca-entity](https://github.com/senecajs/seneca-entity) and the [Seneca Data
Entities
Tutorial](https://senecajs.org/docs/tutorials/understanding-data-entities.html)
for more details on the Seneca entity API.

[![build](https://github.com/senecajs/seneca-github-provider/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-github-provider/actions/workflows/build.yml)

| This open source module is sponsored and supported by [Voxgig](https://voxgig.com). |
| --- |


<!--START:SECTION:intro-->
<!--END:SECTION:intro-->


## Documentation

Full documentation lives in [`doc/`](doc/README.md) and follows the
[Diátaxis](https://diataxis.fr) framework:

| Document | Purpose |
| -------- | ------- |
| [Tutorial](doc/tutorial.md) | Start here. Build a working script from an empty folder. |
| [How-to guides](doc/how-to.md) | Recipes for specific tasks. |
| [Reference](doc/reference.md) | Every pattern, entity, option and export. |
| [Explanation](doc/explanation.md) | Why the plugin is designed this way. |


## Quick Example

```js
const Seneca = require('seneca')

const seneca = Seneca()
  .use('promisify')
  .use('entity')
  .use('env', { var: { $GITHUB_APIKEY: '' } })
  .use('provider', {
    provider: {
      github: {
        keys: { apikey: { value: '$GITHUB_APIKEY' } },
      },
    },
  })
  .use('@seneca/github-provider')

await seneca.ready()

const repos = await seneca
  .entity('provider/github/repo').list$()
const repo = await seneca
  .entity('provider/github/repo').load$('some-id')
```


## Install

```sh
npm install @seneca/github-provider
```

This plugin expects the Seneca host framework to be present:

```sh
npm install seneca seneca-entity seneca-promisify @seneca/provider @seneca/env
```


## Options

| Option | Type | Description |
| --- | --- | --- |
| `sdk` | object | Passed straight to the `GithubSDK` constructor. Most usefully `base`, to point at a server. |
| `test` | boolean | Run the SDK in offline test mode (in-memory mock transport). |
| `testopts` | object | Seed and options for the mock, used only when `test` is true. |


## Entities

Each API entity is exposed as a Seneca entity under
`provider/github/<entity>`.

| Seneca entity | Commands | Fields |
| --- | --- | --- |
| `provider/github/issue` | `list$`, `load$`, `save$`, `remove$` | `assignee`, `closed_at`, `closed_by`, `comments`, `comments_url`, `created_at`, `events_url`, `html_url`, `id`, `issue_dependencies_summary`, `issue_url`, `labels`, `labels_url`, `locked`, `milestone`, `minimized`, `node_id`, `number`, `performed_via_github_app`, `pin`, `pinned_comment`, `pull_request`, `reactions`, `repository`, `repository_url`, `state`, `sub_issues_summary`, `title`, `type`, `updated_at`, `url`, `user`, `owner`, `repo` |
| `provider/github/pull` | `list$`, `load$`, `save$` | `additions`, `assignee`, `author_association`, `auto_merge`, `base`, `body`, `changed_files`, `closed_at`, `comments`, `comments_url`, `commits`, `commits_url`, `created_at`, `deletions`, `diff_url`, `head`, `html_url`, `id`, `issue_url`, `labels`, `links`, `locked`, `maintainer_can_modify`, `merge_commit_sha`, `mergeable`, `mergeable_state`, `merged`, `merged_at`, `merged_by`, `message`, `milestone`, `node_id`, `number`, `patch_url`, `review_comment_url`, `review_comments`, `review_comments_url`, `sha`, `stack`, `state`, `statuses_url`, `title`, `updated_at`, `url`, `user`, `owner`, `repo` |
| `provider/github/pull_request_review` | `list$`, `save$` | `author_association`, `body`, `commit_id`, `html_url`, `id`, `links`, `node_id`, `pull_request_url`, `state`, `teams`, `user`, `users`, `owner`, `pull_number`, `repo` |
| `provider/github/pull_request_simple` | `save$`, `remove$` | `owner`, `repo` |
| `provider/github/repo` | `list$`, `load$`, `save$`, `remove$` | `archive_url`, `archived`, `assignees_url`, `blobs_url`, `branches_url`, `clone_url`, `code_of_conduct`, `collaborators_url`, `comments_url`, `commits_url`, `compare_url`, `contents_url`, `contributors_url`, `created_at`, `default_branch`, `deployments_url`, `description`, `disabled`, `downloads_url`, `events_url`, `fork`, `forks`, `forks_count`, `forks_url`, `full_name`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `git_url`, `has_discussions`, `has_issues`, `has_pages`, `has_projects`, `has_wiki`, `homepage`, `hooks_url`, `html_url`, `id`, `issue_comment_url`, `issue_events_url`, `issues_url`, `keys_url`, `labels_url`, `language`, `languages_url`, `license`, `merges_url`, `milestones_url`, `mirror_url`, `name`, `network_count`, `node_id`, `notifications_url`, `open_issues`, `open_issues_count`, `organization`, `owner`, `parent`, `permissions`, `private`, `pulls_url`, `pushed_at`, `releases_url`, `size`, `source`, `ssh_url`, `stargazers_count`, `stargazers_url`, `statuses_url`, `subscribers_count`, `subscribers_url`, `subscription_url`, `svn_url`, `tags_url`, `teams_url`, `template_repository`, `trees_url`, `updated_at`, `url`, `watchers`, `watchers_count` |

### Nested entities

Some entities live under a parent in the API path, so every command needs the
parent's id in the query. Leaving it out throws with a message naming the
missing key, rather than failing as an opaque 404 from a half-built URL.

- `issue` requires `owner`, `repo`
- `pull` requires `owner`, `repo`
- `pull_request_review` requires `owner`, `pull_number`, `repo`
- `pull_request_simple` requires `owner`, `repo`
- `repo` requires `owner`

### Actions

Some API endpoints are not one of the five CRUD operations — merging a pull
request, uploading an image. The API definition folds each one into an
ordinary operation as an alternative route, and this plugin selects one with
the `action$` directive, alongside Seneca's own `sort$`, `limit$` and
`fields$`.

| Entity | Action | Route | Command |
| --- | --- | --- | --- |
| `issue` | `comment` | `/repos/{owner}/{repo}/issues/{issue_number}/comments` | `list$` |
| `issue` | `label` | `/repos/{owner}/{repo}/issues/{issue_number}/labels` | `list$` |
| `issue` | `assignee` | `/repos/{owner}/{repo}/issues/{issue_number}/assignees` | `remove$` |
| `issue` | `label` | `/repos/{owner}/{repo}/issues/{issue_number}/labels` | `remove$` |
| `issue` | `assignee` | `/repos/{owner}/{repo}/issues/{issue_number}/assignees` | `save$` |
| `issue` | `comment` | `/repos/{owner}/{repo}/issues/{issue_number}/comments` | `save$` |
| `issue` | `label` | `/repos/{owner}/{repo}/issues/{issue_number}/labels` | `save$` |
| `pull` | `merge` | `/repos/{owner}/{repo}/pulls/{pull_number}/merge` | `save$` |

An action returns that action's OWN response, which is not necessarily a
record of the entity it hangs off — check the API definition for its shape.
Naming an action the entity does not have throws, and names the ones it
does have. It never falls back to the plain command.

On `save$`, pass it as a directive. The rest of the entity is the
action's payload:

```js
const issue = seneca.entity('provider/github/issue')

await issue
  .make$({ id: 'some-id', /* ...the action's own arguments */ })
  .directive$({ action$: 'assignee' })
  .save$()
```

> **`make$({ action$: 'assignee' })` does not work**, and cannot.
> `seneca-entity`'s `make$` copies only keys without a `$`, plus the four
> directives it knows by name (`id$`, `merge$`, `custom$`, `directive$`),
> so any other trailing-`$` key is dropped before this plugin sees it —
> there is nothing left for it to refuse. Use `directive$` as above, or
> assign the property to an entity you already made:
>
> ```js
> const p = issue.make$({ id: 'some-id' })
> p.action$ = 'assignee'
> await p.save$()
> ```

On `list$`, pass it in the query:

```js
await seneca.entity('provider/github/issue')
  .list$({ action$: 'comment' })
```



## Action Patterns

Every message pattern this plugin registers. The entity actions are the ones
`seneca-entity` dispatches to when you call `list$` / `load$` / `save$` /
`remove$` on a canon below — you rarely post them by hand, but they are what
appears in a Seneca log, and a plugin that documents one of nine is a plugin
whose logs cannot be read.

| Pattern | Description |
| --- | --- |
| `sys:provider,provider:github,get:info` | Plugin and SDK version information. |
| `sys:entity,cmd:list,zone:provider,base:github,name:issue` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:issue` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:issue` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:issue` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:pull` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:pull` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:pull` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:pull_request_review` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:pull_request_review` | Create or update a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:pull_request_simple` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:pull_request_simple` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:repo` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:repo` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:repo` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:repo` | Remove a record. |



## More Examples

### Offline testing

The SDK ships an in-memory mock transport, so this plugin can be exercised
with no server:

```js
.use('@seneca/github-provider', { test: true, testopts: { entity: { ... } } })
```

`testopts` is passed straight to the SDK's test constructor; `entity`
seeds the mock store. See `test/seed.js` for the shape.


## Motivation

Applications rarely talk to one external service, and each service usually
arrives with its own client library, authentication style and error
conventions. That variety leaks into application code and makes it harder to
test.

The Seneca provider convention removes the variety: every external service
becomes a Seneca entity reached with `list$`, `load$`, `save$` and
`remove$`, so application code has one shape regardless of what it talks to.

The SDK underneath arrives at a similar conclusion from the other side — it
deliberately exposes entities rather than HTTP routes. This plugin is the
short bridge between the two.


## Support

- Issues and bugs: [GitHub issues](https://github.com/senecajs/seneca-github-provider/issues)
- Seneca community: [senecajs.org](http://senecajs.org)


## API

### Plugin export: `GithubProvider/sdk`

Returns the configured `GithubSDK` instance, for the operations
the entity API does not cover:

```js
const sdk = seneca.export('GithubProvider/sdk')()
```


## Contributing

This plugin is GENERATED. Changes belong in the SDK project's model and
components, not here — anything edited in this repository is overwritten by
the next generation run.

The [Senecajs org](http://senecajs.org) encourages open participation. If you
feel you can help in any way, be it with bug reporting, documentation,
examples, extra testing, or new features, please get in touch.


## Background

Generated by [@voxgig/sdkgen](https://github.com/voxgig/sdkgen) from the
GitHub v3 REST API definition, against the
[@voxgig-sdk/github](https://www.npmjs.com/package/@voxgig-sdk/github) SDK.
