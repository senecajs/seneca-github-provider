# Explanation

This document discusses why `@seneca/github-provider` is built the way it is.
It does not tell you how to do anything — for that see the
[tutorial](tutorial.md) and the [how-to guides](how-to.md), and for the exact
patterns, entities and options, the [reference](reference.md). The whole set is
indexed in [doc/README.md](README.md).


## The provider convention

Seneca applications talk to the outside world through *providers*. A provider
is a plugin that makes a third-party API look like a Seneca data source, so
application code uses the entity API it already knows instead of learning a
client library per service.

The payoff is uniformity. An application reading from GitHub v3 REST, a
payment processor and a CRM uses one access pattern for all three:

```js
await seneca.entity('provider/github/gist').list$()
await seneca.entity('provider/stripe/charge').list$()
```

Because these are ordinary Seneca entities, everything built on the entity API
— logging, tracing, message interception, test doubles — applies to remote
calls without any special support for HTTP.


## What entityBuilder buys

The convention is more than a naming scheme. `@seneca/provider` exports
`provider/entityBuilder`, and this plugin hands it exactly one thing: a map
from entity name to a small set of cmd actions. Recognising the
`provider/github/` canon, registering the `role:entity` messages
that sit behind `list$`, `load$`, `save$` and `remove$`, and turning
whatever an action returns into an entity of the right canon — none of that is
written here. It arrives with the convention.

What remains is a handful of async functions, each a few lines long, whose
whole job is to call the SDK and hand the result back through the `entize`
function entityBuilder supplies. That thinness is the point rather than an
accident of effort: a provider that is nearly all glue can be read at a glance,
generated in full, and regenerated when the API moves. Cleverness added here is
cleverness that has to be maintained against a moving target.


## Two layers of the same idea

This provider is unusual among Seneca providers in that the thing it wraps is
*already* entity-shaped. The GitHub v3 REST SDK exposes accessors like
`client.Gist()` — carrying
`list`, `load`, `create`, `update`, `remove` —
rather than raw HTTP routes, for much the same reason Seneca does. A small,
uniform surface is easier for people and for agents to reason about than a set
of URL templates.

So the provider is mostly a translation between two entity models that already
agree on the important things. Where they *disagree* is where this plugin has
to do real work, and each disagreement is discussed below.


## Where the SDK and Seneca disagree

### Four commands, five operations

Seneca's store commands are `list`, `load`, `save` and `remove`. The
SDK's operations are `list`, `load`, `create`, `update` and `remove`.
Four of the five line up. `save` is the join, and it dispatches on the id: an
entity carrying one is an update, an entity without one is a create.

That is Seneca's convention rather than this plugin's invention, and it is a
good one. Exposing create and update separately would push the HTTP verb back
into application code — the caller who loaded a record, changed a field and
called `save$` would have to know whether that becomes a POST or a PUT. The
presence of the id already answers the question. Asking the caller to answer it
again only adds a way to be wrong.

Which commands exist at all is decided per entity, from the operations the API
declares, rather than from an assumption that everything is CRUD.
`gist` carries
`list$`, `load$`, `save$`, `remove$`.
The other entities carry whatever their own operations support; the
[reference](reference.md) lists them all.
An entity whose API has no create and no update simply has no `save$`, which
is a better answer than a `save$` that exists and then fails at the HTTP
layer.

Where an entity declares only one of create and update there is nothing to
dispatch on, and `save$` means that operation whether an id is present or not:

