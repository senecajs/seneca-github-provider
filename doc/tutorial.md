# Tutorial: your first Github query

This tutorial takes you from an empty folder to a script that
reads and writes GitHub v3 REST data through
Seneca entities. It should take about fifteen minutes.

You will build one script and add to it as you go. Everything runs in
memory: the SDK ships an offline mode backed by a small in-memory
store, and you supply that store's contents yourself. No request leaves
your machine, so nothing here can affect anything outside it.

You need [Node.js](https://nodejs.org) 24 or later. You do not need a
server, a network connection, or credentials.

## Step 1: Create the project

```sh
$ mkdir github-demo
$ cd github-demo
$ npm init -y
$ npm install seneca seneca-entity seneca-promisify @seneca/provider @seneca/github-provider
```

The first four are the Seneca host: the framework itself, the entity
API, the promise wrapper that makes calls awaitable, and the shared
machinery every Seneca provider is built on. The last is this plugin,
which brings the GitHub v3 REST SDK with it.

## Step 2: Connect

Create `demo.js`:

```js
const Seneca = require('seneca')

// The offline store. Each key under an entity name is that record's
// id, and each record is what the API would have answered with.
const SEED = {
  entity: {
    pull: {
      pull0: {"additions":100,"assignee":{},"author_association":"author_association0","auto_merge":{},"base":{},"body":"body0","changed_files":100,"closed_at":"closed_at0","comments":100,"comments_url":"comments_url0","commits":100,"commits_url":"commits_url0","created_at":"created_at0","deletions":100,"diff_url":"diff_url0","head":{},"html_url":"html_url0","id":"pull0","issue_url":"issue_url0","labels":[],"links":{},"locked":false,"maintainer_can_modify":false,"merge_commit_sha":"merge_commit_sha0","mergeable":false,"mergeable_state":"mergeable_state0","merged":false,"merged_at":"merged_at0","merged_by":{},"message":"message0","milestone":{},"node_id":"node_id0","number":100,"patch_url":"patch_url0","review_comment_url":"review_comment_url0","review_comments":100,"review_comments_url":"review_comments_url0","sha":"sha0","stack":{},"state":"state0","statuses_url":"statuses_url0","title":"title0","updated_at":"updated_at0","url":"url0","user":{},"owner":"owner0","repo":"repo0"},
      pull1: {"additions":200,"assignee":{},"author_association":"author_association1","auto_merge":{},"base":{},"body":"body1","changed_files":200,"closed_at":"closed_at1","comments":200,"comments_url":"comments_url1","commits":200,"commits_url":"commits_url1","created_at":"created_at1","deletions":200,"diff_url":"diff_url1","head":{},"html_url":"html_url1","id":"pull1","issue_url":"issue_url1","labels":[],"links":{},"locked":false,"maintainer_can_modify":false,"merge_commit_sha":"merge_commit_sha1","mergeable":false,"mergeable_state":"mergeable_state1","merged":false,"merged_at":"merged_at1","merged_by":{},"message":"message1","milestone":{},"node_id":"node_id1","number":200,"patch_url":"patch_url1","review_comment_url":"review_comment_url1","review_comments":200,"review_comments_url":"review_comments_url1","sha":"sha1","stack":{},"state":"state1","statuses_url":"statuses_url1","title":"title1","updated_at":"updated_at1","url":"url1","user":{},"owner":"owner0","repo":"repo0"},
    },
    repo: {
      repo0: {"archive_url":"archive_url0","archived":false,"assignees_url":"assignees_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","clone_url":"clone_url0","code_of_conduct":{},"collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","created_at":"created_at0","default_branch":"default_branch0","deployments_url":"deployments_url0","description":"description0","disabled":false,"downloads_url":"downloads_url0","events_url":"events_url0","fork":false,"forks":100,"forks_count":100,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","git_url":"git_url0","has_discussions":false,"has_issues":false,"has_pages":false,"has_projects":false,"has_wiki":false,"homepage":"homepage0","hooks_url":"hooks_url0","html_url":"html_url0","id":"repo0","issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels_url":"labels_url0","language":"language0","languages_url":"languages_url0","license":{},"merges_url":"merges_url0","milestones_url":"milestones_url0","mirror_url":"mirror_url0","name":"name0","network_count":100,"node_id":"node_id0","notifications_url":"notifications_url0","open_issues":100,"open_issues_count":100,"organization":{},"owner":"owner0","parent":{},"permissions":{},"private":false,"pulls_url":"pulls_url0","pushed_at":"pushed_at0","releases_url":"releases_url0","size":100,"source":{},"ssh_url":"ssh_url0","stargazers_count":100,"stargazers_url":"stargazers_url0","statuses_url":"statuses_url0","subscribers_count":100,"subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","svn_url":"svn_url0","tags_url":"tags_url0","teams_url":"teams_url0","template_repository":{},"trees_url":"trees_url0","updated_at":"updated_at0","url":"url0","watchers":100,"watchers_count":100},
      repo1: {"archive_url":"archive_url1","archived":false,"assignees_url":"assignees_url1","blobs_url":"blobs_url1","branches_url":"branches_url1","clone_url":"clone_url1","code_of_conduct":{},"collaborators_url":"collaborators_url1","comments_url":"comments_url1","commits_url":"commits_url1","compare_url":"compare_url1","contents_url":"contents_url1","contributors_url":"contributors_url1","created_at":"created_at1","default_branch":"default_branch1","deployments_url":"deployments_url1","description":"description1","disabled":false,"downloads_url":"downloads_url1","events_url":"events_url1","fork":false,"forks":200,"forks_count":200,"forks_url":"forks_url1","full_name":"full_name1","git_commits_url":"git_commits_url1","git_refs_url":"git_refs_url1","git_tags_url":"git_tags_url1","git_url":"git_url1","has_discussions":false,"has_issues":false,"has_pages":false,"has_projects":false,"has_wiki":false,"homepage":"homepage1","hooks_url":"hooks_url1","html_url":"html_url1","id":"repo1","issue_comment_url":"issue_comment_url1","issue_events_url":"issue_events_url1","issues_url":"issues_url1","keys_url":"keys_url1","labels_url":"labels_url1","language":"language1","languages_url":"languages_url1","license":{},"merges_url":"merges_url1","milestones_url":"milestones_url1","mirror_url":"mirror_url1","name":"name1","network_count":200,"node_id":"node_id1","notifications_url":"notifications_url1","open_issues":200,"open_issues_count":200,"organization":{},"owner":"owner0","parent":{},"permissions":{},"private":false,"pulls_url":"pulls_url1","pushed_at":"pushed_at1","releases_url":"releases_url1","size":200,"source":{},"ssh_url":"ssh_url1","stargazers_count":200,"stargazers_url":"stargazers_url1","statuses_url":"statuses_url1","subscribers_count":200,"subscribers_url":"subscribers_url1","subscription_url":"subscription_url1","svn_url":"svn_url1","tags_url":"tags_url1","teams_url":"teams_url1","template_repository":{},"trees_url":"trees_url1","updated_at":"updated_at1","url":"url1","watchers":200,"watchers_count":200},
    },
  },
}

async function main() {
  const seneca = await Seneca({ legacy: false })
    .use('promisify')
    .use('entity')
    .use('provider', {
      provider: {
        github: {
          keys: {
            apikey: { value: '' },
          },
        },
      },
    })
    .use('@seneca/github-provider', {
      test: true,
      testopts: SEED,
    })
    .ready()

  const info = await seneca.post('sys:provider,provider:github,get:info')
  console.log(info)
}

main()
```

Run it:

```sh
$ node demo.js
```

You should see:

```js
{
  ok: true,
  name: 'github',
  version: '0.0.1',
  sdk: { name: '@voxgig-sdk/github', version: '0.0.1' },
}
```

Two details of that configuration are worth a moment. The `apikey` is
declared even though nothing here asks for credentials — an empty
value simply means no `authorization` header is sent. Every Seneca
provider is configured the same way, so an application that later moves
to an authenticated service changes one value rather than its shape.
And `get:info` is answered by the plugin itself, without calling the
API, so a reply tells you the plugin loaded and initialised before any
request goes anywhere.

## Step 3: List the repo records

Repo records live inside a parent record in the API,
and the route says so:

`/user/repos`

The parent id there is not optional, so every repo call
carries `owner` in its query. Leave it out and the provider
names the key you missed, rather than letting a half-built URL come
back as a puzzling 404.

Replace the `console.log(info)` line with:

```js
  const repos = await seneca
    .entity('provider/github/repo')
    .list$({ owner: '0' })

  console.log('Found ' + repos.length + ' repo record(s):')
  repos.forEach((r) => {
    console.log('  ' + r.id + '  ' + r.archive_url + '  ' + r.archived)
  })
```

Run it again and you will see the two repo
records you seeded, under the ids they are filed by.

No URL, no HTTP verb, no JSON parsing. You asked a Seneca entity for
a list, the provider turned that into an SDK call, and the SDK turned
it into a request. These are ordinary Seneca entities, so everything
you already know about the entity API applies to them.

## Step 4: Load one repo

Add:

```js
  const one = await seneca
    .entity('provider/github/repo')
    .load$({ owner: '0', id: 'repo0' })

  console.log('loaded', one.id, one.archive_url)
```

`list$` gives you many, `load$` gives you one. Now ask for
something that is not there:

```js
  const missing = await seneca
    .entity('provider/github/repo')
    .load$({ owner: '0', id: 'nosuchrepo' })

  console.log('missing =', missing)   // null
```

You get `null`, not an exception. "There is no such
repo" is an ordinary answer to a lookup, so it does not
interrupt your code.

## Step 5: Create, change and remove

Everything so far has been reading. This entity accepts writes too,
so add:

```js
  // Create: make$ builds an entity, save$ persists it.
  let repo = await seneca
    .entity('provider/github/repo')
    .make$({ owner: '0', archive_url: 'tutorial-archive_url', archived: false, assignees_url: 'tutorial-assignees_url', blobs_url: 'tutorial-blobs_url', branches_url: 'tutorial-branches_url', clone_url: 'tutorial-clone_url', code_of_conduct: 'tutorial-code_of_conduct', collaborators_url: 'tutorial-collaborators_url', comments_url: 'tutorial-comments_url', commits_url: 'tutorial-commits_url', compare_url: 'tutorial-compare_url', contents_url: 'tutorial-contents_url', contributors_url: 'tutorial-contributors_url', created_at: 'tutorial-created_at', default_branch: 'tutorial-default_branch', deployments_url: 'tutorial-deployments_url', description: 'tutorial-description', disabled: false, downloads_url: 'tutorial-downloads_url', events_url: 'tutorial-events_url', fork: false, forks: 1234, forks_count: 1234, forks_url: 'tutorial-forks_url', full_name: 'tutorial-full_name', git_commits_url: 'tutorial-git_commits_url', git_refs_url: 'tutorial-git_refs_url', git_tags_url: 'tutorial-git_tags_url', git_url: 'tutorial-git_url', has_discussions: false, has_issues: false, has_pages: false, has_projects: false, has_wiki: false, homepage: 'tutorial-homepage', hooks_url: 'tutorial-hooks_url', html_url: 'tutorial-html_url', issue_comment_url: 'tutorial-issue_comment_url', issue_events_url: 'tutorial-issue_events_url', issues_url: 'tutorial-issues_url', keys_url: 'tutorial-keys_url', labels_url: 'tutorial-labels_url', language: 'tutorial-language', languages_url: 'tutorial-languages_url', license: 'tutorial-license', merges_url: 'tutorial-merges_url', milestones_url: 'tutorial-milestones_url', mirror_url: 'tutorial-mirror_url', name: 'tutorial-name', network_count: 1234, node_id: 'tutorial-node_id', notifications_url: 'tutorial-notifications_url', open_issues: 1234, open_issues_count: 1234, organization: 'tutorial-organization', parent: 'tutorial-parent', permissions: 'tutorial-permissions', private: false, pulls_url: 'tutorial-pulls_url', pushed_at: 'tutorial-pushed_at', releases_url: 'tutorial-releases_url', size: 1234, source: 'tutorial-source', ssh_url: 'tutorial-ssh_url', stargazers_count: 1234, stargazers_url: 'tutorial-stargazers_url', statuses_url: 'tutorial-statuses_url', subscribers_count: 1234, subscribers_url: 'tutorial-subscribers_url', subscription_url: 'tutorial-subscription_url', svn_url: 'tutorial-svn_url', tags_url: 'tutorial-tags_url', teams_url: 'tutorial-teams_url', template_repository: 'tutorial-template_repository', trees_url: 'tutorial-trees_url', updated_at: 'tutorial-updated_at', url: 'tutorial-url', watchers: 1234, watchers_count: 1234 })
    .save$()

  console.log('created with id', repo.id)
```

Run it, and note the id printed. It is **not** one you chose — the
store assigns ids itself and ignores any you send. That is worth
knowing before you write code that assumes otherwise.

Now change it. An entity that already carries an id is an update
rather than a create, and `save$` decides between the two on exactly
that:

```js
  repo.archive_url = 'tutorial-archive_url-2'
  repo = await repo.save$()

  console.log('updated:', repo.archive_url)
```

And remove it, leaving the store as you found it:

```js
  await seneca
    .entity('provider/github/repo')
    .remove$({ owner: '0', id: repo.id })
```

Load it once more and, as before, you get `null`:

```js
  console.log(
    'after remove:',
    await seneca
      .entity('provider/github/repo')
      .load$({ owner: '0', id: repo.id })
  )   // null
```

Those are the only methods there are:

`list$`, `load$`, `save$`, `remove$`

They behave the same way on every entity this plugin exposes.

## Step 6: Reach the pull records

Pull records live inside their parent, and the API route
says so:

`/repos/{owner}/{repo}/pulls`

The parent id in that path is not optional, so every pull
call needs a `owner` in its query:

```js
  const pulls = await seneca
    .entity('provider/github/pull')
    .list$({ owner: '0', repo: 'repo0' })

  console.log('found ' + pulls.length + ' pull record(s)')
```

Leave the `owner` out and the call throws at once, naming the key it
needed, rather than letting a half-built URL come back as a puzzling
404:

```js
  // throws: @seneca/github-provider: pull list: owner is required
  await seneca
    .entity('provider/github/pull')
    .list$()
```

## Talking to a real server

The script you have just written never touched the network. To point it
at a running GitHub v3 REST server instead, replace the `test` and
`testopts` options with that server's base URL:

```js
    .use('@seneca/github-provider', {
      sdk: { base: 'https://api.example.com' },
    })
```

Nothing else in the script changes — the entity calls are the same
calls. Your seeded ids will not exist there, so read the ids you need
from a `list$` first.

## What you have learned

You built a script that reads and writes
GitHub v3 REST data through Seneca entities,
with no server involved. Along
the way you saw:

- Provider configuration has the same shape even when no credentials
  are needed.
- API resources are Seneca entities under `provider/github/`,
  reached with the entity API you already know.
- A resource nested under another in the API needs its parent's id in
  every query, and says which key is missing when you forget.
- `load$` answers `null` for something that is not there, rather
  than throwing.
- `save$` creates without an id and updates with one, and the
  store chooses the id.
- The offline store makes all of this runnable with nothing installed
  but npm packages, which is also how you test your own code.

## Where to go next

- To do a specific job — point at a real server, reach the raw SDK,
  test your own code — see the [how-to guides](how-to.md).
- To look up an exact pattern, field or option, see the
  [reference](reference.md).
- To understand why the plugin is built this way — why entities rather
  than one message per route, and what it does with the SDK's answers
  — see the [explanation](explanation.md).
- For what each of these documents is for, see the
  [documentation index](README.md).
