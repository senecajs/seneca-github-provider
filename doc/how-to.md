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
const gists = await seneca
  .entity('provider/github/gist')
  .list$()
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
const gist = await seneca
  .entity('provider/github/gist')
  .load$('gist0')
```

A record that is not there comes back as `null`. It is not an error and
it does not throw, so test the value rather than wrapping the call:

```js
const missing = await seneca
  .entity('provider/github/gist')
  .load$('nosuch')

if (null == missing) {
  // no such gist
}
```

Everything else that can go wrong — a network failure, a 5xx, a rejected
key — does throw, so an unhandled rejection still means something is
genuinely wrong.

## Create a record

`make$` builds an entity and `save$` writes it. An entity with no id
is a create:

```js
const gist = await seneca
  .entity('provider/github/gist')
  .make$({ fork_of: {}, owner: {} })
  .save$()

console.log(gist.id)
```

`save$` resolves to the record as the API returned it, which is the only
reliable source of the id. Read it from there rather than predicting it:
what an API does with an id you supply on create is its own business, and
several ignore it entirely.

## Update a record

The same call updates. `save$` dispatches on the id: an entity carrying
one is an update, an entity without one is a create. So the safe shape is
load, change, save:

```js
const gist = await seneca
  .entity('provider/github/gist')
  .load$('gist0')

gist.fork_of = 'fork_of-changed'

await gist.save$()
```

Mutating the record you loaded sends it as it stood plus your change, so
you do not depend on how the API treats a request that omits fields —
some merge, some replace.

## Remove a record

```js
await seneca
  .entity('provider/github/gist')
  .remove$('gist0')