- `activity`: `save$` always updates
- `add`: `save$` always creates
- `authentication_token`: `save$` always creates
- `autolink`: `save$` always creates
- `base_gist`: `save$` always creates
- `branch_with_protection`: `save$` always creates
- `check_suite`: `save$` always creates
- `check_suite_preference`: `save$` always updates
- `code_scanning`: `save$` always creates
- `code_scanning_alert`: `save$` always updates
- `code_scanning_autofix`: `save$` always creates
- `code_scanning_autofix_commit`: `save$` always creates
- `code_scanning_variant_analysi`: `save$` always creates
- `code_security`: `save$` always updates
- `commit`: `save$` always creates
- `copilot`: `save$` always creates
- `credential`: `save$` always creates
- `custom_property`: `save$` always updates
- `dependabot`: `save$` always updates
- `dependabot_alert`: `save$` always updates
- `dependency_graph`: `save$` always creates
- `deploy_key`: `save$` always creates
- `deployment`: `save$` always creates
- `deployment_protection_rule`: `save$` always creates
- `deployment_status`: `save$` always creates
- `environment`: `save$` always updates
- `file_commit`: `save$` always updates
- `git_commit`: `save$` always creates
- `git_tag`: `save$` always creates
- `git_tree`: `save$` always creates
- `gpg_key`: `save$` always creates
- `import`: `save$` always updates
- `installation`: `save$` always updates
- `installation_token`: `save$` always creates
- `interaction_limit`: `save$` always updates
- `key`: `save$` always creates
- `markdown`: `save$` always creates
- `membership`: `save$` always updates
- `merged_upstream`: `save$` always creates
- `migration`: `save$` always creates
- `org_membership`: `save$` always updates
- `org_private_registry_configuration_with_selected_repository`: `save$` always creates
- `organization_invitation`: `save$` always creates
- `package`: `save$` always creates
- `page`: `save$` always creates
- `page_build_status`: `save$` always creates
- `page_deployment`: `save$` always creates
- `pages_deployment_status`: `save$` always creates
- `porter_author`: `save$` always updates
- `private_registry`: `save$` always updates
- `projects_v2_item_simple`: `save$` always creates
- `projects_v2_item_with_content`: `save$` always updates
- `protected_branch`: `save$` always updates
- `protected_branch_admin_enforced`: `save$` always creates
- `protected_branch_pull_request_review`: `save$` always updates
- `pull_request_simple`: `save$` always creates
- `reaction`: `save$` always creates
- `release_notes_content`: `save$` always creates
- `remove`: `save$` always creates
- `repository_invitation`: `save$` always updates
- `repository_subscription`: `save$` always updates
- `secret_scanning`: `save$` always updates
- `secret_scanning_alert`: `save$` always updates
- `secret_scanning_push_protection_bypass`: `save$` always creates
- `security_advisory`: `save$` always creates
- `short_blob`: `save$` always creates
- `social_account`: `save$` always creates
- `ssh_signing_key`: `save$` always creates
- `status`: `save$` always creates
- `status_check_policy`: `save$` always updates
- `tag_protection`: `save$` always creates
- `thread_subscription`: `save$` always updates
- `topic`: `save$` always updates
- `webhook_config`: `save$` always updates
- `workflow`: `save$` always updates
- `workflow_run`: `save$` always creates

### Entity instances versus plain data

Every SDK operation resolves to an SDK entity instance, never to raw data:
`list` to a list of them, and each single-record operation to one. The record
is absorbed into the instance and read back through `.data()`. A removed
entity is the same instance, marked deleted, still holding what it held.

Seneca's `entize` wants plain data, so the provider takes the `.data()` hop
on everything the SDK hands back, before it goes anywhere near an entity. That
is the whole of the `plain` helper in the source, and it is the only place in
the plugin that knows the SDK deals in instances at all.

The hop earns its keep for a second reason. An SDK instance carries its own
serialisation marker, and that marker must not survive into a Seneca entity:
Seneca reads `entity$` on a data object as the *canon*. A marker landing on
that key would be taken as a canon, and the record would come back under the
wrong one — or under none. The SDK namespaces its marker so the collision
cannot happen by accident, but normalising at this boundary is still the right
call. It is what makes the data plain, and it keeps the provider independent of
whatever the SDK decides to carry alongside a record.

### Missing things

`load$` for an id that does not exist resolves to `null`. Only a 404 is
translated this way; every other failure propagates.

"This thing does not exist" is an ordinary answer to a lookup, not a failure of
the lookup. It is usually a branch in the caller's logic, and forcing every call
site into a `try`/`catch` to express that branch makes the common path noisy.
A malformed request, a rejected credential or an unreachable server means
something else entirely: the question could not be asked, and that should
interrupt rather than quietly look like an empty result.

The SDK does not draw this line — it throws for any non-2xx — so the provider
asks the thrown error, which reports `notFound` and the HTTP `status` at the
top level. That coupling to the SDK's error shape is a deliberate and narrow
one, and it is why the shape is written down in the
[reference](reference.md).

`remove$` is treated the same way and for the same reason: removing something
that is already gone leaves the caller with what the caller wanted.

### Nesting

