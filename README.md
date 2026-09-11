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

const gists = await seneca
  .entity('provider/github/gist').list$()
const gist = await seneca
  .entity('provider/github/gist').load$('some-id')
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
| `provider/github/action` | `list$`, `load$`, `save$`, `remove$` | `access_level`, `active_caches_count`, `active_caches_size_in_bytes`, `actor`, `allows_public_repositories`, `approval_policy`, `archive_download_url`, `archive_url`, `artifacts_url`, `assignees_url`, `badge_url`, `blobs_url`, `branches_url`, `busy`, `cancel_url`, `check_run_url`, `check_suite_url`, `code_of_conduct`, `collaborators_url`, `comments_url`, `commits_url`, `compare_url`, `completed_at`, `conclusion`, `contents_url`, `contributors_url`, `cpu_cores`, `created_at`, `days`, `default`, `deployments_url`, `description`, `display_name`, `display_title`, `downloads_url`, `enabled`, `enabled_repositories`, `event`, `events_url`, `expired`, `expires_at`, `fork`, `forks_url`, `full_name`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `head_branch`, `head_commit`, `head_repository`, `head_sha`, `hooks_url`, `html_url`, `id`, `image_details`, `inherited`, `issue_comment_url`, `issue_events_url`, `issues_url`, `jobs_url`, `keys_url`, `labels`, `labels_url`, `languages_url`, `logs_url`, `machine_size_details`, `memory_gb`, `merges_url`, `milestones_url`, `name`, `node_id`, `notifications_url`, `os`, `owner`, `path`, `platform`, `platforms`, `private`, `public_ip_enabled`, `pull_requests`, `pulls_url`, `ref`, `releases_url`, `repository`, `rerun_url`, `run_id`, `run_number`, `run_url`, `run_workflows_from_fork_pull_requests`, `runner_group_id`, `runner_group_name`, `runner_id`, `runner_name`, `runners`, `runners_url`, `selected_repository_ids`, `size_gb`, `size_in_bytes`, `source`, `stargazers_url`, `started_at`, `state`, `status`, `statuses_url`, `storage_gb`, `subscribers_url`, `subscription_url`, `tags_url`, `teams_url`, `total_count`, `trees_url`, `triggering_actor`, `updated_at`, `url`, `workflow_id`, `workflow_name`, `workflow_url`, `artifact_id`, `hosted_runner_id`, `org_id`, `repo`, `repository_id` |
| `provider/github/actions_artifact_and_log_retention` | `load$` | `days`, `maximum_allowed_days` |
| `provider/github/actions_cache_list` | `list$`, `remove$` | `key`, `owner` |
| `provider/github/actions_cache_usage_by_repository` | `load$` | `active_caches_count`, `active_caches_size_in_bytes`, `full_name`, `owner` |
| `provider/github/actions_cache_usage_org_enterprise` | `load$` | `total_active_caches_count`, `total_active_caches_size_in_bytes` |
| `provider/github/actions_fork_pr_contributor_approval` | `load$` | `approval_policy` |
| `provider/github/actions_fork_pr_workflows_private_repo` | `load$` | `require_approval_for_fork_pr_workflows`, `run_workflows_from_fork_pull_requests`, `send_secrets_and_variables`, `send_write_tokens_to_workflows` |
| `provider/github/actions_get_default_workflow_permission` | `load$` | `can_approve_pull_request_reviews`, `default_workflow_permissions` |
| `provider/github/actions_hosted_runner` | `load$`, `save$` | `id`, `image`, `image_details`, `machine_size_details`, `name`, `platform`, `public_ip_enabled`, `size`, `status`, `org_id` |
| `provider/github/actions_hosted_runner_limit` | `load$` | `current_usage`, `maximum` |
| `provider/github/actions_organization_permission` | `load$` | `enabled_repositories` |
| `provider/github/actions_public_key` | `load$` | `key`, `key_id` |
| `provider/github/actions_repository_permission` | `load$` | `enabled`, `owner` |
| `provider/github/actions_secret` | `load$` | `created_at`, `name`, `updated_at`, `owner`, `repo` |
| `provider/github/actions_variable` | `load$` | `created_at`, `name`, `updated_at`, `value`, `owner`, `repo` |
| `provider/github/actions_workflow_access_to_repository` | `load$` | `access_level`, `owner` |
| `provider/github/activity` | `list$`, `load$`, `save$`, `remove$` | `activity_type`, `actor`, `after`, `before`, `ref`, `timestamp`, `owner`, `thread_id` |
| `provider/github/add` | `save$` | `usernames`, `enterprise`, `team_id` |
| `provider/github/api_insights_route_stat` | `list$` | `actor_id`, `actor_type`, `min_timestamp`, `org` |
| `provider/github/api_insights_subject_stat` | `list$` | `min_timestamp`, `org_id` |
| `provider/github/api_insights_summary_stat` | `load$` | `min_timestamp` |
| `provider/github/api_insights_time_stat` | `list$`, `load$` | `min_timestamp`, `org_id`, `timestamp_increment` |
| `provider/github/api_insights_user_stat` | `load$` | `min_timestamp`, `org_id` |
| `provider/github/api_overview` | `list$` | `verifiable_password_authentication` |
| `provider/github/app` | `list$`, `save$`, `remove$` | `access_tokens_url`, `account`, `app_id`, `app_slug`, `archive_url`, `archived`, `assignees_url`, `blobs_url`, `branches_url`, `clone_url`, `collaborators_url`, `comments_url`, `commits_url`, `compare_url`, `contents_url`, `contributors_url`, `default_branch`, `deployments_url`, `disabled`, `downloads_url`, `events_url`, `fork`, `forks`, `forks_count`, `forks_url`, `full_name`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `git_url`, `has_downloads`, `has_issues`, `has_pages`, `has_projects`, `has_wiki`, `homepage`, `hooks_url`, `issue_comment_url`, `issue_events_url`, `issues_url`, `keys_url`, `labels_url`, `language`, `languages_url`, `license`, `merges_url`, `milestones_url`, `mirror_url`, `notifications_url`, `open_issues`, `open_issues_count`, `private`, `pulls_url`, `pushed_at`, `releases_url`, `repositories_url`, `repository_selection`, `single_file_name`, `size`, `ssh_url`, `stargazers_count`, `stargazers_url`, `statuses_url`, `subscribers_url`, `subscription_url`, `suspended_at`, `suspended_by`, `svn_url`, `tags_url`, `target_id`, `target_type`, `teams_url`, `trees_url`, `url`, `watchers`, `watchers_count`, `code`, `repository_id` |
| `provider/github/artifact` | `load$` | `owner`, `repo` |
| `provider/github/assignee` | `list$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url`, `owner`, `repo` |
| `provider/github/authentication_token` | `save$` | `org_id` |
| `provider/github/authorization` | `save$` | `access_token`, `app`, `created_at`, `expires_at`, `fingerprint`, `hashed_token`, `id`, `installation`, `note`, `note_url`, `scopes`, `token`, `token_last_eight`, `updated_at`, `url`, `user` |
| `provider/github/autolink` | `list$`, `load$`, `save$` | `id`, `is_alphanumeric`, `key_prefix`, `url_template`, `owner`, `repo` |
| `provider/github/base_gist` | `list$`, `save$` | `gist_id` |
| `provider/github/billing_usage_report` | `list$` | `date`, `discountAmount`, `grossAmount`, `netAmount`, `organizationName`, `pricePerUnit`, `product`, `quantity`, `sku`, `unitType`, `org` |
| `provider/github/billing_usage_report_user` | `list$` | `date`, `discountAmount`, `grossAmount`, `netAmount`, `pricePerUnit`, `product`, `quantity`, `sku`, `unitType`, `username` |
| `provider/github/blob` | `load$` | `content`, `encoding`, `node_id`, `sha`, `size`, `url`, `owner`, `repo` |
| `provider/github/block` | `list$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url` |
| `provider/github/branch` | `load$` | `commit`, `links`, `name`, `protected`, `protection`, `protection_url`, `owner`, `repo` |
| `provider/github/branch_protection` | `load$` | `enforce_admins`, `required_pull_request_reviews`, `required_signatures`, `required_status_checks`, `restrictions`, `owner`, `repo` |
| `provider/github/branch_restriction_policy` | `list$` | `apps`, `apps_url`, `teams`, `teams_url`, `url`, `users`, `users_url`, `branch_id`, `owner`, `repo` |
| `provider/github/branch_short` | `list$` | `commit`, `name`, `protected`, `commit_sha`, `owner`, `repo` |
| `provider/github/branch_with_protection` | `save$` | `new_name`, `owner`, `repo` |
| `provider/github/campaign` | `list$`, `load$`, `save$`, `remove$` | `alert_stats`, `code_scanning_alerts`, `contact_link`, `created_at`, `description`, `ends_at`, `managers`, `number`, `state`, `updated_at`, `org_id` |
| `provider/github/check` | `list$` | `after`, `app`, `before`, `check_runs_url`, `check_suite`, `completed_at`, `conclusion`, `created_at`, `deployment`, `details_url`, `external_id`, `head_branch`, `head_commit`, `head_sha`, `html_url`, `id`, `latest_check_runs_count`, `name`, `node_id`, `output`, `pull_requests`, `repository`, `started_at`, `status`, `updated_at`, `url`, `owner`, `repo` |
| `provider/github/check_annotation` | `list$` | `annotation_level`, `blob_href`, `end_column`, `end_line`, `message`, `path`, `raw_details`, `start_column`, `start_line`, `title`, `check_run_id`, `owner`, `repo` |
| `provider/github/check_automated_security_fix` | `load$` | `enabled`, `paused`, `owner` |
| `provider/github/check_run` | `load$`, `save$` | `app`, `check_suite`, `completed_at`, `conclusion`, `deployment`, `details_url`, `external_id`, `head_sha`, `html_url`, `id`, `name`, `node_id`, `output`, `pull_requests`, `started_at`, `status`, `url`, `owner`, `repo` |
| `provider/github/check_suite` | `load$`, `save$` | `after`, `app`, `before`, `check_runs_url`, `conclusion`, `created_at`, `head_branch`, `head_commit`, `head_sha`, `id`, `latest_check_runs_count`, `node_id`, `pull_requests`, `repository`, `status`, `updated_at`, `url`, `owner`, `repo` |
| `provider/github/check_suite_preference` | `save$` | `preferences`, `repository`, `owner` |
| `provider/github/classroom` | `list$`, `load$` | `archived`, `avatar_url`, `html_url`, `id`, `login`, `name`, `node_id`, `url` |
| `provider/github/classroom_accepted_assignment` | `list$` | `assignment`, `commit_count`, `grade`, `id`, `passing`, `repository`, `students`, `submitted`, `assignment_id` |
| `provider/github/classroom_assignment` | `load$` | `accepted`, `classroom`, `deadline`, `editor`, `feedback_pull_requests_enabled`, `id`, `invitations_enabled`, `invite_link`, `language`, `max_members`, `max_teams`, `passing`, `public_repo`, `slug`, `starter_code_repository`, `students_are_repo_admins`, `submitted`, `title`, `type` |
| `provider/github/classroom_assignment_grade` | `list$` | `assignment_name`, `assignment_url`, `github_username`, `points_available`, `points_awarded`, `roster_identifier`, `starter_code_url`, `student_repository_name`, `student_repository_url`, `submission_timestamp`, `assignment_id` |
| `provider/github/clone` | `list$` | `count`, `timestamp`, `uniques`, `owner`, `repo` |
| `provider/github/code_frequency` | `list$` | `owner`, `repo` |
| `provider/github/code_frequency_stat` | `list$` | `owner`, `repo` |
| `provider/github/code_of_conduct` | `list$`, `load$` | `html_url`, `key`, `name`, `url` |
| `provider/github/code_scanning` | `save$`, `remove$` | `commit_sha`, `ref`, `sarif`, `owner`, `repo` |
| `provider/github/code_scanning_alert` | `load$`, `save$` | `created_at`, `dismissal_approved_by`, `dismissed_at`, `dismissed_by`, `dismissed_reason`, `html_url`, `instances_url`, `most_recent_instance`, `number`, `rule`, `state`, `tool`, `url`, `owner`, `repo` |
| `provider/github/code_scanning_alert_instance` | `list$` | `alert_number`, `owner`, `repo` |
| `provider/github/code_scanning_alert_item` | `list$` | `created_at`, `dismissal_approved_by`, `dismissed_at`, `dismissed_by`, `dismissed_reason`, `html_url`, `instances_url`, `most_recent_instance`, `number`, `rule`, `state`, `tool`, `url`, `owner`, `repo` |
| `provider/github/code_scanning_analysi` | `list$`, `load$` | `analysis_key`, `commit_sha`, `created_at`, `deletable`, `environment`, `error`, `id`, `ref`, `results_count`, `rules_count`, `sarif_id`, `tool`, `url`, `warning`, `owner`, `repo` |
| `provider/github/code_scanning_analysis_deletion` | `remove$` | `owner`, `repo` |
| `provider/github/code_scanning_autofix` | `load$`, `save$` | `description`, `started_at`, `status`, `owner`, `repo` |
| `provider/github/code_scanning_autofix_commit` | `save$` | `alert_id`, `owner`, `repo` |
| `provider/github/code_scanning_codeql_database` | `list$`, `load$` | `avatar_url`, `content_type`, `created_at`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `language`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `size`, `starred_url`, `subscriptions_url`, `type`, `updated_at`, `uploader`, `url`, `owner`, `repo` |
| `provider/github/code_scanning_default_setup` | `list$` | `owner`, `repo` |
| `provider/github/code_scanning_organization_alert_item` | `list$` | `created_at`, `dismissal_approved_by`, `dismissed_at`, `dismissed_by`, `dismissed_reason`, `html_url`, `instances_url`, `most_recent_instance`, `number`, `repository`, `rule`, `state`, `tool`, `url`, `org_id` |
| `provider/github/code_scanning_sarifs_status` | `load$` | `owner`, `repo` |
| `provider/github/code_scanning_variant_analysi` | `load$`, `save$` | `actor`, `controller_repo`, `id`, `language`, `query_language`, `query_pack`, `query_pack_url`, `skipped_repositories`, `status`, `owner`, `repo` |
| `provider/github/code_scanning_variant_analysis_repo_task` | `load$` | `archive_url`, `assignees_url`, `blobs_url`, `branches_url`, `collaborators_url`, `comments_url`, `commits_url`, `compare_url`, `contents_url`, `contributors_url`, `deployments_url`, `description`, `downloads_url`, `events_url`, `fork`, `forks_url`, `full_name`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `github_id`, `hooks_url`, `html_url`, `id`, `issue_comment_url`, `issue_events_url`, `issues_url`, `keys_url`, `labels_url`, `languages_url`, `merges_url`, `milestones_url`, `name`, `node_id`, `notifications_url`, `owner`, `private`, `pulls_url`, `releases_url`, `stargazers_url`, `statuses_url`, `subscribers_url`, `subscription_url`, `tags_url`, `teams_url`, `trees_url`, `url`, `codeql_variant_analysis_id`, `repo`, `repo_owner` |
| `provider/github/code_security` | `save$`, `remove$` | `enterprise` |
| `provider/github/code_security_configuration` | `list$`, `load$`, `save$` | `scope`, `enterprise`, `org_id` |
| `provider/github/code_security_configuration_repository` | `list$` | `repository`, `configuration_id` |
| `provider/github/code_security_default_configuration` | `list$` | `enterprise` |
| `provider/github/codeowners_error` | `list$` | `column`, `kind`, `line`, `message`, `path`, `owner`, `repo` |
| `provider/github/codespace` | `list$`, `load$`, `save$`, `remove$` | `accepted`, `archive_url`, `assignees_url`, `billable_owner`, `blobs_url`, `branches_url`, `code_of_conduct`, `collaborators_url`, `comments_url`, `commits_url`, `compare_url`, `contents_url`, `contributors_url`, `cpus`, `created_at`, `defaults`, `deployments_url`, `description`, `downloads_url`, `environment_id`, `events_url`, `fork`, `forks_url`, `full_name`, `git_commits_url`, `git_refs_url`, `git_status`, `git_tags_url`, `hooks_url`, `idle_timeout_minutes`, `issue_comment_url`, `issue_events_url`, `issues_url`, `key`, `key_id`, `keys_url`, `labels_url`, `languages_url`, `last_used_at`, `location`, `machine`, `machines_url`, `memory_in_bytes`, `merges_url`, `milestones_url`, `name`, `node_id`, `notifications_url`, `operating_system`, `owner`, `path`, `prebuild`, `prebuild_availability`, `pulls_url`, `recent_folders`, `releases_url`, `repository`, `selected_usernames`, `stargazers_url`, `start_url`, `statuses_url`, `stop_url`, `storage_in_bytes`, `subscribers_url`, `subscription_url`, `tags_url`, `teams_url`, `trees_url`, `updated_at`, `visibility`, `web_url`, `secret_name` |
| `provider/github/collaborator` | `list$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `permissions`, `received_events_url`, `repos_url`, `role_name`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url`, `project_id` |
| `provider/github/combined_billing_usage` | `load$` | `days_left_in_billing_cycle`, `estimated_paid_storage_for_month`, `estimated_storage_for_month` |
| `provider/github/combined_commit_status` | `list$` | `avatar_url`, `context`, `created_at`, `description`, `id`, `node_id`, `state`, `target_url`, `updated_at`, `url`, `owner`, `ref`, `repo` |
| `provider/github/commit` | `list$`, `load$`, `save$` | `author`, `base`, `comments_url`, `commit`, `committer`, `head`, `html_url`, `node_id`, `parents`, `sha`, `url`, `owner`, `repo` |
| `provider/github/commit_activity` | `list$` | `days`, `total`, `week`, `owner`, `repo` |
| `provider/github/commit_comment` | `list$`, `load$`, `save$` | `author_association`, `body`, `commit_id`, `created_at`, `html_url`, `id`, `line`, `node_id`, `path`, `position`, `reactions`, `updated_at`, `url`, `user`, `commit_sha`, `owner`, `repo` |
| `provider/github/commit_comparison` | `load$` | `ahead_by`, `base_commit`, `behind_by`, `commits`, `diff_url`, `html_url`, `merge_base_commit`, `patch_url`, `permalink_url`, `status`, `total_commits`, `url`, `owner`, `repo` |
| `provider/github/community_profile` | `load$` | `code_of_conduct`, `code_of_conduct_file`, `contributing`, `issue_template`, `license`, `pull_request_template`, `readme`, `owner` |
| `provider/github/content_file` | `load$` | `git`, `html`, `self`, `owner`, `repo` |
| `provider/github/content_traffic` | `list$` | `count`, `path`, `title`, `uniques`, `owner`, `repo` |
| `provider/github/contributor` | `list$` | `author`, `contributions`, `total`, `type`, `weeks`, `owner`, `repo` |
| `provider/github/copilot` | `list$`, `load$`, `save$`, `remove$` | `assignee`, `created_at`, `organization`, `selected_teams`, `selected_usernames`, `org_id` |
| `provider/github/copilot_organization_detail` | `load$` | — |
| `provider/github/copilot_usage_metrics_day` | `list$` | `date`, `org_id` |
| `provider/github/credential` | `save$` | `credentials` |
| `provider/github/custom_property` | `list$`, `load$`, `save$` | `properties`, `property_name`, `value_type`, `org_id` |
| `provider/github/custom_property_value` | `list$` | `property_name`, `value`, `owner`, `repo` |
| `provider/github/dependabot` | `list$`, `save$`, `remove$` | `archive_url`, `assignees_url`, `avatar_url`, `blobs_url`, `branches_url`, `code_of_conduct`, `collaborators_url`, `comments_url`, `commits_url`, `compare_url`, `contents_url`, `contributors_url`, `default_level`, `deployments_url`, `description`, `downloads_url`, `events_url`, `fork`, `forks_url`, `full_name`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `hooks_url`, `html_url`, `id`, `issue_comment_url`, `issue_events_url`, `issues_url`, `keys_url`, `labels_url`, `languages_url`, `login`, `members_url`, `merges_url`, `milestones_url`, `name`, `node_id`, `notifications_url`, `owner`, `private`, `public_members_url`, `pulls_url`, `releases_url`, `repos_url`, `selected_repository_ids`, `stargazers_url`, `statuses_url`, `subscribers_url`, `subscription_url`, `tags_url`, `teams_url`, `trees_url`, `url`, `org`, `org_id`, `repository_id`, `secret_id` |
| `provider/github/dependabot_alert` | `list$`, `load$`, `save$` | `created_at`, `dependency`, `dismissed_at`, `dismissed_by`, `dismissed_comment`, `dismissed_reason`, `fixed_at`, `html_url`, `number`, `security_advisory`, `security_vulnerability`, `state`, `updated_at`, `url`, `owner`, `repo` |
| `provider/github/dependabot_alert_with_repository` | `list$` | `created_at`, `dependency`, `dismissed_at`, `dismissed_by`, `dismissed_comment`, `dismissed_reason`, `fixed_at`, `html_url`, `number`, `repository`, `security_advisory`, `security_vulnerability`, `state`, `updated_at`, `url`, `org_id` |
| `provider/github/dependabot_public_key` | `load$` | `key`, `key_id` |
| `provider/github/dependabot_repository_access_detail` | `list$` | `archive_url`, `assignees_url`, `blobs_url`, `branches_url`, `collaborators_url`, `comments_url`, `commits_url`, `compare_url`, `contents_url`, `contributors_url`, `deployments_url`, `description`, `downloads_url`, `events_url`, `fork`, `forks_url`, `full_name`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `hooks_url`, `html_url`, `id`, `issue_comment_url`, `issue_events_url`, `issues_url`, `keys_url`, `labels_url`, `languages_url`, `merges_url`, `milestones_url`, `name`, `node_id`, `notifications_url`, `owner`, `private`, `pulls_url`, `releases_url`, `stargazers_url`, `statuses_url`, `subscribers_url`, `subscription_url`, `tags_url`, `teams_url`, `trees_url`, `url`, `org` |
| `provider/github/dependabot_secret` | `load$` | `created_at`, `name`, `updated_at`, `owner`, `repo` |
| `provider/github/dependency_graph` | `save$` | `detector`, `job`, `ref`, `scanned`, `sha`, `version`, `owner`, `repo` |
| `provider/github/dependency_graph_diff` | `load$` | `change_type`, `ecosystem`, `license`, `manifest`, `name`, `package_url`, `scope`, `source_repository_url`, `version`, `vulnerabilities`, `owner`, `repo` |
| `provider/github/dependency_graph_spdx_sbom` | `load$` | `SPDXID`, `creationInfo`, `dataLicense`, `documentNamespace`, `name`, `packages`, `relationships`, `spdxVersion`, `owner` |
| `provider/github/deploy_key` | `list$`, `load$`, `save$` | `created_at`, `id`, `key`, `read_only`, `title`, `url`, `verified`, `owner`, `repo` |
| `provider/github/deployment` | `list$`, `load$`, `save$` | `comment`, `created_at`, `creator`, `description`, `environment`, `environment_ids`, `id`, `node_id`, `payload`, `performed_via_github_app`, `ref`, `repository_url`, `sha`, `state`, `statuses_url`, `task`, `updated_at`, `url`, `owner`, `repo` |
| `provider/github/deployment_branch_policy` | `load$`, `save$` | `environment_id`, `environment_name`, `owner`, `repo` |
| `provider/github/deployment_protection_rule` | `load$`, `save$` | `id`, `integration_url`, `node_id`, `slug`, `environment_id`, `environment_name`, `owner`, `repo` |
| `provider/github/deployment_status` | `list$`, `load$`, `save$` | `created_at`, `creator`, `deployment_url`, `description`, `id`, `node_id`, `performed_via_github_app`, `repository_url`, `state`, `target_url`, `updated_at`, `url`, `deployment_id`, `owner`, `repo` |
| `provider/github/diff_entry` | `list$` | `additions`, `blob_url`, `changes`, `contents_url`, `deletions`, `filename`, `raw_url`, `sha`, `status`, `owner`, `pull_number`, `repo` |
| `provider/github/email` | `list$`, `save$` | — |
| `provider/github/emoji` | `load$` | — |
| `provider/github/empty_object` | `load$`, `save$` | `encrypted_value`, `key_id`, `name`, `use_default`, `value`, `visibility`, `org_id`, `owner`, `repo`, `secret_name`, `username` |
| `provider/github/enterprise_team` | `list$`, `load$`, `save$`, `remove$` | `created_at`, `group_id`, `html_url`, `id`, `members_url`, `name`, `slug`, `updated_at`, `url`, `enterprise` |
| `provider/github/enterprise_team_membership` | `remove$` | `enterprise`, `team_id` |
| `provider/github/environment` | `load$`, `save$` | `created_at`, `deployment_branch_policy`, `html_url`, `id`, `name`, `node_id`, `updated_at`, `url`, `owner`, `repo` |
| `provider/github/environment_approval` | `list$` | `comment`, `environments`, `state`, `user`, `owner`, `repo`, `run_id` |
| `provider/github/event` | `list$`, `load$` | `actor`, `created_at`, `id`, `org`, `payload`, `public`, `repo`, `type`, `username` |
| `provider/github/feed` | `list$` | `links`, `timeline_url`, `user_url` |
| `provider/github/file_commit` | `save$`, `remove$` | `author`, `commit`, `committer`, `content`, `message`, `owner`, `repo` |
| `provider/github/follower` | `list$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url` |
| `provider/github/following` | `list$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url` |
| `provider/github/full_repository` | `load$`, `save$` | `archive_url`, `archived`, `assignees_url`, `blobs_url`, `branches_url`, `clone_url`, `code_of_conduct`, `collaborators_url`, `comments_url`, `commits_url`, `compare_url`, `contents_url`, `contributors_url`, `created_at`, `default_branch`, `deployments_url`, `description`, `disabled`, `downloads_url`, `events_url`, `fork`, `forks`, `forks_count`, `forks_url`, `full_name`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `git_url`, `github_id`, `has_discussions`, `has_issues`, `has_pages`, `has_projects`, `has_wiki`, `homepage`, `hooks_url`, `html_url`, `id`, `issue_comment_url`, `issue_events_url`, `issues_url`, `keys_url`, `labels_url`, `language`, `languages_url`, `license`, `merges_url`, `milestones_url`, `mirror_url`, `name`, `network_count`, `node_id`, `notifications_url`, `open_issues`, `open_issues_count`, `organization`, `owner`, `parent`, `permissions`, `private`, `pulls_url`, `pushed_at`, `releases_url`, `size`, `source`, `ssh_url`, `stargazers_count`, `stargazers_url`, `statuses_url`, `subscribers_count`, `subscribers_url`, `subscription_url`, `svn_url`, `tags_url`, `teams_url`, `template_repository`, `trees_url`, `updated_at`, `url`, `watchers`, `watchers_count` |
| `provider/github/gist` | `list$`, `load$`, `save$`, `remove$` | `fork_of`, `owner` |
| `provider/github/gist_comment` | `list$`, `load$`, `save$` | `author_association`, `avatar_url`, `body`, `created_at`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `updated_at`, `url`, `user`, `gist_id` |
| `provider/github/gist_commit` | `list$` | `change_status`, `committed_at`, `url`, `user`, `version` |
| `provider/github/gist_simple` | `list$` | `fork_of`, `owner` |
| `provider/github/git` | `remove$` | `owner`, `repo` |
| `provider/github/git_commit` | `load$`, `save$` | `author`, `committer`, `html_url`, `message`, `node_id`, `parents`, `sha`, `tree`, `url`, `verification`, `owner`, `repo` |
| `provider/github/git_ref` | `load$`, `save$` | `node_id`, `object`, `ref`, `sha`, `type`, `url`, `owner`, `repo` |
| `provider/github/git_tag` | `load$`, `save$` | `message`, `node_id`, `object`, `sha`, `tag`, `tagger`, `type`, `url`, `verification`, `owner`, `repo` |
| `provider/github/git_tree` | `load$`, `save$` | `sha`, `tree`, `truncated`, `owner`, `repo` |
| `provider/github/gitignore` | `list$` | — |
| `provider/github/gitignore_template` | `load$` | `name`, `source` |
| `provider/github/global_advisory` | `list$`, `load$` | `credits`, `cve_id`, `cvss`, `cwes`, `description`, `ghsa_id`, `github_reviewed_at`, `html_url`, `identifiers`, `nvd_published_at`, `published_at`, `references`, `repository_advisory_url`, `severity`, `source_code_location`, `summary`, `type`, `updated_at`, `url`, `vulnerabilities`, `withdrawn_at` |
| `provider/github/gpg_key` | `list$`, `load$`, `save$` | `armored_public_key`, `can_certify`, `can_encrypt_comms`, `can_encrypt_storage`, `can_sign`, `created_at`, `emails`, `expires_at`, `id`, `key_id`, `primary_key_id`, `public_key`, `raw_key`, `revoked`, `subkeys` |
| `provider/github/hook` | `list$`, `load$`, `save$` | `active`, `config`, `created_at`, `events`, `id`, `last_response`, `name`, `ping_url`, `test_url`, `type`, `updated_at`, `url`, `owner`, `repo` |
| `provider/github/hook_delivery` | `load$` | `action`, `delivered_at`, `duration`, `event`, `guid`, `id`, `installation_id`, `redelivery`, `repository_id`, `request`, `response`, `status`, `status_code` |
| `provider/github/hook_delivery_item` | `list$` | `action`, `delivered_at`, `duration`, `event`, `guid`, `id`, `installation_id`, `redelivery`, `repository_id`, `status`, `status_code` |
| `provider/github/hosted_compute` | `list$`, `remove$` | `created_on`, `id`, `name`, `org_id` |
| `provider/github/hovercard` | `list$` | `message`, `octicon`, `username` |
| `provider/github/import` | `list$`, `save$` | `authors_url`, `html_url`, `repository_url`, `status`, `url`, `vcs`, `vcs_url`, `owner` |
| `provider/github/installation` | `list$`, `load$`, `save$`, `remove$` | `access_tokens_url`, `account`, `app_id`, `app_slug`, `created_at`, `events`, `html_url`, `id`, `permissions`, `repositories_url`, `repository_selection`, `single_file_name`, `suspended_at`, `suspended_by`, `target_id`, `target_type`, `updated_at` |
| `provider/github/installation_token` | `save$` | — |
| `provider/github/integration` | `list$`, `load$`, `save$`, `remove$` | `apps`, `created_at`, `description`, `events`, `external_url`, `html_url`, `id`, `name`, `node_id`, `owner`, `permissions`, `updated_at`, `branch_id`, `repo` |
| `provider/github/integration_installation` | `list$` | `account`, `created_at`, `id`, `requester` |
| `provider/github/interaction` | `load$`, `remove$` | — |
| `provider/github/interaction_limit` | `save$` | `expires_at`, `limit`, `origin` |
| `provider/github/issue` | `list$`, `load$`, `save$`, `remove$` | `actor`, `assignee`, `assigner`, `author_association`, `closed_at`, `closed_by`, `comments`, `comments_url`, `commit_id`, `commit_url`, `created_at`, `dismissed_review`, `event`, `events_url`, `html_url`, `id`, `issue`, `issue_dependencies_summary`, `issue_id`, `issue_url`, `label`, `labels`, `labels_url`, `locked`, `milestone`, `node_id`, `number`, `performed_via_github_app`, `project_card`, `pull_request`, `reactions`, `rename`, `repository`, `repository_url`, `requested_reviewer`, `requested_team`, `review_requester`, `state`, `sub_issue_id`, `sub_issues_summary`, `title`, `type`, `updated_at`, `url`, `user`, `owner`, `repo` |
| `provider/github/issue_type` | `list$`, `save$` | `description`, `id`, `name`, `node_id`, `org_id` |
| `provider/github/job` | `load$` | `check_run_url`, `completed_at`, `conclusion`, `created_at`, `head_branch`, `head_sha`, `html_url`, `id`, `labels`, `name`, `node_id`, `run_id`, `run_url`, `runner_group_id`, `runner_group_name`, `runner_id`, `runner_name`, `started_at`, `status`, `url`, `workflow_name`, `owner`, `repo` |
| `provider/github/key` | `list$`, `load$`, `save$` | `created_at`, `id`, `key`, `read_only`, `title`, `url`, `verified` |
| `provider/github/label` | `list$`, `load$`, `save$` | `color`, `default`, `description`, `id`, `name`, `node_id`, `url`, `owner`, `repo` |
| `provider/github/language` | `load$` | `owner` |
| `provider/github/license` | `list$`, `load$` | `body`, `conditions`, `content`, `description`, `download_url`, `encoding`, `featured`, `git_url`, `html_url`, `implementation`, `key`, `license`, `limitations`, `links`, `name`, `node_id`, `path`, `permissions`, `sha`, `size`, `spdx_id`, `type`, `url` |
| `provider/github/markdown` | `save$` | `text` |
| `provider/github/marketplace_listing_plan` | `list$` | `accounts_url`, `bullets`, `description`, `has_free_trial`, `id`, `monthly_price_in_cents`, `name`, `number`, `price_model`, `state`, `unit_name`, `url`, `yearly_price_in_cents` |
| `provider/github/marketplace_purchase` | `list$`, `load$` | `id`, `login`, `marketplace_purchase`, `type`, `url`, `plan_id` |
| `provider/github/member` | `list$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url`, `org_id` |
| `provider/github/membership` | `list$`, `load$`, `save$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url`, `enterprise`, `enterprise_team`, `team_id` |
| `provider/github/merged_upstream` | `save$` | `branch`, `owner`, `repo` |
| `provider/github/meta` | `list$`, `load$` | — |
| `provider/github/metaroot` | `load$` | `authorizations_url`, `code_search_url`, `commit_search_url`, `current_user_authorizations_html_url`, `current_user_repositories_url`, `current_user_url`, `emails_url`, `emojis_url`, `events_url`, `feeds_url`, `followers_url`, `following_url`, `gists_url`, `issue_search_url`, `issues_url`, `keys_url`, `label_search_url`, `notifications_url`, `organization_repositories_url`, `organization_teams_url`, `organization_url`, `public_gists_url`, `rate_limit_url`, `repository_search_url`, `repository_url`, `starred_gists_url`, `starred_url`, `user_organizations_url`, `user_repositories_url`, `user_search_url`, `user_url` |
| `provider/github/migration` | `list$`, `load$`, `save$`, `remove$` | `assignees_url`, `blobs_url`, `branches_url`, `code_of_conduct`, `collaborators_url`, `comments_url`, `commits_url`, `compare_url`, `contents_url`, `contributors_url`, `created_at`, `deployments_url`, `description`, `downloads_url`, `events_url`, `exclude_attachments`, `exclude_git_data`, `exclude_metadata`, `exclude_owner_projects`, `exclude_releases`, `fork`, `forks_url`, `full_name`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `guid`, `hooks_url`, `html_url`, `id`, `issue_comment_url`, `issue_events_url`, `issues_url`, `keys_url`, `labels_url`, `languages_url`, `lock_repositories`, `merges_url`, `milestones_url`, `name`, `node_id`, `notifications_url`, `org_metadata_only`, `owner`, `private`, `pulls_url`, `releases_url`, `repositories`, `stargazers_url`, `state`, `statuses_url`, `subscribers_url`, `subscription_url`, `tags_url`, `teams_url`, `trees_url`, `updated_at`, `url`, `repo` |
| `provider/github/milestone` | `list$`, `load$`, `save$` | `avatar_url`, `closed_at`, `closed_issues`, `created_at`, `creator`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `labels_url`, `login`, `node_id`, `number`, `open_issues`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `title`, `type`, `updated_at`, `url`, `owner`, `repo` |
| `provider/github/minimal_repository` | `list$` | `archive_url`, `assignees_url`, `blobs_url`, `branches_url`, `code_of_conduct`, `collaborators_url`, `comments_url`, `commits_url`, `compare_url`, `contents_url`, `contributors_url`, `deployments_url`, `description`, `downloads_url`, `events_url`, `fork`, `forks_url`, `full_name`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `hooks_url`, `html_url`, `id`, `issue_comment_url`, `issue_events_url`, `issues_url`, `keys_url`, `labels_url`, `languages_url`, `merges_url`, `milestones_url`, `name`, `node_id`, `notifications_url`, `owner`, `private`, `pulls_url`, `releases_url`, `stargazers_url`, `statuses_url`, `subscribers_url`, `subscription_url`, `tags_url`, `teams_url`, `trees_url`, `url` |
| `provider/github/network_configuration` | `load$`, `save$` | `created_on`, `id`, `name`, `org_id` |
| `provider/github/network_setting` | `load$` | `id`, `name`, `region`, `subnet_id`, `org_id` |
| `provider/github/oidc_custom_sub` | `list$` | `include_claim_keys`, `org_id` |
| `provider/github/oidc_custom_sub_repo` | `list$` | `use_default`, `owner`, `repo` |
| `provider/github/org` | `list$`, `load$`, `save$`, `remove$` | `access_tokens_url`, `account`, `action`, `app_id`, `app_slug`, `avatar_url`, `created_at`, `digest`, `events`, `events_url`, `hooks_url`, `html_url`, `id`, `issues_url`, `login`, `members_url`, `name`, `node_id`, `organization`, `organization_url`, `pat_ids`, `permissions`, `private_repos`, `properties`, `public_members_url`, `registry_url`, `repos_url`, `repositories_url`, `repository_names`, `repository_selection`, `role`, `single_file_name`, `space`, `state`, `subject_digests`, `suspended_at`, `suspended_by`, `target_id`, `target_type`, `updated_at`, `url`, `user`, `enablement`, `org`, `security_product`, `username` |
| `provider/github/org_hook` | `list$`, `load$`, `save$` | `active`, `config`, `created_at`, `events`, `id`, `name`, `ping_url`, `type`, `updated_at`, `url`, `org_id` |
| `provider/github/org_membership` | `load$`, `save$` | `organization`, `organization_url`, `permissions`, `role`, `state`, `url`, `user`, `org_id` |
| `provider/github/org_private_registry_configuration` | `load$` | `created_at`, `name`, `registry_type`, `updated_at`, `visibility`, `org_id` |
| `provider/github/org_private_registry_configuration_with_selected_repository` | `save$` | `encrypted_value`, `key_id`, `registry_type`, `url`, `visibility` |
| `provider/github/org_repo_custom_property_value` | `list$` | `properties`, `repository_full_name`, `repository_id`, `repository_name`, `org_id` |
| `provider/github/organization_actions_secret` | `load$` | `created_at`, `name`, `updated_at`, `visibility`, `org_id` |
| `provider/github/organization_actions_variable` | `load$` | `created_at`, `name`, `updated_at`, `value`, `visibility`, `org_id` |
| `provider/github/organization_dependabot_secret` | `load$` | `created_at`, `name`, `updated_at`, `visibility`, `org_id` |
| `provider/github/organization_invitation` | `list$`, `save$` | `created_at`, `id`, `invitation_teams_url`, `inviter`, `login`, `node_id`, `team_count`, `org_id` |
| `provider/github/organization_programmatic_access_grant` | `list$` | `access_granted_at`, `created_at`, `id`, `owner`, `permissions`, `reason`, `repositories_url`, `repository_selection`, `token_expired`, `token_expires_at`, `token_id`, `token_last_used_at`, `token_name`, `org_id` |
| `provider/github/organization_role` | `load$` | `created_at`, `id`, `name`, `organization`, `permissions`, `updated_at`, `org_id` |
| `provider/github/organization_secret_scanning_alert` | `list$` | `push_protection_bypass_request_reviewer`, `push_protection_bypassed_by`, `repository`, `resolved_by`, `org_id` |
| `provider/github/outside_collaborator` | `list$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url`, `org_id` |
| `provider/github/package` | `list$`, `load$`, `save$`, `remove$` | `container`, `created_at`, `docker`, `github_id`, `html_url`, `id`, `included_gigabytes_bandwidth`, `metadata`, `name`, `owner`, `package_html_url`, `package_type`, `repository`, `total_gigabytes_bandwidth_used`, `total_paid_gigabytes_bandwidth_used`, `updated_at`, `url`, `version_count`, `visibility`, `package_id` |
| `provider/github/page` | `load$`, `save$` | `cname`, `custom_404`, `https_certificate`, `public`, `source`, `status`, `url`, `owner` |
| `provider/github/page_build` | `list$`, `load$` | `commit`, `created_at`, `duration`, `error`, `pusher`, `status`, `updated_at`, `url`, `owner`, `repo` |
| `provider/github/page_build_status` | `save$` | `owner`, `repo` |
| `provider/github/page_deployment` | `save$` | `oidc_token`, `pages_build_version`, `owner`, `repo` |
| `provider/github/pages_deployment_status` | `load$`, `save$` | `deployment_id`, `owner`, `repo` |
| `provider/github/pages_health_check` | `load$` | `owner` |
| `provider/github/participation` | `list$` | `all`, `owner`, `repo` |
| `provider/github/pending_deployment` | `list$` | `current_user_can_approve`, `environment`, `reviewers`, `wait_timer`, `wait_timer_started_at`, `owner`, `repo`, `run_id` |
| `provider/github/porter_author` | `list$`, `save$` | `email`, `id`, `import_url`, `name`, `remote_id`, `remote_name`, `url`, `owner`, `repo` |
| `provider/github/porter_large_file` | `list$` | `oid`, `path`, `ref_name`, `size`, `owner`, `repo` |
| `provider/github/private_registry` | `list$`, `load$`, `save$`, `remove$` | `created_at`, `key`, `key_id`, `name`, `updated_at` |
| `provider/github/project` | `list$`, `load$`, `save$`, `remove$` | `avatar_url`, `columns_url`, `created_at`, `creator`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `number`, `organizations_url`, `owner_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `updated_at`, `url`, `org_id` |
| `provider/github/project_collaborator_permission` | `load$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url`, `project_id` |
| `provider/github/project_column` | `list$`, `load$`, `save$` | `cards_url`, `created_at`, `id`, `name`, `node_id`, `project_url`, `updated_at`, `url` |
| `provider/github/projects_classic` | `save$`, `remove$` | `position`, `project_id`, `username` |
| `provider/github/projects_v2` | `list$`, `load$` | `closed_at`, `created_at`, `creator`, `deleted_at`, `deleted_by`, `description`, `id`, `latest_status_update`, `node_id`, `number`, `owner`, `public`, `short_description`, `title`, `updated_at`, `org_id` |
| `provider/github/projects_v2_field` | `list$`, `load$` | `created_at`, `data_type`, `id`, `name`, `project_url`, `updated_at`, `project_number`, `projects_v2_id` |
| `provider/github/projects_v2_item_simple` | `save$` | `id`, `type`, `project_number` |
| `provider/github/projects_v2_item_with_content` | `list$`, `load$`, `save$` | `archived_at`, `content_type`, `created_at`, `creator`, `id`, `updated_at`, `project_number`, `projects_v2_id` |
| `provider/github/protected_branch` | `save$` | `allow_deletions`, `allow_force_pushes`, `block_creations`, `enforce_admins`, `required_linear_history`, `required_pull_request_reviews`, `required_signatures`, `required_status_checks`, `restrictions`, `url`, `owner`, `repo` |
| `provider/github/protected_branch_admin_enforced` | `load$`, `save$` | `enabled`, `url`, `owner`, `repo` |
| `provider/github/protected_branch_pull_request_review` | `load$`, `save$` | `dismiss_stale_reviews`, `require_code_owner_reviews`, `owner`, `repo` |
| `provider/github/public_member` | `list$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url`, `org_id` |
| `provider/github/pull` | `list$`, `load$`, `save$`, `remove$` | `additions`, `assignee`, `author_association`, `auto_merge`, `base`, `body`, `changed_files`, `closed_at`, `comments`, `comments_url`, `commits`, `commits_url`, `created_at`, `deletions`, `diff_url`, `head`, `html_url`, `id`, `issue_url`, `labels`, `links`, `locked`, `maintainer_can_modify`, `merge_commit_sha`, `mergeable`, `mergeable_state`, `merged`, `merged_at`, `merged_by`, `message`, `milestone`, `node_id`, `number`, `patch_url`, `review_comment_url`, `review_comments`, `review_comments_url`, `sha`, `state`, `statuses_url`, `title`, `updated_at`, `url`, `user`, `comment_id`, `owner`, `repo` |
| `provider/github/pull_request_review` | `list$`, `load$`, `save$`, `remove$` | `author_association`, `body`, `commit_id`, `event`, `html_url`, `id`, `links`, `message`, `node_id`, `pull_request_url`, `state`, `teams`, `user`, `users`, `owner`, `pull_id`, `pull_number`, `repo` |
| `provider/github/pull_request_review_comment` | `list$`, `load$`, `save$` | `author_association`, `body`, `commit_id`, `created_at`, `diff_hunk`, `html_url`, `id`, `links`, `node_id`, `original_commit_id`, `path`, `pull_request_review_id`, `pull_request_url`, `reactions`, `updated_at`, `url`, `user`, `owner`, `repo` |
| `provider/github/pull_request_simple` | `save$`, `remove$` | `owner`, `repo` |
| `provider/github/rate_limit` | `load$` | `rate`, `resources` |
| `provider/github/reaction` | `list$`, `save$`, `remove$` | `avatar_url`, `content`, `created_at`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url`, `user`, `discussion_number`, `team_id` |
| `provider/github/referrer` | `list$` | `count`, `referrer`, `uniques`, `owner`, `repo` |
| `provider/github/release` | `list$`, `load$`, `save$` | `assets`, `assets_url`, `author`, `browser_download_url`, `content_type`, `created_at`, `digest`, `download_count`, `draft`, `html_url`, `id`, `label`, `name`, `node_id`, `prerelease`, `published_at`, `reactions`, `size`, `state`, `tag_name`, `tarball_url`, `target_commitish`, `upload_url`, `uploader`, `url`, `zipball_url`, `owner`, `repo` |
| `provider/github/release_asset` | `list$`, `load$`, `save$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url`, `name`, `owner`, `repo` |
| `provider/github/release_notes_content` | `save$` | `body`, `name`, `tag_name`, `owner`, `repo` |
| `provider/github/remove` | `save$` | `usernames`, `enterprise`, `team_id` |
| `provider/github/repo` | `list$`, `load$`, `save$`, `remove$` | `app`, `archive_url`, `archived`, `assignees_url`, `blobs_url`, `branches_url`, `bundle`, `clone_url`, `collaborators_url`, `comments_url`, `commits_url`, `compare_url`, `contents_url`, `contributors_url`, `created_at`, `default_branch`, `deployment_branch_policy`, `deployments_url`, `description`, `disabled`, `downloads_url`, `enabled`, `event_type`, `events_url`, `fork`, `forks`, `forks_count`, `forks_url`, `full_name`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `github_id`, `has_downloads`, `has_issues`, `has_pages`, `has_projects`, `has_wiki`, `homepage`, `hooks_url`, `id`, `integration_url`, `issue_comment_url`, `issue_events_url`, `issues_url`, `keys_url`, `labels_url`, `language`, `languages_url`, `license`, `merges_url`, `milestones_url`, `mirror_url`, `new_owner`, `node_id`, `notifications_url`, `open_issues`, `open_issues_count`, `owner`, `permissions`, `private`, `properties`, `pulls_url`, `pushed_at`, `releases_url`, `slug`, `ssh_url`, `stargazers_count`, `stargazers_url`, `statuses_url`, `subscribers_url`, `subscription_url`, `svn_url`, `tags_url`, `teams_url`, `trees_url`, `updated_at`, `watchers`, `watchers_count`, `branch_id`, `invitation_id`, `repo` |
| `provider/github/repository` | `list$` | `archive_url`, `archived`, `assignees_url`, `blobs_url`, `branches_url`, `clone_url`, `collaborators_url`, `comments_url`, `commits_url`, `compare_url`, `contents_url`, `contributors_url`, `created_at`, `default_branch`, `deployments_url`, `description`, `disabled`, `downloads_url`, `events_url`, `fork`, `forks`, `forks_count`, `forks_url`, `full_name`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `git_url`, `has_downloads`, `has_issues`, `has_pages`, `has_projects`, `has_wiki`, `homepage`, `hooks_url`, `html_url`, `id`, `issue_comment_url`, `issue_events_url`, `issues_url`, `keys_url`, `labels_url`, `language`, `languages_url`, `license`, `merges_url`, `milestones_url`, `mirror_url`, `name`, `node_id`, `notifications_url`, `open_issues`, `open_issues_count`, `owner`, `permissions`, `private`, `pulls_url`, `pushed_at`, `releases_url`, `size`, `ssh_url`, `stargazers_count`, `stargazers_url`, `statuses_url`, `subscribers_url`, `subscription_url`, `svn_url`, `tags_url`, `teams_url`, `trees_url`, `updated_at`, `url`, `watchers`, `watchers_count` |
| `provider/github/repository_advisory` | `list$`, `load$`, `save$` | `author`, `closed_at`, `collaborating_teams`, `collaborating_users`, `created_at`, `credits`, `credits_detailed`, `cve_id`, `cvss`, `cwe_ids`, `cwes`, `description`, `ghsa_id`, `html_url`, `identifiers`, `private_fork`, `published_at`, `publisher`, `severity`, `state`, `submission`, `summary`, `updated_at`, `url`, `vulnerabilities`, `withdrawn_at`, `org_id`, `owner`, `repo` |
| `provider/github/repository_collaborator_permission` | `load$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `permissions`, `received_events_url`, `repos_url`, `role_name`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url`, `owner`, `repo` |
| `provider/github/repository_invitation` | `list$`, `save$` | `created_at`, `html_url`, `id`, `invitee`, `inviter`, `node_id`, `permissions`, `repository`, `url`, `owner`, `repo` |
| `provider/github/repository_rule_detailed` | `load$` | `owner`, `repo` |
| `provider/github/repository_ruleset` | `list$`, `load$`, `save$` | `enforcement`, `id`, `name`, `source`, `org_id` |
| `provider/github/repository_subscription` | `load$`, `save$` | `created_at`, `ignored`, `reason`, `repository_url`, `subscribed`, `url`, `owner` |
| `provider/github/review_comment` | `list$` | `author_association`, `body`, `commit_id`, `created_at`, `diff_hunk`, `html_url`, `id`, `links`, `node_id`, `original_commit_id`, `original_position`, `path`, `position`, `pull_request_review_id`, `pull_request_url`, `reactions`, `updated_at`, `url`, `user`, `owner`, `pull_id`, `repo` |
| `provider/github/rule_suite` | `list$`, `load$` | `org_id` |
| `provider/github/ruleset_version` | `list$` | `actor`, `updated_at`, `version_id` |
| `provider/github/ruleset_version_with_state` | `load$` | `actor`, `state`, `updated_at`, `version_id`, `ruleset_id` |
| `provider/github/runner` | `load$` | `busy`, `id`, `labels`, `name`, `os`, `status` |
| `provider/github/runner_application` | `list$` | `architecture`, `download_url`, `filename`, `os`, `org_id` |
| `provider/github/runner_group` | `load$`, `save$` | `allows_public_repositories`, `default`, `id`, `inherited`, `name`, `runners_url`, `visibility`, `org_id` |
| `provider/github/search` | `list$` | `archive_url`, `archived`, `assignee`, `assignees_url`, `author`, `author_association`, `avatar_url`, `blobs_url`, `branches_url`, `clone_url`, `closed_at`, `collaborators_url`, `color`, `comments`, `comments_url`, `commit`, `commits_url`, `committer`, `compare_url`, `contents_url`, `contributors_url`, `created_at`, `created_by`, `curated`, `default`, `default_branch`, `deployments_url`, `description`, `disabled`, `display_name`, `downloads_url`, `events_url`, `featured`, `followers_url`, `following_url`, `fork`, `forks`, `forks_count`, `forks_url`, `full_name`, `gists_url`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `git_url`, `gravatar_id`, `has_downloads`, `has_issues`, `has_pages`, `has_projects`, `has_wiki`, `homepage`, `hooks_url`, `html_url`, `id`, `issue_comment_url`, `issue_dependencies_summary`, `issue_events_url`, `issues_url`, `keys_url`, `labels`, `labels_url`, `languages_url`, `license`, `locked`, `login`, `merges_url`, `milestone`, `milestones_url`, `mirror_url`, `name`, `node_id`, `notifications_url`, `number`, `open_issues`, `open_issues_count`, `organizations_url`, `owner`, `parents`, `path`, `performed_via_github_app`, `permissions`, `private`, `pull_request`, `pulls_url`, `pushed_at`, `reactions`, `received_events_url`, `released`, `releases_url`, `repos_url`, `repository`, `repository_url`, `score`, `sha`, `short_description`, `site_admin`, `size`, `ssh_url`, `stargazers_count`, `stargazers_url`, `starred_url`, `state`, `statuses_url`, `sub_issues_summary`, `subscribers_url`, `subscription_url`, `subscriptions_url`, `svn_url`, `tags_url`, `teams_url`, `title`, `trees_url`, `type`, `updated_at`, `url`, `user`, `watchers`, `watchers_count`, `q` |
| `provider/github/secret_scanning` | `save$` | — |
| `provider/github/secret_scanning_alert` | `list$`, `load$`, `save$` | `push_protection_bypass_request_reviewer`, `push_protection_bypassed_by`, `resolved_by`, `owner`, `repo` |
| `provider/github/secret_scanning_location` | `list$` | `alert_number`, `owner`, `repo` |
| `provider/github/secret_scanning_pattern_configuration` | `list$` | `org_id` |
| `provider/github/secret_scanning_push_protection_bypass` | `save$` | `placeholder_id`, `owner`, `repo` |
| `provider/github/secret_scanning_scan_history` | `list$` | `owner`, `repo` |
| `provider/github/security_advisory` | `save$` | `owner`, `repo` |
| `provider/github/selected_action` | `list$` | `org_id` |
| `provider/github/self_hosted_runner` | `load$` | `enabled_repositories` |
| `provider/github/short_blob` | `save$` | `content`, `owner`, `repo` |
| `provider/github/short_branch` | `list$` | `commit`, `name`, `protected`, `owner`, `repo` |
| `provider/github/simple_classroom_assignment` | `list$` | `accepted`, `classroom`, `deadline`, `editor`, `feedback_pull_requests_enabled`, `id`, `invitations_enabled`, `invite_link`, `language`, `passing`, `public_repo`, `slug`, `students_are_repo_admins`, `submitted`, `title`, `type`, `classroom_id` |
| `provider/github/social_account` | `list$`, `save$` | `account_urls`, `provider`, `url` |
| `provider/github/ssh_signing_key` | `list$`, `load$`, `save$` | `created_at`, `id`, `key`, `title` |
| `provider/github/status` | `list$`, `save$` | `avatar_url`, `created_at`, `creator`, `id`, `node_id`, `state`, `updated_at`, `url`, `owner`, `ref`, `repo` |
| `provider/github/status_check_policy` | `list$`, `save$` | `app_id`, `checks`, `context`, `contexts`, `contexts_url`, `strict`, `url`, `owner`, `repo` |
| `provider/github/subscriber` | `list$` | `avatar_url`, `events_url`, `followers_url`, `following_url`, `gists_url`, `gravatar_id`, `html_url`, `id`, `login`, `node_id`, `organizations_url`, `received_events_url`, `repos_url`, `site_admin`, `starred_url`, `subscriptions_url`, `type`, `url`, `owner`, `repo` |
| `provider/github/tag` | `list$` | `commit`, `name`, `node_id`, `tarball_url`, `zipball_url`, `owner`, `repo` |
| `provider/github/tag_protection` | `list$`, `save$` | `pattern`, `owner`, `repo` |
| `provider/github/team` | `list$`, `load$`, `save$`, `remove$` | `archive_url`, `archived`, `assignees_url`, `author`, `avatar_url`, `blobs_url`, `body`, `body_html`, `body_version`, `branches_url`, `clone_url`, `code_of_conduct`, `collaborators_url`, `columns_url`, `comments_count`, `comments_url`, `commits_url`, `compare_url`, `contents_url`, `contributors_url`, `created_at`, `creator`, `default_branch`, `deployments_url`, `description`, `disabled`, `discussion_url`, `downloads_url`, `events_url`, `followers_url`, `following_url`, `fork`, `forks`, `forks_count`, `forks_url`, `full_name`, `gists_url`, `git_commits_url`, `git_refs_url`, `git_tags_url`, `git_url`, `gravatar_id`, `has_downloads`, `has_issues`, `has_pages`, `has_projects`, `has_wiki`, `homepage`, `hooks_url`, `html_url`, `id`, `invitation_teams_url`, `inviter`, `issue_comment_url`, `issue_events_url`, `issues_url`, `keys_url`, `labels_url`, `language`, `languages_url`, `last_edited_at`, `license`, `login`, `members_count`, `members_url`, `merges_url`, `milestones_url`, `mirror_url`, `name`, `node_id`, `notifications_url`, `number`, `open_issues`, `open_issues_count`, `organization`, `organizations_url`, `owner`, `owner_url`, `parent`, `permission`, `permissions`, `pinned`, `private`, `pulls_url`, `pushed_at`, `reactions`, `received_events_url`, `releases_url`, `repos_count`, `repos_url`, `repositories_url`, `role`, `site_admin`, `size`, `slug`, `ssh_url`, `stargazers_count`, `stargazers_url`, `starred_url`, `state`, `statuses_url`, `subscribers_url`, `subscription_url`, `subscriptions_url`, `svn_url`, `tags_url`, `team_count`, `team_url`, `teams_url`, `title`, `trees_url`, `type`, `updated_at`, `url`, `watchers`, `watchers_count`, `org_id`, `project_id` |
| `provider/github/team_simple` | `list$` | `description`, `html_url`, `id`, `members_url`, `name`, `node_id`, `permission`, `repositories_url`, `slug`, `url`, `org_id` |
| `provider/github/thread` | `list$`, `load$`, `remove$` | `id`, `last_read_at`, `reason`, `repository`, `subject`, `subscription_url`, `unread`, `updated_at`, `url` |
| `provider/github/thread_subscription` | `load$`, `save$` | `created_at`, `ignored`, `reason`, `subscribed`, `url` |
| `provider/github/topic` | `list$`, `save$` | `names`, `owner` |
| `provider/github/user` | `list$`, `load$`, `save$`, `remove$` | `private_repos`, `space`, `subject_digests`, `users`, `branch_id`, `gpg_key_id`, `owner`, `repo`, `username` |
| `provider/github/user_marketplace_purchase` | `list$` | `account`, `billing_cycle`, `free_trial_ends_on`, `next_billing_date`, `on_free_trial`, `plan`, `unit_count`, `updated_at` |
| `provider/github/view` | `list$` | `count`, `timestamp`, `uniques`, `owner`, `repo` |
| `provider/github/webhook_config` | `load$`, `save$` | — |
| `provider/github/workflow` | `load$`, `save$` | `badge_url`, `created_at`, `html_url`, `id`, `name`, `node_id`, `path`, `state`, `updated_at`, `url`, `owner`, `repo` |
| `provider/github/workflow_run` | `load$`, `save$` | `actor`, `artifacts_url`, `cancel_url`, `check_suite_url`, `conclusion`, `created_at`, `display_title`, `event`, `head_branch`, `head_commit`, `head_repository`, `head_sha`, `html_url`, `id`, `jobs_url`, `logs_url`, `node_id`, `path`, `pull_requests`, `repository`, `rerun_url`, `run_number`, `status`, `triggering_actor`, `updated_at`, `url`, `workflow_id`, `workflow_url`, `owner`, `repo`, `run_id` |
| `provider/github/workflow_run_usage` | `load$` | `MACOS`, `UBUNTU`, `WINDOWS`, `owner`, `repo` |
| `provider/github/workflow_usage` | `load$` | `owner`, `repo` |