```

A `load$` of the same id afterwards answers `null`.

## Work with nested entities

Some resources live inside a parent, and the API path says so — the
route for `action` is:

```
/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs
```

So a `action` cannot be addressed at all without its parent's id, and
the provider requires those keys on every command.

- `action` requires `artifact_id`, `hosted_runner_id`, `name`, `org_id`, `owner`, `repo`, `repository_id`
- `actions_cache_list` requires `key`, `owner`
- `actions_cache_usage_by_repository` requires `owner`
- `actions_hosted_runner` requires `org_id`
- `actions_repository_permission` requires `owner`
- `actions_secret` requires `owner`, `repo`
- `actions_variable` requires `owner`, `repo`
- `actions_workflow_access_to_repository` requires `owner`
- `activity` requires `owner`, `thread_id`
- `add` requires `enterprise`, `team_id`
- `api_insights_route_stat` requires `actor_id`, `actor_type`, `min_timestamp`, `org`
- `api_insights_subject_stat` requires `min_timestamp`, `org_id`
- `api_insights_summary_stat` requires `min_timestamp`
- `api_insights_time_stat` requires `min_timestamp`, `org_id`, `timestamp_increment`
- `api_insights_user_stat` requires `min_timestamp`, `org_id`
- `app` requires `code`, `repository_id`
- `artifact` requires `owner`, `repo`
- `assignee` requires `owner`, `repo`
- `authentication_token` requires `org_id`
- `autolink` requires `owner`, `repo`
- `base_gist` requires `gist_id`
- `billing_usage_report` requires `org`
- `billing_usage_report_user` requires `username`
- `blob` requires `owner`, `repo`
- `branch` requires `owner`, `repo`
- `branch_protection` requires `owner`, `repo`
- `branch_restriction_policy` requires `branch_id`, `owner`, `repo`
- `branch_short` requires `commit_sha`, `owner`, `repo`
- `branch_with_protection` requires `owner`, `repo`
- `campaign` requires `org_id`
- `check` requires `owner`, `repo`
- `check_annotation` requires `check_run_id`, `owner`, `repo`
- `check_automated_security_fix` requires `owner`
- `check_run` requires `owner`, `repo`
- `check_suite` requires `owner`, `repo`
- `check_suite_preference` requires `owner`
- `classroom_accepted_assignment` requires `assignment_id`
- `classroom_assignment_grade` requires `assignment_id`
- `clone` requires `owner`, `repo`
- `code_frequency` requires `owner`, `repo`
- `code_frequency_stat` requires `owner`, `repo`
- `code_scanning` requires `owner`, `repo`
- `code_scanning_alert` requires `owner`, `repo`
- `code_scanning_alert_instance` requires `alert_number`, `owner`, `repo`
- `code_scanning_alert_item` requires `owner`, `repo`
- `code_scanning_analysi` requires `owner`, `repo`
- `code_scanning_analysis_deletion` requires `owner`, `repo`
- `code_scanning_autofix` requires `owner`, `repo`
- `code_scanning_autofix_commit` requires `alert_id`, `owner`, `repo`
- `code_scanning_codeql_database` requires `owner`, `repo`
- `code_scanning_default_setup` requires `owner`, `repo`
- `code_scanning_organization_alert_item` requires `org_id`
- `code_scanning_sarifs_status` requires `owner`, `repo`
- `code_scanning_variant_analysi` requires `owner`, `repo`
- `code_scanning_variant_analysis_repo_task` requires `codeql_variant_analysis_id`, `owner`, `repo`, `repo_owner`
- `code_security` requires `enterprise`
- `code_security_configuration` requires `enterprise`, `org_id`
- `code_security_configuration_repository` requires `configuration_id`
- `code_security_default_configuration` requires `enterprise`
- `codeowners_error` requires `owner`, `repo`
- `codespace` requires `secret_name`
- `collaborator` requires `project_id`
- `combined_commit_status` requires `owner`, `ref`, `repo`
- `commit` requires `owner`, `repo`
- `commit_activity` requires `owner`, `repo`
- `commit_comment` requires `commit_sha`, `owner`, `repo`
- `commit_comparison` requires `owner`, `repo`
- `community_profile` requires `owner`
- `content_file` requires `owner`, `repo`
- `content_traffic` requires `owner`, `repo`
- `contributor` requires `owner`, `repo`
- `copilot` requires `org_id`
- `copilot_usage_metrics_day` requires `org_id`
- `custom_property` requires `org_id`
- `custom_property_value` requires `owner`, `repo`
- `dependabot` requires `org`, `org_id`, `repository_id`, `secret_id`
- `dependabot_alert` requires `owner`, `repo`
- `dependabot_alert_with_repository` requires `org_id`
- `dependabot_repository_access_detail` requires `org`
- `dependabot_secret` requires `owner`, `repo`
- `dependency_graph` requires `owner`, `repo`
- `dependency_graph_diff` requires `owner`, `repo`
- `dependency_graph_spdx_sbom` requires `owner`
- `deploy_key` requires `owner`, `repo`
- `deployment` requires `owner`, `repo`
- `deployment_branch_policy` requires `environment_id`, `environment_name`, `owner`, `repo`
- `deployment_protection_rule` requires `environment_id`, `environment_name`, `owner`, `repo`
- `deployment_status` requires `deployment_id`, `owner`, `repo`
- `diff_entry` requires `owner`, `pull_number`, `repo`
- `empty_object` requires `org_id`, `owner`, `repo`, `secret_name`, `username`
- `enterprise_team` requires `enterprise`
- `enterprise_team_membership` requires `enterprise`, `team_id`
- `environment` requires `owner`, `repo`
- `environment_approval` requires `owner`, `repo`, `run_id`
- `event` requires `username`
- `file_commit` requires `owner`, `repo`
- `full_repository` requires `owner`
- `gist_comment` requires `gist_id`
- `git` requires `owner`, `repo`
- `git_commit` requires `owner`, `repo`
- `git_ref` requires `owner`, `repo`
- `git_tag` requires `owner`, `repo`
- `git_tree` requires `owner`, `repo`
- `hook` requires `owner`, `repo`
- `hosted_compute` requires `org_id`
- `hovercard` requires `username`
- `import` requires `owner`
- `integration` requires `branch_id`, `owner`, `repo`
- `issue` requires `owner`, `repo`
- `issue_type` requires `org_id`
- `job` requires `owner`, `repo`
- `label` requires `owner`, `repo`
- `language` requires `owner`
- `marketplace_purchase` requires `plan_id`
- `member` requires `org_id`
- `membership` requires `enterprise`, `enterprise_team`, `team_id`
- `merged_upstream` requires `owner`, `repo`
- `migration` requires `owner`, `repo`
- `milestone` requires `owner`, `repo`
- `network_configuration` requires `org_id`
- `network_setting` requires `org_id`
- `oidc_custom_sub` requires `org_id`
- `oidc_custom_sub_repo` requires `owner`, `repo`
- `org` requires `enablement`, `org`, `security_product`, `username`
- `org_hook` requires `org_id`
- `org_membership` requires `org_id`
- `org_private_registry_configuration` requires `org_id`
- `org_repo_custom_property_value` requires `org_id`
- `organization_actions_secret` requires `org_id`
- `organization_actions_variable` requires `org_id`
- `organization_dependabot_secret` requires `org_id`
- `organization_invitation` requires `org_id`
- `organization_programmatic_access_grant` requires `org_id`
- `organization_role` requires `org_id`
- `organization_secret_scanning_alert` requires `org_id`
- `outside_collaborator` requires `org_id`
- `package` requires `package_id`, `package_type`
- `page` requires `owner`
- `page_build` requires `owner`, `repo`
- `page_build_status` requires `owner`, `repo`
- `page_deployment` requires `owner`, `repo`
- `pages_deployment_status` requires `deployment_id`, `owner`, `repo`
- `pages_health_check` requires `owner`
- `participation` requires `owner`, `repo`
- `pending_deployment` requires `owner`, `repo`, `run_id`
- `porter_author` requires `owner`, `repo`
- `porter_large_file` requires `owner`, `repo`
- `project` requires `org_id`
- `project_collaborator_permission` requires `project_id`
- `projects_classic` requires `project_id`, `username`
- `projects_v2` requires `org_id`
- `projects_v2_field` requires `project_number`, `projects_v2_id`
- `projects_v2_item_simple` requires `project_number`
- `projects_v2_item_with_content` requires `project_number`, `projects_v2_id`
- `protected_branch` requires `owner`, `repo`
- `protected_branch_admin_enforced` requires `owner`, `repo`
- `protected_branch_pull_request_review` requires `owner`, `repo`
- `public_member` requires `org_id`
- `pull` requires `comment_id`, `owner`, `repo`
- `pull_request_review` requires `owner`, `pull_id`, `pull_number`, `repo`
- `pull_request_review_comment` requires `owner`, `repo`
- `pull_request_simple` requires `owner`, `repo`
- `reaction` requires `discussion_number`, `team_id`
- `referrer` requires `owner`, `repo`
- `release` requires `owner`, `repo`
- `release_asset` requires `name`, `owner`, `repo`
- `release_notes_content` requires `owner`, `repo`
- `remove` requires `enterprise`, `team_id`
- `repo` requires `branch_id`, `invitation_id`, `owner`, `repo`
- `repository_advisory` requires `org_id`, `owner`, `repo`
- `repository_collaborator_permission` requires `owner`, `repo`
- `repository_invitation` requires `owner`, `repo`
- `repository_rule_detailed` requires `owner`, `repo`
- `repository_ruleset` requires `org_id`
- `repository_subscription` requires `owner`
- `review_comment` requires `owner`, `pull_id`, `repo`
- `rule_suite` requires `org_id`
- `ruleset_version_with_state` requires `ruleset_id`
- `runner_application` requires `org_id`
- `runner_group` requires `org_id`
- `search` requires `q`
- `secret_scanning_alert` requires `owner`, `repo`
- `secret_scanning_location` requires `alert_number`, `owner`, `repo`
- `secret_scanning_pattern_configuration` requires `org_id`
- `secret_scanning_push_protection_bypass` requires `owner`, `repo`
- `secret_scanning_scan_history` requires `owner`, `repo`
- `security_advisory` requires `owner`, `repo`
- `selected_action` requires `org_id`
- `short_blob` requires `owner`, `repo`
- `short_branch` requires `owner`, `repo`
- `simple_classroom_assignment` requires `classroom_id`
- `status` requires `owner`, `ref`, `repo`
- `status_check_policy` requires `owner`, `repo`
- `subscriber` requires `owner`, `repo`
- `tag` requires `owner`, `repo`
- `tag_protection` requires `owner`, `repo`
- `team` requires `org_id`, `project_id`
- `team_simple` requires `org_id`
- `topic` requires `owner`
- `user` requires `branch_id`, `gpg_key_id`, `owner`, `repo`, `username`
- `view` requires `owner`, `repo`
- `workflow` requires `owner`, `repo`
- `workflow_run` requires `owner`, `repo`, `run_id`
- `workflow_run_usage` requires `owner`, `repo`
- `workflow_usage` requires `owner`, `repo`

For reads the keys go in the query; for writes they go in the data:

```js
await seneca.entity('provider/github/action').list$({ artifact_id: 'artifact0', hosted_runner_id: '0', name: '0', org_id: 'org0', owner: '0', repo: 'repo0', repository_id: 'repository0' })