The API nests `action` under `artifact`: a `action`'s URL contains its `artifact`.
Seneca's entity model is flat — a canon has no notion of a parent.

The gap is bridged by putting the parent id in the query, which is why
`artifact_id` is required on every `action` command, and why
`action` `load$` takes an object rather than a bare id string.
This is inherited from the API's URL structure — `/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs` — rather than
chosen here.

The provider checks for `artifact_id` itself and throws a named error
rather than letting the request go out. Without the check, the SDK builds a URL
with a missing segment and the server answers 404, and that 404 is
indistinguishable from "that action does not exist" — which the provider
would then dutifully translate to `null`. A forgotten argument would look
exactly like an empty result. Failing early turns a confusing
wrong answer into an obvious mistake.

The same applies to every nested entity here —
`action`, `actions_cache_list`, `actions_cache_usage_by_repository`, `actions_hosted_runner`, `actions_repository_permission`, `actions_secret`, `actions_variable`, `actions_workflow_access_to_repository`, `activity`, `add`, `api_insights_route_stat`, `api_insights_subject_stat`, `api_insights_summary_stat`, `api_insights_time_stat`, `api_insights_user_stat`, `app`, `artifact`, `assignee`, `authentication_token`, `autolink`, `base_gist`, `billing_usage_report`, `billing_usage_report_user`, `blob`, `branch`, `branch_protection`, `branch_restriction_policy`, `branch_short`, `branch_with_protection`, `campaign`, `check`, `check_annotation`, `check_automated_security_fix`, `check_run`, `check_suite`, `check_suite_preference`, `classroom_accepted_assignment`, `classroom_assignment_grade`, `clone`, `code_frequency`, `code_frequency_stat`, `code_scanning`, `code_scanning_alert`, `code_scanning_alert_instance`, `code_scanning_alert_item`, `code_scanning_analysi`, `code_scanning_analysis_deletion`, `code_scanning_autofix`, `code_scanning_autofix_commit`, `code_scanning_codeql_database`, `code_scanning_default_setup`, `code_scanning_organization_alert_item`, `code_scanning_sarifs_status`, `code_scanning_variant_analysi`, `code_scanning_variant_analysis_repo_task`, `code_security`, `code_security_configuration`, `code_security_configuration_repository`, `code_security_default_configuration`, `codeowners_error`, `codespace`, `collaborator`, `combined_commit_status`, `commit`, `commit_activity`, `commit_comment`, `commit_comparison`, `community_profile`, `content_file`, `content_traffic`, `contributor`, `copilot`, `copilot_usage_metrics_day`, `custom_property`, `custom_property_value`, `dependabot`, `dependabot_alert`, `dependabot_alert_with_repository`, `dependabot_repository_access_detail`, `dependabot_secret`, `dependency_graph`, `dependency_graph_diff`, `dependency_graph_spdx_sbom`, `deploy_key`, `deployment`, `deployment_branch_policy`, `deployment_protection_rule`, `deployment_status`, `diff_entry`, `empty_object`, `enterprise_team`, `enterprise_team_membership`, `environment`, `environment_approval`, `event`, `file_commit`, `full_repository`, `gist_comment`, `git`, `git_commit`, `git_ref`, `git_tag`, `git_tree`, `hook`, `hosted_compute`, `hovercard`, `import`, `integration`, `issue`, `issue_type`, `job`, `label`, `language`, `marketplace_purchase`, `member`, `membership`, `merged_upstream`, `migration`, `milestone`, `network_configuration`, `network_setting`, `oidc_custom_sub`, `oidc_custom_sub_repo`, `org`, `org_hook`, `org_membership`, `org_private_registry_configuration`, `org_repo_custom_property_value`, `organization_actions_secret`, `organization_actions_variable`, `organization_dependabot_secret`, `organization_invitation`, `organization_programmatic_access_grant`, `organization_role`, `organization_secret_scanning_alert`, `outside_collaborator`, `package`, `page`, `page_build`, `page_build_status`, `page_deployment`, `pages_deployment_status`, `pages_health_check`, `participation`, `pending_deployment`, `porter_author`, `porter_large_file`, `project`, `project_collaborator_permission`, `projects_classic`, `projects_v2`, `projects_v2_field`, `projects_v2_item_simple`, `projects_v2_item_with_content`, `protected_branch`, `protected_branch_admin_enforced`, `protected_branch_pull_request_review`, `public_member`, `pull`, `pull_request_review`, `pull_request_review_comment`, `pull_request_simple`, `reaction`, `referrer`, `release`, `release_asset`, `release_notes_content`, `remove`, `repo`, `repository_advisory`, `repository_collaborator_permission`, `repository_invitation`, `repository_rule_detailed`, `repository_ruleset`, `repository_subscription`, `review_comment`, `rule_suite`, `ruleset_version_with_state`, `runner_application`, `runner_group`, `search`, `secret_scanning_alert`, `secret_scanning_location`, `secret_scanning_pattern_configuration`, `secret_scanning_push_protection_bypass`, `secret_scanning_scan_history`, `security_advisory`, `selected_action`, `short_blob`, `short_branch`, `simple_classroom_assignment`, `status`, `status_check_policy`, `subscriber`, `tag`, `tag_protection`, `team`, `team_simple`, `topic`, `user`, `view`, `workflow`, `workflow_run`, `workflow_run_usage`, `workflow_usage` — each guarded on its own keys.