### Nested entities

Some entities live under a parent in the API path, so every command needs the
parent's id in the query. Leaving it out throws with a message naming the
missing key, rather than failing as an opaque 404 from a half-built URL.

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

### Actions

Some API endpoints are not one of the five CRUD operations — merging a pull
request, uploading an image. The API definition folds each one into an
ordinary operation as an alternative route, and this plugin selects one with
the `action$` directive, alongside Seneca's own `sort$`, `limit$` and
`fields$`.

| Entity | Action | Route | Command |
| --- | --- | --- | --- |
| `action` | `artifact` | `/repos/{owner}/{repo}/actions/artifacts` | `list$` |
| `action` | `hosted_runner` | `/orgs/{org}/actions/hosted-runners` | `list$` |
| `action` | `organization_secret` | `/repos/{owner}/{repo}/actions/organization-secrets` | `list$` |
| `action` | `organization_variable` | `/repos/{owner}/{repo}/actions/organization-variables` | `list$` |
| `action` | `run` | `/repos/{owner}/{repo}/actions/runs` | `list$` |
| `action` | `runner` | `/repos/{owner}/{repo}/actions/runners` | `list$` |
| `action` | `runner` | `/orgs/{org}/actions/runners` | `list$` |
| `action` | `runner_group` | `/orgs/{org}/actions/runner-groups` | `list$` |
| `action` | `secret` | `/repos/{owner}/{repo}/actions/secrets` | `list$` |
| `action` | `secret` | `/orgs/{org}/actions/secrets` | `list$` |
| `action` | `variable` | `/repos/{owner}/{repo}/actions/variables` | `list$` |
| `action` | `variable` | `/orgs/{org}/actions/variables` | `list$` |
| `action` | `workflow` | `/repos/{owner}/{repo}/actions/workflows` | `list$` |
| `action` | `permission` | `/repos/{owner}/{repo}/actions/permissions` | `save$` |
| `action` | `permission` | `/orgs/{org}/actions/permissions` | `save$` |
| `branch_with_protection` | `rename` | `/repos/{owner}/{repo}/branches/{branch}/rename` | `save$` |
| `code_scanning` | `sarif` | `/repos/{owner}/{repo}/code-scanning/sarifs` | `save$` |
| `code_security_configuration` | `attach` | `/enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach` | `save$` |
| `code_security_configuration` | `attach` | `/orgs/{org}/code-security/configurations/{configuration_id}/attach` | `save$` |
| `codespace` | `devcontainer` | `/repos/{owner}/{repo}/codespaces/devcontainers` | `list$` |
| `codespace` | `machine` | `/repos/{owner}/{repo}/codespaces/machines` | `list$` |
| `codespace` | `machine` | `/user/codespaces/{codespace_name}/machines` | `list$` |
| `codespace` | `secret` | `/repos/{owner}/{repo}/codespaces/secrets` | `list$` |
| `codespace` | `secret` | `/orgs/{org}/codespaces/secrets` | `list$` |
| `codespace` | `secret` | `/user/codespaces/secrets` | `list$` |
| `codespace` | `new` | `/repos/{owner}/{repo}/codespaces/new` | `load$` |
| `codespace` | `permissions_check` | `/repos/{owner}/{repo}/codespaces/permissions_check` | `load$` |
| `codespace` | `export` | `/user/codespaces/{codespace_name}/exports` | `save$` |
| `codespace` | `publish` | `/user/codespaces/{codespace_name}/publish` | `save$` |
| `codespace` | `start` | `/user/codespaces/{codespace_name}/start` | `save$` |
| `codespace` | `stop` | `/orgs/{org}/members/{username}/codespaces/{codespace_name}/stop` | `save$` |
| `codespace` | `stop` | `/user/codespaces/{codespace_name}/stop` | `save$` |
| `codespace` | `access` | `/orgs/{org}/codespaces/access` | `save$` |
| `credential` | `revoke` | `/credentials/revoke` | `save$` |
| `dependabot` | `secret` | `/repos/{owner}/{repo}/dependabot/secrets` | `list$` |
| `dependabot` | `secret` | `/orgs/{org}/dependabot/secrets` | `list$` |
| `dependency_graph` | `snapshot` | `/repos/{owner}/{repo}/dependency-graph/snapshots` | `save$` |
| `email` | `visibility` | `/user/email/visibility` | `save$` |
| `event` | `public` | `/users/{username}/events/public` | `list$` |
| `gist` | `star` | `/gists/{gist_id}/star` | `load$` |
| `gist` | `star` | `/gists/{gist_id}/star` | `remove$` |
| `gist` | `star` | `/gists/{gist_id}/star` | `save$` |
| `gist_simple` | `forks` | `/gists/{gist_id}/forks` | `list$` |
| `gitignore` | `template` | `/gitignore/templates` | `list$` |
| `hook_delivery_item` | `deliveries` | `/repos/{owner}/{repo}/hooks/{hook_id}/deliveries` | `list$` |
| `hook_delivery_item` | `deliveries` | `/orgs/{org}/hooks/{hook_id}/deliveries` | `list$` |
| `installation` | `suspended` | `/app/installations/{installation_id}/suspended` | `remove$` |
| `installation` | `suspended` | `/app/installations/{installation_id}/suspended` | `save$` |
| `installation_token` | `access_tokens` | `/app/installations/{installation_id}/access_tokens` | `save$` |
| `issue` | `comment` | `/repos/{owner}/{repo}/issues/comments` | `list$` |
| `issue` | `comment` | `/repos/{owner}/{repo}/issues/{issue_number}/comments` | `list$` |
| `issue` | `dependency_blocked_by` | `/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by` | `list$` |
| `issue` | `dependency_blocking` | `/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocking` | `list$` |
| `issue` | `event` | `/repos/{owner}/{repo}/issues/{issue_number}/events` | `list$` |
| `issue` | `event` | `/repos/{owner}/{repo}/issues/events` | `list$` |
| `issue` | `label` | `/repos/{owner}/{repo}/issues/{issue_number}/labels` | `list$` |
| `issue` | `parent` | `/repos/{owner}/{repo}/issues/{issue_number}/parent` | `list$` |
| `issue` | `sub_issue` | `/repos/{owner}/{repo}/issues/{issue_number}/sub_issues` | `list$` |
| `issue` | `timeline` | `/repos/{owner}/{repo}/issues/{issue_number}/timeline` | `list$` |
| `issue` | `assignee` | `/repos/{owner}/{repo}/issues/{issue_number}/assignees` | `remove$` |
| `issue` | `label` | `/repos/{owner}/{repo}/issues/{issue_number}/labels` | `remove$` |
| `issue` | `lock` | `/repos/{owner}/{repo}/issues/{issue_number}/lock` | `remove$` |
| `issue` | `sub_issue` | `/repos/{owner}/{repo}/issues/{issue_number}/sub_issue` | `remove$` |
| `issue` | `assignee` | `/repos/{owner}/{repo}/issues/{issue_number}/assignees` | `save$` |
| `issue` | `comment` | `/repos/{owner}/{repo}/issues/{issue_number}/comments` | `save$` |
| `issue` | `dependency_blocked_by` | `/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by` | `save$` |
| `issue` | `label` | `/repos/{owner}/{repo}/issues/{issue_number}/labels` | `save$` |
| `issue` | `sub_issue` | `/repos/{owner}/{repo}/issues/{issue_number}/sub_issues` | `save$` |
| `issue` | `lock` | `/repos/{owner}/{repo}/issues/{issue_number}/lock` | `save$` |
| `issue` | `sub_issue_priority` | `/repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority` | `save$` |
| `markdown` | `raw` | `/markdown/raw` | `save$` |
| `migration` | `repository` | `/orgs/{org}/migrations/{migration_id}/repositories` | `list$` |
| `migration` | `repository` | `/user/migrations/{migration_id}/repositories` | `list$` |
| `migration` | `archive` | `/orgs/{org}/migrations/{migration_id}/archive` | `load$` |
| `migration` | `archive` | `/user/migrations/{migration_id}/archive` | `load$` |
| `migration` | `archive` | `/orgs/{org}/migrations/{migration_id}/archive` | `remove$` |
| `migration` | `archive` | `/user/migrations/{migration_id}/archive` | `remove$` |
| `org` | `installation` | `/orgs/{org}/installations` | `list$` |
| `org` | `organization_role` | `/orgs/{org}/organization-roles` | `list$` |
| `org` | `personal_access_token` | `/orgs/{org}/personal-access-tokens` | `save$` |
| `org` | `personal_access_token_request` | `/orgs/{org}/personal-access-token-requests` | `save$` |
| `org_private_registry_configuration_with_selected_repository` | `private-registries` | `/orgs/{org}/private-registries` | `save$` |
| `package` | `restore` | `/orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore` | `save$` |
| `package` | `restore` | `/users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore` | `save$` |
| `package` | `restore` | `/user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore` | `save$` |
| `pages_deployment_status` | `cancel` | `/repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel` | `save$` |
| `private_registry` | `public_key` | `/orgs/{org}/private-registries/public-key` | `load$` |
| `pull` | `merge` | `/repos/{owner}/{repo}/pulls/{pull_number}/merge` | `load$` |
| `pull` | `merge` | `/repos/{owner}/{repo}/pulls/{pull_number}/merge` | `save$` |
| `pull` | `update_branch` | `/repos/{owner}/{repo}/pulls/{pull_number}/update-branch` | `save$` |
| `release` | `latest` | `/repos/{owner}/{repo}/releases/latest` | `list$` |
| `repo` | `environment` | `/repos/{owner}/{repo}/environments` | `list$` |
| `repo` | `private_vulnerability_reporting` | `/repos/{owner}/{repo}/private-vulnerability-reporting` | `load$` |
| `repo` | `vulnerability_alert` | `/repos/{owner}/{repo}/vulnerability-alerts` | `load$` |
| `repo` | `automated_security_fix` | `/repos/{owner}/{repo}/automated-security-fixes` | `remove$` |
| `repo` | `page` | `/repos/{owner}/{repo}/pages` | `remove$` |
| `repo` | `private_vulnerability_reporting` | `/repos/{owner}/{repo}/private-vulnerability-reporting` | `remove$` |
| `repo` | `vulnerability_alert` | `/repos/{owner}/{repo}/vulnerability-alerts` | `remove$` |
| `repo` | `attestation` | `/repos/{owner}/{repo}/attestations` | `save$` |
| `repo` | `dispatch` | `/repos/{owner}/{repo}/dispatches` | `save$` |
| `repo` | `fork` | `/repos/{owner}/{repo}/forks` | `save$` |
| `repo` | `transfer` | `/repos/{owner}/{repo}/transfer` | `save$` |
| `repo` | `automated_security_fix` | `/repos/{owner}/{repo}/automated-security-fixes` | `save$` |
| `repo` | `page` | `/repos/{owner}/{repo}/pages` | `save$` |
| `repo` | `private_vulnerability_reporting` | `/repos/{owner}/{repo}/private-vulnerability-reporting` | `save$` |
| `repo` | `vulnerability_alert` | `/repos/{owner}/{repo}/vulnerability-alerts` | `save$` |
| `repository_advisory` | `cve` | `/repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve` | `save$` |
| `ruleset_version` | `history` | `/repos/{owner}/{repo}/rulesets/{ruleset_id}/history` | `list$` |
| `ruleset_version` | `history` | `/orgs/{org}/rulesets/{ruleset_id}/history` | `list$` |
| `search` | `code` | `/search/code` | `list$` |
| `search` | `commit` | `/search/commits` | `list$` |
| `search` | `issue` | `/search/issues` | `list$` |
| `search` | `label` | `/search/labels` | `list$` |
| `search` | `repository` | `/search/repositories` | `list$` |
| `search` | `topic` | `/search/topics` | `list$` |
| `search` | `user` | `/search/users` | `list$` |
| `secret_scanning` | `pattern_configuration` | `/orgs/{org}/secret-scanning/pattern-configurations` | `save$` |
| `security_advisory` | `fork` | `/repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks` | `save$` |
| `team` | `discussion` | `/orgs/{org}/teams/{team_slug}/discussions` | `list$` |
| `team` | `discussion` | `/teams/{team_id}/discussions` | `list$` |
| `team` | `invitation` | `/orgs/{org}/teams/{team_slug}/invitations` | `list$` |
| `team` | `invitation` | `/teams/{team_id}/invitations` | `list$` |
| `team` | `member` | `/orgs/{org}/teams/{team_slug}/members` | `list$` |
| `team` | `member` | `/teams/{team_id}/members` | `list$` |
| `team` | `project` | `/orgs/{org}/teams/{team_slug}/projects` | `list$` |
| `team` | `project` | `/teams/{team_id}/projects` | `list$` |
| `team` | `repo` | `/orgs/{org}/teams/{team_slug}/repos` | `list$` |
| `team` | `repo` | `/teams/{team_id}/repos` | `list$` |
| `team` | `discussion` | `/orgs/{org}/teams/{team_slug}/discussions` | `save$` |
| `team` | `discussion` | `/teams/{team_id}/discussions` | `save$` |
| `thread` | `subscription` | `/notifications/threads/{thread_id}/subscription` | `remove$` |
| `user` | `email` | `/user/emails` | `remove$` |
| `user` | `social_account` | `/user/social_accounts` | `remove$` |
| `user` | `attestation_bulk_list` | `/users/{username}/attestations/bulk-list` | `save$` |
| `user` | `attestation_delete_request` | `/users/{username}/attestations/delete-request` | `save$` |
| `workflow` | `disable` | `/repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable` | `save$` |
| `workflow` | `enable` | `/repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable` | `save$` |
| `workflow_run` | `cancel` | `/repos/{owner}/{repo}/actions/runs/{run_id}/cancel` | `save$` |
| `workflow_run` | `deployment_protection_rule` | `/repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule` | `save$` |
| `workflow_run` | `force_cancel` | `/repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel` | `save$` |
| `workflow_usage` | `timing` | `/repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing` | `load$` |