await seneca.entity('provider/github/action')
  .load$({ artifact_id: 'artifact0', hosted_runner_id: '0', name: '0', org_id: 'org0', owner: '0', repo: 'repo0', repository_id: 'repository0', id: 'action0' })

await seneca.entity('provider/github/action')
  .make$({ access_level: 'access_level0', active_caches_count: 100, active_caches_size_in_bytes: 100, actor: {}, allows_public_repositories: false, approval_policy: 'approval_policy0', archive_download_url: 'archive_download_url0', archive_url: 'archive_url0', artifacts_url: 'artifacts_url0', assignees_url: 'assignees_url0', badge_url: 'badge_url0', blobs_url: 'blobs_url0', branches_url: 'branches_url0', busy: false, cancel_url: 'cancel_url0', check_run_url: 'check_run_url0', check_suite_url: 'check_suite_url0', code_of_conduct: {}, collaborators_url: 'collaborators_url0', comments_url: 'comments_url0', commits_url: 'commits_url0', compare_url: 'compare_url0', completed_at: 'completed_at0', conclusion: 'conclusion0', contents_url: 'contents_url0', contributors_url: 'contributors_url0', cpu_cores: 100, created_at: 'created_at0', days: 100, default: false, deployments_url: 'deployments_url0', description: 'description0', display_name: 'display_name0', display_title: 'display_title0', downloads_url: 'downloads_url0', enabled: false, enabled_repositories: 'enabled_repositories0', event: 'event0', events_url: 'events_url0', expired: false, expires_at: 'expires_at0', fork: false, forks_url: 'forks_url0', full_name: 'full_name0', git_commits_url: 'git_commits_url0', git_refs_url: 'git_refs_url0', git_tags_url: 'git_tags_url0', head_branch: 'head_branch0', head_commit: {}, head_repository: {}, head_sha: 'head_sha0', hooks_url: 'hooks_url0', html_url: 'html_url0', image_details: {}, inherited: false, issue_comment_url: 'issue_comment_url0', issue_events_url: 'issue_events_url0', issues_url: 'issues_url0', jobs_url: 'jobs_url0', keys_url: 'keys_url0', labels: [], labels_url: 'labels_url0', languages_url: 'languages_url0', logs_url: 'logs_url0', machine_size_details: {}, memory_gb: 100, merges_url: 'merges_url0', milestones_url: 'milestones_url0', name: 'name0', node_id: 'node_id0', notifications_url: 'notifications_url0', os: 'os0', owner: 'owner0', path: 'path0', platform: 'platform0', platforms: [], private: false, public_ip_enabled: false, pull_requests: [], pulls_url: 'pulls_url0', ref: 'ref0', releases_url: 'releases_url0', repository: {}, rerun_url: 'rerun_url0', run_id: 100, run_number: 100, run_url: 'run_url0', run_workflows_from_fork_pull_requests: false, runner_group_id: 100, runner_group_name: 'runner_group_name0', runner_id: 100, runner_name: 'runner_name0', runners: [], runners_url: 'runners_url0', selected_repository_ids: [], size_gb: 100, size_in_bytes: 100, source: 'source0', stargazers_url: 'stargazers_url0', started_at: 'started_at0', state: 'state0', status: 'status0', statuses_url: 'statuses_url0', storage_gb: 100, subscribers_url: 'subscribers_url0', subscription_url: 'subscription_url0', tags_url: 'tags_url0', teams_url: 'teams_url0', total_count: 100, trees_url: 'trees_url0', triggering_actor: {}, updated_at: 'updated_at0', url: 'url0', workflow_id: 100, workflow_name: 'workflow_name0', workflow_url: 'workflow_url0', artifact_id: 'artifact0', hosted_runner_id: 'hosted_runner0', org_id: 'org0', repo: 'repo0', repository_id: 'repository0', archive_format: 'action0' })
  .save$()

