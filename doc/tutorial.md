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
    base_gist: {
      base_gist0: {"gist_id":"gist0","id":"base_gist0"},
      base_gist1: {"gist_id":"gist0","id":"base_gist1"},
    },
    gist: {
      gist0: {"fork_of":{},"owner":{},"id":"gist0"},
      gist1: {"fork_of":{},"owner":{},"id":"gist1"},
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
  version: '0.3.4',
  sdk: { name: '@voxgig-sdk/github-sdk', version: '0.0.3' },
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

## Step 3: List the gist records

Replace the `console.log(info)` line with:

```js
  const gists = await seneca
    .entity('provider/github/gist')
    .list$()

  console.log('Found ' + gists.length + ' gist record(s):')
  gists.forEach((r) => {
    console.log('  ' + r.id + '  ' + r.fork_of + '  ' + r.owner)
  })
```

Run it again and you will see the two gist
records you seeded, under the ids they are filed by.

No URL, no HTTP verb, no JSON parsing. You asked a Seneca entity for
a list, the provider turned that into an SDK call, and the SDK turned
it into a request. These are ordinary Seneca entities, so everything
you already know about the entity API applies to them.

## Step 4: Load one gist

Add:

```js
  const one = await seneca
    .entity('provider/github/gist')
    .load$('gist0')

  console.log('loaded', one.id, one.fork_of)
```

`list$` gives you many, `load$` gives you one. Now ask for
something that is not there:

```js
  const missing = await seneca
    .entity('provider/github/gist')
    .load$('nosuchgist')

  console.log('missing =', missing)   // null
```

You get `null`, not an exception. "There is no such
gist" is an ordinary answer to a lookup, so it does not
interrupt your code.

## Step 5: Create, change and remove

Everything so far has been reading. This entity accepts writes too,
so add:

```js
  // Create: make$ builds an entity, save$ persists it.
  let gist = await seneca
    .entity('provider/github/gist')
    .make$({ fork_of: 'tutorial-fork_of', owner: 'tutorial-owner' })
    .save$()

  console.log('created with id', gist.id)
```

Run it, and note the id printed. It is **not** one you chose — the
store assigns ids itself and ignores any you send. That is worth
knowing before you write code that assumes otherwise.

Now change it. An entity that already carries an id is an update
rather than a create, and `save$` decides between the two on exactly
that:

```js
  gist.fork_of = 'tutorial-fork_of-2'
  gist = await gist.save$()

  console.log('updated:', gist.fork_of)
```

And remove it, leaving the store as you found it:

```js
  await seneca
    .entity('provider/github/gist')
    .remove$(gist.id)
```

Load it once more and, as before, you get `null`:

```js
  console.log(
    'after remove:',
    await seneca
      .entity('provider/github/gist')
      .load$(gist.id)
  )   // null
```

Those are the only methods there are:

`list$`, `load$`, `save$`, `remove$`

They behave the same way on every entity this plugin exposes.

## Step 6: Reach the base_gist records

Base_gist records live inside gist records, and the API route
says so:

`/users/{username}/gists`

The parent id in that path is not optional, so every base_gist
call needs a `gist_id` in its query:

```js
  const base_gists = await seneca
    .entity('provider/github/base_gist')
    .list$({ gist_id: 'gist0' })

  console.log('found ' + base_gists.length + ' base_gist record(s)')
```

Leave the `gist_id` out and the call throws at once, naming the key it
needed, rather than letting a half-built URL come back as a puzzling
404:

```js
  // throws: @seneca/github-provider: base_gist list: gist_id is required
  await seneca
    .entity('provider/github/base_gist')
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