### Query directives

Seneca store queries can carry directives such as `sort$` and `limit$`.
These are instructions to a *store*, and the API has no equivalent, so the
provider strips any key ending in `$` before the query becomes an API match.

Passing them through would be worse than dropping them: the SDK would forward
them as ordinary match fields, and the API would either ignore them or reject
the request outright. Dropping them is imperfect too — a caller who writes
`list$({ sort$: 'name' })` gets unsorted results and no complaint — but it is
the behaviour least likely to produce a wrong answer, and the limitation is
documented rather than hidden. Sorting and limiting belong on the caller's
side, or in the API's own query fields where it has them.


## Why writes are supported here

The read-only question is worth asking of every provider, and the answer here
follows from the API rather than from taste.

Writes map cleanly onto entities only when the API's notion of "save" is
unambiguous. For a CMS with draft states, localised fields and a separate
publish step, `save$` would have to pick one interpretation and would mislead
whoever guessed differently. Here the write operations are plain whole-record
ones, so `save$` can mean exactly one thing for each of
`action`, `actions_hosted_runner`, `activity`, `add`, `app`, `authentication_token`, `authorization`, `autolink`, `base_gist`, `branch_with_protection`, `campaign`, `check_run`, `check_suite`, `check_suite_preference`, `code_scanning`, `code_scanning_alert`, `code_scanning_autofix`, `code_scanning_autofix_commit`, `code_scanning_variant_analysi`, `code_security`, `code_security_configuration`, `codespace`, `commit`, `commit_comment`, `copilot`, `credential`, `custom_property`, `dependabot`, `dependabot_alert`, `dependency_graph`, `deploy_key`, `deployment`, `deployment_branch_policy`, `deployment_protection_rule`, `deployment_status`, `email`, `empty_object`, `enterprise_team`, `environment`, `file_commit`, `full_repository`, `gist`, `gist_comment`, `git_commit`, `git_ref`, `git_tag`, `git_tree`, `gpg_key`, `hook`, `import`, `installation`, `installation_token`, `integration`, `interaction_limit`, `issue`, `issue_type`, `key`, `label`, `markdown`, `membership`, `merged_upstream`, `migration`, `milestone`, `network_configuration`, `org`, `org_hook`, `org_membership`, `org_private_registry_configuration_with_selected_repository`, `organization_invitation`, `package`, `page`, `page_build_status`, `page_deployment`, `pages_deployment_status`, `porter_author`, `private_registry`, `project`, `project_column`, `projects_classic`, `projects_v2_item_simple`, `projects_v2_item_with_content`, `protected_branch`, `protected_branch_admin_enforced`, `protected_branch_pull_request_review`, `pull`, `pull_request_review`, `pull_request_review_comment`, `pull_request_simple`, `reaction`, `release`, `release_asset`, `release_notes_content`, `remove`, `repo`, `repository_advisory`, `repository_invitation`, `repository_ruleset`, `repository_subscription`, `runner_group`, `secret_scanning`, `secret_scanning_alert`, `secret_scanning_push_protection_bypass`, `security_advisory`, `short_blob`, `social_account`, `ssh_signing_key`, `status`, `status_check_policy`, `tag_protection`, `team`, `thread_subscription`, `topic`, `user`, `webhook_config`, `workflow`, `workflow_run`, and the store surface those
operations support is implemented in full.