await seneca.entity('provider/github/action')
  .remove$({ artifact_id: 'artifact0', hosted_runner_id: '0', name: '0', org_id: 'org0', owner: '0', repo: 'repo0', repository_id: 'repository0', id: 'action0' })
```

Leave a key out and the call throws at once, naming what is missing:

```
@seneca/github-provider: action list: artifact_id is required
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
      action: {
        action0: { access_level: 'access_level0', active_caches_count: 100, active_caches_size_in_bytes: 100, actor: {}, allows_public_repositories: false, approval_policy: 'approval_policy0', archive_download_url: 'archive_download_url0', archive_url: 'archive_url0', artifacts_url: 'artifacts_url0', assignees_url: 'assignees_url0', badge_url: 'badge_url0', blobs_url: 'blobs_url0', branches_url: 'branches_url0', busy: false, cancel_url: 'cancel_url0', check_run_url: 'check_run_url0', check_suite_url: 'check_suite_url0', code_of_conduct: {}, collaborators_url: 'collaborators_url0', comments_url: 'comments_url0', commits_url: 'commits_url0', compare_url: 'compare_url0', completed_at: 'completed_at0', conclusion: 'conclusion0', contents_url: 'contents_url0', contributors_url: 'contributors_url0', cpu_cores: 100, created_at: 'created_at0', days: 100, default: false, deployments_url: 'deployments_url0', description: 'description0', display_name: 'display_name0', display_title: 'display_title0', downloads_url: 'downloads_url0', enabled: false, enabled_repositories: 'enabled_repositories0', event: 'event0', events_url: 'events_url0', expired: false, expires_at: 'expires_at0', fork: false, forks_url: 'forks_url0', full_name: 'full_name0', git_commits_url: 'git_commits_url0', git_refs_url: 'git_refs_url0', git_tags_url: 'git_tags_url0', head_branch: 'head_branch0', head_commit: {}, head_repository: {}, head_sha: 'head_sha0', hooks_url: 'hooks_url0', html_url: 'html_url0', id: 'action-apiid-0', image_details: {}, inherited: false, issue_comment_url: 'issue_comment_url0', issue_events_url: 'issue_events_url0', issues_url: 'issues_url0', jobs_url: 'jobs_url0', keys_url: 'keys_url0', labels: [], labels_url: 'labels_url0', languages_url: 'languages_url0', logs_url: 'logs_url0', machine_size_details: {}, memory_gb: 100, merges_url: 'merges_url0', milestones_url: 'milestones_url0', name: 'name0', node_id: 'node_id0', notifications_url: 'notifications_url0', os: 'os0', owner: 'owner0', path: 'path0', platform: 'platform0', platforms: [], private: false, public_ip_enabled: false, pull_requests: [], pulls_url: 'pulls_url0', ref: 'ref0', releases_url: 'releases_url0', repository: {}, rerun_url: 'rerun_url0', run_id: 100, run_number: 100, run_url: 'run_url0', run_workflows_from_fork_pull_requests: false, runner_group_id: 100, runner_group_name: 'runner_group_name0', runner_id: 100, runner_name: 'runner_name0', runners: [], runners_url: 'runners_url0', selected_repository_ids: [], size_gb: 100, size_in_bytes: 100, source: 'source0', stargazers_url: 'stargazers_url0', started_at: 'started_at0', state: 'state0', status: 'status0', statuses_url: 'statuses_url0', storage_gb: 100, subscribers_url: 'subscribers_url0', subscription_url: 'subscription_url0', tags_url: 'tags_url0', teams_url: 'teams_url0', total_count: 100, trees_url: 'trees_url0', triggering_actor: {}, updated_at: 'updated_at0', url: 'url0', workflow_id: 100, workflow_name: 'workflow_name0', workflow_url: 'workflow_url0', artifact_id: 'artifact0', hosted_runner_id: 'hosted_runner0', org_id: 'org0', repo: 'repo0', repository_id: 'repository0', archive_format: 'action0' },
        action1: { access_level: 'access_level1', active_caches_count: 200, active_caches_size_in_bytes: 200, actor: {}, allows_public_repositories: false, approval_policy: 'approval_policy1', archive_download_url: 'archive_download_url1', archive_url: 'archive_url1', artifacts_url: 'artifacts_url1', assignees_url: 'assignees_url1', badge_url: 'badge_url1', blobs_url: 'blobs_url1', branches_url: 'branches_url1', busy: false, cancel_url: 'cancel_url1', check_run_url: 'check_run_url1', check_suite_url: 'check_suite_url1', code_of_conduct: {}, collaborators_url: 'collaborators_url1', comments_url: 'comments_url1', commits_url: 'commits_url1', compare_url: 'compare_url1', completed_at: 'completed_at1', conclusion: 'conclusion1', contents_url: 'contents_url1', contributors_url: 'contributors_url1', cpu_cores: 200, created_at: 'created_at1', days: 200, default: false, deployments_url: 'deployments_url1', description: 'description1', display_name: 'display_name1', display_title: 'display_title1', downloads_url: 'downloads_url1', enabled: false, enabled_repositories: 'enabled_repositories1', event: 'event1', events_url: 'events_url1', expired: false, expires_at: 'expires_at1', fork: false, forks_url: 'forks_url1', full_name: 'full_name1', git_commits_url: 'git_commits_url1', git_refs_url: 'git_refs_url1', git_tags_url: 'git_tags_url1', head_branch: 'head_branch1', head_commit: {}, head_repository: {}, head_sha: 'head_sha1', hooks_url: 'hooks_url1', html_url: 'html_url1', id: 'action-apiid-1', image_details: {}, inherited: false, issue_comment_url: 'issue_comment_url1', issue_events_url: 'issue_events_url1', issues_url: 'issues_url1', jobs_url: 'jobs_url1', keys_url: 'keys_url1', labels: [], labels_url: 'labels_url1', languages_url: 'languages_url1', logs_url: 'logs_url1', machine_size_details: {}, memory_gb: 200, merges_url: 'merges_url1', milestones_url: 'milestones_url1', name: 'name0', node_id: 'node_id1', notifications_url: 'notifications_url1', os: 'os1', owner: 'owner0', path: 'path1', platform: 'platform1', platforms: [], private: false, public_ip_enabled: false, pull_requests: [], pulls_url: 'pulls_url1', ref: 'ref1', releases_url: 'releases_url1', repository: {}, rerun_url: 'rerun_url1', run_id: 200, run_number: 200, run_url: 'run_url1', run_workflows_from_fork_pull_requests: false, runner_group_id: 200, runner_group_name: 'runner_group_name1', runner_id: 200, runner_name: 'runner_name1', runners: [], runners_url: 'runners_url1', selected_repository_ids: [], size_gb: 200, size_in_bytes: 200, source: 'source1', stargazers_url: 'stargazers_url1', started_at: 'started_at1', state: 'state1', status: 'status1', statuses_url: 'statuses_url1', storage_gb: 200, subscribers_url: 'subscribers_url1', subscription_url: 'subscription_url1', tags_url: 'tags_url1', teams_url: 'teams_url1', total_count: 200, trees_url: 'trees_url1', triggering_actor: {}, updated_at: 'updated_at1', url: 'url1', workflow_id: 200, workflow_name: 'workflow_name1', workflow_url: 'workflow_url1', artifact_id: 'artifact0', hosted_runner_id: 'hosted_runner0', org_id: 'org0', repo: 'repo0', repository_id: 'repository0', archive_format: 'action1' },
      },
      artifact: {
        artifact0: { owner: 'owner0', repo: 'repo0', id: 'artifact0' },
        artifact1: { owner: 'owner0', repo: 'repo0', id: 'artifact1' },
      },
      gist: {
        gist0: { fork_of: {}, owner: {}, id: 'gist0' },
        gist1: { fork_of: {}, owner: {}, id: 'gist1' },
      },
    },
  },
})
```

Records are keyed by id under their entity name, and the id inside the
record has to match the key it is filed under. Every command then works
offline, not-found included: an id you did not seed answers `null`,
exactly as it would against a real server.

A nested record has to point at a parent that is actually seeded: each
`action` above carries `artifact_id: 'artifact0'`, and
that is a `artifact` the seed contains. Seed a child under a parent
that is not there and its list comes back empty rather than failing —
which, in a test, reads as a pass that proves nothing.

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
  version: '0.3.2',
  sdk: { name: '@voxgig-sdk/github-sdk', version: '0.0.2' },
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
const gists = (await sdk.Gist().list())
  .map((r) => r.data())

const one = (await sdk.Gist().load({ id: 'gist0' })).data()
```

For a route the entity model does not cover at all, `direct` sends a
request and hands back the raw response:

```js
const res = await sdk.direct({
  path: '/gists',
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
const ent = seneca.entity('provider/github/gist').data$(res.data)
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
$ ls -l node_modules/@voxgig-sdk/github-sdk
```

To go back to the published SDK:

```sh
$ rm -rf node_modules/@voxgig-sdk/github-sdk package-lock.json && npm install
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
$ TEST_PATTERN=gist-load npm run test-some
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