An action returns that action's OWN response, which is not necessarily a
record of the entity it hangs off — check the API definition for its shape.
Naming an action the entity does not have throws, and names the ones it
does have. It never falls back to the plain command.

On `save$`, pass it as a directive. The rest of the entity is the
action's payload:

```js
const action = seneca.entity('provider/github/action')

await action
  .make$({ id: 'some-id', /* ...the action's own arguments */ })
  .directive$({ action$: 'permission' })
  .save$()
```

> **`make$({ action$: 'permission' })` does not work**, and cannot.
> `seneca-entity`'s `make$` copies only keys without a `$`, plus the four
> directives it knows by name (`id$`, `merge$`, `custom$`, `directive$`),
> so any other trailing-`$` key is dropped before this plugin sees it —
> there is nothing left for it to refuse. Use `directive$` as above, or
> assign the property to an entity you already made:
>
> ```js
> const p = action.make$({ id: 'some-id' })
> p.action$ = 'permission'
> await p.save$()
> ```

On `list$`, pass it in the query:

```js
await seneca.entity('provider/github/action')
  .list$({ action$: 'artifact' })
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
| `sys:entity,cmd:list,zone:provider,base:github,name:action` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:action` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:action` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:action` | Remove a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_artifact_and_log_retention` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:actions_cache_list` | List records. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:actions_cache_list` | Remove a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_cache_usage_by_repository` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_cache_usage_org_enterprise` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_fork_pr_contributor_approval` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_fork_pr_workflows_private_repo` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_get_default_workflow_permission` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_hosted_runner` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:actions_hosted_runner` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_hosted_runner_limit` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_organization_permission` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_public_key` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_repository_permission` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_secret` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_variable` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:actions_workflow_access_to_repository` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:activity` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:activity` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:activity` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:activity` | Remove a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:add` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:api_insights_route_stat` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:api_insights_subject_stat` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:api_insights_summary_stat` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:api_insights_time_stat` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:api_insights_time_stat` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:api_insights_user_stat` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:api_overview` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:app` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:app` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:app` | Remove a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:artifact` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:assignee` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:authentication_token` | Create or update a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:authorization` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:autolink` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:autolink` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:autolink` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:base_gist` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:base_gist` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:billing_usage_report` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:billing_usage_report_user` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:blob` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:block` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:branch` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:branch_protection` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:branch_restriction_policy` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:branch_short` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:branch_with_protection` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:campaign` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:campaign` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:campaign` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:campaign` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:check` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:check_annotation` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:check_automated_security_fix` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:check_run` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:check_run` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:check_suite` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:check_suite` | Create or update a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:check_suite_preference` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:classroom` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:classroom` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:classroom_accepted_assignment` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:classroom_assignment` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:classroom_assignment_grade` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:clone` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:code_frequency` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:code_frequency_stat` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:code_of_conduct` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:code_of_conduct` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:code_scanning` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:code_scanning` | Remove a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:code_scanning_alert` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:code_scanning_alert` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:code_scanning_alert_instance` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:code_scanning_alert_item` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:code_scanning_analysi` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:code_scanning_analysi` | Load one record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:code_scanning_analysis_deletion` | Remove a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:code_scanning_autofix` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:code_scanning_autofix` | Create or update a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:code_scanning_autofix_commit` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:code_scanning_codeql_database` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:code_scanning_codeql_database` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:code_scanning_default_setup` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:code_scanning_organization_alert_item` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:code_scanning_sarifs_status` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:code_scanning_variant_analysi` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:code_scanning_variant_analysi` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:code_scanning_variant_analysis_repo_task` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:code_security` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:code_security` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:code_security_configuration` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:code_security_configuration` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:code_security_configuration` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:code_security_configuration_repository` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:code_security_default_configuration` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:codeowners_error` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:codespace` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:codespace` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:codespace` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:codespace` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:collaborator` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:combined_billing_usage` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:combined_commit_status` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:commit` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:commit` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:commit` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:commit_activity` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:commit_comment` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:commit_comment` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:commit_comment` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:commit_comparison` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:community_profile` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:content_file` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:content_traffic` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:contributor` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:copilot` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:copilot` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:copilot` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:copilot` | Remove a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:copilot_organization_detail` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:copilot_usage_metrics_day` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:credential` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:custom_property` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:custom_property` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:custom_property` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:custom_property_value` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:dependabot` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:dependabot` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:dependabot` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:dependabot_alert` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:dependabot_alert` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:dependabot_alert` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:dependabot_alert_with_repository` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:dependabot_public_key` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:dependabot_repository_access_detail` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:dependabot_secret` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:dependency_graph` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:dependency_graph_diff` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:dependency_graph_spdx_sbom` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:deploy_key` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:deploy_key` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:deploy_key` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:deployment` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:deployment` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:deployment` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:deployment_branch_policy` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:deployment_branch_policy` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:deployment_protection_rule` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:deployment_protection_rule` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:deployment_status` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:deployment_status` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:deployment_status` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:diff_entry` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:email` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:email` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:emoji` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:empty_object` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:empty_object` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:enterprise_team` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:enterprise_team` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:enterprise_team` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:enterprise_team` | Remove a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:enterprise_team_membership` | Remove a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:environment` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:environment` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:environment_approval` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:event` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:event` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:feed` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:file_commit` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:file_commit` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:follower` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:following` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:full_repository` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:full_repository` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:gist` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:gist` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:gist` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:gist` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:gist_comment` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:gist_comment` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:gist_comment` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:gist_commit` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:gist_simple` | List records. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:git` | Remove a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:git_commit` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:git_commit` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:git_ref` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:git_ref` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:git_tag` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:git_tag` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:git_tree` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:git_tree` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:gitignore` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:gitignore_template` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:global_advisory` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:global_advisory` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:gpg_key` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:gpg_key` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:gpg_key` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:hook` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:hook` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:hook` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:hook_delivery` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:hook_delivery_item` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:hosted_compute` | List records. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:hosted_compute` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:hovercard` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:import` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:import` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:installation` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:installation` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:installation` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:installation` | Remove a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:installation_token` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:integration` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:integration` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:integration` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:integration` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:integration_installation` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:interaction` | Load one record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:interaction` | Remove a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:interaction_limit` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:issue` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:issue` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:issue` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:issue` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:issue_type` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:issue_type` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:job` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:key` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:key` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:key` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:label` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:label` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:label` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:language` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:license` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:license` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:markdown` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:marketplace_listing_plan` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:marketplace_purchase` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:marketplace_purchase` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:member` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:membership` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:membership` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:membership` | Create or update a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:merged_upstream` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:meta` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:meta` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:metaroot` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:migration` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:migration` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:migration` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:migration` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:milestone` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:milestone` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:milestone` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:minimal_repository` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:network_configuration` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:network_configuration` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:network_setting` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:oidc_custom_sub` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:oidc_custom_sub_repo` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:org` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:org` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:org` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:org` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:org_hook` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:org_hook` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:org_hook` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:org_membership` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:org_membership` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:org_private_registry_configuration` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:org_private_registry_configuration_with_selected_repository` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:org_repo_custom_property_value` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:organization_actions_secret` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:organization_actions_variable` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:organization_dependabot_secret` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:organization_invitation` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:organization_invitation` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:organization_programmatic_access_grant` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:organization_role` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:organization_secret_scanning_alert` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:outside_collaborator` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:package` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:package` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:package` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:package` | Remove a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:page` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:page` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:page_build` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:page_build` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:page_build_status` | Create or update a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:page_deployment` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:pages_deployment_status` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:pages_deployment_status` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:pages_health_check` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:participation` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:pending_deployment` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:porter_author` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:porter_author` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:porter_large_file` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:private_registry` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:private_registry` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:private_registry` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:private_registry` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:project` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:project` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:project` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:project` | Remove a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:project_collaborator_permission` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:project_column` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:project_column` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:project_column` | Create or update a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:projects_classic` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:projects_classic` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:projects_v2` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:projects_v2` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:projects_v2_field` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:projects_v2_field` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:projects_v2_item_simple` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:projects_v2_item_with_content` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:projects_v2_item_with_content` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:projects_v2_item_with_content` | Create or update a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:protected_branch` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:protected_branch_admin_enforced` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:protected_branch_admin_enforced` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:protected_branch_pull_request_review` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:protected_branch_pull_request_review` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:public_member` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:pull` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:pull` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:pull` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:pull` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:pull_request_review` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:pull_request_review` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:pull_request_review` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:pull_request_review` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:pull_request_review_comment` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:pull_request_review_comment` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:pull_request_review_comment` | Create or update a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:pull_request_simple` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:pull_request_simple` | Remove a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:rate_limit` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:reaction` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:reaction` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:reaction` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:referrer` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:release` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:release` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:release` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:release_asset` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:release_asset` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:release_asset` | Create or update a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:release_notes_content` | Create or update a record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:remove` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:repo` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:repo` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:repo` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:repo` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:repository` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:repository_advisory` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:repository_advisory` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:repository_advisory` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:repository_collaborator_permission` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:repository_invitation` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:repository_invitation` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:repository_rule_detailed` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:repository_ruleset` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:repository_ruleset` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:repository_ruleset` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:repository_subscription` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:repository_subscription` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:review_comment` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:rule_suite` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:rule_suite` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:ruleset_version` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:ruleset_version_with_state` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:runner` | Load one record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:runner_application` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:runner_group` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:runner_group` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:search` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:secret_scanning` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:secret_scanning_alert` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:secret_scanning_alert` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:secret_scanning_alert` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:secret_scanning_location` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:secret_scanning_pattern_configuration` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:secret_scanning_push_protection_bypass` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:secret_scanning_scan_history` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:security_advisory` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:selected_action` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:self_hosted_runner` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:short_blob` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:short_branch` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:simple_classroom_assignment` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:social_account` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:social_account` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:ssh_signing_key` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:ssh_signing_key` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:ssh_signing_key` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:status` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:status` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:status_check_policy` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:status_check_policy` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:subscriber` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:tag` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:tag_protection` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:tag_protection` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:team` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:team` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:team` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:team` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:team_simple` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:thread` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:thread` | Load one record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:thread` | Remove a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:thread_subscription` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:thread_subscription` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:topic` | List records. |
| `sys:entity,cmd:save,zone:provider,base:github,name:topic` | Create or update a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:user` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:user` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:user` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:github,name:user` | Remove a record. |
| `sys:entity,cmd:list,zone:provider,base:github,name:user_marketplace_purchase` | List records. |
| `sys:entity,cmd:list,zone:provider,base:github,name:view` | List records. |
| `sys:entity,cmd:load,zone:provider,base:github,name:webhook_config` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:webhook_config` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:workflow` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:workflow` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:workflow_run` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:github,name:workflow_run` | Create or update a record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:workflow_run_usage` | Load one record. |
| `sys:entity,cmd:load,zone:provider,base:github,name:workflow_usage` | Load one record. |



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