One wrinkle does not map cleanly. Seneca's model lets a caller choose an id;
many APIs assign ids themselves and ignore any id sent on create. The provider
does not try to paper over that, because it cannot make a server honour an id
it did not issue. Code that predicts the id of a record it is about to create
will be wrong on such an API, and the remedy is to read the id back from what
`save$` returns rather than to guess it beforehand.


## Credentials, whether or not the API needs them

At startup the plugin asks `@seneca/provider` for the keymap of
`github` and sends the `apikey` as a bearer token when one is
configured.

The key is *optional*. Absent, unconfigured and empty all mean "send no
header", and none of them is an error. For an API that needs no credential this
looks like ceremony, and it is worth keeping anyway: the shape of a Seneca
application should not depend on whether a particular service happens to need a
key. An application that moves from an open endpoint to an authenticated
deployment then changes one configuration value rather than restructuring how
the plugin loads — and a provider that demanded a key from an API that has none
would force every user to invent a fake one.


## Depending on a published SDK

The SDK is an ordinary published dependency: `@voxgig-sdk/github-sdk` at
`^0.0.2`, resolved by npm like anything else.

The alternative is vendoring — copying the generated client into this
repository. That is tempting, since both artefacts come from the same model and
change together. It is also wrong. It makes a second copy of something that is
regenerated whenever the API moves, and it puts this plugin's release cycle in
charge of the API's. As a dependency, the SDK carries its own semantic version:
when the API changes, the SDK is versioned, and this plugin either follows the
range or pins until it is ready. Keeping them separable also matters to the
people who use the SDK with no Seneca anywhere in sight.

One consequence of depending on generated code is worth stating plainly. The
SDK is regenerated as the API model changes, so its surface can shift in ways a
hand-written library's would not. That argues for keeping this plugin thin, and
for pinning behaviour in tests. Everything this plugin knows about the SDK's
shapes is concentrated in three small functions — the `.data()` hop, the query
cleaner and the not-found translation — plus the construction of the client, so
an SDK change is absorbed in one place and surfaces as a failing offline test
rather than as a surprise in production.

The API definition declares no server, so this plugin has no default host: the
base URL arrives through the `sdk.base` option, supplied by whoever configures
the plugin for a particular deployment. The tests therefore run entirely
against the SDK's mock transport, which is the one host that is always
available.


## A generated plugin

Nothing in this repository is hand-written. The plugin source, its tests, its CI
workflow, its manifest and these documents are all emitted by
[@voxgig/sdkgen](https://github.com/voxgig/sdkgen) from the GitHub v3 REST API
model — the same model the SDK is generated from, which is why the two cannot
disagree about entity names, id fields, or which operations exist.

There is one blunt consequence for anyone reading the code and reaching for an
edit: the edit will not survive. The next generation run overwrites this
repository, without a merge and without a warning. A fix applied here is a fix
that has to be applied again, silently, forever.

The source of truth is the SDK project's model — `../../voxgig-sdk/github-sdk` from
here, if both are checked out — together with the sdkgen component that emits
this target. A change to *what* the API offers belongs in the model; a change to
*how* the provider expresses it belongs in the component. Both are versioned,
both regenerate every provider built this way rather than just this one, and
both are where a fix is worth making. See
[Contributing](../README.md#contributing).


## How the tests are arranged

The suite runs offline by default. It needs no credentials and no network.

The **offline** tests use the SDK's own mock transport, reached through this
plugin's own options:

```js
.use('@seneca/github-provider', {
  test: true,
  testopts: { entity: { gist: { 'gist0': { ... } } } },
})
```

This is better than the usual provider-testing compromise. Rather than checking
only that the plugin loads and answers
`sys:provider,provider:github,get:info`, the tests exercise the
entity commands themselves — list, load, the not-found answer, the nested-entity rules —
through the real code path, from a Seneca entity call down to the transport and
back. The only thing replaced is the socket. And because the mock belongs to the
SDK, it stays honest as the SDK changes: a regeneration that alters a return
shape breaks a test here rather than someone's production run.

Seeding the mock is not decoration either. The seed is generated from the same
model as the entities, so the records the tests read carry the fields the API
would really return, and a nested record's parent id
names a parent record that exists — otherwise the nested tests would read an
empty store and pass without proving anything.

