# Reference

Complete description of the interface exposed by
`@seneca/github-provider` version 0.3.1.

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
      action: { action0: {"access_level":"access_level0","active_caches_count":100,"active_caches_size_in_bytes":100,"actor":{},"allows_public_repositories":false,"approval_policy":"approval_policy0","archive_download_url":"archive_download_url0","archive_url":"archive_url0","artifacts_url":"artifacts_url0","assignees_url":"assignees_url0","badge_url":"badge_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","busy":false,"cancel_url":"cancel_url0","check_run_url":"check_run_url0","check_suite_url":"check_suite_url0","code_of_conduct":{},"collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","completed_at":"completed_at0","conclusion":"conclusion0","contents_url":"contents_url0","contributors_url":"contributors_url0","cpu_cores":100,"created_at":"created_at0","days":100,"default":false,"deployments_url":"deployments_url0","description":"description0","display_name":"display_name0","display_title":"display_title0","downloads_url":"downloads_url0","enabled":false,"enabled_repositories":"enabled_repositories0","event":"event0","events_url":"events_url0","expired":false,"expires_at":"expires_at0","fork":false,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","head_branch":"head_branch0","head_commit":{},"head_repository":{},"head_sha":"head_sha0","hooks_url":"hooks_url0","html_url":"html_url0","id":"action-apiid-0","image_details":{},"inherited":false,"issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","jobs_url":"jobs_url0","keys_url":"keys_url0","labels":[],"labels_url":"labels_url0","languages_url":"languages_url0","logs_url":"logs_url0","machine_size_details":{},"memory_gb":100,"merges_url":"merges_url0","milestones_url":"milestones_url0","name":"name0","node_id":"node_id0","notifications_url":"notifications_url0","os":"os0","owner":"owner0","path":"path0","platform":"platform0","platforms":[],"private":false,"public_ip_enabled":false,"pull_requests":[],"pulls_url":"pulls_url0","ref":"ref0","releases_url":"releases_url0","repository":{},"rerun_url":"rerun_url0","run_id":100,"run_number":100,"run_url":"run_url0","run_workflows_from_fork_pull_requests":false,"runner_group_id":100,"runner_group_name":"runner_group_name0","runner_id":100,"runner_name":"runner_name0","runners":[],"runners_url":"runners_url0","selected_repository_ids":[],"size_gb":100,"size_in_bytes":100,"source":"source0","stargazers_url":"stargazers_url0","started_at":"started_at0","state":"state0","status":"status0","statuses_url":"statuses_url0","storage_gb":100,"subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","tags_url":"tags_url0","teams_url":"teams_url0","total_count":100,"trees_url":"trees_url0","triggering_actor":{},"updated_at":"updated_at0","url":"url0","workflow_id":100,"workflow_name":"workflow_name0","workflow_url":"workflow_url0","artifact_id":"artifact0","hosted_runner_id":"hosted_runner0","org_id":"org0","repo":"repo0","repository_id":"repository0","archive_format":"action0"} },
      actions_artifact_and_log_retention: { actions_artifact_and_log_retention0: {"days":100,"maximum_allowed_days":100,"org_id":"actions_artifact_and_log_retention0"} },
      actions_cache_list: { actions_cache_list0: {"key":"key0","owner":"owner0","repo":"actions_cache_list0"} },
      actions_cache_usage_by_repository: { actions_cache_usage_by_repository0: {"active_caches_count":100,"active_caches_size_in_bytes":100,"full_name":"full_name0","owner":"owner0","repo":"actions_cache_usage_by_repository0"} },
      actions_cache_usage_org_enterprise: { actions_cache_usage_org_enterprise0: {"total_active_caches_count":100,"total_active_caches_size_in_bytes":100,"org_id":"actions_cache_usage_org_enterprise0"} },
      actions_fork_pr_contributor_approval: { actions_fork_pr_contributor_approval0: {"approval_policy":"approval_policy0","org_id":"actions_fork_pr_contributor_approval0"} },
      actions_fork_pr_workflows_private_repo: { actions_fork_pr_workflows_private_repo0: {"require_approval_for_fork_pr_workflows":false,"run_workflows_from_fork_pull_requests":false,"send_secrets_and_variables":false,"send_write_tokens_to_workflows":false,"org_id":"actions_fork_pr_workflows_private_repo0"} },
      actions_get_default_workflow_permission: { actions_get_default_workflow_permission0: {"can_approve_pull_request_reviews":false,"default_workflow_permissions":"default_workflow_permissions0","org_id":"actions_get_default_workflow_permission0"} },
      actions_hosted_runner: { actions_hosted_runner0: {"id":"actions_hosted_runner0","image":{},"image_details":{},"machine_size_details":{},"name":"name0","platform":"platform0","public_ip_enabled":false,"size":"size0","status":"status0","org_id":"org0"} },
      actions_hosted_runner_limit: { actions_hosted_runner_limit0: {"current_usage":100,"maximum":100,"org_id":"actions_hosted_runner_limit0"} },
      actions_organization_permission: { actions_organization_permission0: {"enabled_repositories":"enabled_repositories0","org_id":"actions_organization_permission0"} },
      actions_public_key: { actions_public_key0: {"key":"key0","key_id":"key_id0","org_id":"actions_public_key0"} },
      actions_repository_permission: { actions_repository_permission0: {"enabled":false,"owner":"owner0","repo":"actions_repository_permission0"} },
      actions_secret: { actions_secret0: {"created_at":"created_at0","name":"name0","updated_at":"updated_at0","owner":"owner0","repo":"repo0","id":"actions_secret0"} },
      actions_variable: { actions_variable0: {"created_at":"created_at0","name":"name0","updated_at":"updated_at0","value":"value0","owner":"owner0","repo":"repo0","id":"actions_variable0"} },
      actions_workflow_access_to_repository: { actions_workflow_access_to_repository0: {"access_level":"access_level0","owner":"owner0","repo":"actions_workflow_access_to_repository0"} },
      activity: { activity0: {"activity_type":"activity_type0","actor":{},"after":"after0","before":"before0","ref":"ref0","timestamp":"timestamp0","owner":"owner0","thread_id":"thread0","repo":"activity0"} },
      add: { add0: {"usernames":[],"enterprise":"enterprise0","team_id":"team0","id":"add0"} },
      api_insights_route_stat: { api_insights_route_stat0: {"actor_id":"actor0","actor_type":"actor_type0","min_timestamp":"min_timestamp0","org":"org0","id":"api_insights_route_stat0"} },
      api_insights_subject_stat: { api_insights_subject_stat0: {"min_timestamp":"min_timestamp0","org_id":"org0","id":"api_insights_subject_stat0"} },
      api_insights_summary_stat: { api_insights_summary_stat0: {"min_timestamp":"min_timestamp0","actor_type":"api_insights_summary_stat0","actor_id":"api_insights_summary_stat0"} },
      api_insights_time_stat: { api_insights_time_stat0: {"min_timestamp":"min_timestamp0","org_id":"org0","timestamp_increment":"timestamp_increment0","user_id":"api_insights_time_stat0"} },
      api_insights_user_stat: { api_insights_user_stat0: {"min_timestamp":"min_timestamp0","org_id":"org0","id":"api_insights_user_stat0"} },
      api_overview: { api_overview0: {"verifiable_password_authentication":false,"id":"api_overview0"} },
      app: { app0: {"access_tokens_url":"access_tokens_url0","account":"account0","app_id":100,"app_slug":"app_slug0","archive_url":"archive_url0","archived":false,"assignees_url":"assignees_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","clone_url":"clone_url0","collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","default_branch":"default_branch0","deployments_url":"deployments_url0","disabled":false,"downloads_url":"downloads_url0","events_url":"events_url0","fork":false,"forks":100,"forks_count":100,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","git_url":"git_url0","has_downloads":false,"has_issues":false,"has_pages":false,"has_projects":false,"has_wiki":false,"homepage":"homepage0","hooks_url":"hooks_url0","issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels_url":"labels_url0","language":"language0","languages_url":"languages_url0","license":{},"merges_url":"merges_url0","milestones_url":"milestones_url0","mirror_url":"mirror_url0","notifications_url":"notifications_url0","open_issues":100,"open_issues_count":100,"private":false,"pulls_url":"pulls_url0","pushed_at":"pushed_at0","releases_url":"releases_url0","repositories_url":"repositories_url0","repository_selection":"repository_selection0","single_file_name":"single_file_name0","size":100,"ssh_url":"ssh_url0","stargazers_count":100,"stargazers_url":"stargazers_url0","statuses_url":"statuses_url0","subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","suspended_at":"suspended_at0","suspended_by":{},"svn_url":"svn_url0","tags_url":"tags_url0","target_id":100,"target_type":"target_type0","teams_url":"teams_url0","trees_url":"trees_url0","url":"url0","watchers":100,"watchers_count":100,"code":"code0","repository_id":"repository0","installation_id":"app0"} },
      artifact: { artifact0: {"owner":"owner0","repo":"repo0","id":"artifact0"} },
      assignee: { assignee0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"assignee0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0","owner":"owner0","repo":"repo0"} },
      authentication_token: { authentication_token0: {"org_id":"org0","id":"authentication_token0"} },
      authorization: { authorization0: {"access_token":"access_token0","app":{},"created_at":"created_at0","expires_at":"expires_at0","fingerprint":"fingerprint0","hashed_token":"hashed_token0","id":"authorization-apiid-0","installation":{},"note":"note0","note_url":"note_url0","scopes":[],"token":"token0","token_last_eight":"token_last_eight0","updated_at":"updated_at0","url":"url0","user":{},"application_id":"authorization0"} },
      autolink: { autolink0: {"id":"autolink0","is_alphanumeric":false,"key_prefix":"key_prefix0","url_template":"url_template0","owner":"owner0","repo":"repo0"} },
      base_gist: { base_gist0: {"gist_id":"gist0","id":"base_gist0"} },
      billing_usage_report: { billing_usage_report0: {"date":"date0","discountAmount":100,"grossAmount":100,"netAmount":100,"organizationName":"organizationName0","pricePerUnit":100,"product":"product0","quantity":100,"sku":"sku0","unitType":"unitType0","org":"org0","id":"billing_usage_report0"} },
      billing_usage_report_user: { billing_usage_report_user0: {"date":"date0","discountAmount":100,"grossAmount":100,"netAmount":100,"pricePerUnit":100,"product":"product0","quantity":100,"sku":"sku0","unitType":"unitType0","username":"username0","id":"billing_usage_report_user0"} },
      blob: { blob0: {"content":"content0","encoding":"encoding0","node_id":"node_id0","sha":"sha0","size":100,"url":"url0","owner":"owner0","repo":"repo0","id":"blob0"} },
      block: { block0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"block0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0"} },
      branch: { branch0: {"commit":{},"links":{},"name":"name0","protected":false,"protection":{},"protection_url":"protection_url0","owner":"owner0","repo":"repo0","id":"branch0"} },
      branch_protection: { branch_protection0: {"enforce_admins":{},"required_pull_request_reviews":{},"required_signatures":{},"required_status_checks":{},"restrictions":{},"owner":"owner0","repo":"repo0","id":"branch_protection0"} },
      branch_restriction_policy: { branch_restriction_policy0: {"apps":[],"apps_url":"apps_url0","teams":[],"teams_url":"teams_url0","url":"url0","users":[],"users_url":"users_url0","branch_id":"branch0","owner":"owner0","repo":"repo0","id":"branch_restriction_policy0"} },
      branch_short: { branch_short0: {"commit":{},"name":"name0","protected":false,"commit_sha":"commit_sha0","owner":"owner0","repo":"repo0","id":"branch_short0"} },
      branch_with_protection: { branch_with_protection0: {"new_name":"new_name0","owner":"owner0","repo":"repo0","id":"branch_with_protection0"} },
      campaign: { campaign0: {"alert_stats":{},"code_scanning_alerts":[],"contact_link":"contact_link0","created_at":"created_at0","description":"description0","ends_at":"ends_at0","managers":[],"number":100,"state":"state0","updated_at":"updated_at0","org_id":"org0","id":"campaign0"} },
      check: { check0: {"after":"after0","app":{},"before":"before0","check_runs_url":"check_runs_url0","check_suite":{},"completed_at":"completed_at0","conclusion":"conclusion0","created_at":"created_at0","deployment":{},"details_url":"details_url0","external_id":"external_id0","head_branch":"head_branch0","head_commit":{},"head_sha":"head_sha0","html_url":"html_url0","id":"check0","latest_check_runs_count":100,"name":"name0","node_id":"node_id0","output":{},"pull_requests":[],"repository":{},"started_at":"started_at0","status":"status0","updated_at":"updated_at0","url":"url0","owner":"owner0","repo":"repo0"} },
      check_annotation: { check_annotation0: {"annotation_level":"annotation_level0","blob_href":"blob_href0","end_column":100,"end_line":100,"message":"message0","path":"path0","raw_details":"raw_details0","start_column":100,"start_line":100,"title":"title0","check_run_id":"check_run0","owner":"owner0","repo":"repo0","id":"check_annotation0"} },
      check_automated_security_fix: { check_automated_security_fix0: {"enabled":false,"paused":false,"owner":"owner0","repo":"check_automated_security_fix0"} },
      check_run: { check_run0: {"app":{},"check_suite":{},"completed_at":"completed_at0","conclusion":"conclusion0","deployment":{},"details_url":"details_url0","external_id":"external_id0","head_sha":"head_sha0","html_url":"html_url0","id":"check_run0","name":"name0","node_id":"node_id0","output":{},"pull_requests":[],"started_at":"started_at0","status":"status0","url":"url0","owner":"owner0","repo":"repo0"} },
      check_suite: { check_suite0: {"after":"after0","app":{},"before":"before0","check_runs_url":"check_runs_url0","conclusion":"conclusion0","created_at":"created_at0","head_branch":"head_branch0","head_commit":{},"head_sha":"head_sha0","id":"check_suite0","latest_check_runs_count":100,"node_id":"node_id0","pull_requests":[],"repository":{},"status":"status0","updated_at":"updated_at0","url":"url0","owner":"owner0","repo":"repo0"} },
      check_suite_preference: { check_suite_preference0: {"preferences":{},"repository":{},"owner":"owner0","repo":"check_suite_preference0"} },
      classroom: { classroom0: {"archived":false,"avatar_url":"avatar_url0","html_url":"html_url0","id":"classroom0","login":"login0","name":"name0","node_id":"node_id0","url":"url0"} },
      classroom_accepted_assignment: { classroom_accepted_assignment0: {"assignment":{},"commit_count":100,"grade":"grade0","id":"classroom_accepted_assignment0","passing":false,"repository":{},"students":[],"submitted":false,"assignment_id":"assignment0"} },
      classroom_assignment: { classroom_assignment0: {"accepted":100,"classroom":{},"deadline":"deadline0","editor":"editor0","feedback_pull_requests_enabled":false,"id":"classroom_assignment0","invitations_enabled":false,"invite_link":"invite_link0","language":"language0","max_members":100,"max_teams":100,"passing":100,"public_repo":false,"slug":"slug0","starter_code_repository":{},"students_are_repo_admins":false,"submitted":100,"title":"title0","type":"type0"} },
      classroom_assignment_grade: { classroom_assignment_grade0: {"assignment_name":"assignment_name0","assignment_url":"assignment_url0","github_username":"github_username0","points_available":100,"points_awarded":100,"roster_identifier":"roster_identifier0","starter_code_url":"starter_code_url0","student_repository_name":"student_repository_name0","student_repository_url":"student_repository_url0","submission_timestamp":"submission_timestamp0","assignment_id":"assignment0","id":"classroom_assignment_grade0"} },
      clone: { clone0: {"count":100,"timestamp":"timestamp0","uniques":100,"owner":"owner0","repo":"repo0","id":"clone0"} },
      code_frequency: { code_frequency0: {"owner":"owner0","repo":"repo0","id":"code_frequency0"} },
      code_frequency_stat: { code_frequency_stat0: {"owner":"owner0","repo":"repo0","id":"code_frequency_stat0"} },
      code_of_conduct: { code_of_conduct0: {"html_url":"html_url0","key":"code_of_conduct0","name":"name0","url":"url0"} },
      code_scanning: { code_scanning0: {"commit_sha":"commit_sha0","ref":"ref0","sarif":"sarif0","owner":"owner0","repo":"repo0","language":"code_scanning0"} },
      code_scanning_alert: { code_scanning_alert0: {"created_at":"created_at0","dismissal_approved_by":{},"dismissed_at":"dismissed_at0","dismissed_by":{},"dismissed_reason":"dismissed_reason0","html_url":"html_url0","instances_url":"instances_url0","most_recent_instance":{},"number":100,"rule":{},"state":"state0","tool":{},"url":"url0","owner":"owner0","repo":"repo0","id":"code_scanning_alert0"} },
      code_scanning_alert_instance: { code_scanning_alert_instance0: {"alert_number":"alert_number0","owner":"owner0","repo":"repo0","id":"code_scanning_alert_instance0"} },
      code_scanning_alert_item: { code_scanning_alert_item0: {"created_at":"created_at0","dismissal_approved_by":{},"dismissed_at":"dismissed_at0","dismissed_by":{},"dismissed_reason":"dismissed_reason0","html_url":"html_url0","instances_url":"instances_url0","most_recent_instance":{},"number":100,"rule":{},"state":"state0","tool":{},"url":"url0","owner":"owner0","repo":"repo0","id":"code_scanning_alert_item0"} },
      code_scanning_analysi: { code_scanning_analysi0: {"analysis_key":"analysis_key0","commit_sha":"commit_sha0","created_at":"created_at0","deletable":false,"environment":"environment0","error":"error0","id":"code_scanning_analysi-apiid-0","ref":"ref0","results_count":100,"rules_count":100,"sarif_id":"sarif_id0","tool":{},"url":"url0","warning":"warning0","owner":"owner0","repo":"repo0","analysis_id":"code_scanning_analysi0"} },
      code_scanning_analysis_deletion: { code_scanning_analysis_deletion0: {"owner":"owner0","repo":"repo0","analysis_id":"code_scanning_analysis_deletion0"} },
      code_scanning_autofix: { code_scanning_autofix0: {"description":"description0","started_at":"started_at0","status":"status0","owner":"owner0","repo":"repo0","alert_number":"code_scanning_autofix0"} },
      code_scanning_autofix_commit: { code_scanning_autofix_commit0: {"alert_id":"alert0","owner":"owner0","repo":"repo0","id":"code_scanning_autofix_commit0"} },
      code_scanning_codeql_database: { code_scanning_codeql_database0: {"avatar_url":"avatar_url0","content_type":"content_type0","created_at":"created_at0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"code_scanning_codeql_database-apiid-0","language":"code_scanning_codeql_database0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"size":100,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","updated_at":"updated_at0","uploader":{},"url":"url0","owner":"owner0","repo":"repo0"} },
      code_scanning_default_setup: { code_scanning_default_setup0: {"owner":"owner0","repo":"repo0","id":"code_scanning_default_setup0"} },
      code_scanning_organization_alert_item: { code_scanning_organization_alert_item0: {"created_at":"created_at0","dismissal_approved_by":{},"dismissed_at":"dismissed_at0","dismissed_by":{},"dismissed_reason":"dismissed_reason0","html_url":"html_url0","instances_url":"instances_url0","most_recent_instance":{},"number":100,"repository":{},"rule":{},"state":"state0","tool":{},"url":"url0","org_id":"org0","id":"code_scanning_organization_alert_item0"} },
      code_scanning_sarifs_status: { code_scanning_sarifs_status0: {"owner":"owner0","repo":"repo0","sarif_id":"code_scanning_sarifs_status0"} },
      code_scanning_variant_analysi: { code_scanning_variant_analysi0: {"actor":{},"controller_repo":{},"id":"code_scanning_variant_analysi-apiid-0","language":"language0","query_language":"query_language0","query_pack":"query_pack0","query_pack_url":"query_pack_url0","skipped_repositories":{},"status":"status0","owner":"owner0","repo":"repo0","codeql_variant_analysis_id":"code_scanning_variant_analysi0"} },
      code_scanning_variant_analysis_repo_task: { code_scanning_variant_analysis_repo_task0: {"archive_url":"archive_url0","assignees_url":"assignees_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","deployments_url":"deployments_url0","description":"description0","downloads_url":"downloads_url0","events_url":"events_url0","fork":false,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","github_id":100,"hooks_url":"hooks_url0","html_url":"html_url0","id":"code_scanning_variant_analysis_repo_task-apiid-0","issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels_url":"labels_url0","languages_url":"languages_url0","merges_url":"merges_url0","milestones_url":"milestones_url0","name":"name0","node_id":"node_id0","notifications_url":"notifications_url0","owner":"owner0","private":false,"pulls_url":"pulls_url0","releases_url":"releases_url0","stargazers_url":"stargazers_url0","statuses_url":"statuses_url0","subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","tags_url":"tags_url0","teams_url":"teams_url0","trees_url":"trees_url0","url":"url0","codeql_variant_analysis_id":"codeql_variant_analysis0","repo":"repo0","repo_owner":"repo_owner0","repo_name":"code_scanning_variant_analysis_repo_task0"} },
      code_security: { code_security0: {"enterprise":"enterprise0","configuration_id":"code_security0"} },
      code_security_configuration: { code_security_configuration0: {"scope":"scope0","enterprise":"enterprise0","org_id":"org0","id":"code_security_configuration0"} },
      code_security_configuration_repository: { code_security_configuration_repository0: {"repository":{},"configuration_id":"configuration0","id":"code_security_configuration_repository0"} },
      code_security_default_configuration: { code_security_default_configuration0: {"enterprise":"enterprise0","id":"code_security_default_configuration0"} },
      codeowners_error: { codeowners_error0: {"column":100,"kind":"kind0","line":100,"message":"message0","path":"path0","owner":"owner0","repo":"repo0","id":"codeowners_error0"} },
      codespace: { codespace0: {"accepted":false,"archive_url":"archive_url0","assignees_url":"assignees_url0","billable_owner":{},"blobs_url":"blobs_url0","branches_url":"branches_url0","code_of_conduct":{},"collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","cpus":100,"created_at":"created_at0","defaults":{},"deployments_url":"deployments_url0","description":"description0","downloads_url":"downloads_url0","environment_id":"environment_id0","events_url":"events_url0","fork":false,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_status":{},"git_tags_url":"git_tags_url0","hooks_url":"hooks_url0","idle_timeout_minutes":100,"issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","key":"key0","key_id":"key_id0","keys_url":"keys_url0","labels_url":"labels_url0","languages_url":"languages_url0","last_used_at":"last_used_at0","location":"location0","machine":{},"machines_url":"machines_url0","memory_in_bytes":100,"merges_url":"merges_url0","milestones_url":"milestones_url0","name":"name0","node_id":"node_id0","notifications_url":"notifications_url0","operating_system":"operating_system0","owner":{},"path":"path0","prebuild":false,"prebuild_availability":"prebuild_availability0","pulls_url":"pulls_url0","recent_folders":[],"releases_url":"releases_url0","repository":{},"selected_usernames":[],"stargazers_url":"stargazers_url0","start_url":"start_url0","statuses_url":"statuses_url0","stop_url":"stop_url0","storage_in_bytes":100,"subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","tags_url":"tags_url0","teams_url":"teams_url0","trees_url":"trees_url0","updated_at":"updated_at0","visibility":"visibility0","web_url":"web_url0","secret_name":"secret_name0","id":"codespace0"} },
      collaborator: { collaborator0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"collaborator0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","permissions":{},"received_events_url":"received_events_url0","repos_url":"repos_url0","role_name":"role_name0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0","project_id":"project0"} },
      combined_billing_usage: { combined_billing_usage0: {"days_left_in_billing_cycle":100,"estimated_paid_storage_for_month":100,"estimated_storage_for_month":100,"org_id":"combined_billing_usage0"} },
      combined_commit_status: { combined_commit_status0: {"avatar_url":"avatar_url0","context":"context0","created_at":"created_at0","description":"description0","id":"combined_commit_status0","node_id":"node_id0","state":"state0","target_url":"target_url0","updated_at":"updated_at0","url":"url0","owner":"owner0","ref":"ref0","repo":"repo0"} },
      commit: { commit0: {"author":"author0","base":"base0","comments_url":"comments_url0","commit":{},"committer":"committer0","head":"head0","html_url":"html_url0","node_id":"node_id0","parents":[],"sha":"sha0","url":"url0","owner":"owner0","repo":"repo0","id":"commit0"} },
      commit_activity: { commit_activity0: {"days":[],"total":100,"week":100,"owner":"owner0","repo":"repo0","id":"commit_activity0"} },
      commit_comment: { commit_comment0: {"author_association":"author_association0","body":"body0","commit_id":"commit_id0","created_at":"created_at0","html_url":"html_url0","id":"commit_comment0","line":100,"node_id":"node_id0","path":"path0","position":100,"reactions":{},"updated_at":"updated_at0","url":"url0","user":{},"commit_sha":"commit_sha0","owner":"owner0","repo":"repo0"} },
      commit_comparison: { commit_comparison0: {"ahead_by":100,"base_commit":{},"behind_by":100,"commits":[],"diff_url":"diff_url0","html_url":"html_url0","merge_base_commit":{},"patch_url":"patch_url0","permalink_url":"permalink_url0","status":"status0","total_commits":100,"url":"url0","owner":"owner0","repo":"repo0","basehead":"commit_comparison0"} },
      community_profile: { community_profile0: {"code_of_conduct":{},"code_of_conduct_file":{},"contributing":{},"issue_template":{},"license":{},"pull_request_template":{},"readme":{},"owner":"owner0","repo":"community_profile0"} },
      content_file: { content_file0: {"git":"git0","html":"html0","self":"self0","owner":"owner0","repo":"repo0","dir":"content_file0"} },
      content_traffic: { content_traffic0: {"count":100,"path":"path0","title":"title0","uniques":100,"owner":"owner0","repo":"repo0","id":"content_traffic0"} },
      contributor: { contributor0: {"author":{},"contributions":100,"total":100,"type":"type0","weeks":[],"owner":"owner0","repo":"repo0","id":"contributor0"} },
      copilot: { copilot0: {"assignee":{},"created_at":"created_at0","organization":{},"selected_teams":[],"selected_usernames":[],"org_id":"org0","username":"copilot0"} },
      copilot_organization_detail: { copilot_organization_detail0: {"org_id":"copilot_organization_detail0"} },
      copilot_usage_metrics_day: { copilot_usage_metrics_day0: {"date":"date0","org_id":"org0","id":"copilot_usage_metrics_day0"} },
      credential: { credential0: {"credentials":[],"id":"credential0"} },
      custom_property: { custom_property0: {"properties":[],"property_name":"property_name0","value_type":"value_type0","org_id":"org0","custom_property_name":"custom_property0"} },
      custom_property_value: { custom_property_value0: {"property_name":"property_name0","value":"value0","owner":"owner0","repo":"repo0","id":"custom_property_value0"} },
      dependabot: { dependabot0: {"archive_url":"archive_url0","assignees_url":"assignees_url0","avatar_url":"avatar_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","code_of_conduct":{},"collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","default_level":"default_level0","deployments_url":"deployments_url0","description":"description0","downloads_url":"downloads_url0","events_url":"events_url0","fork":false,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","hooks_url":"hooks_url0","html_url":"html_url0","id":"dependabot-apiid-0","issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels_url":"labels_url0","languages_url":"languages_url0","login":"login0","members_url":"members_url0","merges_url":"merges_url0","milestones_url":"milestones_url0","name":"name0","node_id":"node_id0","notifications_url":"notifications_url0","owner":{},"private":false,"public_members_url":"public_members_url0","pulls_url":"pulls_url0","releases_url":"releases_url0","repos_url":"repos_url0","selected_repository_ids":[],"stargazers_url":"stargazers_url0","statuses_url":"statuses_url0","subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","tags_url":"tags_url0","teams_url":"teams_url0","trees_url":"trees_url0","url":"url0","org":"org0","org_id":"org0","repository_id":"repository0","secret_id":"secret0","secret_name":"dependabot0"} },
      dependabot_alert: { dependabot_alert0: {"created_at":"created_at0","dependency":{},"dismissed_at":"dismissed_at0","dismissed_by":{},"dismissed_comment":"dismissed_comment0","dismissed_reason":"dismissed_reason0","fixed_at":"fixed_at0","html_url":"html_url0","number":100,"security_advisory":{},"security_vulnerability":{},"state":"state0","updated_at":"updated_at0","url":"url0","owner":"owner0","repo":"repo0","id":"dependabot_alert0"} },
      dependabot_alert_with_repository: { dependabot_alert_with_repository0: {"created_at":"created_at0","dependency":{},"dismissed_at":"dismissed_at0","dismissed_by":{},"dismissed_comment":"dismissed_comment0","dismissed_reason":"dismissed_reason0","fixed_at":"fixed_at0","html_url":"html_url0","number":100,"repository":{},"security_advisory":{},"security_vulnerability":{},"state":"state0","updated_at":"updated_at0","url":"url0","org_id":"org0","id":"dependabot_alert_with_repository0"} },
      dependabot_public_key: { dependabot_public_key0: {"key":"key0","key_id":"key_id0","org_id":"dependabot_public_key0"} },
      dependabot_repository_access_detail: { dependabot_repository_access_detail0: {"archive_url":"archive_url0","assignees_url":"assignees_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","deployments_url":"deployments_url0","description":"description0","downloads_url":"downloads_url0","events_url":"events_url0","fork":false,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","hooks_url":"hooks_url0","html_url":"html_url0","id":"dependabot_repository_access_detail0","issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels_url":"labels_url0","languages_url":"languages_url0","merges_url":"merges_url0","milestones_url":"milestones_url0","name":"name0","node_id":"node_id0","notifications_url":"notifications_url0","owner":{},"private":false,"pulls_url":"pulls_url0","releases_url":"releases_url0","stargazers_url":"stargazers_url0","statuses_url":"statuses_url0","subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","tags_url":"tags_url0","teams_url":"teams_url0","trees_url":"trees_url0","url":"url0","org":"org0"} },
      dependabot_secret: { dependabot_secret0: {"created_at":"created_at0","name":"name0","updated_at":"updated_at0","owner":"owner0","repo":"repo0","id":"dependabot_secret0"} },
      dependency_graph: { dependency_graph0: {"detector":{},"job":{},"ref":"ref0","scanned":"scanned0","sha":"sha0","version":100,"owner":"owner0","repo":"repo0","id":"dependency_graph0"} },
      dependency_graph_diff: { dependency_graph_diff0: {"change_type":"change_type0","ecosystem":"ecosystem0","license":"license0","manifest":"manifest0","name":"name0","package_url":"package_url0","scope":"scope0","source_repository_url":"source_repository_url0","version":"version0","vulnerabilities":[],"owner":"owner0","repo":"repo0","basehead":"dependency_graph_diff0"} },
      dependency_graph_spdx_sbom: { dependency_graph_spdx_sbom0: {"SPDXID":"SPDXID0","creationInfo":{},"dataLicense":"dataLicense0","documentNamespace":"documentNamespace0","name":"name0","packages":[],"relationships":[],"spdxVersion":"spdxVersion0","owner":"owner0","repo":"dependency_graph_spdx_sbom0"} },
      deploy_key: { deploy_key0: {"created_at":"created_at0","id":"deploy_key0","key":"key0","read_only":false,"title":"title0","url":"url0","verified":false,"owner":"owner0","repo":"repo0"} },
      deployment: { deployment0: {"comment":"comment0","created_at":"created_at0","creator":{},"description":"description0","environment":"environment0","environment_ids":[],"id":"deployment0","node_id":"node_id0","payload":"payload0","performed_via_github_app":{},"ref":"ref0","repository_url":"repository_url0","sha":"sha0","state":"state0","statuses_url":"statuses_url0","task":"task0","updated_at":"updated_at0","url":"url0","owner":"owner0","repo":"repo0"} },
      deployment_branch_policy: { deployment_branch_policy0: {"environment_id":"environment0","environment_name":"environment_name0","owner":"owner0","repo":"repo0","id":"deployment_branch_policy0"} },
      deployment_protection_rule: { deployment_protection_rule0: {"id":"deployment_protection_rule0","integration_url":"integration_url0","node_id":"node_id0","slug":"slug0","environment_id":"environment0","environment_name":"environment_name0","owner":"owner0","repo":"repo0"} },
      deployment_status: { deployment_status0: {"created_at":"created_at0","creator":{},"deployment_url":"deployment_url0","description":"description0","id":"deployment_status0","node_id":"node_id0","performed_via_github_app":{},"repository_url":"repository_url0","state":"state0","target_url":"target_url0","updated_at":"updated_at0","url":"url0","deployment_id":"deployment0","owner":"owner0","repo":"repo0"} },
      diff_entry: { diff_entry0: {"additions":100,"blob_url":"blob_url0","changes":100,"contents_url":"contents_url0","deletions":100,"filename":"filename0","raw_url":"raw_url0","sha":"sha0","status":"status0","owner":"owner0","pull_number":"pull_number0","repo":"repo0","id":"diff_entry0"} },
      email: { email0: {"id":"email0"} },
      emoji: { emoji0: {"id":"emoji0"} },
      empty_object: { empty_object0: {"encrypted_value":"encrypted_value0","key_id":"key_id0","name":"name0","use_default":false,"value":"value0","visibility":"visibility0","org_id":"org0","owner":"owner0","repo":"repo0","secret_name":"secret_name0","username":"username0","subject_digest":"empty_object0"} },
      enterprise_team: { enterprise_team0: {"created_at":"created_at0","group_id":"group_id0","html_url":"html_url0","id":"enterprise_team0","members_url":"members_url0","name":"name0","slug":"slug0","updated_at":"updated_at0","url":"url0","enterprise":"enterprise0"} },
      enterprise_team_membership: { enterprise_team_membership0: {"enterprise":"enterprise0","team_id":"team0","id":"enterprise_team_membership0"} },
      environment: { environment0: {"created_at":"created_at0","deployment_branch_policy":{},"html_url":"html_url0","id":"environment0","name":"name0","node_id":"node_id0","updated_at":"updated_at0","url":"url0","owner":"owner0","repo":"repo0"} },
      environment_approval: { environment_approval0: {"comment":"comment0","environments":[],"state":"state0","user":{},"owner":"owner0","repo":"repo0","run_id":"run0","id":"environment_approval0"} },
      event: { event0: {"actor":{},"created_at":"created_at0","id":"event-apiid-0","org":"event0","payload":{},"public":false,"repo":{},"type":"type0","username":"username0"} },
      feed: { feed0: {"links":{},"timeline_url":"timeline_url0","user_url":"user_url0","id":"feed0"} },
      file_commit: { file_commit0: {"author":{},"commit":{},"committer":{},"content":{},"message":"message0","owner":"owner0","repo":"repo0","path":"file_commit0"} },
      follower: { follower0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"follower0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0"} },
      following: { following0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"following0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0"} },
      full_repository: { full_repository0: {"archive_url":"archive_url0","archived":false,"assignees_url":"assignees_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","clone_url":"clone_url0","code_of_conduct":{},"collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","created_at":"created_at0","default_branch":"default_branch0","deployments_url":"deployments_url0","description":"description0","disabled":false,"downloads_url":"downloads_url0","events_url":"events_url0","fork":false,"forks":100,"forks_count":100,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","git_url":"git_url0","github_id":100,"has_discussions":false,"has_issues":false,"has_pages":false,"has_projects":false,"has_wiki":false,"homepage":"homepage0","hooks_url":"hooks_url0","html_url":"html_url0","id":"full_repository-apiid-0","issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels_url":"labels_url0","language":"language0","languages_url":"languages_url0","license":{},"merges_url":"merges_url0","milestones_url":"milestones_url0","mirror_url":"mirror_url0","name":"name0","network_count":100,"node_id":"node_id0","notifications_url":"notifications_url0","open_issues":100,"open_issues_count":100,"organization":{},"owner":{"login":"owner0"},"parent":{},"permissions":{},"private":false,"pulls_url":"pulls_url0","pushed_at":"pushed_at0","releases_url":"releases_url0","size":100,"source":{},"ssh_url":"ssh_url0","stargazers_count":100,"stargazers_url":"stargazers_url0","statuses_url":"statuses_url0","subscribers_count":100,"subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","svn_url":"svn_url0","tags_url":"tags_url0","teams_url":"teams_url0","template_repository":{},"trees_url":"trees_url0","updated_at":"updated_at0","url":"url0","watchers":100,"watchers_count":100,"repo":"full_repository0"} },
      gist: { gist0: {"fork_of":{},"owner":{},"id":"gist0"} },
      gist_comment: { gist_comment0: {"author_association":"author_association0","avatar_url":"avatar_url0","body":"body0","created_at":"created_at0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"gist_comment0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","updated_at":"updated_at0","url":"url0","user":{},"gist_id":"gist0"} },
      gist_commit: { gist_commit0: {"change_status":{},"committed_at":"committed_at0","url":"url0","user":{},"version":"version0","id":"gist_commit0"} },
      gist_simple: { gist_simple0: {"fork_of":{},"owner":{},"id":"gist_simple0"} },
      git: { git0: {"owner":"owner0","repo":"repo0","ref":"git0"} },
      git_commit: { git_commit0: {"author":{},"committer":{},"html_url":"html_url0","message":"message0","node_id":"node_id0","parents":[],"sha":"sha0","tree":{},"url":"url0","verification":{},"owner":"owner0","repo":"repo0","id":"git_commit0"} },
      git_ref: { git_ref0: {"node_id":"node_id0","object":{},"ref":"ref0","sha":"sha0","type":"type0","url":"url0","owner":"owner0","repo":"repo0","id":"git_ref0"} },
      git_tag: { git_tag0: {"message":"message0","node_id":"node_id0","object":{},"sha":"sha0","tag":"tag0","tagger":{},"type":"type0","url":"url0","verification":{},"owner":"owner0","repo":"repo0","id":"git_tag0"} },
      git_tree: { git_tree0: {"sha":"sha0","tree":[],"truncated":false,"owner":"owner0","repo":"repo0","id":"git_tree0"} },
      gitignore: { gitignore0: {"id":"gitignore0"} },
      gitignore_template: { gitignore_template0: {"name":"name0","source":"source0","id":"gitignore_template0"} },
      global_advisory: { global_advisory0: {"credits":[],"cve_id":"cve_id0","cvss":{},"cwes":[],"description":"description0","ghsa_id":"ghsa_id0","github_reviewed_at":"github_reviewed_at0","html_url":"html_url0","identifiers":[],"nvd_published_at":"nvd_published_at0","published_at":"published_at0","references":[],"repository_advisory_url":"repository_advisory_url0","severity":"severity0","source_code_location":"source_code_location0","summary":"summary0","type":"type0","updated_at":"updated_at0","url":"url0","vulnerabilities":[],"withdrawn_at":"withdrawn_at0","id":"global_advisory0"} },
      gpg_key: { gpg_key0: {"armored_public_key":"armored_public_key0","can_certify":false,"can_encrypt_comms":false,"can_encrypt_storage":false,"can_sign":false,"created_at":"created_at0","emails":[],"expires_at":"expires_at0","id":"gpg_key0","key_id":"key_id0","primary_key_id":100,"public_key":"public_key0","raw_key":"raw_key0","revoked":false,"subkeys":[]} },
      hook: { hook0: {"active":false,"config":{},"created_at":"created_at0","events":[],"id":"hook0","last_response":{},"name":"name0","ping_url":"ping_url0","test_url":"test_url0","type":"type0","updated_at":"updated_at0","url":"url0","owner":"owner0","repo":"repo0"} },
      hook_delivery: { hook_delivery0: {"action":"action0","delivered_at":"delivered_at0","duration":100,"event":"event0","guid":"guid0","id":"hook_delivery0","installation_id":100,"redelivery":false,"repository_id":100,"request":{},"response":{},"status":"status0","status_code":100} },
      hook_delivery_item: { hook_delivery_item0: {"action":"action0","delivered_at":"delivered_at0","duration":100,"event":"event0","guid":"guid0","id":"hook_delivery_item0","installation_id":100,"redelivery":false,"repository_id":100,"status":"status0","status_code":100} },
      hosted_compute: { hosted_compute0: {"created_on":"created_on0","id":"hosted_compute-apiid-0","name":"name0","org_id":"org0","network_configuration_id":"hosted_compute0"} },
      hovercard: { hovercard0: {"message":"message0","octicon":"octicon0","username":"username0","id":"hovercard0"} },
      import: { import0: {"authors_url":"authors_url0","html_url":"html_url0","repository_url":"repository_url0","status":"status0","url":"url0","vcs":"vcs0","vcs_url":"vcs_url0","owner":"owner0","repo":"import0"} },
      installation: { installation0: {"access_tokens_url":"access_tokens_url0","account":"account0","app_id":100,"app_slug":"app_slug0","created_at":"created_at0","events":[],"html_url":"html_url0","id":"installation0","permissions":{},"repositories_url":"repositories_url0","repository_selection":"repository_selection0","single_file_name":"single_file_name0","suspended_at":"suspended_at0","suspended_by":{},"target_id":100,"target_type":"target_type0","updated_at":"updated_at0"} },
      installation_token: { installation_token0: {"id":"installation_token0"} },
      integration: { integration0: {"apps":[],"created_at":"created_at0","description":"description0","events":[],"external_url":"external_url0","html_url":"html_url0","id":"integration-apiid-0","name":"name0","node_id":"node_id0","owner":"owner0","permissions":{},"updated_at":"updated_at0","branch_id":"branch0","repo":"repo0","app_slug":"integration0"} },
      integration_installation: { integration_installation0: {"account":"account0","created_at":"created_at0","id":"integration_installation0","requester":{}} },
      interaction: { interaction0: {"id":"interaction0"} },
      interaction_limit: { interaction_limit0: {"expires_at":"expires_at0","limit":"limit0","origin":"origin0","id":"interaction_limit0"} },
      issue: { issue0: {"actor":{},"assignee":{},"assigner":{},"author_association":"author_association0","closed_at":"closed_at0","closed_by":{},"comments":100,"comments_url":"comments_url0","commit_id":"commit_id0","commit_url":"commit_url0","created_at":"created_at0","dismissed_review":{},"event":"event0","events_url":"events_url0","html_url":"html_url0","id":"issue0","issue":{},"issue_dependencies_summary":{},"issue_id":100,"issue_url":"issue_url0","label":{},"labels":[],"labels_url":"labels_url0","locked":false,"milestone":{},"node_id":"node_id0","number":100,"performed_via_github_app":{},"project_card":{},"pull_request":{},"reactions":{},"rename":{},"repository":{},"repository_url":"repository_url0","requested_reviewer":{},"requested_team":{},"review_requester":{},"state":"state0","sub_issue_id":100,"sub_issues_summary":{},"title":"title0","type":{},"updated_at":"updated_at0","url":"url0","user":{},"owner":"owner0","repo":"repo0"} },
      issue_type: { issue_type0: {"description":"description0","id":"issue_type0","name":"name0","node_id":"node_id0","org_id":"org0"} },
      job: { job0: {"check_run_url":"check_run_url0","completed_at":"completed_at0","conclusion":"conclusion0","created_at":"created_at0","head_branch":"head_branch0","head_sha":"head_sha0","html_url":"html_url0","id":"job0","labels":[],"name":"name0","node_id":"node_id0","run_id":100,"run_url":"run_url0","runner_group_id":100,"runner_group_name":"runner_group_name0","runner_id":100,"runner_name":"runner_name0","started_at":"started_at0","status":"status0","url":"url0","workflow_name":"workflow_name0","owner":"owner0","repo":"repo0"} },
      key: { key0: {"created_at":"created_at0","id":"key0","key":"key0","read_only":false,"title":"title0","url":"url0","verified":false} },
      label: { label0: {"color":"color0","default":false,"description":"description0","id":"label0","name":"name0","node_id":"node_id0","url":"url0","owner":"owner0","repo":"repo0"} },
      language: { language0: {"owner":"owner0","repo":"language0"} },
      license: { license0: {"body":"body0","conditions":[],"content":"content0","description":"description0","download_url":"download_url0","encoding":"encoding0","featured":false,"git_url":"git_url0","html_url":"html_url0","implementation":"implementation0","key":"key0","license":{},"limitations":[],"links":{},"name":"name0","node_id":"node_id0","path":"path0","permissions":[],"sha":"sha0","size":100,"spdx_id":"spdx_id0","type":"type0","url":"url0","id":"license0"} },
      markdown: { markdown0: {"text":"text0","id":"markdown0"} },
      marketplace_listing_plan: { marketplace_listing_plan0: {"accounts_url":"accounts_url0","bullets":[],"description":"description0","has_free_trial":false,"id":"marketplace_listing_plan0","monthly_price_in_cents":100,"name":"name0","number":100,"price_model":"price_model0","state":"state0","unit_name":"unit_name0","url":"url0","yearly_price_in_cents":100} },
      marketplace_purchase: { marketplace_purchase0: {"id":"marketplace_purchase-apiid-0","login":"login0","marketplace_purchase":{},"type":"type0","url":"url0","plan_id":"plan0","account_id":"marketplace_purchase0"} },
      member: { member0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"member0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0","org_id":"org0"} },
      membership: { membership0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"membership0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0","enterprise":"enterprise0","enterprise_team":"enterprise_team0","team_id":"team0"} },
      merged_upstream: { merged_upstream0: {"branch":"branch0","owner":"owner0","repo":"repo0","id":"merged_upstream0"} },
      meta: { meta0: {"id":"meta0"} },
      metaroot: { metaroot0: {"authorizations_url":"authorizations_url0","code_search_url":"code_search_url0","commit_search_url":"commit_search_url0","current_user_authorizations_html_url":"current_user_authorizations_html_url0","current_user_repositories_url":"current_user_repositories_url0","current_user_url":"current_user_url0","emails_url":"emails_url0","emojis_url":"emojis_url0","events_url":"events_url0","feeds_url":"feeds_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","issue_search_url":"issue_search_url0","issues_url":"issues_url0","keys_url":"keys_url0","label_search_url":"label_search_url0","notifications_url":"notifications_url0","organization_repositories_url":"organization_repositories_url0","organization_teams_url":"organization_teams_url0","organization_url":"organization_url0","public_gists_url":"public_gists_url0","rate_limit_url":"rate_limit_url0","repository_search_url":"repository_search_url0","repository_url":"repository_url0","starred_gists_url":"starred_gists_url0","starred_url":"starred_url0","user_organizations_url":"user_organizations_url0","user_repositories_url":"user_repositories_url0","user_search_url":"user_search_url0","user_url":"user_url0","id":"metaroot0"} },
      migration: { migration0: {"assignees_url":"assignees_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","code_of_conduct":{},"collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","created_at":"created_at0","deployments_url":"deployments_url0","description":"description0","downloads_url":"downloads_url0","events_url":"events_url0","exclude_attachments":false,"exclude_git_data":false,"exclude_metadata":false,"exclude_owner_projects":false,"exclude_releases":false,"fork":false,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","guid":"guid0","hooks_url":"hooks_url0","html_url":"html_url0","id":"migration0","issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels_url":"labels_url0","languages_url":"languages_url0","lock_repositories":false,"merges_url":"merges_url0","milestones_url":"milestones_url0","name":"name0","node_id":"node_id0","notifications_url":"notifications_url0","org_metadata_only":false,"owner":"owner0","private":false,"pulls_url":"pulls_url0","releases_url":"releases_url0","repositories":[],"stargazers_url":"stargazers_url0","state":"state0","statuses_url":"statuses_url0","subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","tags_url":"tags_url0","teams_url":"teams_url0","trees_url":"trees_url0","updated_at":"updated_at0","url":"url0","repo":"repo0"} },
      milestone: { milestone0: {"avatar_url":"avatar_url0","closed_at":"closed_at0","closed_issues":100,"created_at":"created_at0","creator":{},"events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"milestone0","labels_url":"labels_url0","login":"login0","node_id":"node_id0","number":100,"open_issues":100,"organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","title":"title0","type":"type0","updated_at":"updated_at0","url":"url0","owner":"owner0","repo":"repo0"} },
      minimal_repository: { minimal_repository0: {"archive_url":"archive_url0","assignees_url":"assignees_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","code_of_conduct":{},"collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","deployments_url":"deployments_url0","description":"description0","downloads_url":"downloads_url0","events_url":"events_url0","fork":false,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","hooks_url":"hooks_url0","html_url":"html_url0","id":"minimal_repository0","issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels_url":"labels_url0","languages_url":"languages_url0","merges_url":"merges_url0","milestones_url":"milestones_url0","name":"name0","node_id":"node_id0","notifications_url":"notifications_url0","owner":{},"private":false,"pulls_url":"pulls_url0","releases_url":"releases_url0","stargazers_url":"stargazers_url0","statuses_url":"statuses_url0","subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","tags_url":"tags_url0","teams_url":"teams_url0","trees_url":"trees_url0","url":"url0"} },
      network_configuration: { network_configuration0: {"created_on":"created_on0","id":"network_configuration0","name":"name0","org_id":"org0"} },
      network_setting: { network_setting0: {"id":"network_setting0","name":"name0","region":"region0","subnet_id":"subnet_id0","org_id":"org0"} },
      oidc_custom_sub: { oidc_custom_sub0: {"include_claim_keys":[],"org_id":"org0","id":"oidc_custom_sub0"} },
      oidc_custom_sub_repo: { oidc_custom_sub_repo0: {"use_default":false,"owner":"owner0","repo":"repo0","id":"oidc_custom_sub_repo0"} },
      org: { org0: {"access_tokens_url":"access_tokens_url0","account":"account0","action":"action0","app_id":100,"app_slug":"app_slug0","avatar_url":"avatar_url0","created_at":"created_at0","digest":"digest0","events":[],"events_url":"events_url0","hooks_url":"hooks_url0","html_url":"html_url0","id":"org0","issues_url":"issues_url0","login":"login0","members_url":"members_url0","name":"name0","node_id":"node_id0","organization":{},"organization_url":"organization_url0","pat_ids":[],"permissions":{},"private_repos":100,"properties":[],"public_members_url":"public_members_url0","registry_url":"registry_url0","repos_url":"repos_url0","repositories_url":"repositories_url0","repository_names":[],"repository_selection":"repository_selection0","role":"role0","single_file_name":"single_file_name0","space":100,"state":"state0","subject_digests":[],"suspended_at":"suspended_at0","suspended_by":{},"target_id":100,"target_type":"target_type0","updated_at":"updated_at0","url":"url0","user":{},"enablement":"enablement0","org":"org0","security_product":"security_product0","username":"username0"} },
      org_hook: { org_hook0: {"active":false,"config":{},"created_at":"created_at0","events":[],"id":"org_hook0","name":"name0","ping_url":"ping_url0","type":"type0","updated_at":"updated_at0","url":"url0","org_id":"org0"} },
      org_membership: { org_membership0: {"organization":{},"organization_url":"organization_url0","permissions":{},"role":"role0","state":"state0","url":"url0","user":{},"org_id":"org0","id":"org_membership0"} },
      org_private_registry_configuration: { org_private_registry_configuration0: {"created_at":"created_at0","name":"name0","registry_type":"registry_type0","updated_at":"updated_at0","visibility":"visibility0","org_id":"org0","secret_name":"org_private_registry_configuration0"} },
      org_private_registry_configuration_with_selected_repository: { org_private_registry_configuration_with_selected_repository0: {"encrypted_value":"encrypted_value0","key_id":"key_id0","registry_type":"registry_type0","url":"url0","visibility":"visibility0","id":"org_private_registry_configuration_with_selected_repository0"} },
      org_repo_custom_property_value: { org_repo_custom_property_value0: {"properties":[],"repository_full_name":"repository_full_name0","repository_id":100,"repository_name":"repository_name0","org_id":"org0","id":"org_repo_custom_property_value0"} },
      organization_actions_secret: { organization_actions_secret0: {"created_at":"created_at0","name":"name0","updated_at":"updated_at0","visibility":"visibility0","org_id":"org0","id":"organization_actions_secret0"} },
      organization_actions_variable: { organization_actions_variable0: {"created_at":"created_at0","name":"name0","updated_at":"updated_at0","value":"value0","visibility":"visibility0","org_id":"org0","id":"organization_actions_variable0"} },
      organization_dependabot_secret: { organization_dependabot_secret0: {"created_at":"created_at0","name":"name0","updated_at":"updated_at0","visibility":"visibility0","org_id":"org0","id":"organization_dependabot_secret0"} },
      organization_invitation: { organization_invitation0: {"created_at":"created_at0","id":"organization_invitation0","invitation_teams_url":"invitation_teams_url0","inviter":{},"login":"login0","node_id":"node_id0","team_count":100,"org_id":"org0"} },
      organization_programmatic_access_grant: { organization_programmatic_access_grant0: {"access_granted_at":"access_granted_at0","created_at":"created_at0","id":"organization_programmatic_access_grant0","owner":{},"permissions":{},"reason":"reason0","repositories_url":"repositories_url0","repository_selection":"repository_selection0","token_expired":false,"token_expires_at":"token_expires_at0","token_id":100,"token_last_used_at":"token_last_used_at0","token_name":"token_name0","org_id":"org0"} },
      organization_role: { organization_role0: {"created_at":"created_at0","id":"organization_role0","name":"name0","organization":{},"permissions":[],"updated_at":"updated_at0","org_id":"org0"} },
      organization_secret_scanning_alert: { organization_secret_scanning_alert0: {"push_protection_bypass_request_reviewer":{},"push_protection_bypassed_by":{},"repository":{},"resolved_by":{},"org_id":"org0","id":"organization_secret_scanning_alert0"} },
      outside_collaborator: { outside_collaborator0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"outside_collaborator0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0","org_id":"org0"} },
      package: { package0: {"container":{},"created_at":"created_at0","docker":{},"github_id":100,"html_url":"html_url0","id":"package-apiid-0","included_gigabytes_bandwidth":100,"metadata":{},"name":"name0","owner":{},"package_html_url":"package_html_url0","package_type":"package_type0","repository":{},"total_gigabytes_bandwidth_used":100,"total_paid_gigabytes_bandwidth_used":100,"updated_at":"updated_at0","url":"url0","version_count":100,"visibility":"visibility0","package_id":"package0","package_name":"package0"} },
      page: { page0: {"cname":"cname0","custom_404":false,"https_certificate":{},"public":false,"source":{},"status":"status0","url":"url0","owner":"owner0","repo":"page0"} },
      page_build: { page_build0: {"commit":"commit0","created_at":"created_at0","duration":100,"error":{},"pusher":{},"status":"status0","updated_at":"updated_at0","url":"url0","owner":"owner0","repo":"repo0","id":"page_build0"} },
      page_build_status: { page_build_status0: {"owner":"owner0","repo":"repo0","id":"page_build_status0"} },
      page_deployment: { page_deployment0: {"oidc_token":"oidc_token0","pages_build_version":"pages_build_version0","owner":"owner0","repo":"repo0","id":"page_deployment0"} },
      pages_deployment_status: { pages_deployment_status0: {"deployment_id":"deployment0","owner":"owner0","repo":"repo0","pages_deployment_id":"pages_deployment_status0"} },
      pages_health_check: { pages_health_check0: {"owner":"owner0","repo":"pages_health_check0"} },
      participation: { participation0: {"all":[],"owner":"owner0","repo":"repo0","id":"participation0"} },
      pending_deployment: { pending_deployment0: {"current_user_can_approve":false,"environment":{},"reviewers":[],"wait_timer":100,"wait_timer_started_at":"wait_timer_started_at0","owner":"owner0","repo":"repo0","run_id":"run0","id":"pending_deployment0"} },
      porter_author: { porter_author0: {"email":"email0","id":"porter_author0","import_url":"import_url0","name":"name0","remote_id":"remote_id0","remote_name":"remote_name0","url":"url0","owner":"owner0","repo":"repo0"} },
      porter_large_file: { porter_large_file0: {"oid":"oid0","path":"path0","ref_name":"ref_name0","size":100,"owner":"owner0","repo":"repo0","id":"porter_large_file0"} },
      private_registry: { private_registry0: {"created_at":"created_at0","key":"key0","key_id":"key_id0","name":"name0","updated_at":"updated_at0","org_id":"private_registry0"} },
      project: { project0: {"avatar_url":"avatar_url0","columns_url":"columns_url0","created_at":"created_at0","creator":{},"events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"project0","login":"login0","node_id":"node_id0","number":100,"organizations_url":"organizations_url0","owner_url":"owner_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","updated_at":"updated_at0","url":"url0","org_id":"org0"} },
      project_collaborator_permission: { project_collaborator_permission0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"project_collaborator_permission-apiid-0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0","project_id":"project0","username":"project_collaborator_permission0"} },
      project_column: { project_column0: {"cards_url":"cards_url0","created_at":"created_at0","id":"project_column0","name":"name0","node_id":"node_id0","project_url":"project_url0","updated_at":"updated_at0","url":"url0"} },
      projects_classic: { projects_classic0: {"position":"position0","project_id":"project0","username":"username0","column_id":"projects_classic0"} },
      projects_v2: { projects_v20: {"closed_at":"closed_at0","created_at":"created_at0","creator":{},"deleted_at":"deleted_at0","deleted_by":{},"description":"description0","id":"projects_v20","latest_status_update":{},"node_id":"node_id0","number":100,"owner":{},"public":false,"short_description":"short_description0","title":"title0","updated_at":"updated_at0","org_id":"org0"} },
      projects_v2_field: { projects_v2_field0: {"created_at":"created_at0","data_type":"data_type0","id":"projects_v2_field0","name":"name0","project_url":"project_url0","updated_at":"updated_at0","project_number":"project_number0","projects_v2_id":"projects_v20"} },
      projects_v2_item_simple: { projects_v2_item_simple0: {"id":"projects_v2_item_simple0","type":"type0","project_number":"project_number0"} },
      projects_v2_item_with_content: { projects_v2_item_with_content0: {"archived_at":"archived_at0","content_type":"content_type0","created_at":"created_at0","creator":{},"id":"projects_v2_item_with_content-apiid-0","updated_at":"updated_at0","project_number":"project_number0","projects_v2_id":"projects_v20","item_id":"projects_v2_item_with_content0"} },
      protected_branch: { protected_branch0: {"allow_deletions":{},"allow_force_pushes":{},"block_creations":{},"enforce_admins":{},"required_linear_history":{},"required_pull_request_reviews":{},"required_signatures":{},"required_status_checks":{},"restrictions":{},"url":"url0","owner":"owner0","repo":"repo0","branch_id":"protected_branch0"} },
      protected_branch_admin_enforced: { protected_branch_admin_enforced0: {"enabled":false,"url":"url0","owner":"owner0","repo":"repo0","branch_id":"protected_branch_admin_enforced0"} },
      protected_branch_pull_request_review: { protected_branch_pull_request_review0: {"dismiss_stale_reviews":false,"require_code_owner_reviews":false,"owner":"owner0","repo":"repo0","branch_id":"protected_branch_pull_request_review0"} },
      public_member: { public_member0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"public_member0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0","org_id":"org0"} },
      pull: { pull0: {"additions":100,"assignee":{},"author_association":"author_association0","auto_merge":{},"base":{},"body":"body0","changed_files":100,"closed_at":"closed_at0","comments":100,"comments_url":"comments_url0","commits":100,"commits_url":"commits_url0","created_at":"created_at0","deletions":100,"diff_url":"diff_url0","head":{},"html_url":"html_url0","id":"pull0","issue_url":"issue_url0","labels":[],"links":{},"locked":false,"maintainer_can_modify":false,"merge_commit_sha":"merge_commit_sha0","mergeable":false,"mergeable_state":"mergeable_state0","merged":false,"merged_at":"merged_at0","merged_by":{},"message":"message0","milestone":{},"node_id":"node_id0","number":100,"patch_url":"patch_url0","review_comment_url":"review_comment_url0","review_comments":100,"review_comments_url":"review_comments_url0","sha":"sha0","state":"state0","statuses_url":"statuses_url0","title":"title0","updated_at":"updated_at0","url":"url0","user":{},"comment_id":"comment0","owner":"owner0","repo":"repo0"} },
      pull_request_review: { pull_request_review0: {"author_association":"author_association0","body":"body0","commit_id":"commit_id0","event":"event0","html_url":"html_url0","id":"pull_request_review0","links":{},"message":"message0","node_id":"node_id0","pull_request_url":"pull_request_url0","state":"state0","teams":[],"user":{},"users":[],"owner":"owner0","pull_id":"pull0","pull_number":"pull_number0","repo":"repo0"} },
      pull_request_review_comment: { pull_request_review_comment0: {"author_association":"author_association0","body":"body0","commit_id":"commit_id0","created_at":"created_at0","diff_hunk":"diff_hunk0","html_url":"html_url0","id":"pull_request_review_comment0","links":{},"node_id":"node_id0","original_commit_id":"original_commit_id0","path":"path0","pull_request_review_id":100,"pull_request_url":"pull_request_url0","reactions":{},"updated_at":"updated_at0","url":"url0","user":{},"owner":"owner0","repo":"repo0"} },
      pull_request_simple: { pull_request_simple0: {"owner":"owner0","repo":"repo0","pull_number":"pull_request_simple0"} },
      rate_limit: { rate_limit0: {"rate":{},"resources":{},"id":"rate_limit0"} },
      reaction: { reaction0: {"avatar_url":"avatar_url0","content":"content0","created_at":"created_at0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"reaction0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0","user":{},"discussion_number":"discussion_number0","team_id":"team0"} },
      referrer: { referrer0: {"count":100,"referrer":"referrer0","uniques":100,"owner":"owner0","repo":"repo0","id":"referrer0"} },
      release: { release0: {"assets":[],"assets_url":"assets_url0","author":{},"browser_download_url":"browser_download_url0","content_type":"content_type0","created_at":"created_at0","digest":"digest0","download_count":100,"draft":false,"html_url":"html_url0","id":"release0","label":"label0","name":"name0","node_id":"node_id0","prerelease":false,"published_at":"published_at0","reactions":{},"size":100,"state":"state0","tag_name":"tag_name0","tarball_url":"tarball_url0","target_commitish":"target_commitish0","upload_url":"upload_url0","uploader":{},"url":"url0","zipball_url":"zipball_url0","owner":"owner0","repo":"repo0"} },
      release_asset: { release_asset0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"release_asset0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0","name":"name0","owner":"owner0","repo":"repo0"} },
      release_notes_content: { release_notes_content0: {"body":"body0","name":"name0","tag_name":"tag_name0","owner":"owner0","repo":"repo0","id":"release_notes_content0"} },
      remove: { remove0: {"usernames":[],"enterprise":"enterprise0","team_id":"team0","id":"remove0"} },
      repo: { repo0: {"app":{},"archive_url":"archive_url0","archived":false,"assignees_url":"assignees_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","bundle":{},"clone_url":"clone_url0","collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","created_at":"created_at0","default_branch":"default_branch0","deployment_branch_policy":{},"deployments_url":"deployments_url0","description":"description0","disabled":false,"downloads_url":"downloads_url0","enabled":false,"event_type":"event_type0","events_url":"events_url0","fork":false,"forks":100,"forks_count":100,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","github_id":100,"has_downloads":false,"has_issues":false,"has_pages":false,"has_projects":false,"has_wiki":false,"homepage":"homepage0","hooks_url":"hooks_url0","id":"repo-apiid-0","integration_url":"integration_url0","issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels_url":"labels_url0","language":"language0","languages_url":"languages_url0","license":{},"merges_url":"merges_url0","milestones_url":"milestones_url0","mirror_url":"mirror_url0","new_owner":"new_owner0","node_id":"node_id0","notifications_url":"notifications_url0","open_issues":100,"open_issues_count":100,"owner":{"login":"owner0"},"permissions":{},"private":false,"properties":[],"pulls_url":"pulls_url0","pushed_at":"pushed_at0","releases_url":"releases_url0","slug":"slug0","ssh_url":"ssh_url0","stargazers_count":100,"stargazers_url":"stargazers_url0","statuses_url":"statuses_url0","subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","svn_url":"svn_url0","tags_url":"tags_url0","teams_url":"teams_url0","trees_url":"trees_url0","updated_at":"updated_at0","watchers":100,"watchers_count":100,"branch_id":"branch0","invitation_id":"invitation0","repo":"repo0","name":"repo0"} },
      repository: { repository0: {"archive_url":"archive_url0","archived":false,"assignees_url":"assignees_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","clone_url":"clone_url0","collaborators_url":"collaborators_url0","comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","created_at":"created_at0","default_branch":"default_branch0","deployments_url":"deployments_url0","description":"description0","disabled":false,"downloads_url":"downloads_url0","events_url":"events_url0","fork":false,"forks":100,"forks_count":100,"forks_url":"forks_url0","full_name":"full_name0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","git_url":"git_url0","has_downloads":false,"has_issues":false,"has_pages":false,"has_projects":false,"has_wiki":false,"homepage":"homepage0","hooks_url":"hooks_url0","html_url":"html_url0","id":"repository0","issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels_url":"labels_url0","language":"language0","languages_url":"languages_url0","license":{},"merges_url":"merges_url0","milestones_url":"milestones_url0","mirror_url":"mirror_url0","name":"name0","node_id":"node_id0","notifications_url":"notifications_url0","open_issues":100,"open_issues_count":100,"owner":{},"permissions":{},"private":false,"pulls_url":"pulls_url0","pushed_at":"pushed_at0","releases_url":"releases_url0","size":100,"ssh_url":"ssh_url0","stargazers_count":100,"stargazers_url":"stargazers_url0","statuses_url":"statuses_url0","subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","svn_url":"svn_url0","tags_url":"tags_url0","teams_url":"teams_url0","trees_url":"trees_url0","updated_at":"updated_at0","url":"url0","watchers":100,"watchers_count":100} },
      repository_advisory: { repository_advisory0: {"author":"author0","closed_at":"closed_at0","collaborating_teams":[],"collaborating_users":[],"created_at":"created_at0","credits":[],"credits_detailed":[],"cve_id":"cve_id0","cvss":{},"cwe_ids":[],"cwes":[],"description":"description0","ghsa_id":"repository_advisory0","html_url":"html_url0","identifiers":[],"private_fork":"private_fork0","published_at":"published_at0","publisher":"publisher0","severity":"severity0","state":"state0","submission":{},"summary":"summary0","updated_at":"updated_at0","url":"url0","vulnerabilities":[],"withdrawn_at":"withdrawn_at0","org_id":"org0","owner":"owner0","repo":"repo0"} },
      repository_collaborator_permission: { repository_collaborator_permission0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"repository_collaborator_permission-apiid-0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","permissions":{},"received_events_url":"received_events_url0","repos_url":"repos_url0","role_name":"role_name0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0","owner":"owner0","repo":"repo0","username":"repository_collaborator_permission0"} },
      repository_invitation: { repository_invitation0: {"created_at":"created_at0","html_url":"html_url0","id":"repository_invitation-apiid-0","invitee":{},"inviter":{},"node_id":"node_id0","permissions":"permissions0","repository":{},"url":"url0","owner":"owner0","repo":"repo0","username":"repository_invitation0"} },
      repository_rule_detailed: { repository_rule_detailed0: {"owner":"owner0","repo":"repo0","branch":"repository_rule_detailed0"} },
      repository_ruleset: { repository_ruleset0: {"enforcement":"enforcement0","id":"repository_ruleset0","name":"name0","source":"source0","org_id":"org0"} },
      repository_subscription: { repository_subscription0: {"created_at":"created_at0","ignored":false,"reason":"reason0","repository_url":"repository_url0","subscribed":false,"url":"url0","owner":"owner0","repo":"repository_subscription0"} },
      review_comment: { review_comment0: {"author_association":"author_association0","body":"body0","commit_id":"commit_id0","created_at":"created_at0","diff_hunk":"diff_hunk0","html_url":"html_url0","id":"review_comment0","links":{},"node_id":"node_id0","original_commit_id":"original_commit_id0","original_position":100,"path":"path0","position":100,"pull_request_review_id":100,"pull_request_url":"pull_request_url0","reactions":{},"updated_at":"updated_at0","url":"url0","user":{},"owner":"owner0","pull_id":"pull0","repo":"repo0"} },
      rule_suite: { rule_suite0: {"org_id":"org0","id":"rule_suite0"} },
      ruleset_version: { ruleset_version0: {"actor":{},"updated_at":"updated_at0","version_id":100,"id":"ruleset_version0"} },
      ruleset_version_with_state: { ruleset_version_with_state0: {"actor":{},"state":{},"updated_at":"updated_at0","version_id":"ruleset_version_with_state0","ruleset_id":"ruleset0"} },
      runner: { runner0: {"busy":false,"id":"runner0","labels":[],"name":"name0","os":"os0","status":"status0"} },
      runner_application: { runner_application0: {"architecture":"architecture0","download_url":"download_url0","filename":"filename0","os":"os0","org_id":"org0","id":"runner_application0"} },
      runner_group: { runner_group0: {"allows_public_repositories":false,"default":false,"id":"runner_group0","inherited":false,"name":"name0","runners_url":"runners_url0","visibility":"visibility0","org_id":"org0"} },
      search: { search0: {"archive_url":"archive_url0","archived":false,"assignee":{},"assignees_url":"assignees_url0","author":{},"author_association":"author_association0","avatar_url":"avatar_url0","blobs_url":"blobs_url0","branches_url":"branches_url0","clone_url":"clone_url0","closed_at":"closed_at0","collaborators_url":"collaborators_url0","color":"color0","comments":100,"comments_url":"comments_url0","commit":{},"commits_url":"commits_url0","committer":{},"compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","created_at":"created_at0","created_by":"created_by0","curated":false,"default":false,"default_branch":"default_branch0","deployments_url":"deployments_url0","description":"description0","disabled":false,"display_name":"display_name0","downloads_url":"downloads_url0","events_url":"events_url0","featured":false,"followers_url":"followers_url0","following_url":"following_url0","fork":false,"forks":100,"forks_count":100,"forks_url":"forks_url0","full_name":"full_name0","gists_url":"gists_url0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","git_url":"git_url0","gravatar_id":"gravatar_id0","has_downloads":false,"has_issues":false,"has_pages":false,"has_projects":false,"has_wiki":false,"homepage":"homepage0","hooks_url":"hooks_url0","html_url":"html_url0","id":"search0","issue_comment_url":"issue_comment_url0","issue_dependencies_summary":{},"issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels":[],"labels_url":"labels_url0","languages_url":"languages_url0","license":{},"locked":false,"login":"login0","merges_url":"merges_url0","milestone":{},"milestones_url":"milestones_url0","mirror_url":"mirror_url0","name":"name0","node_id":"node_id0","notifications_url":"notifications_url0","number":100,"open_issues":100,"open_issues_count":100,"organizations_url":"organizations_url0","owner":{},"parents":[],"path":"path0","performed_via_github_app":{},"permissions":{},"private":false,"pull_request":{},"pulls_url":"pulls_url0","pushed_at":"pushed_at0","reactions":{},"received_events_url":"received_events_url0","released":"released0","releases_url":"releases_url0","repos_url":"repos_url0","repository":{},"repository_url":"repository_url0","score":100,"sha":"sha0","short_description":"short_description0","site_admin":false,"size":100,"ssh_url":"ssh_url0","stargazers_count":100,"stargazers_url":"stargazers_url0","starred_url":"starred_url0","state":"state0","statuses_url":"statuses_url0","sub_issues_summary":{},"subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","subscriptions_url":"subscriptions_url0","svn_url":"svn_url0","tags_url":"tags_url0","teams_url":"teams_url0","title":"title0","trees_url":"trees_url0","type":{},"updated_at":"updated_at0","url":"url0","user":{},"watchers":100,"watchers_count":100,"q":"q0"} },
      secret_scanning: { secret_scanning0: {"org_id":"secret_scanning0"} },
      secret_scanning_alert: { secret_scanning_alert0: {"push_protection_bypass_request_reviewer":{},"push_protection_bypassed_by":{},"resolved_by":{},"owner":"owner0","repo":"repo0","id":"secret_scanning_alert0"} },
      secret_scanning_location: { secret_scanning_location0: {"alert_number":"alert_number0","owner":"owner0","repo":"repo0","id":"secret_scanning_location0"} },
      secret_scanning_pattern_configuration: { secret_scanning_pattern_configuration0: {"org_id":"org0","id":"secret_scanning_pattern_configuration0"} },
      secret_scanning_push_protection_bypass: { secret_scanning_push_protection_bypass0: {"placeholder_id":"placeholder_id0","owner":"owner0","repo":"repo0","id":"secret_scanning_push_protection_bypass0"} },
      secret_scanning_scan_history: { secret_scanning_scan_history0: {"owner":"owner0","repo":"repo0","id":"secret_scanning_scan_history0"} },
      security_advisory: { security_advisory0: {"owner":"owner0","repo":"repo0","id":"security_advisory0"} },
      selected_action: { selected_action0: {"org_id":"org0","id":"selected_action0"} },
      self_hosted_runner: { self_hosted_runner0: {"enabled_repositories":"enabled_repositories0","org_id":"self_hosted_runner0"} },
      short_blob: { short_blob0: {"content":"content0","owner":"owner0","repo":"repo0","id":"short_blob0"} },
      short_branch: { short_branch0: {"commit":{},"name":"name0","protected":false,"owner":"owner0","repo":"repo0","id":"short_branch0"} },
      simple_classroom_assignment: { simple_classroom_assignment0: {"accepted":100,"classroom":{},"deadline":"deadline0","editor":"editor0","feedback_pull_requests_enabled":false,"id":"simple_classroom_assignment0","invitations_enabled":false,"invite_link":"invite_link0","language":"language0","passing":100,"public_repo":false,"slug":"slug0","students_are_repo_admins":false,"submitted":100,"title":"title0","type":"type0","classroom_id":"classroom0"} },
      social_account: { social_account0: {"account_urls":[],"provider":"provider0","url":"url0","id":"social_account0"} },
      ssh_signing_key: { ssh_signing_key0: {"created_at":"created_at0","id":"ssh_signing_key0","key":"key0","title":"title0"} },
      status: { status0: {"avatar_url":"avatar_url0","created_at":"created_at0","creator":{},"id":"status0","node_id":"node_id0","state":"state0","updated_at":"updated_at0","url":"url0","owner":"owner0","ref":"ref0","repo":"repo0"} },
      status_check_policy: { status_check_policy0: {"app_id":100,"checks":[],"context":"context0","contexts":[],"contexts_url":"contexts_url0","strict":false,"url":"url0","owner":"owner0","repo":"repo0","branch_id":"status_check_policy0"} },
      subscriber: { subscriber0: {"avatar_url":"avatar_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","gists_url":"gists_url0","gravatar_id":"gravatar_id0","html_url":"html_url0","id":"subscriber0","login":"login0","node_id":"node_id0","organizations_url":"organizations_url0","received_events_url":"received_events_url0","repos_url":"repos_url0","site_admin":false,"starred_url":"starred_url0","subscriptions_url":"subscriptions_url0","type":"type0","url":"url0","owner":"owner0","repo":"repo0"} },
      tag: { tag0: {"commit":{},"name":"name0","node_id":"node_id0","tarball_url":"tarball_url0","zipball_url":"zipball_url0","owner":"owner0","repo":"repo0","id":"tag0"} },
      tag_protection: { tag_protection0: {"pattern":"pattern0","owner":"owner0","repo":"repo0","id":"tag_protection0"} },
      team: { team0: {"archive_url":"archive_url0","archived":false,"assignees_url":"assignees_url0","author":{},"avatar_url":"avatar_url0","blobs_url":"blobs_url0","body":"body0","body_html":"body_html0","body_version":"body_version0","branches_url":"branches_url0","clone_url":"clone_url0","code_of_conduct":{},"collaborators_url":"collaborators_url0","columns_url":"columns_url0","comments_count":100,"comments_url":"comments_url0","commits_url":"commits_url0","compare_url":"compare_url0","contents_url":"contents_url0","contributors_url":"contributors_url0","created_at":"created_at0","creator":{},"default_branch":"default_branch0","deployments_url":"deployments_url0","description":"description0","disabled":false,"discussion_url":"discussion_url0","downloads_url":"downloads_url0","events_url":"events_url0","followers_url":"followers_url0","following_url":"following_url0","fork":false,"forks":100,"forks_count":100,"forks_url":"forks_url0","full_name":"full_name0","gists_url":"gists_url0","git_commits_url":"git_commits_url0","git_refs_url":"git_refs_url0","git_tags_url":"git_tags_url0","git_url":"git_url0","gravatar_id":"gravatar_id0","has_downloads":false,"has_issues":false,"has_pages":false,"has_projects":false,"has_wiki":false,"homepage":"homepage0","hooks_url":"hooks_url0","html_url":"html_url0","id":"team0","invitation_teams_url":"invitation_teams_url0","inviter":{},"issue_comment_url":"issue_comment_url0","issue_events_url":"issue_events_url0","issues_url":"issues_url0","keys_url":"keys_url0","labels_url":"labels_url0","language":"language0","languages_url":"languages_url0","last_edited_at":"last_edited_at0","license":{},"login":"login0","members_count":100,"members_url":"members_url0","merges_url":"merges_url0","milestones_url":"milestones_url0","mirror_url":"mirror_url0","name":"name0","node_id":"node_id0","notifications_url":"notifications_url0","number":100,"open_issues":100,"open_issues_count":100,"organization":{},"organizations_url":"organizations_url0","owner":{},"owner_url":"owner_url0","parent":{},"permission":"permission0","permissions":{},"pinned":false,"private":false,"pulls_url":"pulls_url0","pushed_at":"pushed_at0","reactions":{},"received_events_url":"received_events_url0","releases_url":"releases_url0","repos_count":100,"repos_url":"repos_url0","repositories_url":"repositories_url0","role":"role0","site_admin":false,"size":100,"slug":"slug0","ssh_url":"ssh_url0","stargazers_count":100,"stargazers_url":"stargazers_url0","starred_url":"starred_url0","state":"state0","statuses_url":"statuses_url0","subscribers_url":"subscribers_url0","subscription_url":"subscription_url0","subscriptions_url":"subscriptions_url0","svn_url":"svn_url0","tags_url":"tags_url0","team_count":100,"team_url":"team_url0","teams_url":"teams_url0","title":"title0","trees_url":"trees_url0","type":"type0","updated_at":"updated_at0","url":"url0","watchers":100,"watchers_count":100,"org_id":"org0","project_id":"project0"} },
      team_simple: { team_simple0: {"description":"description0","html_url":"html_url0","id":"team_simple0","members_url":"members_url0","name":"name0","node_id":"node_id0","permission":"permission0","repositories_url":"repositories_url0","slug":"slug0","url":"url0","org_id":"org0"} },
      thread: { thread0: {"id":"thread0","last_read_at":"last_read_at0","reason":"reason0","repository":{},"subject":{},"subscription_url":"subscription_url0","unread":false,"updated_at":"updated_at0","url":"url0"} },
      thread_subscription: { thread_subscription0: {"created_at":"created_at0","ignored":false,"reason":"reason0","subscribed":false,"url":"url0","id":"thread_subscription0"} },
      topic: { topic0: {"names":[],"owner":"owner0","repo":"topic0"} },
      user: { user0: {"private_repos":100,"space":100,"subject_digests":[],"users":[],"branch_id":"branch0","gpg_key_id":"gpg_key0","owner":"owner0","repo":"repo0","username":"username0","id":"user0"} },
      user_marketplace_purchase: { user_marketplace_purchase0: {"account":{},"billing_cycle":"billing_cycle0","free_trial_ends_on":"free_trial_ends_on0","next_billing_date":"next_billing_date0","on_free_trial":false,"plan":{},"unit_count":100,"updated_at":"updated_at0","id":"user_marketplace_purchase0"} },
      view: { view0: {"count":100,"timestamp":"timestamp0","uniques":100,"owner":"owner0","repo":"repo0","id":"view0"} },
      webhook_config: { webhook_config0: {"id":"webhook_config0"} },
      workflow: { workflow0: {"badge_url":"badge_url0","created_at":"created_at0","html_url":"html_url0","id":"workflow0","name":"name0","node_id":"node_id0","path":"path0","state":"state0","updated_at":"updated_at0","url":"url0","owner":"owner0","repo":"repo0"} },
      workflow_run: { workflow_run0: {"actor":{},"artifacts_url":"artifacts_url0","cancel_url":"cancel_url0","check_suite_url":"check_suite_url0","conclusion":"conclusion0","created_at":"created_at0","display_title":"display_title0","event":"event0","head_branch":"head_branch0","head_commit":{},"head_repository":{},"head_sha":"head_sha0","html_url":"html_url0","id":"workflow_run0","jobs_url":"jobs_url0","logs_url":"logs_url0","node_id":"node_id0","path":"path0","pull_requests":[],"repository":{},"rerun_url":"rerun_url0","run_number":100,"status":"status0","triggering_actor":{},"updated_at":"updated_at0","url":"url0","workflow_id":100,"workflow_url":"workflow_url0","owner":"owner0","repo":"repo0","run_id":"run0"} },
      workflow_run_usage: { workflow_run_usage0: {"MACOS":{},"UBUNTU":{},"WINDOWS":{},"owner":"owner0","repo":"repo0","run_id":"workflow_run_usage0"} },
      workflow_usage: { workflow_usage0: {"owner":"owner0","repo":"repo0","id":"workflow_usage0"} },
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

The plugin registers 264 entity canons.
A canon carries only the commands its API operations support — an entity the
API offers no delete for has no `remove$` — so the tables below are the
whole of what each one answers.

| Seneca canon | SDK accessor | Route | Id field | Parent keys | Commands |
| ------------ | ------------ | ----- | -------- | ----------- | -------- |
| `provider/github/action` | `sdk.Action()` | `/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs` | `null` | `artifact_id`, `hosted_runner_id`, `name`, `org_id`, `owner`, `repo`, `repository_id` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/actions_artifact_and_log_retention` | `sdk.ActionsArtifactAndLogRetention()` | `/repos/{owner}/{repo}/actions/permissions/artifact-and-log-retention` | `null` | — | `load$` |
| `provider/github/actions_cache_list` | `sdk.ActionsCacheList()` | `/repos/{owner}/{repo}/actions/caches` | `null` | `key`, `owner` | `list$`, `remove$` |
| `provider/github/actions_cache_usage_by_repository` | `sdk.ActionsCacheUsageByRepository()` | `/repos/{owner}/{repo}/actions/cache/usage` | `null` | `owner` | `load$` |
| `provider/github/actions_cache_usage_org_enterprise` | `sdk.ActionsCacheUsageOrgEnterprise()` | `/orgs/{org}/actions/cache/usage` | `null` | — | `load$` |
| `provider/github/actions_fork_pr_contributor_approval` | `sdk.ActionsForkPrContributorApproval()` | `/repos/{owner}/{repo}/actions/permissions/fork-pr-contributor-approval` | `null` | — | `load$` |
| `provider/github/actions_fork_pr_workflows_private_repo` | `sdk.ActionsForkPrWorkflowsPrivateRepo()` | `/repos/{owner}/{repo}/actions/permissions/fork-pr-workflows-private-repos` | `null` | — | `load$` |
| `provider/github/actions_get_default_workflow_permission` | `sdk.ActionsGetDefaultWorkflowPermission()` | `/repos/{owner}/{repo}/actions/permissions/workflow` | `null` | — | `load$` |
| `provider/github/actions_hosted_runner` | `sdk.ActionsHostedRunner()` | `/orgs/{org}/actions/hosted-runners/{hosted_runner_id}` | `id` | `org_id` | `load$`, `save$` |
| `provider/github/actions_hosted_runner_limit` | `sdk.ActionsHostedRunnerLimit()` | `/orgs/{org}/actions/hosted-runners/limits` | `null` | — | `load$` |
| `provider/github/actions_organization_permission` | `sdk.ActionsOrganizationPermission()` | `/orgs/{org}/actions/permissions` | `null` | — | `load$` |
| `provider/github/actions_public_key` | `sdk.ActionsPublicKey()` | `/repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key` | `null` | — | `load$` |
| `provider/github/actions_repository_permission` | `sdk.ActionsRepositoryPermission()` | `/repos/{owner}/{repo}/actions/permissions` | `null` | `owner` | `load$` |
| `provider/github/actions_secret` | `sdk.ActionsSecret()` | `/repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}` | `id` | `owner`, `repo` | `load$` |
| `provider/github/actions_variable` | `sdk.ActionsVariable()` | `/repos/{owner}/{repo}/environments/{environment_name}/variables/{name}` | `id` | `owner`, `repo` | `load$` |
| `provider/github/actions_workflow_access_to_repository` | `sdk.ActionsWorkflowAccessToRepository()` | `/repos/{owner}/{repo}/actions/permissions/access` | `null` | `owner` | `load$` |
| `provider/github/activity` | `sdk.Activity()` | `/repos/{owner}/{repo}/activity` | `null` | `owner`, `thread_id` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/add` | `sdk.Add()` | `/enterprises/{enterprise}/teams/{enterprise-team}/memberships/add` | `null` | `enterprise`, `team_id` | `save$` |
| `provider/github/api_insights_route_stat` | `sdk.ApiInsightsRouteStat()` | `/orgs/{org}/insights/api/route-stats/{actor_type}/{actor_id}` | `null` | `actor_id`, `actor_type`, `min_timestamp`, `org` | `list$` |
| `provider/github/api_insights_subject_stat` | `sdk.ApiInsightsSubjectStat()` | `/orgs/{org}/insights/api/subject-stats` | `null` | `min_timestamp`, `org_id` | `list$` |
| `provider/github/api_insights_summary_stat` | `sdk.ApiInsightsSummaryStat()` | `/orgs/{org}/insights/api/summary-stats/{actor_type}/{actor_id}` | `null` | `min_timestamp` | `load$` |
| `provider/github/api_insights_time_stat` | `sdk.ApiInsightsTimeStat()` | `/orgs/{org}/insights/api/time-stats/{actor_type}/{actor_id}` | `null` | `min_timestamp`, `org_id`, `timestamp_increment` | `list$`, `load$` |
| `provider/github/api_insights_user_stat` | `sdk.ApiInsightsUserStat()` | `/orgs/{org}/insights/api/user-stats/{user_id}` | `id` | `min_timestamp`, `org_id` | `load$` |
| `provider/github/api_overview` | `sdk.ApiOverview()` | `/meta` | `null` | — | `list$` |
| `provider/github/app` | `sdk.App()` | `/user/installations/{installation_id}/repositories` | `null` | `code`, `repository_id` | `list$`, `save$`, `remove$` |
| `provider/github/artifact` | `sdk.Artifact()` | `/repos/{owner}/{repo}/actions/artifacts/{artifact_id}` | `id` | `owner`, `repo` | `load$` |
| `provider/github/assignee` | `sdk.Assignee()` | `/repos/{owner}/{repo}/assignees` | `null` | `owner`, `repo` | `list$` |
| `provider/github/authentication_token` | `sdk.AuthenticationToken()` | `/repos/{owner}/{repo}/actions/runners/registration-token` | `null` | `org_id` | `save$` |
| `provider/github/authorization` | `sdk.Authorization()` | `/applications/{client_id}/token` | `null` | — | `save$` |
| `provider/github/autolink` | `sdk.Autolink()` | `/repos/{owner}/{repo}/autolinks` | `id` | `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/base_gist` | `sdk.BaseGist()` | `/users/{username}/gists` | `null` | `gist_id` | `list$`, `save$` |
| `provider/github/billing_usage_report` | `sdk.BillingUsageReport()` | `/organizations/{org}/settings/billing/usage` | `null` | `org` | `list$` |
| `provider/github/billing_usage_report_user` | `sdk.BillingUsageReportUser()` | `/users/{username}/settings/billing/usage` | `null` | `username` | `list$` |
| `provider/github/blob` | `sdk.Blob()` | `/repos/{owner}/{repo}/git/blobs/{file_sha}` | `id` | `owner`, `repo` | `load$` |
| `provider/github/block` | `sdk.Block()` | `/orgs/{org}/blocks` | `null` | — | `list$` |
| `provider/github/branch` | `sdk.Branch()` | `/repos/{owner}/{repo}/branches/{branch}` | `id` | `owner`, `repo` | `load$` |
| `provider/github/branch_protection` | `sdk.BranchProtection()` | `/repos/{owner}/{repo}/branches/{branch}/protection` | `id` | `owner`, `repo` | `load$` |
| `provider/github/branch_restriction_policy` | `sdk.BranchRestrictionPolicy()` | `/repos/{owner}/{repo}/branches/{branch}/protection/restrictions` | `null` | `branch_id`, `owner`, `repo` | `list$` |
| `provider/github/branch_short` | `sdk.BranchShort()` | `/repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head` | `null` | `commit_sha`, `owner`, `repo` | `list$` |
| `provider/github/branch_with_protection` | `sdk.BranchWithProtection()` | `/repos/{owner}/{repo}/branches/{branch}/rename` | `null` | `owner`, `repo` | `save$` |
| `provider/github/campaign` | `sdk.Campaign()` | `/orgs/{org}/campaigns` | `id` | `org_id` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/check` | `sdk.Check()` | `/repos/{owner}/{repo}/commits/{ref}/check-runs` | `null` | `owner`, `repo` | `list$` |
| `provider/github/check_annotation` | `sdk.CheckAnnotation()` | `/repos/{owner}/{repo}/check-runs/{check_run_id}/annotations` | `null` | `check_run_id`, `owner`, `repo` | `list$` |
| `provider/github/check_automated_security_fix` | `sdk.CheckAutomatedSecurityFix()` | `/repos/{owner}/{repo}/automated-security-fixes` | `null` | `owner` | `load$` |
| `provider/github/check_run` | `sdk.CheckRun()` | `/repos/{owner}/{repo}/check-runs/{check_run_id}` | `id` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/check_suite` | `sdk.CheckSuite()` | `/repos/{owner}/{repo}/check-suites/{check_suite_id}` | `id` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/check_suite_preference` | `sdk.CheckSuitePreference()` | `/repos/{owner}/{repo}/check-suites/preferences` | `null` | `owner` | `save$` |
| `provider/github/classroom` | `sdk.Classroom()` | `/classrooms` | `id` | — | `list$`, `load$` |
| `provider/github/classroom_accepted_assignment` | `sdk.ClassroomAcceptedAssignment()` | `/assignments/{assignment_id}/accepted_assignments` | `null` | `assignment_id` | `list$` |
| `provider/github/classroom_assignment` | `sdk.ClassroomAssignment()` | `/assignments/{assignment_id}` | `id` | — | `load$` |
| `provider/github/classroom_assignment_grade` | `sdk.ClassroomAssignmentGrade()` | `/assignments/{assignment_id}/grades` | `null` | `assignment_id` | `list$` |
| `provider/github/clone` | `sdk.Clone()` | `/repos/{owner}/{repo}/traffic/clones` | `null` | `owner`, `repo` | `list$` |
| `provider/github/code_frequency` | `sdk.CodeFrequency()` | `/repos/{owner}/{repo}/stats/code_frequency` | `null` | `owner`, `repo` | `list$` |
| `provider/github/code_frequency_stat` | `sdk.CodeFrequencyStat()` | `/repos/{owner}/{repo}/stats/punch_card` | `null` | `owner`, `repo` | `list$` |
| `provider/github/code_of_conduct` | `sdk.CodeOfConduct()` | `/codes_of_conduct` | `null` | — | `list$`, `load$` |
| `provider/github/code_scanning` | `sdk.CodeScanning()` | `/repos/{owner}/{repo}/code-scanning/sarifs` | `null` | `owner`, `repo` | `save$`, `remove$` |
| `provider/github/code_scanning_alert` | `sdk.CodeScanningAlert()` | `/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}` | `id` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/code_scanning_alert_instance` | `sdk.CodeScanningAlertInstance()` | `/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances` | `null` | `alert_number`, `owner`, `repo` | `list$` |
| `provider/github/code_scanning_alert_item` | `sdk.CodeScanningAlertItem()` | `/repos/{owner}/{repo}/code-scanning/alerts` | `null` | `owner`, `repo` | `list$` |
| `provider/github/code_scanning_analysi` | `sdk.CodeScanningAnalysi()` | `/repos/{owner}/{repo}/code-scanning/analyses` | `null` | `owner`, `repo` | `list$`, `load$` |
| `provider/github/code_scanning_analysis_deletion` | `sdk.CodeScanningAnalysisDeletion()` | `/repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}` | `null` | `owner`, `repo` | `remove$` |
| `provider/github/code_scanning_autofix` | `sdk.CodeScanningAutofix()` | `/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix` | `null` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/code_scanning_autofix_commit` | `sdk.CodeScanningAutofixCommit()` | `/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits` | `null` | `alert_id`, `owner`, `repo` | `save$` |
| `provider/github/code_scanning_codeql_database` | `sdk.CodeScanningCodeqlDatabase()` | `/repos/{owner}/{repo}/code-scanning/codeql/databases` | `null` | `owner`, `repo` | `list$`, `load$` |
| `provider/github/code_scanning_default_setup` | `sdk.CodeScanningDefaultSetup()` | `/repos/{owner}/{repo}/code-scanning/default-setup` | `null` | `owner`, `repo` | `list$` |
| `provider/github/code_scanning_organization_alert_item` | `sdk.CodeScanningOrganizationAlertItem()` | `/orgs/{org}/code-scanning/alerts` | `null` | `org_id` | `list$` |
| `provider/github/code_scanning_sarifs_status` | `sdk.CodeScanningSarifsStatus()` | `/repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}` | `null` | `owner`, `repo` | `load$` |
| `provider/github/code_scanning_variant_analysi` | `sdk.CodeScanningVariantAnalysi()` | `/repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}` | `null` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/code_scanning_variant_analysis_repo_task` | `sdk.CodeScanningVariantAnalysisRepoTask()` | `/repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}` | `null` | `codeql_variant_analysis_id`, `owner`, `repo`, `repo_owner` | `load$` |
| `provider/github/code_security` | `sdk.CodeSecurity()` | `/enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults` | `null` | `enterprise` | `save$`, `remove$` |
| `provider/github/code_security_configuration` | `sdk.CodeSecurityConfiguration()` | `/orgs/{org}/code-security/configurations` | `id` | `enterprise`, `org_id` | `list$`, `load$`, `save$` |
| `provider/github/code_security_configuration_repository` | `sdk.CodeSecurityConfigurationRepository()` | `/enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories` | `null` | `configuration_id` | `list$` |
| `provider/github/code_security_default_configuration` | `sdk.CodeSecurityDefaultConfiguration()` | `/enterprises/{enterprise}/code-security/configurations/defaults` | `null` | `enterprise` | `list$` |
| `provider/github/codeowners_error` | `sdk.CodeownersError()` | `/repos/{owner}/{repo}/codeowners/errors` | `null` | `owner`, `repo` | `list$` |
| `provider/github/codespace` | `sdk.Codespace()` | `/orgs/{org}/codespaces/secrets/{secret_name}/repositories` | `id` | `secret_name` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/collaborator` | `sdk.Collaborator()` | `/repos/{owner}/{repo}/collaborators` | `null` | `project_id` | `list$` |
| `provider/github/combined_billing_usage` | `sdk.CombinedBillingUsage()` | `/orgs/{org}/settings/billing/shared-storage` | `null` | — | `load$` |
| `provider/github/combined_commit_status` | `sdk.CombinedCommitStatus()` | `/repos/{owner}/{repo}/commits/{ref}/status` | `null` | `owner`, `ref`, `repo` | `list$` |
| `provider/github/commit` | `sdk.Commit()` | `/repos/{owner}/{repo}/commits` | `id` | `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/commit_activity` | `sdk.CommitActivity()` | `/repos/{owner}/{repo}/stats/commit_activity` | `null` | `owner`, `repo` | `list$` |
| `provider/github/commit_comment` | `sdk.CommitComment()` | `/repos/{owner}/{repo}/commits/{commit_sha}/comments` | `id` | `commit_sha`, `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/commit_comparison` | `sdk.CommitComparison()` | `/repos/{owner}/{repo}/compare/{basehead}` | `null` | `owner`, `repo` | `load$` |
| `provider/github/community_profile` | `sdk.CommunityProfile()` | `/repos/{owner}/{repo}/community/profile` | `null` | `owner` | `load$` |
| `provider/github/content_file` | `sdk.ContentFile()` | `/repos/{owner}/{repo}/readme/{dir}` | `null` | `owner`, `repo` | `load$` |
| `provider/github/content_traffic` | `sdk.ContentTraffic()` | `/repos/{owner}/{repo}/traffic/popular/paths` | `null` | `owner`, `repo` | `list$` |
| `provider/github/contributor` | `sdk.Contributor()` | `/repos/{owner}/{repo}/contributors` | `null` | `owner`, `repo` | `list$` |
| `provider/github/copilot` | `sdk.Copilot()` | `/orgs/{org}/copilot/billing/seats` | `null` | `org_id` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/copilot_organization_detail` | `sdk.CopilotOrganizationDetail()` | `/orgs/{org}/copilot/billing` | `null` | — | `load$` |
| `provider/github/copilot_usage_metrics_day` | `sdk.CopilotUsageMetricsDay()` | `/orgs/{org}/team/{team_slug}/copilot/metrics` | `null` | `org_id` | `list$` |
| `provider/github/credential` | `sdk.Credential()` | `/credentials/revoke` | `null` | — | `save$` |
| `provider/github/custom_property` | `sdk.CustomProperty()` | `/orgs/{org}/properties/schema` | `null` | `org_id` | `list$`, `load$`, `save$` |
| `provider/github/custom_property_value` | `sdk.CustomPropertyValue()` | `/repos/{owner}/{repo}/properties/values` | `null` | `owner`, `repo` | `list$` |
| `provider/github/dependabot` | `sdk.Dependabot()` | `/orgs/{org}/dependabot/secrets/{secret_name}/repositories` | `null` | `org`, `org_id`, `repository_id`, `secret_id` | `list$`, `save$`, `remove$` |
| `provider/github/dependabot_alert` | `sdk.DependabotAlert()` | `/repos/{owner}/{repo}/dependabot/alerts` | `id` | `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/dependabot_alert_with_repository` | `sdk.DependabotAlertWithRepository()` | `/orgs/{org}/dependabot/alerts` | `null` | `org_id` | `list$` |
| `provider/github/dependabot_public_key` | `sdk.DependabotPublicKey()` | `/repos/{owner}/{repo}/dependabot/secrets/public-key` | `null` | — | `load$` |
| `provider/github/dependabot_repository_access_detail` | `sdk.DependabotRepositoryAccessDetail()` | `/organizations/{org}/dependabot/repository-access` | `null` | `org` | `list$` |
| `provider/github/dependabot_secret` | `sdk.DependabotSecret()` | `/repos/{owner}/{repo}/dependabot/secrets/{secret_name}` | `id` | `owner`, `repo` | `load$` |
| `provider/github/dependency_graph` | `sdk.DependencyGraph()` | `/repos/{owner}/{repo}/dependency-graph/snapshots` | `null` | `owner`, `repo` | `save$` |
| `provider/github/dependency_graph_diff` | `sdk.DependencyGraphDiff()` | `/repos/{owner}/{repo}/dependency-graph/compare/{basehead}` | `null` | `owner`, `repo` | `load$` |
| `provider/github/dependency_graph_spdx_sbom` | `sdk.DependencyGraphSpdxSbom()` | `/repos/{owner}/{repo}/dependency-graph/sbom` | `null` | `owner` | `load$` |
| `provider/github/deploy_key` | `sdk.DeployKey()` | `/repos/{owner}/{repo}/keys` | `id` | `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/deployment` | `sdk.Deployment()` | `/repos/{owner}/{repo}/deployments` | `id` | `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/deployment_branch_policy` | `sdk.DeploymentBranchPolicy()` | `/repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}` | `id` | `environment_id`, `environment_name`, `owner`, `repo` | `load$`, `save$` |
| `provider/github/deployment_protection_rule` | `sdk.DeploymentProtectionRule()` | `/repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}` | `id` | `environment_id`, `environment_name`, `owner`, `repo` | `load$`, `save$` |
| `provider/github/deployment_status` | `sdk.DeploymentStatus()` | `/repos/{owner}/{repo}/deployments/{deployment_id}/statuses` | `id` | `deployment_id`, `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/diff_entry` | `sdk.DiffEntry()` | `/repos/{owner}/{repo}/pulls/{pull_number}/files` | `null` | `owner`, `pull_number`, `repo` | `list$` |
| `provider/github/email` | `sdk.Email()` | `/user/emails` | `null` | — | `list$`, `save$` |
| `provider/github/emoji` | `sdk.Emoji()` | `/emojis` | `id` | — | `load$` |
| `provider/github/empty_object` | `sdk.EmptyObject()` | `/users/{username}/attestations/{subject_digest}` | `null` | `org_id`, `owner`, `repo`, `secret_name`, `username` | `load$`, `save$` |
| `provider/github/enterprise_team` | `sdk.EnterpriseTeam()` | `/enterprises/{enterprise}/teams` | `id` | `enterprise` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/enterprise_team_membership` | `sdk.EnterpriseTeamMembership()` | `/enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}` | `null` | `enterprise`, `team_id` | `remove$` |
| `provider/github/environment` | `sdk.Environment()` | `/repos/{owner}/{repo}/environments/{environment_name}` | `id` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/environment_approval` | `sdk.EnvironmentApproval()` | `/repos/{owner}/{repo}/actions/runs/{run_id}/approvals` | `null` | `owner`, `repo`, `run_id` | `list$` |
| `provider/github/event` | `sdk.Event()` | `/networks/{owner}/{repo}/events` | `null` | `username` | `list$`, `load$` |
| `provider/github/feed` | `sdk.Feed()` | `/feeds` | `null` | — | `list$` |
| `provider/github/file_commit` | `sdk.FileCommit()` | `/repos/{owner}/{repo}/contents/{path}` | `null` | `owner`, `repo` | `save$`, `remove$` |
| `provider/github/follower` | `sdk.Follower()` | `/users/{username}/followers` | `null` | — | `list$` |
| `provider/github/following` | `sdk.Following()` | `/users/{username}/following` | `null` | — | `list$` |
| `provider/github/full_repository` | `sdk.FullRepository()` | `/repos/{owner}/{repo}` | `null` | `owner` | `load$`, `save$` |
| `provider/github/gist` | `sdk.Gist()` | `/gists` | `id` | — | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/gist_comment` | `sdk.GistComment()` | `/gists/{gist_id}/comments` | `id` | `gist_id` | `list$`, `load$`, `save$` |
| `provider/github/gist_commit` | `sdk.GistCommit()` | `/gists/{gist_id}/commits` | `null` | — | `list$` |
| `provider/github/gist_simple` | `sdk.GistSimple()` | `/gists/{gist_id}/forks` | `null` | — | `list$` |
| `provider/github/git` | `sdk.Git()` | `/repos/{owner}/{repo}/git/refs/{ref}` | `null` | `owner`, `repo` | `remove$` |
| `provider/github/git_commit` | `sdk.GitCommit()` | `/repos/{owner}/{repo}/git/commits/{commit_sha}` | `id` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/git_ref` | `sdk.GitRef()` | `/repos/{owner}/{repo}/git/ref/{ref}` | `id` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/git_tag` | `sdk.GitTag()` | `/repos/{owner}/{repo}/git/tags/{tag_sha}` | `id` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/git_tree` | `sdk.GitTree()` | `/repos/{owner}/{repo}/git/trees/{tree_sha}` | `id` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/gitignore` | `sdk.Gitignore()` | `/gitignore/templates` | `null` | — | `list$` |
| `provider/github/gitignore_template` | `sdk.GitignoreTemplate()` | `/gitignore/templates/{name}` | `id` | — | `load$` |
| `provider/github/global_advisory` | `sdk.GlobalAdvisory()` | `/advisories` | `id` | — | `list$`, `load$` |
| `provider/github/gpg_key` | `sdk.GpgKey()` | `/users/{username}/gpg_keys` | `id` | — | `list$`, `load$`, `save$` |
| `provider/github/hook` | `sdk.Hook()` | `/repos/{owner}/{repo}/hooks` | `id` | `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/hook_delivery` | `sdk.HookDelivery()` | `/repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}` | `id` | — | `load$` |
| `provider/github/hook_delivery_item` | `sdk.HookDeliveryItem()` | `/app/hook/deliveries` | `null` | — | `list$` |
| `provider/github/hosted_compute` | `sdk.HostedCompute()` | `/orgs/{org}/settings/network-configurations` | `null` | `org_id` | `list$`, `remove$` |
| `provider/github/hovercard` | `sdk.Hovercard()` | `/users/{username}/hovercard` | `null` | `username` | `list$` |
| `provider/github/import` | `sdk.Import()` | `/repos/{owner}/{repo}/import` | `null` | `owner` | `list$`, `save$` |
| `provider/github/installation` | `sdk.Installation()` | `/app/installations` | `id` | — | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/installation_token` | `sdk.InstallationToken()` | `/app/installations/{installation_id}/access_tokens` | `null` | — | `save$` |
| `provider/github/integration` | `sdk.Integration()` | `/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps` | `null` | `branch_id`, `owner`, `repo` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/integration_installation` | `sdk.IntegrationInstallation()` | `/app/installation-requests` | `null` | — | `list$` |
| `provider/github/interaction` | `sdk.Interaction()` | `/repos/{owner}/{repo}/interaction-limits` | `null` | — | `load$`, `remove$` |
| `provider/github/interaction_limit` | `sdk.InteractionLimit()` | `/repos/{owner}/{repo}/interaction-limits` | `null` | — | `save$` |
| `provider/github/issue` | `sdk.Issue()` | `/repos/{owner}/{repo}/issues` | `id` | `owner`, `repo` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/issue_type` | `sdk.IssueType()` | `/orgs/{org}/issue-types` | `null` | `org_id` | `list$`, `save$` |
| `provider/github/job` | `sdk.Job()` | `/repos/{owner}/{repo}/actions/jobs/{job_id}` | `id` | `owner`, `repo` | `load$` |
| `provider/github/key` | `sdk.Key()` | `/users/{username}/keys` | `id` | — | `list$`, `load$`, `save$` |
| `provider/github/label` | `sdk.Label()` | `/repos/{owner}/{repo}/milestones/{milestone_number}/labels` | `id` | `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/language` | `sdk.Language()` | `/repos/{owner}/{repo}/languages` | `null` | `owner` | `load$` |
| `provider/github/license` | `sdk.License()` | `/licenses` | `id` | — | `list$`, `load$` |
| `provider/github/markdown` | `sdk.Markdown()` | `/markdown` | `null` | — | `save$` |
| `provider/github/marketplace_listing_plan` | `sdk.MarketplaceListingPlan()` | `/marketplace_listing/plans` | `null` | — | `list$` |
| `provider/github/marketplace_purchase` | `sdk.MarketplacePurchase()` | `/marketplace_listing/plans/{plan_id}/accounts` | `null` | `plan_id` | `list$`, `load$` |
| `provider/github/member` | `sdk.Member()` | `/orgs/{org}/members` | `null` | `org_id` | `list$` |
| `provider/github/membership` | `sdk.Membership()` | `/enterprises/{enterprise}/teams/{enterprise-team}/memberships` | `id` | `enterprise`, `enterprise_team`, `team_id` | `list$`, `load$`, `save$` |
| `provider/github/merged_upstream` | `sdk.MergedUpstream()` | `/repos/{owner}/{repo}/merge-upstream` | `null` | `owner`, `repo` | `save$` |
| `provider/github/meta` | `sdk.Meta()` | `/versions` | `null` | — | `list$`, `load$` |
| `provider/github/metaroot` | `sdk.Metaroot()` | `/` | `null` | — | `load$` |
| `provider/github/migration` | `sdk.Migration()` | `/orgs/{org}/migrations` | `id` | `owner`, `repo` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/milestone` | `sdk.Milestone()` | `/repos/{owner}/{repo}/milestones` | `id` | `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/minimal_repository` | `sdk.MinimalRepository()` | `/orgs/{org}/repos` | `null` | — | `list$` |
| `provider/github/network_configuration` | `sdk.NetworkConfiguration()` | `/orgs/{org}/settings/network-configurations/{network_configuration_id}` | `id` | `org_id` | `load$`, `save$` |
| `provider/github/network_setting` | `sdk.NetworkSetting()` | `/orgs/{org}/settings/network-settings/{network_settings_id}` | `id` | `org_id` | `load$` |
| `provider/github/oidc_custom_sub` | `sdk.OidcCustomSub()` | `/orgs/{org}/actions/oidc/customization/sub` | `null` | `org_id` | `list$` |
| `provider/github/oidc_custom_sub_repo` | `sdk.OidcCustomSubRepo()` | `/repos/{owner}/{repo}/actions/oidc/customization/sub` | `null` | `owner`, `repo` | `list$` |
| `provider/github/org` | `sdk.Org()` | `/user/memberships/orgs` | `id` | `enablement`, `org`, `security_product`, `username` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/org_hook` | `sdk.OrgHook()` | `/orgs/{org}/hooks` | `id` | `org_id` | `list$`, `load$`, `save$` |
| `provider/github/org_membership` | `sdk.OrgMembership()` | `/orgs/{org}/memberships/{username}` | `id` | `org_id` | `load$`, `save$` |
| `provider/github/org_private_registry_configuration` | `sdk.OrgPrivateRegistryConfiguration()` | `/orgs/{org}/private-registries/{secret_name}` | `null` | `org_id` | `load$` |
| `provider/github/org_private_registry_configuration_with_selected_repository` | `sdk.OrgPrivateRegistryConfigurationWithSelectedRepository()` | `/orgs/{org}/private-registries` | `null` | — | `save$` |
| `provider/github/org_repo_custom_property_value` | `sdk.OrgRepoCustomPropertyValue()` | `/orgs/{org}/properties/values` | `null` | `org_id` | `list$` |
| `provider/github/organization_actions_secret` | `sdk.OrganizationActionsSecret()` | `/orgs/{org}/actions/secrets/{secret_name}` | `id` | `org_id` | `load$` |
| `provider/github/organization_actions_variable` | `sdk.OrganizationActionsVariable()` | `/orgs/{org}/actions/variables/{name}` | `id` | `org_id` | `load$` |
| `provider/github/organization_dependabot_secret` | `sdk.OrganizationDependabotSecret()` | `/orgs/{org}/dependabot/secrets/{secret_name}` | `id` | `org_id` | `load$` |
| `provider/github/organization_invitation` | `sdk.OrganizationInvitation()` | `/orgs/{org}/invitations` | `null` | `org_id` | `list$`, `save$` |
| `provider/github/organization_programmatic_access_grant` | `sdk.OrganizationProgrammaticAccessGrant()` | `/orgs/{org}/personal-access-token-requests` | `null` | `org_id` | `list$` |
| `provider/github/organization_role` | `sdk.OrganizationRole()` | `/orgs/{org}/organization-roles/{role_id}` | `id` | `org_id` | `load$` |
| `provider/github/organization_secret_scanning_alert` | `sdk.OrganizationSecretScanningAlert()` | `/orgs/{org}/secret-scanning/alerts` | `null` | `org_id` | `list$` |
| `provider/github/outside_collaborator` | `sdk.OutsideCollaborator()` | `/orgs/{org}/outside_collaborators` | `null` | `org_id` | `list$` |
| `provider/github/package` | `sdk.Package()` | `/orgs/{org}/packages/{package_type}/{package_name}/versions` | `null` | `package_id`, `package_type` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/page` | `sdk.Page()` | `/repos/{owner}/{repo}/pages` | `null` | `owner` | `load$`, `save$` |
| `provider/github/page_build` | `sdk.PageBuild()` | `/repos/{owner}/{repo}/pages/builds` | `id` | `owner`, `repo` | `list$`, `load$` |
| `provider/github/page_build_status` | `sdk.PageBuildStatus()` | `/repos/{owner}/{repo}/pages/builds` | `null` | `owner`, `repo` | `save$` |
| `provider/github/page_deployment` | `sdk.PageDeployment()` | `/repos/{owner}/{repo}/pages/deployments` | `null` | `owner`, `repo` | `save$` |
| `provider/github/pages_deployment_status` | `sdk.PagesDeploymentStatus()` | `/repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}` | `null` | `deployment_id`, `owner`, `repo` | `load$`, `save$` |
| `provider/github/pages_health_check` | `sdk.PagesHealthCheck()` | `/repos/{owner}/{repo}/pages/health` | `null` | `owner` | `load$` |
| `provider/github/participation` | `sdk.Participation()` | `/repos/{owner}/{repo}/stats/participation` | `null` | `owner`, `repo` | `list$` |
| `provider/github/pending_deployment` | `sdk.PendingDeployment()` | `/repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments` | `null` | `owner`, `repo`, `run_id` | `list$` |
| `provider/github/porter_author` | `sdk.PorterAuthor()` | `/repos/{owner}/{repo}/import/authors` | `null` | `owner`, `repo` | `list$`, `save$` |
| `provider/github/porter_large_file` | `sdk.PorterLargeFile()` | `/repos/{owner}/{repo}/import/large_files` | `null` | `owner`, `repo` | `list$` |
| `provider/github/private_registry` | `sdk.PrivateRegistry()` | `/orgs/{org}/private-registries` | `null` | — | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/project` | `sdk.Project()` | `/repos/{owner}/{repo}/projects` | `id` | `org_id` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/project_collaborator_permission` | `sdk.ProjectCollaboratorPermission()` | `/projects/{project_id}/collaborators/{username}/permission` | `null` | `project_id` | `load$` |
| `provider/github/project_column` | `sdk.ProjectColumn()` | `/projects/{project_id}/columns` | `id` | — | `list$`, `load$`, `save$` |
| `provider/github/projects_classic` | `sdk.ProjectsClassic()` | `/projects/columns/{column_id}/moves` | `null` | `project_id`, `username` | `save$`, `remove$` |
| `provider/github/projects_v2` | `sdk.ProjectsV2()` | `/orgs/{org}/projectsV2` | `id` | `org_id` | `list$`, `load$` |
| `provider/github/projects_v2_field` | `sdk.ProjectsV2Field()` | `/orgs/{org}/projectsV2/{project_number}/fields` | `id` | `project_number`, `projects_v2_id` | `list$`, `load$` |
| `provider/github/projects_v2_item_simple` | `sdk.ProjectsV2ItemSimple()` | `/orgs/{org}/projectsV2/{project_number}/items` | `null` | `project_number` | `save$` |
| `provider/github/projects_v2_item_with_content` | `sdk.ProjectsV2ItemWithContent()` | `/orgs/{org}/projectsV2/{project_number}/items` | `null` | `project_number`, `projects_v2_id` | `list$`, `load$`, `save$` |
| `provider/github/protected_branch` | `sdk.ProtectedBranch()` | `/repos/{owner}/{repo}/branches/{branch}/protection` | `null` | `owner`, `repo` | `save$` |
| `provider/github/protected_branch_admin_enforced` | `sdk.ProtectedBranchAdminEnforced()` | `/repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins` | `null` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/protected_branch_pull_request_review` | `sdk.ProtectedBranchPullRequestReview()` | `/repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews` | `null` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/public_member` | `sdk.PublicMember()` | `/orgs/{org}/public_members` | `null` | `org_id` | `list$` |
| `provider/github/pull` | `sdk.Pull()` | `/repos/{owner}/{repo}/pulls` | `id` | `comment_id`, `owner`, `repo` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/pull_request_review` | `sdk.PullRequestReview()` | `/repos/{owner}/{repo}/pulls/{pull_number}/reviews` | `id` | `owner`, `pull_id`, `pull_number`, `repo` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/pull_request_review_comment` | `sdk.PullRequestReviewComment()` | `/repos/{owner}/{repo}/pulls/{pull_number}/comments` | `id` | `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/pull_request_simple` | `sdk.PullRequestSimple()` | `/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers` | `null` | `owner`, `repo` | `save$`, `remove$` |
| `provider/github/rate_limit` | `sdk.RateLimit()` | `/rate_limit` | `null` | — | `load$` |
| `provider/github/reaction` | `sdk.Reaction()` | `/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions` | `null` | `discussion_number`, `team_id` | `list$`, `save$`, `remove$` |
| `provider/github/referrer` | `sdk.Referrer()` | `/repos/{owner}/{repo}/traffic/popular/referrers` | `null` | `owner`, `repo` | `list$` |
| `provider/github/release` | `sdk.Release()` | `/repos/{owner}/{repo}/releases` | `id` | `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/release_asset` | `sdk.ReleaseAsset()` | `/repos/{owner}/{repo}/releases/{release_id}/assets` | `id` | `name`, `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/release_notes_content` | `sdk.ReleaseNotesContent()` | `/repos/{owner}/{repo}/releases/generate-notes` | `null` | `owner`, `repo` | `save$` |
| `provider/github/remove` | `sdk.Remove()` | `/enterprises/{enterprise}/teams/{enterprise-team}/memberships/remove` | `null` | `enterprise`, `team_id` | `save$` |
| `provider/github/repo` | `sdk.Repo()` | `/user/repos` | `null` | `branch_id`, `invitation_id`, `owner`, `repo` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/repository` | `sdk.Repository()` | `/user/starred` | `null` | — | `list$` |
| `provider/github/repository_advisory` | `sdk.RepositoryAdvisory()` | `/repos/{owner}/{repo}/security-advisories` | `null` | `org_id`, `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/repository_collaborator_permission` | `sdk.RepositoryCollaboratorPermission()` | `/repos/{owner}/{repo}/collaborators/{username}/permission` | `null` | `owner`, `repo` | `load$` |
| `provider/github/repository_invitation` | `sdk.RepositoryInvitation()` | `/repos/{owner}/{repo}/invitations` | `null` | `owner`, `repo` | `list$`, `save$` |
| `provider/github/repository_rule_detailed` | `sdk.RepositoryRuleDetailed()` | `/repos/{owner}/{repo}/rules/branches/{branch}` | `null` | `owner`, `repo` | `load$` |
| `provider/github/repository_ruleset` | `sdk.RepositoryRuleset()` | `/repos/{owner}/{repo}/rulesets` | `id` | `org_id` | `list$`, `load$`, `save$` |
| `provider/github/repository_subscription` | `sdk.RepositorySubscription()` | `/repos/{owner}/{repo}/subscription` | `null` | `owner` | `load$`, `save$` |
| `provider/github/review_comment` | `sdk.ReviewComment()` | `/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments` | `null` | `owner`, `pull_id`, `repo` | `list$` |
| `provider/github/rule_suite` | `sdk.RuleSuite()` | `/orgs/{org}/rulesets/rule-suites` | `id` | `org_id` | `list$`, `load$` |
| `provider/github/ruleset_version` | `sdk.RulesetVersion()` | `/repos/{owner}/{repo}/rulesets/{ruleset_id}/history` | `null` | — | `list$` |
| `provider/github/ruleset_version_with_state` | `sdk.RulesetVersionWithState()` | `/repos/{owner}/{repo}/rulesets/{ruleset_id}/history/{version_id}` | `null` | `ruleset_id` | `load$` |
| `provider/github/runner` | `sdk.Runner()` | `/repos/{owner}/{repo}/actions/runners/{runner_id}` | `id` | — | `load$` |
| `provider/github/runner_application` | `sdk.RunnerApplication()` | `/repos/{owner}/{repo}/actions/runners/downloads` | `null` | `org_id` | `list$` |
| `provider/github/runner_group` | `sdk.RunnerGroup()` | `/orgs/{org}/actions/runner-groups/{runner_group_id}` | `id` | `org_id` | `load$`, `save$` |
| `provider/github/search` | `sdk.Search()` | `/search/issues` | `null` | `q` | `list$` |
| `provider/github/secret_scanning` | `sdk.SecretScanning()` | `/orgs/{org}/secret-scanning/pattern-configurations` | `null` | — | `save$` |
| `provider/github/secret_scanning_alert` | `sdk.SecretScanningAlert()` | `/repos/{owner}/{repo}/secret-scanning/alerts` | `id` | `owner`, `repo` | `list$`, `load$`, `save$` |
| `provider/github/secret_scanning_location` | `sdk.SecretScanningLocation()` | `/repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations` | `null` | `alert_number`, `owner`, `repo` | `list$` |
| `provider/github/secret_scanning_pattern_configuration` | `sdk.SecretScanningPatternConfiguration()` | `/orgs/{org}/secret-scanning/pattern-configurations` | `null` | `org_id` | `list$` |
| `provider/github/secret_scanning_push_protection_bypass` | `sdk.SecretScanningPushProtectionBypass()` | `/repos/{owner}/{repo}/secret-scanning/push-protection-bypasses` | `null` | `owner`, `repo` | `save$` |
| `provider/github/secret_scanning_scan_history` | `sdk.SecretScanningScanHistory()` | `/repos/{owner}/{repo}/secret-scanning/scan-history` | `null` | `owner`, `repo` | `list$` |
| `provider/github/security_advisory` | `sdk.SecurityAdvisory()` | `/repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks` | `null` | `owner`, `repo` | `save$` |
| `provider/github/selected_action` | `sdk.SelectedAction()` | `/repos/{owner}/{repo}/actions/permissions/selected-actions` | `null` | `org_id` | `list$` |
| `provider/github/self_hosted_runner` | `sdk.SelfHostedRunner()` | `/orgs/{org}/actions/permissions/self-hosted-runners` | `null` | — | `load$` |
| `provider/github/short_blob` | `sdk.ShortBlob()` | `/repos/{owner}/{repo}/git/blobs` | `null` | `owner`, `repo` | `save$` |
| `provider/github/short_branch` | `sdk.ShortBranch()` | `/repos/{owner}/{repo}/branches` | `null` | `owner`, `repo` | `list$` |
| `provider/github/simple_classroom_assignment` | `sdk.SimpleClassroomAssignment()` | `/classrooms/{classroom_id}/assignments` | `null` | `classroom_id` | `list$` |
| `provider/github/social_account` | `sdk.SocialAccount()` | `/users/{username}/social_accounts` | `null` | — | `list$`, `save$` |
| `provider/github/ssh_signing_key` | `sdk.SshSigningKey()` | `/users/{username}/ssh_signing_keys` | `id` | — | `list$`, `load$`, `save$` |
| `provider/github/status` | `sdk.Status()` | `/repos/{owner}/{repo}/commits/{ref}/statuses` | `null` | `owner`, `ref`, `repo` | `list$`, `save$` |
| `provider/github/status_check_policy` | `sdk.StatusCheckPolicy()` | `/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks` | `null` | `owner`, `repo` | `list$`, `save$` |
| `provider/github/subscriber` | `sdk.Subscriber()` | `/repos/{owner}/{repo}/subscribers` | `null` | `owner`, `repo` | `list$` |
| `provider/github/tag` | `sdk.Tag()` | `/repos/{owner}/{repo}/tags` | `null` | `owner`, `repo` | `list$` |
| `provider/github/tag_protection` | `sdk.TagProtection()` | `/repos/{owner}/{repo}/tags/protection` | `null` | `owner`, `repo` | `list$`, `save$` |
| `provider/github/team` | `sdk.Team()` | `/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments` | `id` | `org_id`, `project_id` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/team_simple` | `sdk.TeamSimple()` | `/orgs/{org}/security-managers` | `null` | `org_id` | `list$` |
| `provider/github/thread` | `sdk.Thread()` | `/repos/{owner}/{repo}/notifications` | `id` | — | `list$`, `load$`, `remove$` |
| `provider/github/thread_subscription` | `sdk.ThreadSubscription()` | `/notifications/threads/{thread_id}/subscription` | `id` | — | `load$`, `save$` |
| `provider/github/topic` | `sdk.Topic()` | `/repos/{owner}/{repo}/topics` | `null` | `owner` | `list$`, `save$` |
| `provider/github/user` | `sdk.User()` | `/orgs/{org}/organization-roles/{role_id}/users` | `id` | `branch_id`, `gpg_key_id`, `owner`, `repo`, `username` | `list$`, `load$`, `save$`, `remove$` |
| `provider/github/user_marketplace_purchase` | `sdk.UserMarketplacePurchase()` | `/user/marketplace_purchases` | `null` | — | `list$` |
| `provider/github/view` | `sdk.View()` | `/repos/{owner}/{repo}/traffic/views` | `null` | `owner`, `repo` | `list$` |
| `provider/github/webhook_config` | `sdk.WebhookConfig()` | `/repos/{owner}/{repo}/hooks/{hook_id}/config` | `null` | — | `load$`, `save$` |
| `provider/github/workflow` | `sdk.Workflow()` | `/repos/{owner}/{repo}/actions/workflows/{workflow_id}` | `id` | `owner`, `repo` | `load$`, `save$` |
| `provider/github/workflow_run` | `sdk.WorkflowRun()` | `/repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}` | `id` | `owner`, `repo`, `run_id` | `load$`, `save$` |
| `provider/github/workflow_run_usage` | `sdk.WorkflowRunUsage()` | `/repos/{owner}/{repo}/actions/runs/{run_id}/timing` | `null` | `owner`, `repo` | `load$` |
| `provider/github/workflow_usage` | `sdk.WorkflowUsage()` | `/repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing` | `id` | `owner`, `repo` | `load$` |

### `provider/github/action`

Backed by `sdk.Action()`, whose results are `ActionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`action` is nested under `/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs` in the API, so **every**
`action` command requires `artifact_id`, `hosted_runner_id`, `name`, `org_id`, `owner`, `repo` and `repository_id`. Omitting one throws —
`@seneca/github-provider: action <cmd>: artifact_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `artifact_id`, `hosted_runner_id`, `name`, `org_id`, `owner`, `repo`, `repository_id`, all **required**, plus optional match fields | Array of `action` entities. |
| `load$(q)` | `artifact_id`, `hosted_runner_id`, `name`, `org_id`, `owner`, `repo`, `repository_id`, ``, all **required** | One `action`, or `null` if not found. |
| `save$()` | entity data, including `artifact_id`, `hosted_runner_id`, `name`, `org_id`, `owner`, `repo` and `repository_id` | Created or updated `action`. |
| `remove$(q)` | `artifact_id`, `hosted_runner_id`, `name`, `org_id`, `owner`, `repo`, `repository_id`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `access_level` | string |  |
| `active_caches_count` | number |  |
| `active_caches_size_in_bytes` | number |  |
| `actor` | object |  |
| `allows_public_repositories` | boolean |  |
| `approval_policy` | string |  |
| `archive_download_url` | string |  |
| `archive_url` | string |  |
| `artifacts_url` | string |  |
| `assignees_url` | string |  |
| `badge_url` | string |  |
| `blobs_url` | string |  |
| `branches_url` | string |  |
| `busy` | boolean |  |
| `cancel_url` | string |  |
| `check_run_url` | string |  |
| `check_suite_url` | string |  |
| `code_of_conduct` | object |  |
| `collaborators_url` | string |  |
| `comments_url` | string |  |
| `commits_url` | string |  |
| `compare_url` | string |  |
| `completed_at` | string |  |
| `conclusion` | string |  |
| `contents_url` | string |  |
| `contributors_url` | string |  |
| `cpu_cores` | number |  |
| `created_at` | string |  |
| `days` | number |  |
| `default` | boolean |  |
| `deployments_url` | string |  |
| `description` | string |  |
| `display_name` | string |  |
| `display_title` | string |  |
| `downloads_url` | string |  |
| `enabled` | boolean |  |
| `enabled_repositories` | string |  |
| `event` | string |  |
| `events_url` | string |  |
| `expired` | boolean |  |
| `expires_at` | string |  |
| `fork` | boolean |  |
| `forks_url` | string |  |
| `full_name` | string |  |
| `git_commits_url` | string |  |
| `git_refs_url` | string |  |
| `git_tags_url` | string |  |
| `head_branch` | string |  |
| `head_commit` | object |  |
| `head_repository` | object |  |
| `head_sha` | string |  |
| `hooks_url` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `image_details` | object |  |
| `inherited` | boolean |  |
| `issue_comment_url` | string |  |
| `issue_events_url` | string |  |
| `issues_url` | string |  |
| `jobs_url` | string |  |
| `keys_url` | string |  |
| `labels` | array |  |
| `labels_url` | string |  |
| `languages_url` | string |  |
| `logs_url` | string |  |
| `machine_size_details` | object |  |
| `memory_gb` | number |  |
| `merges_url` | string |  |
| `milestones_url` | string |  |
| `name` | string | Parent key. Required by every command. |
| `node_id` | string |  |
| `notifications_url` | string |  |
| `os` | string |  |
| `owner` | object | Parent key. Required by every command. |
| `path` | string |  |
| `platform` | string |  |
| `platforms` | array |  |
| `private` | boolean |  |
| `public_ip_enabled` | boolean |  |
| `pull_requests` | array |  |
| `pulls_url` | string |  |
| `ref` | string |  |
| `releases_url` | string |  |
| `repository` | object |  |
| `rerun_url` | string |  |
| `run_id` | number |  |
| `run_number` | number |  |
| `run_url` | string |  |
| `run_workflows_from_fork_pull_requests` | boolean |  |
| `runner_group_id` | number |  |
| `runner_group_name` | string |  |
| `runner_id` | number |  |
| `runner_name` | string |  |
| `runners` | array |  |
| `runners_url` | string |  |
| `selected_repository_ids` | array |  |
| `size_gb` | number |  |
| `size_in_bytes` | number |  |
| `source` | string |  |
| `stargazers_url` | string |  |
| `started_at` | string |  |
| `state` | string |  |
| `status` | string |  |
| `statuses_url` | string |  |
| `storage_gb` | number |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `tags_url` | string |  |
| `teams_url` | string |  |
| `total_count` | number |  |
| `trees_url` | string |  |
| `triggering_actor` | object |  |
| `updated_at` | string |  |
| `url` | string |  |
| `workflow_id` | number |  |
| `workflow_name` | string |  |
| `workflow_url` | string |  |
| `artifact_id` | string | Parent key: the id of a `artifact`. Required by every command. |
| `hosted_runner_id` | string | Parent key. Required by every command. |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |
| `repository_id` | string | Parent key: the id of a `repository`. Required by every command. |

```js
const actions = await seneca
  .entity('provider/github/action')
  .list$({ artifact_id: '...', hosted_runner_id: '...', name: '...', org_id: '...', owner: '...', repo: '...', repository_id: '...' })
const action = await seneca
  .entity('provider/github/action')
  .load$({ artifact_id: '...', hosted_runner_id: '...', name: '...', org_id: '...', owner: '...', repo: '...', repository_id: '...', null: '...' })
```

### `provider/github/actions_artifact_and_log_retention`

Backed by `sdk.ActionsArtifactAndLogRetention()`, whose results are `ActionsArtifactAndLogRetentionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `actions_artifact_and_log_retention`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `days` | number |  |
| `maximum_allowed_days` | number |  |

```js
const actions_artifact_and_log_retention = await seneca
  .entity('provider/github/actions_artifact_and_log_retention')
  .load$({ null: '...' })
```

### `provider/github/actions_cache_list`

Backed by `sdk.ActionsCacheList()`, whose results are `ActionsCacheListEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`actions_cache_list` is nested under `/repos/{owner}/{repo}/actions/caches` in the API, so **every**
`actions_cache_list` command requires `key` and `owner`. Omitting one throws —
`@seneca/github-provider: actions_cache_list <cmd>: key is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `key` and `owner`, both **required**, plus optional match fields | Array of `actions_cache_list` entities. |
| `remove$(q)` | `key`, `owner`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `key` | string | Parent key: the id of a `key`. Required by every command. |
| `owner` | string | Parent key. Required by every command. |

```js
const actions_cache_lists = await seneca
  .entity('provider/github/actions_cache_list')
  .list$({ key: '...', owner: '...' })
```

### `provider/github/actions_cache_usage_by_repository`

Backed by `sdk.ActionsCacheUsageByRepository()`, whose results are `ActionsCacheUsageByRepositoryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`actions_cache_usage_by_repository` is nested under `/repos/{owner}/{repo}/actions/cache/usage` in the API, so **every**
`actions_cache_usage_by_repository` command requires `owner`. Omitting one throws —
`@seneca/github-provider: actions_cache_usage_by_repository <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner` and `null`, both **required** | One `actions_cache_usage_by_repository`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `active_caches_count` | number |  |
| `active_caches_size_in_bytes` | number |  |
| `full_name` | string |  |
| `owner` | string | Parent key. Required by every command. |

```js
const actions_cache_usage_by_repository = await seneca
  .entity('provider/github/actions_cache_usage_by_repository')
  .load$({ owner: '...', null: '...' })
```

### `provider/github/actions_cache_usage_org_enterprise`

Backed by `sdk.ActionsCacheUsageOrgEnterprise()`, whose results are `ActionsCacheUsageOrgEnterpriseEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `actions_cache_usage_org_enterprise`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `total_active_caches_count` | number |  |
| `total_active_caches_size_in_bytes` | number |  |

```js
const actions_cache_usage_org_enterprise = await seneca
  .entity('provider/github/actions_cache_usage_org_enterprise')
  .load$({ null: '...' })
```

### `provider/github/actions_fork_pr_contributor_approval`

Backed by `sdk.ActionsForkPrContributorApproval()`, whose results are `ActionsForkPrContributorApprovalEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `actions_fork_pr_contributor_approval`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `approval_policy` | string |  |

```js
const actions_fork_pr_contributor_approval = await seneca
  .entity('provider/github/actions_fork_pr_contributor_approval')
  .load$({ null: '...' })
```

### `provider/github/actions_fork_pr_workflows_private_repo`

Backed by `sdk.ActionsForkPrWorkflowsPrivateRepo()`, whose results are `ActionsForkPrWorkflowsPrivateRepoEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `actions_fork_pr_workflows_private_repo`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `require_approval_for_fork_pr_workflows` | boolean |  |
| `run_workflows_from_fork_pull_requests` | boolean |  |
| `send_secrets_and_variables` | boolean |  |
| `send_write_tokens_to_workflows` | boolean |  |

```js
const actions_fork_pr_workflows_private_repo = await seneca
  .entity('provider/github/actions_fork_pr_workflows_private_repo')
  .load$({ null: '...' })
```

### `provider/github/actions_get_default_workflow_permission`

Backed by `sdk.ActionsGetDefaultWorkflowPermission()`, whose results are `ActionsGetDefaultWorkflowPermissionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `actions_get_default_workflow_permission`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `can_approve_pull_request_reviews` | boolean |  |
| `default_workflow_permissions` | string |  |

```js
const actions_get_default_workflow_permission = await seneca
  .entity('provider/github/actions_get_default_workflow_permission')
  .load$({ null: '...' })
```

### `provider/github/actions_hosted_runner`

Backed by `sdk.ActionsHostedRunner()`, whose results are `ActionsHostedRunnerEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`actions_hosted_runner` is nested under `/orgs/{org}/actions/hosted-runners/{hosted_runner_id}` in the API, so **every**
`actions_hosted_runner` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: actions_hosted_runner <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `org_id` and `id`, both **required** | One `actions_hosted_runner`, or `null` if not found. |
| `save$()` | entity data, including `org_id` | Created or updated `actions_hosted_runner`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `id` | number | Id field. |
| `image` | object |  |
| `image_details` | object |  |
| `machine_size_details` | object |  |
| `name` | string |  |
| `platform` | string |  |
| `public_ip_enabled` | boolean |  |
| `size` | string |  |
| `status` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const actions_hosted_runner = await seneca
  .entity('provider/github/actions_hosted_runner')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/actions_hosted_runner_limit`

Backed by `sdk.ActionsHostedRunnerLimit()`, whose results are `ActionsHostedRunnerLimitEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `actions_hosted_runner_limit`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `current_usage` | number |  |
| `maximum` | number |  |

```js
const actions_hosted_runner_limit = await seneca
  .entity('provider/github/actions_hosted_runner_limit')
  .load$({ null: '...' })
```

### `provider/github/actions_organization_permission`

Backed by `sdk.ActionsOrganizationPermission()`, whose results are `ActionsOrganizationPermissionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `actions_organization_permission`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `enabled_repositories` | string |  |

```js
const actions_organization_permission = await seneca
  .entity('provider/github/actions_organization_permission')
  .load$({ null: '...' })
```

### `provider/github/actions_public_key`

Backed by `sdk.ActionsPublicKey()`, whose results are `ActionsPublicKeyEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `actions_public_key`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `key` | string |  |
| `key_id` | string |  |

```js
const actions_public_key = await seneca
  .entity('provider/github/actions_public_key')
  .load$({ null: '...' })
```

### `provider/github/actions_repository_permission`

Backed by `sdk.ActionsRepositoryPermission()`, whose results are `ActionsRepositoryPermissionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`actions_repository_permission` is nested under `/repos/{owner}/{repo}/actions/permissions` in the API, so **every**
`actions_repository_permission` command requires `owner`. Omitting one throws —
`@seneca/github-provider: actions_repository_permission <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner` and `null`, both **required** | One `actions_repository_permission`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `enabled` | boolean |  |
| `owner` | string | Parent key. Required by every command. |

```js
const actions_repository_permission = await seneca
  .entity('provider/github/actions_repository_permission')
  .load$({ owner: '...', null: '...' })
```

### `provider/github/actions_secret`

Backed by `sdk.ActionsSecret()`, whose results are `ActionsSecretEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`actions_secret` is nested under `/repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}` in the API, so **every**
`actions_secret` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: actions_secret <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `actions_secret`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `name` | string |  |
| `updated_at` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const actions_secret = await seneca
  .entity('provider/github/actions_secret')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/actions_variable`

Backed by `sdk.ActionsVariable()`, whose results are `ActionsVariableEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`actions_variable` is nested under `/repos/{owner}/{repo}/environments/{environment_name}/variables/{name}` in the API, so **every**
`actions_variable` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: actions_variable <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `actions_variable`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `name` | string |  |
| `updated_at` | string |  |
| `value` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const actions_variable = await seneca
  .entity('provider/github/actions_variable')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/actions_workflow_access_to_repository`

Backed by `sdk.ActionsWorkflowAccessToRepository()`, whose results are `ActionsWorkflowAccessToRepositoryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`actions_workflow_access_to_repository` is nested under `/repos/{owner}/{repo}/actions/permissions/access` in the API, so **every**
`actions_workflow_access_to_repository` command requires `owner`. Omitting one throws —
`@seneca/github-provider: actions_workflow_access_to_repository <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner` and `null`, both **required** | One `actions_workflow_access_to_repository`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `access_level` | string |  |
| `owner` | string | Parent key. Required by every command. |

```js
const actions_workflow_access_to_repository = await seneca
  .entity('provider/github/actions_workflow_access_to_repository')
  .load$({ owner: '...', null: '...' })
```

### `provider/github/activity`

Backed by `sdk.Activity()`, whose results are `ActivityEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`activity` is nested under `/repos/{owner}/{repo}/activity` in the API, so **every**
`activity` command requires `owner` and `thread_id`. Omitting one throws —
`@seneca/github-provider: activity <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `thread_id`, both **required**, plus optional match fields | Array of `activity` entities. |
| `load$(q)` | `owner`, `thread_id`, ``, all **required** | One `activity`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `thread_id` | Updated `activity`; the API declares no create operation. |
| `remove$(q)` | `owner`, `thread_id`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `activity_type` | string |  |
| `actor` | object |  |
| `after` | string |  |
| `before` | string |  |
| `ref` | string |  |
| `timestamp` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `thread_id` | string | Parent key: the id of a `thread`. Required by every command. |

```js
const activitys = await seneca
  .entity('provider/github/activity')
  .list$({ owner: '...', thread_id: '...' })
const activity = await seneca
  .entity('provider/github/activity')
  .load$({ owner: '...', thread_id: '...', null: '...' })
```

### `provider/github/add`

Backed by `sdk.Add()`, whose results are `AddEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`add` is nested under `/enterprises/{enterprise}/teams/{enterprise-team}/memberships/add` in the API, so **every**
`add` command requires `enterprise` and `team_id`. Omitting one throws —
`@seneca/github-provider: add <cmd>: enterprise is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `enterprise` and `team_id` | Created `add`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `usernames` | array |  |
| `enterprise` | string | Parent key. Required by every command. |
| `team_id` | string | Parent key: the id of a `team`. Required by every command. |

### `provider/github/api_insights_route_stat`

Backed by `sdk.ApiInsightsRouteStat()`, whose results are `ApiInsightsRouteStatEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`api_insights_route_stat` is nested under `/orgs/{org}/insights/api/route-stats/{actor_type}/{actor_id}` in the API, so **every**
`api_insights_route_stat` command requires `actor_id`, `actor_type`, `min_timestamp` and `org`. Omitting one throws —
`@seneca/github-provider: api_insights_route_stat <cmd>: actor_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `actor_id`, `actor_type`, `min_timestamp`, `org`, all **required**, plus optional match fields | Array of `api_insights_route_stat` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `actor_id` | string | Parent key. Required by every command. |
| `actor_type` | string | Parent key. Required by every command. |
| `min_timestamp` | string | Parent key. Required by every command. |
| `org` | string | Parent key: the id of a `org`. Required by every command. |

```js
const api_insights_route_stats = await seneca
  .entity('provider/github/api_insights_route_stat')
  .list$({ actor_id: '...', actor_type: '...', min_timestamp: '...', org: '...' })
```

### `provider/github/api_insights_subject_stat`

Backed by `sdk.ApiInsightsSubjectStat()`, whose results are `ApiInsightsSubjectStatEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`api_insights_subject_stat` is nested under `/orgs/{org}/insights/api/subject-stats` in the API, so **every**
`api_insights_subject_stat` command requires `min_timestamp` and `org_id`. Omitting one throws —
`@seneca/github-provider: api_insights_subject_stat <cmd>: min_timestamp is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `min_timestamp` and `org_id`, both **required**, plus optional match fields | Array of `api_insights_subject_stat` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `min_timestamp` | string | Parent key. Required by every command. |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const api_insights_subject_stats = await seneca
  .entity('provider/github/api_insights_subject_stat')
  .list$({ min_timestamp: '...', org_id: '...' })
```

### `provider/github/api_insights_summary_stat`

Backed by `sdk.ApiInsightsSummaryStat()`, whose results are `ApiInsightsSummaryStatEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`api_insights_summary_stat` is nested under `/orgs/{org}/insights/api/summary-stats/{actor_type}/{actor_id}` in the API, so **every**
`api_insights_summary_stat` command requires `min_timestamp`. Omitting one throws —
`@seneca/github-provider: api_insights_summary_stat <cmd>: min_timestamp is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `min_timestamp` and `null`, both **required** | One `api_insights_summary_stat`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `min_timestamp` | string | Parent key. Required by every command. |

```js
const api_insights_summary_stat = await seneca
  .entity('provider/github/api_insights_summary_stat')
  .load$({ min_timestamp: '...', null: '...' })
```

### `provider/github/api_insights_time_stat`

Backed by `sdk.ApiInsightsTimeStat()`, whose results are `ApiInsightsTimeStatEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`api_insights_time_stat` is nested under `/orgs/{org}/insights/api/time-stats/{actor_type}/{actor_id}` in the API, so **every**
`api_insights_time_stat` command requires `min_timestamp`, `org_id` and `timestamp_increment`. Omitting one throws —
`@seneca/github-provider: api_insights_time_stat <cmd>: min_timestamp is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `min_timestamp`, `org_id`, `timestamp_increment`, all **required**, plus optional match fields | Array of `api_insights_time_stat` entities. |
| `load$(q)` | `min_timestamp`, `org_id`, `timestamp_increment`, ``, all **required** | One `api_insights_time_stat`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `min_timestamp` | string | Parent key. Required by every command. |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |
| `timestamp_increment` | string | Parent key. Required by every command. |

```js
const api_insights_time_stats = await seneca
  .entity('provider/github/api_insights_time_stat')
  .list$({ min_timestamp: '...', org_id: '...', timestamp_increment: '...' })
const api_insights_time_stat = await seneca
  .entity('provider/github/api_insights_time_stat')
  .load$({ min_timestamp: '...', org_id: '...', timestamp_increment: '...', null: '...' })
```

### `provider/github/api_insights_user_stat`

Backed by `sdk.ApiInsightsUserStat()`, whose results are `ApiInsightsUserStatEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`api_insights_user_stat` is nested under `/orgs/{org}/insights/api/user-stats/{user_id}` in the API, so **every**
`api_insights_user_stat` command requires `min_timestamp` and `org_id`. Omitting one throws —
`@seneca/github-provider: api_insights_user_stat <cmd>: min_timestamp is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `min_timestamp`, `org_id`, `id`, all **required** | One `api_insights_user_stat`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `min_timestamp` | string | Parent key. Required by every command. |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const api_insights_user_stat = await seneca
  .entity('provider/github/api_insights_user_stat')
  .load$({ min_timestamp: '...', org_id: '...', id: '...' })
```

### `provider/github/api_overview`

Backed by `sdk.ApiOverview()`, whose results are `ApiOverviewEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `api_overview` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `verifiable_password_authentication` | boolean |  |

```js
const api_overviews = await seneca
  .entity('provider/github/api_overview')
  .list$()
```

### `provider/github/app`

Backed by `sdk.App()`, whose results are `AppEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`app` is nested under `/user/installations/{installation_id}/repositories` in the API, so **every**
`app` command requires `code` and `repository_id`. Omitting one throws —
`@seneca/github-provider: app <cmd>: code is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `code` and `repository_id`, both **required**, plus optional match fields | Array of `app` entities. |
| `save$()` | entity data, including `code` and `repository_id` | Created or updated `app`. |
| `remove$(q)` | `code`, `repository_id`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `access_tokens_url` | string |  |
| `account` | string |  |
| `app_id` | number |  |
| `app_slug` | string |  |
| `archive_url` | string |  |
| `archived` | boolean |  |
| `assignees_url` | string |  |
| `blobs_url` | string |  |
| `branches_url` | string |  |
| `clone_url` | string |  |
| `collaborators_url` | string |  |
| `comments_url` | string |  |
| `commits_url` | string |  |
| `compare_url` | string |  |
| `contents_url` | string |  |
| `contributors_url` | string |  |
| `default_branch` | string |  |
| `deployments_url` | string |  |
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
| `has_downloads` | boolean |  |
| `has_issues` | boolean |  |
| `has_pages` | boolean |  |
| `has_projects` | boolean |  |
| `has_wiki` | boolean |  |
| `homepage` | string |  |
| `hooks_url` | string |  |
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
| `notifications_url` | string |  |
| `open_issues` | number |  |
| `open_issues_count` | number |  |
| `private` | boolean |  |
| `pulls_url` | string |  |
| `pushed_at` | string |  |
| `releases_url` | string |  |
| `repositories_url` | string |  |
| `repository_selection` | string |  |
| `single_file_name` | string |  |
| `size` | number |  |
| `ssh_url` | string |  |
| `stargazers_count` | number |  |
| `stargazers_url` | string |  |
| `statuses_url` | string |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `suspended_at` | string |  |
| `suspended_by` | object |  |
| `svn_url` | string |  |
| `tags_url` | string |  |
| `target_id` | number |  |
| `target_type` | string |  |
| `teams_url` | string |  |
| `trees_url` | string |  |
| `url` | string |  |
| `watchers` | number |  |
| `watchers_count` | number |  |
| `code` | string | Parent key. Required by every command. |
| `repository_id` | string | Parent key: the id of a `repository`. Required by every command. |

```js
const apps = await seneca
  .entity('provider/github/app')
  .list$({ code: '...', repository_id: '...' })
```

### `provider/github/artifact`

Backed by `sdk.Artifact()`, whose results are `ArtifactEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`artifact` is nested under `/repos/{owner}/{repo}/actions/artifacts/{artifact_id}` in the API, so **every**
`artifact` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: artifact <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `artifact`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const artifact = await seneca
  .entity('provider/github/artifact')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/assignee`

Backed by `sdk.Assignee()`, whose results are `AssigneeEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`assignee` is nested under `/repos/{owner}/{repo}/assignees` in the API, so **every**
`assignee` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: assignee <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `assignee` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const assignees = await seneca
  .entity('provider/github/assignee')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/authentication_token`

Backed by `sdk.AuthenticationToken()`, whose results are `AuthenticationTokenEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`authentication_token` is nested under `/repos/{owner}/{repo}/actions/runners/registration-token` in the API, so **every**
`authentication_token` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: authentication_token <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `org_id` | Created `authentication_token`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

### `provider/github/authorization`

Backed by `sdk.Authorization()`, whose results are `AuthorizationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data | Created or updated `authorization`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `access_token` | string |  |
| `app` | object |  |
| `created_at` | string |  |
| `expires_at` | string |  |
| `fingerprint` | string |  |
| `hashed_token` | string |  |
| `id` | number |  |
| `installation` | object |  |
| `note` | string |  |
| `note_url` | string |  |
| `scopes` | array |  |
| `token` | string |  |
| `token_last_eight` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `user` | object |  |

### `provider/github/autolink`

Backed by `sdk.Autolink()`, whose results are `AutolinkEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`autolink` is nested under `/repos/{owner}/{repo}/autolinks` in the API, so **every**
`autolink` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: autolink <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `autolink` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `autolink`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created `autolink`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `id` | number | Id field. |
| `is_alphanumeric` | boolean |  |
| `key_prefix` | string |  |
| `url_template` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const autolinks = await seneca
  .entity('provider/github/autolink')
  .list$({ owner: '...', repo: '...' })
const autolink = await seneca
  .entity('provider/github/autolink')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/base_gist`

Backed by `sdk.BaseGist()`, whose results are `BaseGistEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`base_gist` is nested under `/users/{username}/gists` in the API, so **every**
`base_gist` command requires `gist_id`. Omitting one throws —
`@seneca/github-provider: base_gist <cmd>: gist_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `gist_id` **required**, plus optional match fields | Array of `base_gist` entities. |
| `save$()` | entity data, including `gist_id` | Created `base_gist`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `gist_id` | string | Parent key: the id of a `gist`. Required by every command. |

```js
const base_gists = await seneca
  .entity('provider/github/base_gist')
  .list$({ gist_id: '...' })
```

### `provider/github/billing_usage_report`

Backed by `sdk.BillingUsageReport()`, whose results are `BillingUsageReportEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`billing_usage_report` is nested under `/organizations/{org}/settings/billing/usage` in the API, so **every**
`billing_usage_report` command requires `org`. Omitting one throws —
`@seneca/github-provider: billing_usage_report <cmd>: org is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org` **required**, plus optional match fields | Array of `billing_usage_report` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `date` | string |  |
| `discountAmount` | number |  |
| `grossAmount` | number |  |
| `netAmount` | number |  |
| `organizationName` | string |  |
| `pricePerUnit` | number |  |
| `product` | string |  |
| `quantity` | number |  |
| `sku` | string |  |
| `unitType` | string |  |
| `org` | string | Parent key: the id of a `org`. Required by every command. |

```js
const billing_usage_reports = await seneca
  .entity('provider/github/billing_usage_report')
  .list$({ org: '...' })
```

### `provider/github/billing_usage_report_user`

Backed by `sdk.BillingUsageReportUser()`, whose results are `BillingUsageReportUserEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`billing_usage_report_user` is nested under `/users/{username}/settings/billing/usage` in the API, so **every**
`billing_usage_report_user` command requires `username`. Omitting one throws —
`@seneca/github-provider: billing_usage_report_user <cmd>: username is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `username` **required**, plus optional match fields | Array of `billing_usage_report_user` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `date` | string |  |
| `discountAmount` | number |  |
| `grossAmount` | number |  |
| `netAmount` | number |  |
| `pricePerUnit` | number |  |
| `product` | string |  |
| `quantity` | number |  |
| `sku` | string |  |
| `unitType` | string |  |
| `username` | string | Parent key. Required by every command. |

```js
const billing_usage_report_users = await seneca
  .entity('provider/github/billing_usage_report_user')
  .list$({ username: '...' })
```

### `provider/github/blob`

Backed by `sdk.Blob()`, whose results are `BlobEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`blob` is nested under `/repos/{owner}/{repo}/git/blobs/{file_sha}` in the API, so **every**
`blob` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: blob <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `blob`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `content` | string |  |
| `encoding` | string |  |
| `node_id` | string |  |
| `sha` | string |  |
| `size` | number |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const blob = await seneca
  .entity('provider/github/blob')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/block`

Backed by `sdk.Block()`, whose results are `BlockEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `block` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |

```js
const blocks = await seneca
  .entity('provider/github/block')
  .list$()
```

### `provider/github/branch`

Backed by `sdk.Branch()`, whose results are `BranchEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`branch` is nested under `/repos/{owner}/{repo}/branches/{branch}` in the API, so **every**
`branch` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: branch <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `branch`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `commit` | object |  |
| `links` | object |  |
| `name` | string |  |
| `protected` | boolean |  |
| `protection` | object |  |
| `protection_url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const branch = await seneca
  .entity('provider/github/branch')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/branch_protection`

Backed by `sdk.BranchProtection()`, whose results are `BranchProtectionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`branch_protection` is nested under `/repos/{owner}/{repo}/branches/{branch}/protection` in the API, so **every**
`branch_protection` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: branch_protection <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `branch_protection`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `enforce_admins` | object |  |
| `required_pull_request_reviews` | object |  |
| `required_signatures` | object |  |
| `required_status_checks` | object |  |
| `restrictions` | object |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const branch_protection = await seneca
  .entity('provider/github/branch_protection')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/branch_restriction_policy`

Backed by `sdk.BranchRestrictionPolicy()`, whose results are `BranchRestrictionPolicyEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`branch_restriction_policy` is nested under `/repos/{owner}/{repo}/branches/{branch}/protection/restrictions` in the API, so **every**
`branch_restriction_policy` command requires `branch_id`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: branch_restriction_policy <cmd>: branch_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `branch_id`, `owner`, `repo`, all **required**, plus optional match fields | Array of `branch_restriction_policy` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `apps` | array |  |
| `apps_url` | string |  |
| `teams` | array |  |
| `teams_url` | string |  |
| `url` | string |  |
| `users` | array |  |
| `users_url` | string |  |
| `branch_id` | string | Parent key: the id of a `branch`. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const branch_restriction_policys = await seneca
  .entity('provider/github/branch_restriction_policy')
  .list$({ branch_id: '...', owner: '...', repo: '...' })
```

### `provider/github/branch_short`

Backed by `sdk.BranchShort()`, whose results are `BranchShortEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`branch_short` is nested under `/repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head` in the API, so **every**
`branch_short` command requires `commit_sha`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: branch_short <cmd>: commit_sha is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `commit_sha`, `owner`, `repo`, all **required**, plus optional match fields | Array of `branch_short` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `commit` | object |  |
| `name` | string |  |
| `protected` | boolean |  |
| `commit_sha` | string | Parent key. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const branch_shorts = await seneca
  .entity('provider/github/branch_short')
  .list$({ commit_sha: '...', owner: '...', repo: '...' })
```

### `provider/github/branch_with_protection`

Backed by `sdk.BranchWithProtection()`, whose results are `BranchWithProtectionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`branch_with_protection` is nested under `/repos/{owner}/{repo}/branches/{branch}/rename` in the API, so **every**
`branch_with_protection` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: branch_with_protection <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Created `branch_with_protection`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `new_name` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/campaign`

Backed by `sdk.Campaign()`, whose results are `CampaignEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`campaign` is nested under `/orgs/{org}/campaigns` in the API, so **every**
`campaign` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: campaign <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `campaign` entities. |
| `load$(q)` | `org_id` and `id`, both **required** | One `campaign`, or `null` if not found. |
| `save$()` | entity data, including `org_id` | Created or updated `campaign`. |
| `remove$(q)` | `org_id` and `id`, both **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `alert_stats` | object |  |
| `code_scanning_alerts` | array |  |
| `contact_link` | string |  |
| `created_at` | string |  |
| `description` | string |  |
| `ends_at` | string |  |
| `managers` | array |  |
| `number` | number |  |
| `state` | string |  |
| `updated_at` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const campaigns = await seneca
  .entity('provider/github/campaign')
  .list$({ org_id: '...' })
const campaign = await seneca
  .entity('provider/github/campaign')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/check`

Backed by `sdk.Check()`, whose results are `CheckEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`check` is nested under `/repos/{owner}/{repo}/commits/{ref}/check-runs` in the API, so **every**
`check` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: check <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `check` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `after` | string |  |
| `app` | object |  |
| `before` | string |  |
| `check_runs_url` | string |  |
| `check_suite` | object |  |
| `completed_at` | string |  |
| `conclusion` | string |  |
| `created_at` | string |  |
| `deployment` | object |  |
| `details_url` | string |  |
| `external_id` | string |  |
| `head_branch` | string |  |
| `head_commit` | object |  |
| `head_sha` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `latest_check_runs_count` | number |  |
| `name` | string |  |
| `node_id` | string |  |
| `output` | object |  |
| `pull_requests` | array |  |
| `repository` | object |  |
| `started_at` | string |  |
| `status` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const checks = await seneca
  .entity('provider/github/check')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/check_annotation`

Backed by `sdk.CheckAnnotation()`, whose results are `CheckAnnotationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`check_annotation` is nested under `/repos/{owner}/{repo}/check-runs/{check_run_id}/annotations` in the API, so **every**
`check_annotation` command requires `check_run_id`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: check_annotation <cmd>: check_run_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `check_run_id`, `owner`, `repo`, all **required**, plus optional match fields | Array of `check_annotation` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `annotation_level` | string |  |
| `blob_href` | string |  |
| `end_column` | number |  |
| `end_line` | number |  |
| `message` | string |  |
| `path` | string |  |
| `raw_details` | string |  |
| `start_column` | number |  |
| `start_line` | number |  |
| `title` | string |  |
| `check_run_id` | string | Parent key: the id of a `check_run`. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const check_annotations = await seneca
  .entity('provider/github/check_annotation')
  .list$({ check_run_id: '...', owner: '...', repo: '...' })
```

### `provider/github/check_automated_security_fix`

Backed by `sdk.CheckAutomatedSecurityFix()`, whose results are `CheckAutomatedSecurityFixEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`check_automated_security_fix` is nested under `/repos/{owner}/{repo}/automated-security-fixes` in the API, so **every**
`check_automated_security_fix` command requires `owner`. Omitting one throws —
`@seneca/github-provider: check_automated_security_fix <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner` and `null`, both **required** | One `check_automated_security_fix`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `enabled` | boolean |  |
| `paused` | boolean |  |
| `owner` | string | Parent key. Required by every command. |

```js
const check_automated_security_fix = await seneca
  .entity('provider/github/check_automated_security_fix')
  .load$({ owner: '...', null: '...' })
```

### `provider/github/check_run`

Backed by `sdk.CheckRun()`, whose results are `CheckRunEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`check_run` is nested under `/repos/{owner}/{repo}/check-runs/{check_run_id}` in the API, so **every**
`check_run` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: check_run <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `check_run`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created or updated `check_run`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `app` | object |  |
| `check_suite` | object |  |
| `completed_at` | string |  |
| `conclusion` | string |  |
| `deployment` | object |  |
| `details_url` | string |  |
| `external_id` | string |  |
| `head_sha` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `name` | string |  |
| `node_id` | string |  |
| `output` | object |  |
| `pull_requests` | array |  |
| `started_at` | string |  |
| `status` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const check_run = await seneca
  .entity('provider/github/check_run')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/check_suite`

Backed by `sdk.CheckSuite()`, whose results are `CheckSuiteEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`check_suite` is nested under `/repos/{owner}/{repo}/check-suites/{check_suite_id}` in the API, so **every**
`check_suite` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: check_suite <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `check_suite`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created `check_suite`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `after` | string |  |
| `app` | object |  |
| `before` | string |  |
| `check_runs_url` | string |  |
| `conclusion` | string |  |
| `created_at` | string |  |
| `head_branch` | string |  |
| `head_commit` | object |  |
| `head_sha` | string |  |
| `id` | number | Id field. |
| `latest_check_runs_count` | number |  |
| `node_id` | string |  |
| `pull_requests` | array |  |
| `repository` | object |  |
| `status` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const check_suite = await seneca
  .entity('provider/github/check_suite')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/check_suite_preference`

Backed by `sdk.CheckSuitePreference()`, whose results are `CheckSuitePreferenceEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`check_suite_preference` is nested under `/repos/{owner}/{repo}/check-suites/preferences` in the API, so **every**
`check_suite_preference` command requires `owner`. Omitting one throws —
`@seneca/github-provider: check_suite_preference <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` | Updated `check_suite_preference`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `preferences` | object |  |
| `repository` | object |  |
| `owner` | string | Parent key. Required by every command. |

### `provider/github/classroom`

Backed by `sdk.Classroom()`, whose results are `ClassroomEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `classroom` entities. |
| `load$(q)` | `id` **required** | One `classroom`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `archived` | boolean |  |
| `avatar_url` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `login` | string |  |
| `name` | string |  |
| `node_id` | string |  |
| `url` | string |  |

```js
const classrooms = await seneca
  .entity('provider/github/classroom')
  .list$()
const classroom = await seneca
  .entity('provider/github/classroom')
  .load$('...')
```

### `provider/github/classroom_accepted_assignment`

Backed by `sdk.ClassroomAcceptedAssignment()`, whose results are `ClassroomAcceptedAssignmentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`classroom_accepted_assignment` is nested under `/assignments/{assignment_id}/accepted_assignments` in the API, so **every**
`classroom_accepted_assignment` command requires `assignment_id`. Omitting one throws —
`@seneca/github-provider: classroom_accepted_assignment <cmd>: assignment_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `assignment_id` **required**, plus optional match fields | Array of `classroom_accepted_assignment` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `assignment` | object |  |
| `commit_count` | number |  |
| `grade` | string |  |
| `id` | number |  |
| `passing` | boolean |  |
| `repository` | object |  |
| `students` | array |  |
| `submitted` | boolean |  |
| `assignment_id` | string | Parent key. Required by every command. |

```js
const classroom_accepted_assignments = await seneca
  .entity('provider/github/classroom_accepted_assignment')
  .list$({ assignment_id: '...' })
```

### `provider/github/classroom_assignment`

Backed by `sdk.ClassroomAssignment()`, whose results are `ClassroomAssignmentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `id` **required** | One `classroom_assignment`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `accepted` | number |  |
| `classroom` | object |  |
| `deadline` | string |  |
| `editor` | string |  |
| `feedback_pull_requests_enabled` | boolean |  |
| `id` | number | Id field. |
| `invitations_enabled` | boolean |  |
| `invite_link` | string |  |
| `language` | string |  |
| `max_members` | number |  |
| `max_teams` | number |  |
| `passing` | number |  |
| `public_repo` | boolean |  |
| `slug` | string |  |
| `starter_code_repository` | object |  |
| `students_are_repo_admins` | boolean |  |
| `submitted` | number |  |
| `title` | string |  |
| `type` | string |  |

```js
const classroom_assignment = await seneca
  .entity('provider/github/classroom_assignment')
  .load$('...')
```

### `provider/github/classroom_assignment_grade`

Backed by `sdk.ClassroomAssignmentGrade()`, whose results are `ClassroomAssignmentGradeEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`classroom_assignment_grade` is nested under `/assignments/{assignment_id}/grades` in the API, so **every**
`classroom_assignment_grade` command requires `assignment_id`. Omitting one throws —
`@seneca/github-provider: classroom_assignment_grade <cmd>: assignment_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `assignment_id` **required**, plus optional match fields | Array of `classroom_assignment_grade` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `assignment_name` | string |  |
| `assignment_url` | string |  |
| `github_username` | string |  |
| `points_available` | number |  |
| `points_awarded` | number |  |
| `roster_identifier` | string |  |
| `starter_code_url` | string |  |
| `student_repository_name` | string |  |
| `student_repository_url` | string |  |
| `submission_timestamp` | string |  |
| `assignment_id` | string | Parent key. Required by every command. |

```js
const classroom_assignment_grades = await seneca
  .entity('provider/github/classroom_assignment_grade')
  .list$({ assignment_id: '...' })
```

### `provider/github/clone`

Backed by `sdk.Clone()`, whose results are `CloneEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`clone` is nested under `/repos/{owner}/{repo}/traffic/clones` in the API, so **every**
`clone` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: clone <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `clone` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `count` | number |  |
| `timestamp` | string |  |
| `uniques` | number |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const clones = await seneca
  .entity('provider/github/clone')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/code_frequency`

Backed by `sdk.CodeFrequency()`, whose results are `CodeFrequencyEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_frequency` is nested under `/repos/{owner}/{repo}/stats/code_frequency` in the API, so **every**
`code_frequency` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_frequency <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `code_frequency` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const code_frequencys = await seneca
  .entity('provider/github/code_frequency')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/code_frequency_stat`

Backed by `sdk.CodeFrequencyStat()`, whose results are `CodeFrequencyStatEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_frequency_stat` is nested under `/repos/{owner}/{repo}/stats/punch_card` in the API, so **every**
`code_frequency_stat` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_frequency_stat <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `code_frequency_stat` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const code_frequency_stats = await seneca
  .entity('provider/github/code_frequency_stat')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/code_of_conduct`

Backed by `sdk.CodeOfConduct()`, whose results are `CodeOfConductEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `code_of_conduct` entities. |
| `load$(q)` | `` **required** | One `code_of_conduct`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `html_url` | string |  |
| `key` | string |  |
| `name` | string |  |
| `url` | string |  |

```js
const code_of_conducts = await seneca
  .entity('provider/github/code_of_conduct')
  .list$()
const code_of_conduct = await seneca
  .entity('provider/github/code_of_conduct')
  .load$({ null: '...' })
```

### `provider/github/code_scanning`

Backed by `sdk.CodeScanning()`, whose results are `CodeScanningEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning` is nested under `/repos/{owner}/{repo}/code-scanning/sarifs` in the API, so **every**
`code_scanning` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_scanning <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Created `code_scanning`; the API declares no update operation. |
| `remove$(q)` | `owner`, `repo`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `commit_sha` | string |  |
| `ref` | string |  |
| `sarif` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/code_scanning_alert`

Backed by `sdk.CodeScanningAlert()`, whose results are `CodeScanningAlertEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_alert` is nested under `/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}` in the API, so **every**
`code_scanning_alert` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_scanning_alert <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `code_scanning_alert`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Updated `code_scanning_alert`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `dismissal_approved_by` | object |  |
| `dismissed_at` | string |  |
| `dismissed_by` | object |  |
| `dismissed_reason` | string |  |
| `html_url` | string |  |
| `instances_url` | string |  |
| `most_recent_instance` | object |  |
| `number` | number |  |
| `rule` | object |  |
| `state` | string |  |
| `tool` | object |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const code_scanning_alert = await seneca
  .entity('provider/github/code_scanning_alert')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/code_scanning_alert_instance`

Backed by `sdk.CodeScanningAlertInstance()`, whose results are `CodeScanningAlertInstanceEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_alert_instance` is nested under `/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances` in the API, so **every**
`code_scanning_alert_instance` command requires `alert_number`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_scanning_alert_instance <cmd>: alert_number is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `alert_number`, `owner`, `repo`, all **required**, plus optional match fields | Array of `code_scanning_alert_instance` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `alert_number` | string | Parent key. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const code_scanning_alert_instances = await seneca
  .entity('provider/github/code_scanning_alert_instance')
  .list$({ alert_number: '...', owner: '...', repo: '...' })
```

### `provider/github/code_scanning_alert_item`

Backed by `sdk.CodeScanningAlertItem()`, whose results are `CodeScanningAlertItemEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_alert_item` is nested under `/repos/{owner}/{repo}/code-scanning/alerts` in the API, so **every**
`code_scanning_alert_item` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_scanning_alert_item <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `code_scanning_alert_item` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `dismissal_approved_by` | object |  |
| `dismissed_at` | string |  |
| `dismissed_by` | object |  |
| `dismissed_reason` | string |  |
| `html_url` | string |  |
| `instances_url` | string |  |
| `most_recent_instance` | object |  |
| `number` | number |  |
| `rule` | object |  |
| `state` | string |  |
| `tool` | object |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const code_scanning_alert_items = await seneca
  .entity('provider/github/code_scanning_alert_item')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/code_scanning_analysi`

Backed by `sdk.CodeScanningAnalysi()`, whose results are `CodeScanningAnalysiEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_analysi` is nested under `/repos/{owner}/{repo}/code-scanning/analyses` in the API, so **every**
`code_scanning_analysi` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_scanning_analysi <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `code_scanning_analysi` entities. |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `code_scanning_analysi`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `analysis_key` | string |  |
| `commit_sha` | string |  |
| `created_at` | string |  |
| `deletable` | boolean |  |
| `environment` | string |  |
| `error` | string |  |
| `id` | number |  |
| `ref` | string |  |
| `results_count` | number |  |
| `rules_count` | number |  |
| `sarif_id` | string |  |
| `tool` | object |  |
| `url` | string |  |
| `warning` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const code_scanning_analysis = await seneca
  .entity('provider/github/code_scanning_analysi')
  .list$({ owner: '...', repo: '...' })
const code_scanning_analysi = await seneca
  .entity('provider/github/code_scanning_analysi')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/code_scanning_analysis_deletion`

Backed by `sdk.CodeScanningAnalysisDeletion()`, whose results are `CodeScanningAnalysisDeletionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_analysis_deletion` is nested under `/repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}` in the API, so **every**
`code_scanning_analysis_deletion` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_scanning_analysis_deletion <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `remove$(q)` | `owner`, `repo`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/code_scanning_autofix`

Backed by `sdk.CodeScanningAutofix()`, whose results are `CodeScanningAutofixEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_autofix` is nested under `/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix` in the API, so **every**
`code_scanning_autofix` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_scanning_autofix <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `code_scanning_autofix`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created `code_scanning_autofix`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `description` | string |  |
| `started_at` | string |  |
| `status` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const code_scanning_autofix = await seneca
  .entity('provider/github/code_scanning_autofix')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/code_scanning_autofix_commit`

Backed by `sdk.CodeScanningAutofixCommit()`, whose results are `CodeScanningAutofixCommitEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_autofix_commit` is nested under `/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits` in the API, so **every**
`code_scanning_autofix_commit` command requires `alert_id`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_scanning_autofix_commit <cmd>: alert_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `alert_id`, `owner` and `repo` | Created `code_scanning_autofix_commit`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `alert_id` | string | Parent key. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/code_scanning_codeql_database`

Backed by `sdk.CodeScanningCodeqlDatabase()`, whose results are `CodeScanningCodeqlDatabaseEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_codeql_database` is nested under `/repos/{owner}/{repo}/code-scanning/codeql/databases` in the API, so **every**
`code_scanning_codeql_database` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_scanning_codeql_database <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `code_scanning_codeql_database` entities. |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `code_scanning_codeql_database`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `content_type` | string |  |
| `created_at` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `language` | string |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `size` | number |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `updated_at` | string |  |
| `uploader` | object |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const code_scanning_codeql_databases = await seneca
  .entity('provider/github/code_scanning_codeql_database')
  .list$({ owner: '...', repo: '...' })
const code_scanning_codeql_database = await seneca
  .entity('provider/github/code_scanning_codeql_database')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/code_scanning_default_setup`

Backed by `sdk.CodeScanningDefaultSetup()`, whose results are `CodeScanningDefaultSetupEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_default_setup` is nested under `/repos/{owner}/{repo}/code-scanning/default-setup` in the API, so **every**
`code_scanning_default_setup` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_scanning_default_setup <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `code_scanning_default_setup` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const code_scanning_default_setups = await seneca
  .entity('provider/github/code_scanning_default_setup')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/code_scanning_organization_alert_item`

Backed by `sdk.CodeScanningOrganizationAlertItem()`, whose results are `CodeScanningOrganizationAlertItemEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_organization_alert_item` is nested under `/orgs/{org}/code-scanning/alerts` in the API, so **every**
`code_scanning_organization_alert_item` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: code_scanning_organization_alert_item <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `code_scanning_organization_alert_item` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `dismissal_approved_by` | object |  |
| `dismissed_at` | string |  |
| `dismissed_by` | object |  |
| `dismissed_reason` | string |  |
| `html_url` | string |  |
| `instances_url` | string |  |
| `most_recent_instance` | object |  |
| `number` | number |  |
| `repository` | object |  |
| `rule` | object |  |
| `state` | string |  |
| `tool` | object |  |
| `url` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const code_scanning_organization_alert_items = await seneca
  .entity('provider/github/code_scanning_organization_alert_item')
  .list$({ org_id: '...' })
```

### `provider/github/code_scanning_sarifs_status`

Backed by `sdk.CodeScanningSarifsStatus()`, whose results are `CodeScanningSarifsStatusEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_sarifs_status` is nested under `/repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}` in the API, so **every**
`code_scanning_sarifs_status` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_scanning_sarifs_status <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `code_scanning_sarifs_status`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const code_scanning_sarifs_status = await seneca
  .entity('provider/github/code_scanning_sarifs_status')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/code_scanning_variant_analysi`

Backed by `sdk.CodeScanningVariantAnalysi()`, whose results are `CodeScanningVariantAnalysiEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_variant_analysi` is nested under `/repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}` in the API, so **every**
`code_scanning_variant_analysi` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: code_scanning_variant_analysi <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `code_scanning_variant_analysi`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created `code_scanning_variant_analysi`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `actor` | object |  |
| `controller_repo` | object |  |
| `id` | number |  |
| `language` | string |  |
| `query_language` | string |  |
| `query_pack` | string |  |
| `query_pack_url` | string |  |
| `skipped_repositories` | object |  |
| `status` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const code_scanning_variant_analysi = await seneca
  .entity('provider/github/code_scanning_variant_analysi')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/code_scanning_variant_analysis_repo_task`

Backed by `sdk.CodeScanningVariantAnalysisRepoTask()`, whose results are `CodeScanningVariantAnalysisRepoTaskEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_scanning_variant_analysis_repo_task` is nested under `/repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}` in the API, so **every**
`code_scanning_variant_analysis_repo_task` command requires `codeql_variant_analysis_id`, `owner`, `repo` and `repo_owner`. Omitting one throws —
`@seneca/github-provider: code_scanning_variant_analysis_repo_task <cmd>: codeql_variant_analysis_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `codeql_variant_analysis_id`, `owner`, `repo`, `repo_owner`, ``, all **required** | One `code_scanning_variant_analysis_repo_task`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `archive_url` | string |  |
| `assignees_url` | string |  |
| `blobs_url` | string |  |
| `branches_url` | string |  |
| `collaborators_url` | string |  |
| `comments_url` | string |  |
| `commits_url` | string |  |
| `compare_url` | string |  |
| `contents_url` | string |  |
| `contributors_url` | string |  |
| `deployments_url` | string |  |
| `description` | string |  |
| `downloads_url` | string |  |
| `events_url` | string |  |
| `fork` | boolean |  |
| `forks_url` | string |  |
| `full_name` | string |  |
| `git_commits_url` | string |  |
| `git_refs_url` | string |  |
| `git_tags_url` | string |  |
| `github_id` | number |  |
| `hooks_url` | string |  |
| `html_url` | string |  |
| `id` | string |  |
| `issue_comment_url` | string |  |
| `issue_events_url` | string |  |
| `issues_url` | string |  |
| `keys_url` | string |  |
| `labels_url` | string |  |
| `languages_url` | string |  |
| `merges_url` | string |  |
| `milestones_url` | string |  |
| `name` | string |  |
| `node_id` | string |  |
| `notifications_url` | string |  |
| `owner` | object | Parent key. Required by every command. |
| `private` | boolean |  |
| `pulls_url` | string |  |
| `releases_url` | string |  |
| `stargazers_url` | string |  |
| `statuses_url` | string |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `tags_url` | string |  |
| `teams_url` | string |  |
| `trees_url` | string |  |
| `url` | string |  |
| `codeql_variant_analysis_id` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |
| `repo_owner` | string | Parent key. Required by every command. |

```js
const code_scanning_variant_analysis_repo_task = await seneca
  .entity('provider/github/code_scanning_variant_analysis_repo_task')
  .load$({ codeql_variant_analysis_id: '...', owner: '...', repo: '...', repo_owner: '...', null: '...' })
```

### `provider/github/code_security`

Backed by `sdk.CodeSecurity()`, whose results are `CodeSecurityEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_security` is nested under `/enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults` in the API, so **every**
`code_security` command requires `enterprise`. Omitting one throws —
`@seneca/github-provider: code_security <cmd>: enterprise is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `enterprise` | Updated `code_security`; the API declares no create operation. |
| `remove$(q)` | `enterprise` and `null`, both **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `enterprise` | string | Parent key. Required by every command. |

### `provider/github/code_security_configuration`

Backed by `sdk.CodeSecurityConfiguration()`, whose results are `CodeSecurityConfigurationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_security_configuration` is nested under `/orgs/{org}/code-security/configurations` in the API, so **every**
`code_security_configuration` command requires `enterprise` and `org_id`. Omitting one throws —
`@seneca/github-provider: code_security_configuration <cmd>: enterprise is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `enterprise` and `org_id`, both **required**, plus optional match fields | Array of `code_security_configuration` entities. |
| `load$(q)` | `enterprise`, `org_id`, `id`, all **required** | One `code_security_configuration`, or `null` if not found. |
| `save$()` | entity data, including `enterprise` and `org_id` | Created or updated `code_security_configuration`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `scope` | string |  |
| `enterprise` | string | Parent key. Required by every command. |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const code_security_configurations = await seneca
  .entity('provider/github/code_security_configuration')
  .list$({ enterprise: '...', org_id: '...' })
const code_security_configuration = await seneca
  .entity('provider/github/code_security_configuration')
  .load$({ enterprise: '...', org_id: '...', id: '...' })
```

### `provider/github/code_security_configuration_repository`

Backed by `sdk.CodeSecurityConfigurationRepository()`, whose results are `CodeSecurityConfigurationRepositoryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_security_configuration_repository` is nested under `/enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories` in the API, so **every**
`code_security_configuration_repository` command requires `configuration_id`. Omitting one throws —
`@seneca/github-provider: code_security_configuration_repository <cmd>: configuration_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `configuration_id` **required**, plus optional match fields | Array of `code_security_configuration_repository` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `repository` | object |  |
| `configuration_id` | string | Parent key. Required by every command. |

```js
const code_security_configuration_repositorys = await seneca
  .entity('provider/github/code_security_configuration_repository')
  .list$({ configuration_id: '...' })
```

### `provider/github/code_security_default_configuration`

Backed by `sdk.CodeSecurityDefaultConfiguration()`, whose results are `CodeSecurityDefaultConfigurationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`code_security_default_configuration` is nested under `/enterprises/{enterprise}/code-security/configurations/defaults` in the API, so **every**
`code_security_default_configuration` command requires `enterprise`. Omitting one throws —
`@seneca/github-provider: code_security_default_configuration <cmd>: enterprise is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `enterprise` **required**, plus optional match fields | Array of `code_security_default_configuration` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `enterprise` | string | Parent key. Required by every command. |

```js
const code_security_default_configurations = await seneca
  .entity('provider/github/code_security_default_configuration')
  .list$({ enterprise: '...' })
```

### `provider/github/codeowners_error`

Backed by `sdk.CodeownersError()`, whose results are `CodeownersErrorEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`codeowners_error` is nested under `/repos/{owner}/{repo}/codeowners/errors` in the API, so **every**
`codeowners_error` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: codeowners_error <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `codeowners_error` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `column` | number |  |
| `kind` | string |  |
| `line` | number |  |
| `message` | string |  |
| `path` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const codeowners_errors = await seneca
  .entity('provider/github/codeowners_error')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/codespace`

Backed by `sdk.Codespace()`, whose results are `CodespaceEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`codespace` is nested under `/orgs/{org}/codespaces/secrets/{secret_name}/repositories` in the API, so **every**
`codespace` command requires `secret_name`. Omitting one throws —
`@seneca/github-provider: codespace <cmd>: secret_name is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `secret_name` **required**, plus optional match fields | Array of `codespace` entities. |
| `load$(q)` | `secret_name` and `id`, both **required** | One `codespace`, or `null` if not found. |
| `save$()` | entity data, including `secret_name` | Created or updated `codespace`. |
| `remove$(q)` | `secret_name` and `id`, both **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `accepted` | boolean |  |
| `archive_url` | string |  |
| `assignees_url` | string |  |
| `billable_owner` | object |  |
| `blobs_url` | string |  |
| `branches_url` | string |  |
| `code_of_conduct` | object |  |
| `collaborators_url` | string |  |
| `comments_url` | string |  |
| `commits_url` | string |  |
| `compare_url` | string |  |
| `contents_url` | string |  |
| `contributors_url` | string |  |
| `cpus` | number |  |
| `created_at` | string |  |
| `defaults` | object |  |
| `deployments_url` | string |  |
| `description` | string |  |
| `downloads_url` | string |  |
| `environment_id` | string |  |
| `events_url` | string |  |
| `fork` | boolean |  |
| `forks_url` | string |  |
| `full_name` | string |  |
| `git_commits_url` | string |  |
| `git_refs_url` | string |  |
| `git_status` | object |  |
| `git_tags_url` | string |  |
| `hooks_url` | string |  |
| `idle_timeout_minutes` | number |  |
| `issue_comment_url` | string |  |
| `issue_events_url` | string |  |
| `issues_url` | string |  |
| `key` | string |  |
| `key_id` | string |  |
| `keys_url` | string |  |
| `labels_url` | string |  |
| `languages_url` | string |  |
| `last_used_at` | string |  |
| `location` | string |  |
| `machine` | object |  |
| `machines_url` | string |  |
| `memory_in_bytes` | number |  |
| `merges_url` | string |  |
| `milestones_url` | string |  |
| `name` | string |  |
| `node_id` | string |  |
| `notifications_url` | string |  |
| `operating_system` | string |  |
| `owner` | object |  |
| `path` | string |  |
| `prebuild` | boolean |  |
| `prebuild_availability` | string |  |
| `pulls_url` | string |  |
| `recent_folders` | array |  |
| `releases_url` | string |  |
| `repository` | object |  |
| `selected_usernames` | array |  |
| `stargazers_url` | string |  |
| `start_url` | string |  |
| `statuses_url` | string |  |
| `stop_url` | string |  |
| `storage_in_bytes` | number |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `tags_url` | string |  |
| `teams_url` | string |  |
| `trees_url` | string |  |
| `updated_at` | string |  |
| `visibility` | string |  |
| `web_url` | string |  |
| `secret_name` | string | Parent key. Required by every command. |

```js
const codespaces = await seneca
  .entity('provider/github/codespace')
  .list$({ secret_name: '...' })
const codespace = await seneca
  .entity('provider/github/codespace')
  .load$({ secret_name: '...', id: '...' })
```

### `provider/github/collaborator`

Backed by `sdk.Collaborator()`, whose results are `CollaboratorEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`collaborator` is nested under `/repos/{owner}/{repo}/collaborators` in the API, so **every**
`collaborator` command requires `project_id`. Omitting one throws —
`@seneca/github-provider: collaborator <cmd>: project_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `project_id` **required**, plus optional match fields | Array of `collaborator` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `permissions` | object |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `role_name` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |
| `project_id` | string | Parent key: the id of a `project`. Required by every command. |

```js
const collaborators = await seneca
  .entity('provider/github/collaborator')
  .list$({ project_id: '...' })
```

### `provider/github/combined_billing_usage`

Backed by `sdk.CombinedBillingUsage()`, whose results are `CombinedBillingUsageEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `combined_billing_usage`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `days_left_in_billing_cycle` | number |  |
| `estimated_paid_storage_for_month` | number |  |
| `estimated_storage_for_month` | number |  |

```js
const combined_billing_usage = await seneca
  .entity('provider/github/combined_billing_usage')
  .load$({ null: '...' })
```

### `provider/github/combined_commit_status`

Backed by `sdk.CombinedCommitStatus()`, whose results are `CombinedCommitStatusEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`combined_commit_status` is nested under `/repos/{owner}/{repo}/commits/{ref}/status` in the API, so **every**
`combined_commit_status` command requires `owner`, `ref` and `repo`. Omitting one throws —
`@seneca/github-provider: combined_commit_status <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner`, `ref`, `repo`, all **required**, plus optional match fields | Array of `combined_commit_status` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `context` | string |  |
| `created_at` | string |  |
| `description` | string |  |
| `id` | number |  |
| `node_id` | string |  |
| `state` | string |  |
| `target_url` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `ref` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const combined_commit_statuss = await seneca
  .entity('provider/github/combined_commit_status')
  .list$({ owner: '...', ref: '...', repo: '...' })
```

### `provider/github/commit`

Backed by `sdk.Commit()`, whose results are `CommitEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`commit` is nested under `/repos/{owner}/{repo}/commits` in the API, so **every**
`commit` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: commit <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `commit` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `commit`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created `commit`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `author` | string |  |
| `base` | string |  |
| `comments_url` | string |  |
| `commit` | object |  |
| `committer` | string |  |
| `head` | string |  |
| `html_url` | string |  |
| `node_id` | string |  |
| `parents` | array |  |
| `sha` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const commits = await seneca
  .entity('provider/github/commit')
  .list$({ owner: '...', repo: '...' })
const commit = await seneca
  .entity('provider/github/commit')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/commit_activity`

Backed by `sdk.CommitActivity()`, whose results are `CommitActivityEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`commit_activity` is nested under `/repos/{owner}/{repo}/stats/commit_activity` in the API, so **every**
`commit_activity` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: commit_activity <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `commit_activity` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `days` | array |  |
| `total` | number |  |
| `week` | number |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const commit_activitys = await seneca
  .entity('provider/github/commit_activity')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/commit_comment`

Backed by `sdk.CommitComment()`, whose results are `CommitCommentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`commit_comment` is nested under `/repos/{owner}/{repo}/commits/{commit_sha}/comments` in the API, so **every**
`commit_comment` command requires `commit_sha`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: commit_comment <cmd>: commit_sha is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `commit_sha`, `owner`, `repo`, all **required**, plus optional match fields | Array of `commit_comment` entities. |
| `load$(q)` | `commit_sha`, `owner`, `repo`, `id`, all **required** | One `commit_comment`, or `null` if not found. |
| `save$()` | entity data, including `commit_sha`, `owner` and `repo` | Created or updated `commit_comment`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `author_association` | string |  |
| `body` | string |  |
| `commit_id` | string |  |
| `created_at` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `line` | number |  |
| `node_id` | string |  |
| `path` | string |  |
| `position` | number |  |
| `reactions` | object |  |
| `updated_at` | string |  |
| `url` | string |  |
| `user` | object |  |
| `commit_sha` | string | Parent key. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const commit_comments = await seneca
  .entity('provider/github/commit_comment')
  .list$({ commit_sha: '...', owner: '...', repo: '...' })
const commit_comment = await seneca
  .entity('provider/github/commit_comment')
  .load$({ commit_sha: '...', owner: '...', repo: '...', id: '...' })
```

### `provider/github/commit_comparison`

Backed by `sdk.CommitComparison()`, whose results are `CommitComparisonEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`commit_comparison` is nested under `/repos/{owner}/{repo}/compare/{basehead}` in the API, so **every**
`commit_comparison` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: commit_comparison <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `commit_comparison`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `ahead_by` | number |  |
| `base_commit` | object |  |
| `behind_by` | number |  |
| `commits` | array |  |
| `diff_url` | string |  |
| `html_url` | string |  |
| `merge_base_commit` | object |  |
| `patch_url` | string |  |
| `permalink_url` | string |  |
| `status` | string |  |
| `total_commits` | number |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const commit_comparison = await seneca
  .entity('provider/github/commit_comparison')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/community_profile`

Backed by `sdk.CommunityProfile()`, whose results are `CommunityProfileEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`community_profile` is nested under `/repos/{owner}/{repo}/community/profile` in the API, so **every**
`community_profile` command requires `owner`. Omitting one throws —
`@seneca/github-provider: community_profile <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner` and `null`, both **required** | One `community_profile`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `code_of_conduct` | object |  |
| `code_of_conduct_file` | object |  |
| `contributing` | object |  |
| `issue_template` | object |  |
| `license` | object |  |
| `pull_request_template` | object |  |
| `readme` | object |  |
| `owner` | string | Parent key. Required by every command. |

```js
const community_profile = await seneca
  .entity('provider/github/community_profile')
  .load$({ owner: '...', null: '...' })
```

### `provider/github/content_file`

Backed by `sdk.ContentFile()`, whose results are `ContentFileEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`content_file` is nested under `/repos/{owner}/{repo}/readme/{dir}` in the API, so **every**
`content_file` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: content_file <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `content_file`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `git` | string |  |
| `html` | string |  |
| `self` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const content_file = await seneca
  .entity('provider/github/content_file')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/content_traffic`

Backed by `sdk.ContentTraffic()`, whose results are `ContentTrafficEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`content_traffic` is nested under `/repos/{owner}/{repo}/traffic/popular/paths` in the API, so **every**
`content_traffic` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: content_traffic <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `content_traffic` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `count` | number |  |
| `path` | string |  |
| `title` | string |  |
| `uniques` | number |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const content_traffics = await seneca
  .entity('provider/github/content_traffic')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/contributor`

Backed by `sdk.Contributor()`, whose results are `ContributorEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`contributor` is nested under `/repos/{owner}/{repo}/contributors` in the API, so **every**
`contributor` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: contributor <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `contributor` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `author` | object |  |
| `contributions` | number |  |
| `total` | number |  |
| `type` | string |  |
| `weeks` | array |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const contributors = await seneca
  .entity('provider/github/contributor')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/copilot`

Backed by `sdk.Copilot()`, whose results are `CopilotEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`copilot` is nested under `/orgs/{org}/copilot/billing/seats` in the API, so **every**
`copilot` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: copilot <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `copilot` entities. |
| `load$(q)` | `org_id` and `null`, both **required** | One `copilot`, or `null` if not found. |
| `save$()` | entity data, including `org_id` | Created `copilot`; the API declares no update operation. |
| `remove$(q)` | `org_id` and `null`, both **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `assignee` | object |  |
| `created_at` | string |  |
| `organization` | object |  |
| `selected_teams` | array |  |
| `selected_usernames` | array |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const copilots = await seneca
  .entity('provider/github/copilot')
  .list$({ org_id: '...' })
const copilot = await seneca
  .entity('provider/github/copilot')
  .load$({ org_id: '...', null: '...' })
```

### `provider/github/copilot_organization_detail`

Backed by `sdk.CopilotOrganizationDetail()`, whose results are `CopilotOrganizationDetailEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `copilot_organization_detail`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

The API definition declares no required fields for this entity; whatever it
returns is passed through unchanged.

```js
const copilot_organization_detail = await seneca
  .entity('provider/github/copilot_organization_detail')
  .load$({ null: '...' })
```

### `provider/github/copilot_usage_metrics_day`

Backed by `sdk.CopilotUsageMetricsDay()`, whose results are `CopilotUsageMetricsDayEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`copilot_usage_metrics_day` is nested under `/orgs/{org}/team/{team_slug}/copilot/metrics` in the API, so **every**
`copilot_usage_metrics_day` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: copilot_usage_metrics_day <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `copilot_usage_metrics_day` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `date` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const copilot_usage_metrics_days = await seneca
  .entity('provider/github/copilot_usage_metrics_day')
  .list$({ org_id: '...' })
```

### `provider/github/credential`

Backed by `sdk.Credential()`, whose results are `CredentialEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data | Created `credential`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `credentials` | array |  |

### `provider/github/custom_property`

Backed by `sdk.CustomProperty()`, whose results are `CustomPropertyEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`custom_property` is nested under `/orgs/{org}/properties/schema` in the API, so **every**
`custom_property` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: custom_property <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `custom_property` entities. |
| `load$(q)` | `org_id` and `null`, both **required** | One `custom_property`, or `null` if not found. |
| `save$()` | entity data, including `org_id` | Updated `custom_property`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `properties` | array |  |
| `property_name` | string |  |
| `value_type` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const custom_propertys = await seneca
  .entity('provider/github/custom_property')
  .list$({ org_id: '...' })
const custom_property = await seneca
  .entity('provider/github/custom_property')
  .load$({ org_id: '...', null: '...' })
```

### `provider/github/custom_property_value`

Backed by `sdk.CustomPropertyValue()`, whose results are `CustomPropertyValueEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`custom_property_value` is nested under `/repos/{owner}/{repo}/properties/values` in the API, so **every**
`custom_property_value` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: custom_property_value <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `custom_property_value` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `property_name` | string |  |
| `value` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const custom_property_values = await seneca
  .entity('provider/github/custom_property_value')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/dependabot`

Backed by `sdk.Dependabot()`, whose results are `DependabotEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`dependabot` is nested under `/orgs/{org}/dependabot/secrets/{secret_name}/repositories` in the API, so **every**
`dependabot` command requires `org`, `org_id`, `repository_id` and `secret_id`. Omitting one throws —
`@seneca/github-provider: dependabot <cmd>: org is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org`, `org_id`, `repository_id`, `secret_id`, all **required**, plus optional match fields | Array of `dependabot` entities. |
| `save$()` | entity data, including `org`, `org_id`, `repository_id` and `secret_id` | Updated `dependabot`; the API declares no create operation. |
| `remove$(q)` | `org`, `org_id`, `repository_id`, `secret_id`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `archive_url` | string |  |
| `assignees_url` | string |  |
| `avatar_url` | string |  |
| `blobs_url` | string |  |
| `branches_url` | string |  |
| `code_of_conduct` | object |  |
| `collaborators_url` | string |  |
| `comments_url` | string |  |
| `commits_url` | string |  |
| `compare_url` | string |  |
| `contents_url` | string |  |
| `contributors_url` | string |  |
| `default_level` | string |  |
| `deployments_url` | string |  |
| `description` | string |  |
| `downloads_url` | string |  |
| `events_url` | string |  |
| `fork` | boolean |  |
| `forks_url` | string |  |
| `full_name` | string |  |
| `git_commits_url` | string |  |
| `git_refs_url` | string |  |
| `git_tags_url` | string |  |
| `hooks_url` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `issue_comment_url` | string |  |
| `issue_events_url` | string |  |
| `issues_url` | string |  |
| `keys_url` | string |  |
| `labels_url` | string |  |
| `languages_url` | string |  |
| `login` | string |  |
| `members_url` | string |  |
| `merges_url` | string |  |
| `milestones_url` | string |  |
| `name` | string |  |
| `node_id` | string |  |
| `notifications_url` | string |  |
| `owner` | object |  |
| `private` | boolean |  |
| `public_members_url` | string |  |
| `pulls_url` | string |  |
| `releases_url` | string |  |
| `repos_url` | string |  |
| `selected_repository_ids` | array |  |
| `stargazers_url` | string |  |
| `statuses_url` | string |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `tags_url` | string |  |
| `teams_url` | string |  |
| `trees_url` | string |  |
| `url` | string |  |
| `org` | string | Parent key: the id of a `org`. Required by every command. |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |
| `repository_id` | string | Parent key: the id of a `repository`. Required by every command. |
| `secret_id` | string | Parent key. Required by every command. |

```js
const dependabots = await seneca
  .entity('provider/github/dependabot')
  .list$({ org: '...', org_id: '...', repository_id: '...', secret_id: '...' })
```

### `provider/github/dependabot_alert`

Backed by `sdk.DependabotAlert()`, whose results are `DependabotAlertEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`dependabot_alert` is nested under `/repos/{owner}/{repo}/dependabot/alerts` in the API, so **every**
`dependabot_alert` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: dependabot_alert <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `dependabot_alert` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `dependabot_alert`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Updated `dependabot_alert`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `dependency` | object |  |
| `dismissed_at` | string |  |
| `dismissed_by` | object |  |
| `dismissed_comment` | string |  |
| `dismissed_reason` | string |  |
| `fixed_at` | string |  |
| `html_url` | string |  |
| `number` | number |  |
| `security_advisory` | object |  |
| `security_vulnerability` | object |  |
| `state` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const dependabot_alerts = await seneca
  .entity('provider/github/dependabot_alert')
  .list$({ owner: '...', repo: '...' })
const dependabot_alert = await seneca
  .entity('provider/github/dependabot_alert')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/dependabot_alert_with_repository`

Backed by `sdk.DependabotAlertWithRepository()`, whose results are `DependabotAlertWithRepositoryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`dependabot_alert_with_repository` is nested under `/orgs/{org}/dependabot/alerts` in the API, so **every**
`dependabot_alert_with_repository` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: dependabot_alert_with_repository <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `dependabot_alert_with_repository` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `dependency` | object |  |
| `dismissed_at` | string |  |
| `dismissed_by` | object |  |
| `dismissed_comment` | string |  |
| `dismissed_reason` | string |  |
| `fixed_at` | string |  |
| `html_url` | string |  |
| `number` | number |  |
| `repository` | object |  |
| `security_advisory` | object |  |
| `security_vulnerability` | object |  |
| `state` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const dependabot_alert_with_repositorys = await seneca
  .entity('provider/github/dependabot_alert_with_repository')
  .list$({ org_id: '...' })
```

### `provider/github/dependabot_public_key`

Backed by `sdk.DependabotPublicKey()`, whose results are `DependabotPublicKeyEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `dependabot_public_key`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `key` | string |  |
| `key_id` | string |  |

```js
const dependabot_public_key = await seneca
  .entity('provider/github/dependabot_public_key')
  .load$({ null: '...' })
```

### `provider/github/dependabot_repository_access_detail`

Backed by `sdk.DependabotRepositoryAccessDetail()`, whose results are `DependabotRepositoryAccessDetailEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`dependabot_repository_access_detail` is nested under `/organizations/{org}/dependabot/repository-access` in the API, so **every**
`dependabot_repository_access_detail` command requires `org`. Omitting one throws —
`@seneca/github-provider: dependabot_repository_access_detail <cmd>: org is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org` **required**, plus optional match fields | Array of `dependabot_repository_access_detail` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `archive_url` | string |  |
| `assignees_url` | string |  |
| `blobs_url` | string |  |
| `branches_url` | string |  |
| `collaborators_url` | string |  |
| `comments_url` | string |  |
| `commits_url` | string |  |
| `compare_url` | string |  |
| `contents_url` | string |  |
| `contributors_url` | string |  |
| `deployments_url` | string |  |
| `description` | string |  |
| `downloads_url` | string |  |
| `events_url` | string |  |
| `fork` | boolean |  |
| `forks_url` | string |  |
| `full_name` | string |  |
| `git_commits_url` | string |  |
| `git_refs_url` | string |  |
| `git_tags_url` | string |  |
| `hooks_url` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `issue_comment_url` | string |  |
| `issue_events_url` | string |  |
| `issues_url` | string |  |
| `keys_url` | string |  |
| `labels_url` | string |  |
| `languages_url` | string |  |
| `merges_url` | string |  |
| `milestones_url` | string |  |
| `name` | string |  |
| `node_id` | string |  |
| `notifications_url` | string |  |
| `owner` | object |  |
| `private` | boolean |  |
| `pulls_url` | string |  |
| `releases_url` | string |  |
| `stargazers_url` | string |  |
| `statuses_url` | string |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `tags_url` | string |  |
| `teams_url` | string |  |
| `trees_url` | string |  |
| `url` | string |  |
| `org` | string | Parent key: the id of a `org`. Required by every command. |

```js
const dependabot_repository_access_details = await seneca
  .entity('provider/github/dependabot_repository_access_detail')
  .list$({ org: '...' })
```

### `provider/github/dependabot_secret`

Backed by `sdk.DependabotSecret()`, whose results are `DependabotSecretEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`dependabot_secret` is nested under `/repos/{owner}/{repo}/dependabot/secrets/{secret_name}` in the API, so **every**
`dependabot_secret` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: dependabot_secret <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `dependabot_secret`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `name` | string |  |
| `updated_at` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const dependabot_secret = await seneca
  .entity('provider/github/dependabot_secret')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/dependency_graph`

Backed by `sdk.DependencyGraph()`, whose results are `DependencyGraphEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`dependency_graph` is nested under `/repos/{owner}/{repo}/dependency-graph/snapshots` in the API, so **every**
`dependency_graph` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: dependency_graph <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Created `dependency_graph`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `detector` | object |  |
| `job` | object |  |
| `ref` | string |  |
| `scanned` | string |  |
| `sha` | string |  |
| `version` | number |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/dependency_graph_diff`

Backed by `sdk.DependencyGraphDiff()`, whose results are `DependencyGraphDiffEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`dependency_graph_diff` is nested under `/repos/{owner}/{repo}/dependency-graph/compare/{basehead}` in the API, so **every**
`dependency_graph_diff` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: dependency_graph_diff <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `dependency_graph_diff`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `change_type` | string |  |
| `ecosystem` | string |  |
| `license` | string |  |
| `manifest` | string |  |
| `name` | string |  |
| `package_url` | string |  |
| `scope` | string |  |
| `source_repository_url` | string |  |
| `version` | string |  |
| `vulnerabilities` | array |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const dependency_graph_diff = await seneca
  .entity('provider/github/dependency_graph_diff')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/dependency_graph_spdx_sbom`

Backed by `sdk.DependencyGraphSpdxSbom()`, whose results are `DependencyGraphSpdxSbomEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`dependency_graph_spdx_sbom` is nested under `/repos/{owner}/{repo}/dependency-graph/sbom` in the API, so **every**
`dependency_graph_spdx_sbom` command requires `owner`. Omitting one throws —
`@seneca/github-provider: dependency_graph_spdx_sbom <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner` and `null`, both **required** | One `dependency_graph_spdx_sbom`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `SPDXID` | string |  |
| `creationInfo` | object |  |
| `dataLicense` | string |  |
| `documentNamespace` | string |  |
| `name` | string |  |
| `packages` | array |  |
| `relationships` | array |  |
| `spdxVersion` | string |  |
| `owner` | string | Parent key. Required by every command. |

```js
const dependency_graph_spdx_sbom = await seneca
  .entity('provider/github/dependency_graph_spdx_sbom')
  .load$({ owner: '...', null: '...' })
```

### `provider/github/deploy_key`

Backed by `sdk.DeployKey()`, whose results are `DeployKeyEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`deploy_key` is nested under `/repos/{owner}/{repo}/keys` in the API, so **every**
`deploy_key` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: deploy_key <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `deploy_key` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `deploy_key`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created `deploy_key`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `id` | number | Id field. |
| `key` | string |  |
| `read_only` | boolean |  |
| `title` | string |  |
| `url` | string |  |
| `verified` | boolean |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const deploy_keys = await seneca
  .entity('provider/github/deploy_key')
  .list$({ owner: '...', repo: '...' })
const deploy_key = await seneca
  .entity('provider/github/deploy_key')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/deployment`

Backed by `sdk.Deployment()`, whose results are `DeploymentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`deployment` is nested under `/repos/{owner}/{repo}/deployments` in the API, so **every**
`deployment` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: deployment <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `deployment` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `deployment`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created `deployment`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `comment` | string |  |
| `created_at` | string |  |
| `creator` | object |  |
| `description` | string |  |
| `environment` | string |  |
| `environment_ids` | array |  |
| `id` | number | Id field. |
| `node_id` | string |  |
| `payload` | string |  |
| `performed_via_github_app` | object |  |
| `ref` | string |  |
| `repository_url` | string |  |
| `sha` | string |  |
| `state` | string |  |
| `statuses_url` | string |  |
| `task` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const deployments = await seneca
  .entity('provider/github/deployment')
  .list$({ owner: '...', repo: '...' })
const deployment = await seneca
  .entity('provider/github/deployment')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/deployment_branch_policy`

Backed by `sdk.DeploymentBranchPolicy()`, whose results are `DeploymentBranchPolicyEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`deployment_branch_policy` is nested under `/repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}` in the API, so **every**
`deployment_branch_policy` command requires `environment_id`, `environment_name`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: deployment_branch_policy <cmd>: environment_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `environment_id`, `environment_name`, `owner`, `repo`, `id`, all **required** | One `deployment_branch_policy`, or `null` if not found. |
| `save$()` | entity data, including `environment_id`, `environment_name`, `owner` and `repo` | Created or updated `deployment_branch_policy`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `environment_id` | string | Parent key: the id of a `environment`. Required by every command. |
| `environment_name` | string | Parent key. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const deployment_branch_policy = await seneca
  .entity('provider/github/deployment_branch_policy')
  .load$({ environment_id: '...', environment_name: '...', owner: '...', repo: '...', id: '...' })
```

### `provider/github/deployment_protection_rule`

Backed by `sdk.DeploymentProtectionRule()`, whose results are `DeploymentProtectionRuleEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`deployment_protection_rule` is nested under `/repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}` in the API, so **every**
`deployment_protection_rule` command requires `environment_id`, `environment_name`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: deployment_protection_rule <cmd>: environment_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `environment_id`, `environment_name`, `owner`, `repo`, `id`, all **required** | One `deployment_protection_rule`, or `null` if not found. |
| `save$()` | entity data, including `environment_id`, `environment_name`, `owner` and `repo` | Created `deployment_protection_rule`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `id` | number | Id field. |
| `integration_url` | string |  |
| `node_id` | string |  |
| `slug` | string |  |
| `environment_id` | string | Parent key: the id of a `environment`. Required by every command. |
| `environment_name` | string | Parent key. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const deployment_protection_rule = await seneca
  .entity('provider/github/deployment_protection_rule')
  .load$({ environment_id: '...', environment_name: '...', owner: '...', repo: '...', id: '...' })
```

### `provider/github/deployment_status`

Backed by `sdk.DeploymentStatus()`, whose results are `DeploymentStatusEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`deployment_status` is nested under `/repos/{owner}/{repo}/deployments/{deployment_id}/statuses` in the API, so **every**
`deployment_status` command requires `deployment_id`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: deployment_status <cmd>: deployment_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `deployment_id`, `owner`, `repo`, all **required**, plus optional match fields | Array of `deployment_status` entities. |
| `load$(q)` | `deployment_id`, `owner`, `repo`, `id`, all **required** | One `deployment_status`, or `null` if not found. |
| `save$()` | entity data, including `deployment_id`, `owner` and `repo` | Created `deployment_status`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `creator` | object |  |
| `deployment_url` | string |  |
| `description` | string |  |
| `id` | number | Id field. |
| `node_id` | string |  |
| `performed_via_github_app` | object |  |
| `repository_url` | string |  |
| `state` | string |  |
| `target_url` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `deployment_id` | string | Parent key: the id of a `deployment`. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const deployment_statuss = await seneca
  .entity('provider/github/deployment_status')
  .list$({ deployment_id: '...', owner: '...', repo: '...' })
const deployment_status = await seneca
  .entity('provider/github/deployment_status')
  .load$({ deployment_id: '...', owner: '...', repo: '...', id: '...' })
```

### `provider/github/diff_entry`

Backed by `sdk.DiffEntry()`, whose results are `DiffEntryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`diff_entry` is nested under `/repos/{owner}/{repo}/pulls/{pull_number}/files` in the API, so **every**
`diff_entry` command requires `owner`, `pull_number` and `repo`. Omitting one throws —
`@seneca/github-provider: diff_entry <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner`, `pull_number`, `repo`, all **required**, plus optional match fields | Array of `diff_entry` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `additions` | number |  |
| `blob_url` | string |  |
| `changes` | number |  |
| `contents_url` | string |  |
| `deletions` | number |  |
| `filename` | string |  |
| `raw_url` | string |  |
| `sha` | string |  |
| `status` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `pull_number` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const diff_entrys = await seneca
  .entity('provider/github/diff_entry')
  .list$({ owner: '...', pull_number: '...', repo: '...' })
```

### `provider/github/email`

Backed by `sdk.Email()`, whose results are `EmailEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `email` entities. |
| `save$()` | entity data | Created or updated `email`. |

The API definition declares no required fields for this entity; whatever it
returns is passed through unchanged.

```js
const emails = await seneca
  .entity('provider/github/email')
  .list$()
```

### `provider/github/emoji`

Backed by `sdk.Emoji()`, whose results are `EmojiEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `id` **required** | One `emoji`, or `null` if not found. |

The API definition declares no required fields for this entity; whatever it
returns is passed through unchanged.

```js
const emoji = await seneca
  .entity('provider/github/emoji')
  .load$('...')
```

### `provider/github/empty_object`

Backed by `sdk.EmptyObject()`, whose results are `EmptyObjectEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`empty_object` is nested under `/users/{username}/attestations/{subject_digest}` in the API, so **every**
`empty_object` command requires `org_id`, `owner`, `repo`, `secret_name` and `username`. Omitting one throws —
`@seneca/github-provider: empty_object <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `org_id`, `owner`, `repo`, `secret_name`, `username`, ``, all **required** | One `empty_object`, or `null` if not found. |
| `save$()` | entity data, including `org_id`, `owner`, `repo`, `secret_name` and `username` | Created or updated `empty_object`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `encrypted_value` | string |  |
| `key_id` | string |  |
| `name` | string |  |
| `use_default` | boolean |  |
| `value` | string |  |
| `visibility` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |
| `secret_name` | string | Parent key. Required by every command. |
| `username` | string | Parent key. Required by every command. |

```js
const empty_object = await seneca
  .entity('provider/github/empty_object')
  .load$({ org_id: '...', owner: '...', repo: '...', secret_name: '...', username: '...', null: '...' })
```

### `provider/github/enterprise_team`

Backed by `sdk.EnterpriseTeam()`, whose results are `EnterpriseTeamEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`enterprise_team` is nested under `/enterprises/{enterprise}/teams` in the API, so **every**
`enterprise_team` command requires `enterprise`. Omitting one throws —
`@seneca/github-provider: enterprise_team <cmd>: enterprise is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `enterprise` **required**, plus optional match fields | Array of `enterprise_team` entities. |
| `load$(q)` | `enterprise` and `id`, both **required** | One `enterprise_team`, or `null` if not found. |
| `save$()` | entity data, including `enterprise` | Created or updated `enterprise_team`. |
| `remove$(q)` | `enterprise` and `id`, both **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `group_id` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `members_url` | string |  |
| `name` | string |  |
| `slug` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `enterprise` | string | Parent key. Required by every command. |

```js
const enterprise_teams = await seneca
  .entity('provider/github/enterprise_team')
  .list$({ enterprise: '...' })
const enterprise_team = await seneca
  .entity('provider/github/enterprise_team')
  .load$({ enterprise: '...', id: '...' })
```

### `provider/github/enterprise_team_membership`

Backed by `sdk.EnterpriseTeamMembership()`, whose results are `EnterpriseTeamMembershipEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`enterprise_team_membership` is nested under `/enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}` in the API, so **every**
`enterprise_team_membership` command requires `enterprise` and `team_id`. Omitting one throws —
`@seneca/github-provider: enterprise_team_membership <cmd>: enterprise is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `remove$(q)` | `enterprise`, `team_id`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `enterprise` | string | Parent key. Required by every command. |
| `team_id` | string | Parent key: the id of a `team`. Required by every command. |

### `provider/github/environment`

Backed by `sdk.Environment()`, whose results are `EnvironmentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`environment` is nested under `/repos/{owner}/{repo}/environments/{environment_name}` in the API, so **every**
`environment` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: environment <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `environment`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Updated `environment`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `deployment_branch_policy` | object |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `name` | string |  |
| `node_id` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const environment = await seneca
  .entity('provider/github/environment')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/environment_approval`

Backed by `sdk.EnvironmentApproval()`, whose results are `EnvironmentApprovalEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`environment_approval` is nested under `/repos/{owner}/{repo}/actions/runs/{run_id}/approvals` in the API, so **every**
`environment_approval` command requires `owner`, `repo` and `run_id`. Omitting one throws —
`@seneca/github-provider: environment_approval <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner`, `repo`, `run_id`, all **required**, plus optional match fields | Array of `environment_approval` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `comment` | string |  |
| `environments` | array |  |
| `state` | string |  |
| `user` | object |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |
| `run_id` | string | Parent key. Required by every command. |

```js
const environment_approvals = await seneca
  .entity('provider/github/environment_approval')
  .list$({ owner: '...', repo: '...', run_id: '...' })
```

### `provider/github/event`

Backed by `sdk.Event()`, whose results are `EventEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`event` is nested under `/networks/{owner}/{repo}/events` in the API, so **every**
`event` command requires `username`. Omitting one throws —
`@seneca/github-provider: event <cmd>: username is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `username` **required**, plus optional match fields | Array of `event` entities. |
| `load$(q)` | `username` and `null`, both **required** | One `event`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `actor` | object |  |
| `created_at` | string |  |
| `id` | string |  |
| `org` | object |  |
| `payload` | object |  |
| `public` | boolean |  |
| `repo` | object |  |
| `type` | string |  |
| `username` | string | Parent key. Required by every command. |

```js
const events = await seneca
  .entity('provider/github/event')
  .list$({ username: '...' })
const event = await seneca
  .entity('provider/github/event')
  .load$({ username: '...', null: '...' })
```

### `provider/github/feed`

Backed by `sdk.Feed()`, whose results are `FeedEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `feed` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `links` | object |  |
| `timeline_url` | string |  |
| `user_url` | string |  |

```js
const feeds = await seneca
  .entity('provider/github/feed')
  .list$()
```

### `provider/github/file_commit`

Backed by `sdk.FileCommit()`, whose results are `FileCommitEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`file_commit` is nested under `/repos/{owner}/{repo}/contents/{path}` in the API, so **every**
`file_commit` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: file_commit <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Updated `file_commit`; the API declares no create operation. |
| `remove$(q)` | `owner`, `repo`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `author` | object |  |
| `commit` | object |  |
| `committer` | object |  |
| `content` | object |  |
| `message` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/follower`

Backed by `sdk.Follower()`, whose results are `FollowerEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `follower` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |

```js
const followers = await seneca
  .entity('provider/github/follower')
  .list$()
```

### `provider/github/following`

Backed by `sdk.Following()`, whose results are `FollowingEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `following` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |

```js
const followings = await seneca
  .entity('provider/github/following')
  .list$()
```

### `provider/github/full_repository`

Backed by `sdk.FullRepository()`, whose results are `FullRepositoryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`full_repository` is nested under `/repos/{owner}/{repo}` in the API, so **every**
`full_repository` command requires `owner`. Omitting one throws —
`@seneca/github-provider: full_repository <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner` and `null`, both **required** | One `full_repository`, or `null` if not found. |
| `save$()` | entity data, including `owner` | Created or updated `full_repository`. |

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
| `github_id` | number |  |
| `has_discussions` | boolean |  |
| `has_issues` | boolean |  |
| `has_pages` | boolean |  |
| `has_projects` | boolean |  |
| `has_wiki` | boolean |  |
| `homepage` | string |  |
| `hooks_url` | string |  |
| `html_url` | string |  |
| `id` | string |  |
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
const full_repository = await seneca
  .entity('provider/github/full_repository')
  .load$({ owner: '...', null: '...' })
```

### `provider/github/gist`

Backed by `sdk.Gist()`, whose results are `GistEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `gist` entities. |
| `load$(q)` | `id` **required** | One `gist`, or `null` if not found. |
| `save$()` | entity data | Created or updated `gist`. |
| `remove$(q)` | `id` **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `fork_of` | object |  |
| `owner` | object |  |

```js
const gists = await seneca
  .entity('provider/github/gist')
  .list$()
const gist = await seneca
  .entity('provider/github/gist')
  .load$('...')
```

### `provider/github/gist_comment`

Backed by `sdk.GistComment()`, whose results are `GistCommentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`gist_comment` is nested under `/gists/{gist_id}/comments` in the API, so **every**
`gist_comment` command requires `gist_id`. Omitting one throws —
`@seneca/github-provider: gist_comment <cmd>: gist_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `gist_id` **required**, plus optional match fields | Array of `gist_comment` entities. |
| `load$(q)` | `gist_id` and `id`, both **required** | One `gist_comment`, or `null` if not found. |
| `save$()` | entity data, including `gist_id` | Created or updated `gist_comment`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `author_association` | string |  |
| `avatar_url` | string |  |
| `body` | string |  |
| `created_at` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `user` | object |  |
| `gist_id` | string | Parent key: the id of a `gist`. Required by every command. |

```js
const gist_comments = await seneca
  .entity('provider/github/gist_comment')
  .list$({ gist_id: '...' })
const gist_comment = await seneca
  .entity('provider/github/gist_comment')
  .load$({ gist_id: '...', id: '...' })
```

### `provider/github/gist_commit`

Backed by `sdk.GistCommit()`, whose results are `GistCommitEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `gist_commit` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `change_status` | object |  |
| `committed_at` | string |  |
| `url` | string |  |
| `user` | object |  |
| `version` | string |  |

```js
const gist_commits = await seneca
  .entity('provider/github/gist_commit')
  .list$()
```

### `provider/github/gist_simple`

Backed by `sdk.GistSimple()`, whose results are `GistSimpleEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `gist_simple` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `fork_of` | object |  |
| `owner` | object |  |

```js
const gist_simples = await seneca
  .entity('provider/github/gist_simple')
  .list$()
```

### `provider/github/git`

Backed by `sdk.Git()`, whose results are `GitEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`git` is nested under `/repos/{owner}/{repo}/git/refs/{ref}` in the API, so **every**
`git` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: git <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `remove$(q)` | `owner`, `repo`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/git_commit`

Backed by `sdk.GitCommit()`, whose results are `GitCommitEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`git_commit` is nested under `/repos/{owner}/{repo}/git/commits/{commit_sha}` in the API, so **every**
`git_commit` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: git_commit <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `git_commit`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created `git_commit`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `author` | object |  |
| `committer` | object |  |
| `html_url` | string |  |
| `message` | string |  |
| `node_id` | string |  |
| `parents` | array |  |
| `sha` | string |  |
| `tree` | object |  |
| `url` | string |  |
| `verification` | object |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const git_commit = await seneca
  .entity('provider/github/git_commit')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/git_ref`

Backed by `sdk.GitRef()`, whose results are `GitRefEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`git_ref` is nested under `/repos/{owner}/{repo}/git/ref/{ref}` in the API, so **every**
`git_ref` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: git_ref <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `git_ref`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created or updated `git_ref`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `node_id` | string |  |
| `object` | object |  |
| `ref` | string |  |
| `sha` | string |  |
| `type` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const git_ref = await seneca
  .entity('provider/github/git_ref')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/git_tag`

Backed by `sdk.GitTag()`, whose results are `GitTagEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`git_tag` is nested under `/repos/{owner}/{repo}/git/tags/{tag_sha}` in the API, so **every**
`git_tag` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: git_tag <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `git_tag`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created `git_tag`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `message` | string |  |
| `node_id` | string |  |
| `object` | object |  |
| `sha` | string |  |
| `tag` | string |  |
| `tagger` | object |  |
| `type` | string |  |
| `url` | string |  |
| `verification` | object |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const git_tag = await seneca
  .entity('provider/github/git_tag')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/git_tree`

Backed by `sdk.GitTree()`, whose results are `GitTreeEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`git_tree` is nested under `/repos/{owner}/{repo}/git/trees/{tree_sha}` in the API, so **every**
`git_tree` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: git_tree <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `git_tree`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created `git_tree`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `sha` | string |  |
| `tree` | array |  |
| `truncated` | boolean |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const git_tree = await seneca
  .entity('provider/github/git_tree')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/gitignore`

Backed by `sdk.Gitignore()`, whose results are `GitignoreEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `gitignore` entities. |

The API definition declares no required fields for this entity; whatever it
returns is passed through unchanged.

```js
const gitignores = await seneca
  .entity('provider/github/gitignore')
  .list$()
```

### `provider/github/gitignore_template`

Backed by `sdk.GitignoreTemplate()`, whose results are `GitignoreTemplateEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `id` **required** | One `gitignore_template`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `name` | string |  |
| `source` | string |  |

```js
const gitignore_template = await seneca
  .entity('provider/github/gitignore_template')
  .load$('...')
```

### `provider/github/global_advisory`

Backed by `sdk.GlobalAdvisory()`, whose results are `GlobalAdvisoryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `global_advisory` entities. |
| `load$(q)` | `id` **required** | One `global_advisory`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `credits` | array |  |
| `cve_id` | string |  |
| `cvss` | object |  |
| `cwes` | array |  |
| `description` | string |  |
| `ghsa_id` | string |  |
| `github_reviewed_at` | string |  |
| `html_url` | string |  |
| `identifiers` | array |  |
| `nvd_published_at` | string |  |
| `published_at` | string |  |
| `references` | array |  |
| `repository_advisory_url` | string |  |
| `severity` | string |  |
| `source_code_location` | string |  |
| `summary` | string |  |
| `type` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `vulnerabilities` | array |  |
| `withdrawn_at` | string |  |

```js
const global_advisorys = await seneca
  .entity('provider/github/global_advisory')
  .list$()
const global_advisory = await seneca
  .entity('provider/github/global_advisory')
  .load$('...')
```

### `provider/github/gpg_key`

Backed by `sdk.GpgKey()`, whose results are `GpgKeyEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `gpg_key` entities. |
| `load$(q)` | `id` **required** | One `gpg_key`, or `null` if not found. |
| `save$()` | entity data | Created `gpg_key`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `armored_public_key` | string |  |
| `can_certify` | boolean |  |
| `can_encrypt_comms` | boolean |  |
| `can_encrypt_storage` | boolean |  |
| `can_sign` | boolean |  |
| `created_at` | string |  |
| `emails` | array |  |
| `expires_at` | string |  |
| `id` | number | Id field. |
| `key_id` | string |  |
| `primary_key_id` | number |  |
| `public_key` | string |  |
| `raw_key` | string |  |
| `revoked` | boolean |  |
| `subkeys` | array |  |

```js
const gpg_keys = await seneca
  .entity('provider/github/gpg_key')
  .list$()
const gpg_key = await seneca
  .entity('provider/github/gpg_key')
  .load$('...')
```

### `provider/github/hook`

Backed by `sdk.Hook()`, whose results are `HookEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`hook` is nested under `/repos/{owner}/{repo}/hooks` in the API, so **every**
`hook` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: hook <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `hook` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `hook`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created or updated `hook`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `active` | boolean |  |
| `config` | object |  |
| `created_at` | string |  |
| `events` | array |  |
| `id` | number | Id field. |
| `last_response` | object |  |
| `name` | string |  |
| `ping_url` | string |  |
| `test_url` | string |  |
| `type` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const hooks = await seneca
  .entity('provider/github/hook')
  .list$({ owner: '...', repo: '...' })
const hook = await seneca
  .entity('provider/github/hook')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/hook_delivery`

Backed by `sdk.HookDelivery()`, whose results are `HookDeliveryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `id` **required** | One `hook_delivery`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `action` | string |  |
| `delivered_at` | string |  |
| `duration` | number |  |
| `event` | string |  |
| `guid` | string |  |
| `id` | number | Id field. |
| `installation_id` | number |  |
| `redelivery` | boolean |  |
| `repository_id` | number |  |
| `request` | object |  |
| `response` | object |  |
| `status` | string |  |
| `status_code` | number |  |

```js
const hook_delivery = await seneca
  .entity('provider/github/hook_delivery')
  .load$('...')
```

### `provider/github/hook_delivery_item`

Backed by `sdk.HookDeliveryItem()`, whose results are `HookDeliveryItemEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `hook_delivery_item` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `action` | string |  |
| `delivered_at` | string |  |
| `duration` | number |  |
| `event` | string |  |
| `guid` | string |  |
| `id` | number |  |
| `installation_id` | number |  |
| `redelivery` | boolean |  |
| `repository_id` | number |  |
| `status` | string |  |
| `status_code` | number |  |

```js
const hook_delivery_items = await seneca
  .entity('provider/github/hook_delivery_item')
  .list$()
```

### `provider/github/hosted_compute`

Backed by `sdk.HostedCompute()`, whose results are `HostedComputeEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`hosted_compute` is nested under `/orgs/{org}/settings/network-configurations` in the API, so **every**
`hosted_compute` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: hosted_compute <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `hosted_compute` entities. |
| `remove$(q)` | `org_id` and `null`, both **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_on` | string |  |
| `id` | string |  |
| `name` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const hosted_computes = await seneca
  .entity('provider/github/hosted_compute')
  .list$({ org_id: '...' })
```

### `provider/github/hovercard`

Backed by `sdk.Hovercard()`, whose results are `HovercardEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`hovercard` is nested under `/users/{username}/hovercard` in the API, so **every**
`hovercard` command requires `username`. Omitting one throws —
`@seneca/github-provider: hovercard <cmd>: username is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `username` **required**, plus optional match fields | Array of `hovercard` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `message` | string |  |
| `octicon` | string |  |
| `username` | string | Parent key. Required by every command. |

```js
const hovercards = await seneca
  .entity('provider/github/hovercard')
  .list$({ username: '...' })
```

### `provider/github/import`

Backed by `sdk.Import()`, whose results are `ImportEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`import` is nested under `/repos/{owner}/{repo}/import` in the API, so **every**
`import` command requires `owner`. Omitting one throws —
`@seneca/github-provider: import <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` **required**, plus optional match fields | Array of `import` entities. |
| `save$()` | entity data, including `owner` | Updated `import`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `authors_url` | string |  |
| `html_url` | string |  |
| `repository_url` | string |  |
| `status` | string |  |
| `url` | string |  |
| `vcs` | string |  |
| `vcs_url` | string |  |
| `owner` | string | Parent key. Required by every command. |

```js
const imports = await seneca
  .entity('provider/github/import')
  .list$({ owner: '...' })
```

### `provider/github/installation`

Backed by `sdk.Installation()`, whose results are `InstallationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `installation` entities. |
| `load$(q)` | `id` **required** | One `installation`, or `null` if not found. |
| `save$()` | entity data | Updated `installation`; the API declares no create operation. |
| `remove$(q)` | `id` **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `access_tokens_url` | string |  |
| `account` | string |  |
| `app_id` | number |  |
| `app_slug` | string |  |
| `created_at` | string |  |
| `events` | array |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `permissions` | object |  |
| `repositories_url` | string |  |
| `repository_selection` | string |  |
| `single_file_name` | string |  |
| `suspended_at` | string |  |
| `suspended_by` | object |  |
| `target_id` | number |  |
| `target_type` | string |  |
| `updated_at` | string |  |

```js
const installations = await seneca
  .entity('provider/github/installation')
  .list$()
const installation = await seneca
  .entity('provider/github/installation')
  .load$('...')
```

### `provider/github/installation_token`

Backed by `sdk.InstallationToken()`, whose results are `InstallationTokenEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data | Created `installation_token`; the API declares no update operation. |

The API definition declares no required fields for this entity; whatever it
returns is passed through unchanged.

### `provider/github/integration`

Backed by `sdk.Integration()`, whose results are `IntegrationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`integration` is nested under `/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps` in the API, so **every**
`integration` command requires `branch_id`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: integration <cmd>: branch_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `branch_id`, `owner`, `repo`, all **required**, plus optional match fields | Array of `integration` entities. |
| `load$(q)` | `branch_id`, `owner`, `repo`, ``, all **required** | One `integration`, or `null` if not found. |
| `save$()` | entity data, including `branch_id`, `owner` and `repo` | Created or updated `integration`. |
| `remove$(q)` | `branch_id`, `owner`, `repo`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `apps` | array |  |
| `created_at` | string |  |
| `description` | string |  |
| `events` | array |  |
| `external_url` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `name` | string |  |
| `node_id` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `permissions` | object |  |
| `updated_at` | string |  |
| `branch_id` | string | Parent key: the id of a `branch`. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const integrations = await seneca
  .entity('provider/github/integration')
  .list$({ branch_id: '...', owner: '...', repo: '...' })
const integration = await seneca
  .entity('provider/github/integration')
  .load$({ branch_id: '...', owner: '...', repo: '...', null: '...' })
```

### `provider/github/integration_installation`

Backed by `sdk.IntegrationInstallation()`, whose results are `IntegrationInstallationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `integration_installation` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `account` | string |  |
| `created_at` | string |  |
| `id` | number |  |
| `requester` | object |  |

```js
const integration_installations = await seneca
  .entity('provider/github/integration_installation')
  .list$()
```

### `provider/github/interaction`

Backed by `sdk.Interaction()`, whose results are `InteractionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `interaction`, or `null` if not found. |
| `remove$(q)` | `` **required** | `null`. |

This entity is keyed by `null` rather than `id`, so the short
forms `load$('...')` and `remove$('...')` do not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

The API definition declares no required fields for this entity; whatever it
returns is passed through unchanged.

```js
const interaction = await seneca
  .entity('provider/github/interaction')
  .load$({ null: '...' })
```

### `provider/github/interaction_limit`

Backed by `sdk.InteractionLimit()`, whose results are `InteractionLimitEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data | Updated `interaction_limit`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `expires_at` | string |  |
| `limit` | string |  |
| `origin` | string |  |

### `provider/github/issue`

Backed by `sdk.Issue()`, whose results are `IssueEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`issue` is nested under `/repos/{owner}/{repo}/issues` in the API, so **every**
`issue` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: issue <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `issue` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `issue`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created or updated `issue`. |
| `remove$(q)` | `owner`, `repo`, `id`, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `actor` | object |  |
| `assignee` | object |  |
| `assigner` | object |  |
| `author_association` | string |  |
| `closed_at` | string |  |
| `closed_by` | object |  |
| `comments` | number |  |
| `comments_url` | string |  |
| `commit_id` | string |  |
| `commit_url` | string |  |
| `created_at` | string |  |
| `dismissed_review` | object |  |
| `event` | string |  |
| `events_url` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `issue` | object |  |
| `issue_dependencies_summary` | object |  |
| `issue_id` | number |  |
| `issue_url` | string |  |
| `label` | object |  |
| `labels` | array |  |
| `labels_url` | string |  |
| `locked` | boolean |  |
| `milestone` | object |  |
| `node_id` | string |  |
| `number` | number |  |
| `performed_via_github_app` | object |  |
| `project_card` | object |  |
| `pull_request` | object |  |
| `reactions` | object |  |
| `rename` | object |  |
| `repository` | object |  |
| `repository_url` | string |  |
| `requested_reviewer` | object |  |
| `requested_team` | object |  |
| `review_requester` | object |  |
| `state` | string |  |
| `sub_issue_id` | number |  |
| `sub_issues_summary` | object |  |
| `title` | string |  |
| `type` | object |  |
| `updated_at` | string |  |
| `url` | string |  |
| `user` | object |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const issues = await seneca
  .entity('provider/github/issue')
  .list$({ owner: '...', repo: '...' })
const issue = await seneca
  .entity('provider/github/issue')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/issue_type`

Backed by `sdk.IssueType()`, whose results are `IssueTypeEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`issue_type` is nested under `/orgs/{org}/issue-types` in the API, so **every**
`issue_type` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: issue_type <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `issue_type` entities. |
| `save$()` | entity data, including `org_id` | Created or updated `issue_type`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `description` | string |  |
| `id` | number |  |
| `name` | string |  |
| `node_id` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const issue_types = await seneca
  .entity('provider/github/issue_type')
  .list$({ org_id: '...' })
```

### `provider/github/job`

Backed by `sdk.Job()`, whose results are `JobEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`job` is nested under `/repos/{owner}/{repo}/actions/jobs/{job_id}` in the API, so **every**
`job` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: job <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `job`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `check_run_url` | string |  |
| `completed_at` | string |  |
| `conclusion` | string |  |
| `created_at` | string |  |
| `head_branch` | string |  |
| `head_sha` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `labels` | array |  |
| `name` | string |  |
| `node_id` | string |  |
| `run_id` | number |  |
| `run_url` | string |  |
| `runner_group_id` | number |  |
| `runner_group_name` | string |  |
| `runner_id` | number |  |
| `runner_name` | string |  |
| `started_at` | string |  |
| `status` | string |  |
| `url` | string |  |
| `workflow_name` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const job = await seneca
  .entity('provider/github/job')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/key`

Backed by `sdk.Key()`, whose results are `KeyEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `key` entities. |
| `load$(q)` | `id` **required** | One `key`, or `null` if not found. |
| `save$()` | entity data | Created `key`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `id` | number | Id field. |
| `key` | string |  |
| `read_only` | boolean |  |
| `title` | string |  |
| `url` | string |  |
| `verified` | boolean |  |

```js
const keys = await seneca
  .entity('provider/github/key')
  .list$()
const key = await seneca
  .entity('provider/github/key')
  .load$('...')
```

### `provider/github/label`

Backed by `sdk.Label()`, whose results are `LabelEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`label` is nested under `/repos/{owner}/{repo}/milestones/{milestone_number}/labels` in the API, so **every**
`label` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: label <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `label` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `label`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created or updated `label`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `color` | string |  |
| `default` | boolean |  |
| `description` | string |  |
| `id` | number | Id field. |
| `name` | string |  |
| `node_id` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const labels = await seneca
  .entity('provider/github/label')
  .list$({ owner: '...', repo: '...' })
const label = await seneca
  .entity('provider/github/label')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/language`

Backed by `sdk.Language()`, whose results are `LanguageEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`language` is nested under `/repos/{owner}/{repo}/languages` in the API, so **every**
`language` command requires `owner`. Omitting one throws —
`@seneca/github-provider: language <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner` and `null`, both **required** | One `language`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |

```js
const language = await seneca
  .entity('provider/github/language')
  .load$({ owner: '...', null: '...' })
```

### `provider/github/license`

Backed by `sdk.License()`, whose results are `LicenseEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `license` entities. |
| `load$(q)` | `id` **required** | One `license`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `body` | string |  |
| `conditions` | array |  |
| `content` | string |  |
| `description` | string |  |
| `download_url` | string |  |
| `encoding` | string |  |
| `featured` | boolean |  |
| `git_url` | string |  |
| `html_url` | string |  |
| `implementation` | string |  |
| `key` | string |  |
| `license` | object |  |
| `limitations` | array |  |
| `links` | object |  |
| `name` | string |  |
| `node_id` | string |  |
| `path` | string |  |
| `permissions` | array |  |
| `sha` | string |  |
| `size` | number |  |
| `spdx_id` | string |  |
| `type` | string |  |
| `url` | string |  |

```js
const licenses = await seneca
  .entity('provider/github/license')
  .list$()
const license = await seneca
  .entity('provider/github/license')
  .load$('...')
```

### `provider/github/markdown`

Backed by `sdk.Markdown()`, whose results are `MarkdownEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data | Created `markdown`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `text` | string |  |

### `provider/github/marketplace_listing_plan`

Backed by `sdk.MarketplaceListingPlan()`, whose results are `MarketplaceListingPlanEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `marketplace_listing_plan` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `accounts_url` | string |  |
| `bullets` | array |  |
| `description` | string |  |
| `has_free_trial` | boolean |  |
| `id` | number |  |
| `monthly_price_in_cents` | number |  |
| `name` | string |  |
| `number` | number |  |
| `price_model` | string |  |
| `state` | string |  |
| `unit_name` | string |  |
| `url` | string |  |
| `yearly_price_in_cents` | number |  |

```js
const marketplace_listing_plans = await seneca
  .entity('provider/github/marketplace_listing_plan')
  .list$()
```

### `provider/github/marketplace_purchase`

Backed by `sdk.MarketplacePurchase()`, whose results are `MarketplacePurchaseEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`marketplace_purchase` is nested under `/marketplace_listing/plans/{plan_id}/accounts` in the API, so **every**
`marketplace_purchase` command requires `plan_id`. Omitting one throws —
`@seneca/github-provider: marketplace_purchase <cmd>: plan_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `plan_id` **required**, plus optional match fields | Array of `marketplace_purchase` entities. |
| `load$(q)` | `plan_id` and `null`, both **required** | One `marketplace_purchase`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `id` | number |  |
| `login` | string |  |
| `marketplace_purchase` | object |  |
| `type` | string |  |
| `url` | string |  |
| `plan_id` | string | Parent key. Required by every command. |

```js
const marketplace_purchases = await seneca
  .entity('provider/github/marketplace_purchase')
  .list$({ plan_id: '...' })
const marketplace_purchase = await seneca
  .entity('provider/github/marketplace_purchase')
  .load$({ plan_id: '...', null: '...' })
```

### `provider/github/member`

Backed by `sdk.Member()`, whose results are `MemberEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`member` is nested under `/orgs/{org}/members` in the API, so **every**
`member` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: member <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `member` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const members = await seneca
  .entity('provider/github/member')
  .list$({ org_id: '...' })
```

### `provider/github/membership`

Backed by `sdk.Membership()`, whose results are `MembershipEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`membership` is nested under `/enterprises/{enterprise}/teams/{enterprise-team}/memberships` in the API, so **every**
`membership` command requires `enterprise`, `enterprise_team` and `team_id`. Omitting one throws —
`@seneca/github-provider: membership <cmd>: enterprise is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `enterprise`, `enterprise_team`, `team_id`, all **required**, plus optional match fields | Array of `membership` entities. |
| `load$(q)` | `enterprise`, `enterprise_team`, `team_id`, `id`, all **required** | One `membership`, or `null` if not found. |
| `save$()` | entity data, including `enterprise`, `enterprise_team` and `team_id` | Updated `membership`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |
| `enterprise` | string | Parent key. Required by every command. |
| `enterprise_team` | string | Parent key: the id of a `enterprise_team`. Required by every command. |
| `team_id` | string | Parent key: the id of a `team`. Required by every command. |

```js
const memberships = await seneca
  .entity('provider/github/membership')
  .list$({ enterprise: '...', enterprise_team: '...', team_id: '...' })
const membership = await seneca
  .entity('provider/github/membership')
  .load$({ enterprise: '...', enterprise_team: '...', team_id: '...', id: '...' })
```

### `provider/github/merged_upstream`

Backed by `sdk.MergedUpstream()`, whose results are `MergedUpstreamEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`merged_upstream` is nested under `/repos/{owner}/{repo}/merge-upstream` in the API, so **every**
`merged_upstream` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: merged_upstream <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Created `merged_upstream`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `branch` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/meta`

Backed by `sdk.Meta()`, whose results are `MetaEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `meta` entities. |
| `load$(q)` | `` **required** | One `meta`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

The API definition declares no required fields for this entity; whatever it
returns is passed through unchanged.

```js
const metas = await seneca
  .entity('provider/github/meta')
  .list$()
const meta = await seneca
  .entity('provider/github/meta')
  .load$({ null: '...' })
```

### `provider/github/metaroot`

Backed by `sdk.Metaroot()`, whose results are `MetarootEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `metaroot`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `authorizations_url` | string |  |
| `code_search_url` | string |  |
| `commit_search_url` | string |  |
| `current_user_authorizations_html_url` | string |  |
| `current_user_repositories_url` | string |  |
| `current_user_url` | string |  |
| `emails_url` | string |  |
| `emojis_url` | string |  |
| `events_url` | string |  |
| `feeds_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `issue_search_url` | string |  |
| `issues_url` | string |  |
| `keys_url` | string |  |
| `label_search_url` | string |  |
| `notifications_url` | string |  |
| `organization_repositories_url` | string |  |
| `organization_teams_url` | string |  |
| `organization_url` | string |  |
| `public_gists_url` | string |  |
| `rate_limit_url` | string |  |
| `repository_search_url` | string |  |
| `repository_url` | string |  |
| `starred_gists_url` | string |  |
| `starred_url` | string |  |
| `user_organizations_url` | string |  |
| `user_repositories_url` | string |  |
| `user_search_url` | string |  |
| `user_url` | string |  |

```js
const metaroot = await seneca
  .entity('provider/github/metaroot')
  .load$({ null: '...' })
```

### `provider/github/migration`

Backed by `sdk.Migration()`, whose results are `MigrationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`migration` is nested under `/orgs/{org}/migrations` in the API, so **every**
`migration` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: migration <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `migration` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `migration`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created `migration`; the API declares no update operation. |
| `remove$(q)` | `owner`, `repo`, `id`, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `assignees_url` | string |  |
| `blobs_url` | string |  |
| `branches_url` | string |  |
| `code_of_conduct` | object |  |
| `collaborators_url` | string |  |
| `comments_url` | string |  |
| `commits_url` | string |  |
| `compare_url` | string |  |
| `contents_url` | string |  |
| `contributors_url` | string |  |
| `created_at` | string |  |
| `deployments_url` | string |  |
| `description` | string |  |
| `downloads_url` | string |  |
| `events_url` | string |  |
| `exclude_attachments` | boolean |  |
| `exclude_git_data` | boolean |  |
| `exclude_metadata` | boolean |  |
| `exclude_owner_projects` | boolean |  |
| `exclude_releases` | boolean |  |
| `fork` | boolean |  |
| `forks_url` | string |  |
| `full_name` | string |  |
| `git_commits_url` | string |  |
| `git_refs_url` | string |  |
| `git_tags_url` | string |  |
| `guid` | string |  |
| `hooks_url` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `issue_comment_url` | string |  |
| `issue_events_url` | string |  |
| `issues_url` | string |  |
| `keys_url` | string |  |
| `labels_url` | string |  |
| `languages_url` | string |  |
| `lock_repositories` | boolean |  |
| `merges_url` | string |  |
| `milestones_url` | string |  |
| `name` | string |  |
| `node_id` | string |  |
| `notifications_url` | string |  |
| `org_metadata_only` | boolean |  |
| `owner` | object | Parent key. Required by every command. |
| `private` | boolean |  |
| `pulls_url` | string |  |
| `releases_url` | string |  |
| `repositories` | array |  |
| `stargazers_url` | string |  |
| `state` | string |  |
| `statuses_url` | string |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `tags_url` | string |  |
| `teams_url` | string |  |
| `trees_url` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const migrations = await seneca
  .entity('provider/github/migration')
  .list$({ owner: '...', repo: '...' })
const migration = await seneca
  .entity('provider/github/migration')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/milestone`

Backed by `sdk.Milestone()`, whose results are `MilestoneEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`milestone` is nested under `/repos/{owner}/{repo}/milestones` in the API, so **every**
`milestone` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: milestone <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `milestone` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `milestone`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created or updated `milestone`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `closed_at` | string |  |
| `closed_issues` | number |  |
| `created_at` | string |  |
| `creator` | object |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `labels_url` | string |  |
| `login` | string |  |
| `node_id` | string |  |
| `number` | number |  |
| `open_issues` | number |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `title` | string |  |
| `type` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const milestones = await seneca
  .entity('provider/github/milestone')
  .list$({ owner: '...', repo: '...' })
const milestone = await seneca
  .entity('provider/github/milestone')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/minimal_repository`

Backed by `sdk.MinimalRepository()`, whose results are `MinimalRepositoryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `minimal_repository` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `archive_url` | string |  |
| `assignees_url` | string |  |
| `blobs_url` | string |  |
| `branches_url` | string |  |
| `code_of_conduct` | object |  |
| `collaborators_url` | string |  |
| `comments_url` | string |  |
| `commits_url` | string |  |
| `compare_url` | string |  |
| `contents_url` | string |  |
| `contributors_url` | string |  |
| `deployments_url` | string |  |
| `description` | string |  |
| `downloads_url` | string |  |
| `events_url` | string |  |
| `fork` | boolean |  |
| `forks_url` | string |  |
| `full_name` | string |  |
| `git_commits_url` | string |  |
| `git_refs_url` | string |  |
| `git_tags_url` | string |  |
| `hooks_url` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `issue_comment_url` | string |  |
| `issue_events_url` | string |  |
| `issues_url` | string |  |
| `keys_url` | string |  |
| `labels_url` | string |  |
| `languages_url` | string |  |
| `merges_url` | string |  |
| `milestones_url` | string |  |
| `name` | string |  |
| `node_id` | string |  |
| `notifications_url` | string |  |
| `owner` | object |  |
| `private` | boolean |  |
| `pulls_url` | string |  |
| `releases_url` | string |  |
| `stargazers_url` | string |  |
| `statuses_url` | string |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `tags_url` | string |  |
| `teams_url` | string |  |
| `trees_url` | string |  |
| `url` | string |  |

```js
const minimal_repositorys = await seneca
  .entity('provider/github/minimal_repository')
  .list$()
```

### `provider/github/network_configuration`

Backed by `sdk.NetworkConfiguration()`, whose results are `NetworkConfigurationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`network_configuration` is nested under `/orgs/{org}/settings/network-configurations/{network_configuration_id}` in the API, so **every**
`network_configuration` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: network_configuration <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `org_id` and `id`, both **required** | One `network_configuration`, or `null` if not found. |
| `save$()` | entity data, including `org_id` | Created or updated `network_configuration`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_on` | string |  |
| `id` | string | Id field. |
| `name` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const network_configuration = await seneca
  .entity('provider/github/network_configuration')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/network_setting`

Backed by `sdk.NetworkSetting()`, whose results are `NetworkSettingEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`network_setting` is nested under `/orgs/{org}/settings/network-settings/{network_settings_id}` in the API, so **every**
`network_setting` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: network_setting <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `org_id` and `id`, both **required** | One `network_setting`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `id` | string | Id field. |
| `name` | string |  |
| `region` | string |  |
| `subnet_id` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const network_setting = await seneca
  .entity('provider/github/network_setting')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/oidc_custom_sub`

Backed by `sdk.OidcCustomSub()`, whose results are `OidcCustomSubEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`oidc_custom_sub` is nested under `/orgs/{org}/actions/oidc/customization/sub` in the API, so **every**
`oidc_custom_sub` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: oidc_custom_sub <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `oidc_custom_sub` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `include_claim_keys` | array |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const oidc_custom_subs = await seneca
  .entity('provider/github/oidc_custom_sub')
  .list$({ org_id: '...' })
```

### `provider/github/oidc_custom_sub_repo`

Backed by `sdk.OidcCustomSubRepo()`, whose results are `OidcCustomSubRepoEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`oidc_custom_sub_repo` is nested under `/repos/{owner}/{repo}/actions/oidc/customization/sub` in the API, so **every**
`oidc_custom_sub_repo` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: oidc_custom_sub_repo <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `oidc_custom_sub_repo` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `use_default` | boolean |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const oidc_custom_sub_repos = await seneca
  .entity('provider/github/oidc_custom_sub_repo')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/org`

Backed by `sdk.Org()`, whose results are `OrgEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`org` is nested under `/user/memberships/orgs` in the API, so **every**
`org` command requires `enablement`, `org`, `security_product` and `username`. Omitting one throws —
`@seneca/github-provider: org <cmd>: enablement is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `enablement`, `org`, `security_product`, `username`, all **required**, plus optional match fields | Array of `org` entities. |
| `load$(q)` | `enablement`, `org`, `security_product`, `username`, `id`, all **required** | One `org`, or `null` if not found. |
| `save$()` | entity data, including `enablement`, `org`, `security_product` and `username` | Created or updated `org`. |
| `remove$(q)` | `enablement`, `org`, `security_product`, `username`, `id`, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `access_tokens_url` | string |  |
| `account` | string |  |
| `action` | string |  |
| `app_id` | number |  |
| `app_slug` | string |  |
| `avatar_url` | string |  |
| `created_at` | string |  |
| `digest` | string |  |
| `events` | array |  |
| `events_url` | string |  |
| `hooks_url` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `issues_url` | string |  |
| `login` | string |  |
| `members_url` | string |  |
| `name` | string |  |
| `node_id` | string |  |
| `organization` | object |  |
| `organization_url` | string |  |
| `pat_ids` | array |  |
| `permissions` | object |  |
| `private_repos` | number |  |
| `properties` | array |  |
| `public_members_url` | string |  |
| `registry_url` | string |  |
| `repos_url` | string |  |
| `repositories_url` | string |  |
| `repository_names` | array |  |
| `repository_selection` | string |  |
| `role` | string |  |
| `single_file_name` | string |  |
| `space` | number |  |
| `state` | string |  |
| `subject_digests` | array |  |
| `suspended_at` | string |  |
| `suspended_by` | object |  |
| `target_id` | number |  |
| `target_type` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `user` | object |  |
| `enablement` | string | Parent key. Required by every command. |
| `org` | string | Parent key: the id of a `org`. Required by every command. |
| `security_product` | string | Parent key. Required by every command. |
| `username` | string | Parent key. Required by every command. |

```js
const orgs = await seneca
  .entity('provider/github/org')
  .list$({ enablement: '...', org: '...', security_product: '...', username: '...' })
const org = await seneca
  .entity('provider/github/org')
  .load$({ enablement: '...', org: '...', security_product: '...', username: '...', id: '...' })
```

### `provider/github/org_hook`

Backed by `sdk.OrgHook()`, whose results are `OrgHookEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`org_hook` is nested under `/orgs/{org}/hooks` in the API, so **every**
`org_hook` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: org_hook <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `org_hook` entities. |
| `load$(q)` | `org_id` and `id`, both **required** | One `org_hook`, or `null` if not found. |
| `save$()` | entity data, including `org_id` | Created or updated `org_hook`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `active` | boolean |  |
| `config` | object |  |
| `created_at` | string |  |
| `events` | array |  |
| `id` | number | Id field. |
| `name` | string |  |
| `ping_url` | string |  |
| `type` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const org_hooks = await seneca
  .entity('provider/github/org_hook')
  .list$({ org_id: '...' })
const org_hook = await seneca
  .entity('provider/github/org_hook')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/org_membership`

Backed by `sdk.OrgMembership()`, whose results are `OrgMembershipEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`org_membership` is nested under `/orgs/{org}/memberships/{username}` in the API, so **every**
`org_membership` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: org_membership <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `org_id` and `id`, both **required** | One `org_membership`, or `null` if not found. |
| `save$()` | entity data, including `org_id` | Updated `org_membership`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `organization` | object |  |
| `organization_url` | string |  |
| `permissions` | object |  |
| `role` | string |  |
| `state` | string |  |
| `url` | string |  |
| `user` | object |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const org_membership = await seneca
  .entity('provider/github/org_membership')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/org_private_registry_configuration`

Backed by `sdk.OrgPrivateRegistryConfiguration()`, whose results are `OrgPrivateRegistryConfigurationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`org_private_registry_configuration` is nested under `/orgs/{org}/private-registries/{secret_name}` in the API, so **every**
`org_private_registry_configuration` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: org_private_registry_configuration <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `org_id` and `null`, both **required** | One `org_private_registry_configuration`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `name` | string |  |
| `registry_type` | string |  |
| `updated_at` | string |  |
| `visibility` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const org_private_registry_configuration = await seneca
  .entity('provider/github/org_private_registry_configuration')
  .load$({ org_id: '...', null: '...' })
```

### `provider/github/org_private_registry_configuration_with_selected_repository`

Backed by `sdk.OrgPrivateRegistryConfigurationWithSelectedRepository()`, whose results are `OrgPrivateRegistryConfigurationWithSelectedRepositoryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data | Created `org_private_registry_configuration_with_selected_repository`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `encrypted_value` | string |  |
| `key_id` | string |  |
| `registry_type` | string |  |
| `url` | string |  |
| `visibility` | string |  |

### `provider/github/org_repo_custom_property_value`

Backed by `sdk.OrgRepoCustomPropertyValue()`, whose results are `OrgRepoCustomPropertyValueEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`org_repo_custom_property_value` is nested under `/orgs/{org}/properties/values` in the API, so **every**
`org_repo_custom_property_value` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: org_repo_custom_property_value <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `org_repo_custom_property_value` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `properties` | array |  |
| `repository_full_name` | string |  |
| `repository_id` | number |  |
| `repository_name` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const org_repo_custom_property_values = await seneca
  .entity('provider/github/org_repo_custom_property_value')
  .list$({ org_id: '...' })
```

### `provider/github/organization_actions_secret`

Backed by `sdk.OrganizationActionsSecret()`, whose results are `OrganizationActionsSecretEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`organization_actions_secret` is nested under `/orgs/{org}/actions/secrets/{secret_name}` in the API, so **every**
`organization_actions_secret` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: organization_actions_secret <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `org_id` and `id`, both **required** | One `organization_actions_secret`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `name` | string |  |
| `updated_at` | string |  |
| `visibility` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const organization_actions_secret = await seneca
  .entity('provider/github/organization_actions_secret')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/organization_actions_variable`

Backed by `sdk.OrganizationActionsVariable()`, whose results are `OrganizationActionsVariableEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`organization_actions_variable` is nested under `/orgs/{org}/actions/variables/{name}` in the API, so **every**
`organization_actions_variable` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: organization_actions_variable <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `org_id` and `id`, both **required** | One `organization_actions_variable`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `name` | string |  |
| `updated_at` | string |  |
| `value` | string |  |
| `visibility` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const organization_actions_variable = await seneca
  .entity('provider/github/organization_actions_variable')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/organization_dependabot_secret`

Backed by `sdk.OrganizationDependabotSecret()`, whose results are `OrganizationDependabotSecretEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`organization_dependabot_secret` is nested under `/orgs/{org}/dependabot/secrets/{secret_name}` in the API, so **every**
`organization_dependabot_secret` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: organization_dependabot_secret <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `org_id` and `id`, both **required** | One `organization_dependabot_secret`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `name` | string |  |
| `updated_at` | string |  |
| `visibility` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const organization_dependabot_secret = await seneca
  .entity('provider/github/organization_dependabot_secret')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/organization_invitation`

Backed by `sdk.OrganizationInvitation()`, whose results are `OrganizationInvitationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`organization_invitation` is nested under `/orgs/{org}/invitations` in the API, so **every**
`organization_invitation` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: organization_invitation <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `organization_invitation` entities. |
| `save$()` | entity data, including `org_id` | Created `organization_invitation`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `id` | number |  |
| `invitation_teams_url` | string |  |
| `inviter` | object |  |
| `login` | string |  |
| `node_id` | string |  |
| `team_count` | number |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const organization_invitations = await seneca
  .entity('provider/github/organization_invitation')
  .list$({ org_id: '...' })
```

### `provider/github/organization_programmatic_access_grant`

Backed by `sdk.OrganizationProgrammaticAccessGrant()`, whose results are `OrganizationProgrammaticAccessGrantEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`organization_programmatic_access_grant` is nested under `/orgs/{org}/personal-access-token-requests` in the API, so **every**
`organization_programmatic_access_grant` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: organization_programmatic_access_grant <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `organization_programmatic_access_grant` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `access_granted_at` | string |  |
| `created_at` | string |  |
| `id` | number |  |
| `owner` | object |  |
| `permissions` | object |  |
| `reason` | string |  |
| `repositories_url` | string |  |
| `repository_selection` | string |  |
| `token_expired` | boolean |  |
| `token_expires_at` | string |  |
| `token_id` | number |  |
| `token_last_used_at` | string |  |
| `token_name` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const organization_programmatic_access_grants = await seneca
  .entity('provider/github/organization_programmatic_access_grant')
  .list$({ org_id: '...' })
```

### `provider/github/organization_role`

Backed by `sdk.OrganizationRole()`, whose results are `OrganizationRoleEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`organization_role` is nested under `/orgs/{org}/organization-roles/{role_id}` in the API, so **every**
`organization_role` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: organization_role <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `org_id` and `id`, both **required** | One `organization_role`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `id` | number | Id field. |
| `name` | string |  |
| `organization` | object |  |
| `permissions` | array |  |
| `updated_at` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const organization_role = await seneca
  .entity('provider/github/organization_role')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/organization_secret_scanning_alert`

Backed by `sdk.OrganizationSecretScanningAlert()`, whose results are `OrganizationSecretScanningAlertEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`organization_secret_scanning_alert` is nested under `/orgs/{org}/secret-scanning/alerts` in the API, so **every**
`organization_secret_scanning_alert` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: organization_secret_scanning_alert <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `organization_secret_scanning_alert` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `push_protection_bypass_request_reviewer` | object |  |
| `push_protection_bypassed_by` | object |  |
| `repository` | object |  |
| `resolved_by` | object |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const organization_secret_scanning_alerts = await seneca
  .entity('provider/github/organization_secret_scanning_alert')
  .list$({ org_id: '...' })
```

### `provider/github/outside_collaborator`

Backed by `sdk.OutsideCollaborator()`, whose results are `OutsideCollaboratorEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`outside_collaborator` is nested under `/orgs/{org}/outside_collaborators` in the API, so **every**
`outside_collaborator` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: outside_collaborator <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `outside_collaborator` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const outside_collaborators = await seneca
  .entity('provider/github/outside_collaborator')
  .list$({ org_id: '...' })
```

### `provider/github/package`

Backed by `sdk.Package()`, whose results are `PackageEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`package` is nested under `/orgs/{org}/packages/{package_type}/{package_name}/versions` in the API, so **every**
`package` command requires `package_id` and `package_type`. Omitting one throws —
`@seneca/github-provider: package <cmd>: package_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `package_id` and `package_type`, both **required**, plus optional match fields | Array of `package` entities. |
| `load$(q)` | `package_id`, `package_type`, ``, all **required** | One `package`, or `null` if not found. |
| `save$()` | entity data, including `package_id` and `package_type` | Created `package`; the API declares no update operation. |
| `remove$(q)` | `package_id`, `package_type`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `container` | object |  |
| `created_at` | string |  |
| `docker` | object |  |
| `github_id` | number |  |
| `html_url` | string |  |
| `id` | string |  |
| `included_gigabytes_bandwidth` | number |  |
| `metadata` | object |  |
| `name` | string |  |
| `owner` | object |  |
| `package_html_url` | string |  |
| `package_type` | string | Parent key. Required by every command. |
| `repository` | object |  |
| `total_gigabytes_bandwidth_used` | number |  |
| `total_paid_gigabytes_bandwidth_used` | number |  |
| `updated_at` | string |  |
| `url` | string |  |
| `version_count` | number |  |
| `visibility` | string |  |
| `package_id` | string | Parent key: the id of a `package`. Required by every command. |

```js
const packages = await seneca
  .entity('provider/github/package')
  .list$({ package_id: '...', package_type: '...' })
const package = await seneca
  .entity('provider/github/package')
  .load$({ package_id: '...', package_type: '...', null: '...' })
```

### `provider/github/page`

Backed by `sdk.Page()`, whose results are `PageEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`page` is nested under `/repos/{owner}/{repo}/pages` in the API, so **every**
`page` command requires `owner`. Omitting one throws —
`@seneca/github-provider: page <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner` and `null`, both **required** | One `page`, or `null` if not found. |
| `save$()` | entity data, including `owner` | Created `page`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `cname` | string |  |
| `custom_404` | boolean |  |
| `https_certificate` | object |  |
| `public` | boolean |  |
| `source` | object |  |
| `status` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |

```js
const page = await seneca
  .entity('provider/github/page')
  .load$({ owner: '...', null: '...' })
```

### `provider/github/page_build`

Backed by `sdk.PageBuild()`, whose results are `PageBuildEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`page_build` is nested under `/repos/{owner}/{repo}/pages/builds` in the API, so **every**
`page_build` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: page_build <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `page_build` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `page_build`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `commit` | string |  |
| `created_at` | string |  |
| `duration` | number |  |
| `error` | object |  |
| `pusher` | object |  |
| `status` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const page_builds = await seneca
  .entity('provider/github/page_build')
  .list$({ owner: '...', repo: '...' })
const page_build = await seneca
  .entity('provider/github/page_build')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/page_build_status`

Backed by `sdk.PageBuildStatus()`, whose results are `PageBuildStatusEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`page_build_status` is nested under `/repos/{owner}/{repo}/pages/builds` in the API, so **every**
`page_build_status` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: page_build_status <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Created `page_build_status`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/page_deployment`

Backed by `sdk.PageDeployment()`, whose results are `PageDeploymentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`page_deployment` is nested under `/repos/{owner}/{repo}/pages/deployments` in the API, so **every**
`page_deployment` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: page_deployment <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Created `page_deployment`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `oidc_token` | string |  |
| `pages_build_version` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/pages_deployment_status`

Backed by `sdk.PagesDeploymentStatus()`, whose results are `PagesDeploymentStatusEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`pages_deployment_status` is nested under `/repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}` in the API, so **every**
`pages_deployment_status` command requires `deployment_id`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: pages_deployment_status <cmd>: deployment_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `deployment_id`, `owner`, `repo`, ``, all **required** | One `pages_deployment_status`, or `null` if not found. |
| `save$()` | entity data, including `deployment_id`, `owner` and `repo` | Created `pages_deployment_status`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `deployment_id` | string | Parent key: the id of a `deployment`. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const pages_deployment_status = await seneca
  .entity('provider/github/pages_deployment_status')
  .load$({ deployment_id: '...', owner: '...', repo: '...', null: '...' })
```

### `provider/github/pages_health_check`

Backed by `sdk.PagesHealthCheck()`, whose results are `PagesHealthCheckEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`pages_health_check` is nested under `/repos/{owner}/{repo}/pages/health` in the API, so **every**
`pages_health_check` command requires `owner`. Omitting one throws —
`@seneca/github-provider: pages_health_check <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner` and `null`, both **required** | One `pages_health_check`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |

```js
const pages_health_check = await seneca
  .entity('provider/github/pages_health_check')
  .load$({ owner: '...', null: '...' })
```

### `provider/github/participation`

Backed by `sdk.Participation()`, whose results are `ParticipationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`participation` is nested under `/repos/{owner}/{repo}/stats/participation` in the API, so **every**
`participation` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: participation <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `participation` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `all` | array |  |
| `owner` | array | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const participations = await seneca
  .entity('provider/github/participation')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/pending_deployment`

Backed by `sdk.PendingDeployment()`, whose results are `PendingDeploymentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`pending_deployment` is nested under `/repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments` in the API, so **every**
`pending_deployment` command requires `owner`, `repo` and `run_id`. Omitting one throws —
`@seneca/github-provider: pending_deployment <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner`, `repo`, `run_id`, all **required**, plus optional match fields | Array of `pending_deployment` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `current_user_can_approve` | boolean |  |
| `environment` | object |  |
| `reviewers` | array |  |
| `wait_timer` | number |  |
| `wait_timer_started_at` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |
| `run_id` | string | Parent key. Required by every command. |

```js
const pending_deployments = await seneca
  .entity('provider/github/pending_deployment')
  .list$({ owner: '...', repo: '...', run_id: '...' })
```

### `provider/github/porter_author`

Backed by `sdk.PorterAuthor()`, whose results are `PorterAuthorEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`porter_author` is nested under `/repos/{owner}/{repo}/import/authors` in the API, so **every**
`porter_author` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: porter_author <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `porter_author` entities. |
| `save$()` | entity data, including `owner` and `repo` | Updated `porter_author`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `email` | string |  |
| `id` | number |  |
| `import_url` | string |  |
| `name` | string |  |
| `remote_id` | string |  |
| `remote_name` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const porter_authors = await seneca
  .entity('provider/github/porter_author')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/porter_large_file`

Backed by `sdk.PorterLargeFile()`, whose results are `PorterLargeFileEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`porter_large_file` is nested under `/repos/{owner}/{repo}/import/large_files` in the API, so **every**
`porter_large_file` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: porter_large_file <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `porter_large_file` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `oid` | string |  |
| `path` | string |  |
| `ref_name` | string |  |
| `size` | number |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const porter_large_files = await seneca
  .entity('provider/github/porter_large_file')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/private_registry`

Backed by `sdk.PrivateRegistry()`, whose results are `PrivateRegistryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `private_registry` entities. |
| `load$(q)` | `` **required** | One `private_registry`, or `null` if not found. |
| `save$()` | entity data | Updated `private_registry`; the API declares no create operation. |
| `remove$(q)` | `` **required** | `null`. |

This entity is keyed by `null` rather than `id`, so the short
forms `load$('...')` and `remove$('...')` do not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `key` | string |  |
| `key_id` | string |  |
| `name` | string |  |
| `updated_at` | string |  |

```js
const private_registrys = await seneca
  .entity('provider/github/private_registry')
  .list$()
const private_registry = await seneca
  .entity('provider/github/private_registry')
  .load$({ null: '...' })
```

### `provider/github/project`

Backed by `sdk.Project()`, whose results are `ProjectEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`project` is nested under `/repos/{owner}/{repo}/projects` in the API, so **every**
`project` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: project <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `project` entities. |
| `load$(q)` | `org_id` and `id`, both **required** | One `project`, or `null` if not found. |
| `save$()` | entity data, including `org_id` | Created or updated `project`. |
| `remove$(q)` | `org_id` and `id`, both **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `columns_url` | string |  |
| `created_at` | string |  |
| `creator` | object |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `login` | string |  |
| `node_id` | string |  |
| `number` | number |  |
| `organizations_url` | string |  |
| `owner_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const projects = await seneca
  .entity('provider/github/project')
  .list$({ org_id: '...' })
const project = await seneca
  .entity('provider/github/project')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/project_collaborator_permission`

Backed by `sdk.ProjectCollaboratorPermission()`, whose results are `ProjectCollaboratorPermissionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`project_collaborator_permission` is nested under `/projects/{project_id}/collaborators/{username}/permission` in the API, so **every**
`project_collaborator_permission` command requires `project_id`. Omitting one throws —
`@seneca/github-provider: project_collaborator_permission <cmd>: project_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `project_id` and `null`, both **required** | One `project_collaborator_permission`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |
| `project_id` | string | Parent key: the id of a `project`. Required by every command. |

```js
const project_collaborator_permission = await seneca
  .entity('provider/github/project_collaborator_permission')
  .load$({ project_id: '...', null: '...' })
```

### `provider/github/project_column`

Backed by `sdk.ProjectColumn()`, whose results are `ProjectColumnEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `project_column` entities. |
| `load$(q)` | `id` **required** | One `project_column`, or `null` if not found. |
| `save$()` | entity data | Created or updated `project_column`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `cards_url` | string |  |
| `created_at` | string |  |
| `id` | number | Id field. |
| `name` | string |  |
| `node_id` | string |  |
| `project_url` | string |  |
| `updated_at` | string |  |
| `url` | string |  |

```js
const project_columns = await seneca
  .entity('provider/github/project_column')
  .list$()
const project_column = await seneca
  .entity('provider/github/project_column')
  .load$('...')
```

### `provider/github/projects_classic`

Backed by `sdk.ProjectsClassic()`, whose results are `ProjectsClassicEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`projects_classic` is nested under `/projects/columns/{column_id}/moves` in the API, so **every**
`projects_classic` command requires `project_id` and `username`. Omitting one throws —
`@seneca/github-provider: projects_classic <cmd>: project_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `project_id` and `username` | Created or updated `projects_classic`. |
| `remove$(q)` | `project_id`, `username`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `position` | string |  |
| `project_id` | string | Parent key: the id of a `project`. Required by every command. |
| `username` | string | Parent key. Required by every command. |

### `provider/github/projects_v2`

Backed by `sdk.ProjectsV2()`, whose results are `ProjectsV2Entity` instances; the
provider hands Seneca the plain record from `.data()`.

`projects_v2` is nested under `/orgs/{org}/projectsV2` in the API, so **every**
`projects_v2` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: projects_v2 <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `projects_v2` entities. |
| `load$(q)` | `org_id` and `id`, both **required** | One `projects_v2`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `closed_at` | string |  |
| `created_at` | string |  |
| `creator` | object |  |
| `deleted_at` | string |  |
| `deleted_by` | object |  |
| `description` | string |  |
| `id` | number | Id field. |
| `latest_status_update` | object |  |
| `node_id` | string |  |
| `number` | number |  |
| `owner` | object |  |
| `public` | boolean |  |
| `short_description` | string |  |
| `title` | string |  |
| `updated_at` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const projects_v2s = await seneca
  .entity('provider/github/projects_v2')
  .list$({ org_id: '...' })
const projects_v2 = await seneca
  .entity('provider/github/projects_v2')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/projects_v2_field`

Backed by `sdk.ProjectsV2Field()`, whose results are `ProjectsV2FieldEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`projects_v2_field` is nested under `/orgs/{org}/projectsV2/{project_number}/fields` in the API, so **every**
`projects_v2_field` command requires `project_number` and `projects_v2_id`. Omitting one throws —
`@seneca/github-provider: projects_v2_field <cmd>: project_number is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `project_number` and `projects_v2_id`, both **required**, plus optional match fields | Array of `projects_v2_field` entities. |
| `load$(q)` | `project_number`, `projects_v2_id`, `id`, all **required** | One `projects_v2_field`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `data_type` | string |  |
| `id` | number | Id field. |
| `name` | string |  |
| `project_url` | string |  |
| `updated_at` | string |  |
| `project_number` | string | Parent key. Required by every command. |
| `projects_v2_id` | string | Parent key: the id of a `projects_v2`. Required by every command. |

```js
const projects_v2_fields = await seneca
  .entity('provider/github/projects_v2_field')
  .list$({ project_number: '...', projects_v2_id: '...' })
const projects_v2_field = await seneca
  .entity('provider/github/projects_v2_field')
  .load$({ project_number: '...', projects_v2_id: '...', id: '...' })
```

### `provider/github/projects_v2_item_simple`

Backed by `sdk.ProjectsV2ItemSimple()`, whose results are `ProjectsV2ItemSimpleEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`projects_v2_item_simple` is nested under `/orgs/{org}/projectsV2/{project_number}/items` in the API, so **every**
`projects_v2_item_simple` command requires `project_number`. Omitting one throws —
`@seneca/github-provider: projects_v2_item_simple <cmd>: project_number is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `project_number` | Created `projects_v2_item_simple`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `id` | number |  |
| `type` | string |  |
| `project_number` | string | Parent key. Required by every command. |

### `provider/github/projects_v2_item_with_content`

Backed by `sdk.ProjectsV2ItemWithContent()`, whose results are `ProjectsV2ItemWithContentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`projects_v2_item_with_content` is nested under `/orgs/{org}/projectsV2/{project_number}/items` in the API, so **every**
`projects_v2_item_with_content` command requires `project_number` and `projects_v2_id`. Omitting one throws —
`@seneca/github-provider: projects_v2_item_with_content <cmd>: project_number is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `project_number` and `projects_v2_id`, both **required**, plus optional match fields | Array of `projects_v2_item_with_content` entities. |
| `load$(q)` | `project_number`, `projects_v2_id`, ``, all **required** | One `projects_v2_item_with_content`, or `null` if not found. |
| `save$()` | entity data, including `project_number` and `projects_v2_id` | Updated `projects_v2_item_with_content`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `archived_at` | string |  |
| `content_type` | string |  |
| `created_at` | string |  |
| `creator` | object |  |
| `id` | number |  |
| `updated_at` | string |  |
| `project_number` | string | Parent key. Required by every command. |
| `projects_v2_id` | string | Parent key: the id of a `projects_v2`. Required by every command. |

```js
const projects_v2_item_with_contents = await seneca
  .entity('provider/github/projects_v2_item_with_content')
  .list$({ project_number: '...', projects_v2_id: '...' })
const projects_v2_item_with_content = await seneca
  .entity('provider/github/projects_v2_item_with_content')
  .load$({ project_number: '...', projects_v2_id: '...', null: '...' })
```

### `provider/github/protected_branch`

Backed by `sdk.ProtectedBranch()`, whose results are `ProtectedBranchEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`protected_branch` is nested under `/repos/{owner}/{repo}/branches/{branch}/protection` in the API, so **every**
`protected_branch` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: protected_branch <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Updated `protected_branch`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `allow_deletions` | object |  |
| `allow_force_pushes` | object |  |
| `block_creations` | object |  |
| `enforce_admins` | object |  |
| `required_linear_history` | object |  |
| `required_pull_request_reviews` | object |  |
| `required_signatures` | object |  |
| `required_status_checks` | object |  |
| `restrictions` | object |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/protected_branch_admin_enforced`

Backed by `sdk.ProtectedBranchAdminEnforced()`, whose results are `ProtectedBranchAdminEnforcedEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`protected_branch_admin_enforced` is nested under `/repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins` in the API, so **every**
`protected_branch_admin_enforced` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: protected_branch_admin_enforced <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `protected_branch_admin_enforced`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created `protected_branch_admin_enforced`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `enabled` | boolean |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const protected_branch_admin_enforced = await seneca
  .entity('provider/github/protected_branch_admin_enforced')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/protected_branch_pull_request_review`

Backed by `sdk.ProtectedBranchPullRequestReview()`, whose results are `ProtectedBranchPullRequestReviewEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`protected_branch_pull_request_review` is nested under `/repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews` in the API, so **every**
`protected_branch_pull_request_review` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: protected_branch_pull_request_review <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `protected_branch_pull_request_review`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Updated `protected_branch_pull_request_review`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `dismiss_stale_reviews` | boolean |  |
| `require_code_owner_reviews` | boolean |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const protected_branch_pull_request_review = await seneca
  .entity('provider/github/protected_branch_pull_request_review')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/public_member`

Backed by `sdk.PublicMember()`, whose results are `PublicMemberEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`public_member` is nested under `/orgs/{org}/public_members` in the API, so **every**
`public_member` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: public_member <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `public_member` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const public_members = await seneca
  .entity('provider/github/public_member')
  .list$({ org_id: '...' })
```

### `provider/github/pull`

Backed by `sdk.Pull()`, whose results are `PullEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`pull` is nested under `/repos/{owner}/{repo}/pulls` in the API, so **every**
`pull` command requires `comment_id`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: pull <cmd>: comment_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `comment_id`, `owner`, `repo`, all **required**, plus optional match fields | Array of `pull` entities. |
| `load$(q)` | `comment_id`, `owner`, `repo`, `id`, all **required** | One `pull`, or `null` if not found. |
| `save$()` | entity data, including `comment_id`, `owner` and `repo` | Created or updated `pull`. |
| `remove$(q)` | `comment_id`, `owner`, `repo`, `id`, all **required** | `null`. |

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
| `state` | string |  |
| `statuses_url` | string |  |
| `title` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `user` | object |  |
| `comment_id` | string | Parent key. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const pulls = await seneca
  .entity('provider/github/pull')
  .list$({ comment_id: '...', owner: '...', repo: '...' })
const pull = await seneca
  .entity('provider/github/pull')
  .load$({ comment_id: '...', owner: '...', repo: '...', id: '...' })
```

### `provider/github/pull_request_review`

Backed by `sdk.PullRequestReview()`, whose results are `PullRequestReviewEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`pull_request_review` is nested under `/repos/{owner}/{repo}/pulls/{pull_number}/reviews` in the API, so **every**
`pull_request_review` command requires `owner`, `pull_id`, `pull_number` and `repo`. Omitting one throws —
`@seneca/github-provider: pull_request_review <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner`, `pull_id`, `pull_number`, `repo`, all **required**, plus optional match fields | Array of `pull_request_review` entities. |
| `load$(q)` | `owner`, `pull_id`, `pull_number`, `repo`, `id`, all **required** | One `pull_request_review`, or `null` if not found. |
| `save$()` | entity data, including `owner`, `pull_id`, `pull_number` and `repo` | Created or updated `pull_request_review`. |
| `remove$(q)` | `owner`, `pull_id`, `pull_number`, `repo`, `id`, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `author_association` | string |  |
| `body` | string |  |
| `commit_id` | string |  |
| `event` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `links` | object |  |
| `message` | string |  |
| `node_id` | string |  |
| `pull_request_url` | string |  |
| `state` | string |  |
| `teams` | array |  |
| `user` | object |  |
| `users` | array |  |
| `owner` | string | Parent key. Required by every command. |
| `pull_id` | string | Parent key: the id of a `pull`. Required by every command. |
| `pull_number` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const pull_request_reviews = await seneca
  .entity('provider/github/pull_request_review')
  .list$({ owner: '...', pull_id: '...', pull_number: '...', repo: '...' })
const pull_request_review = await seneca
  .entity('provider/github/pull_request_review')
  .load$({ owner: '...', pull_id: '...', pull_number: '...', repo: '...', id: '...' })
```

### `provider/github/pull_request_review_comment`

Backed by `sdk.PullRequestReviewComment()`, whose results are `PullRequestReviewCommentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`pull_request_review_comment` is nested under `/repos/{owner}/{repo}/pulls/{pull_number}/comments` in the API, so **every**
`pull_request_review_comment` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: pull_request_review_comment <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `pull_request_review_comment` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `pull_request_review_comment`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created or updated `pull_request_review_comment`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `author_association` | string |  |
| `body` | string |  |
| `commit_id` | string |  |
| `created_at` | string |  |
| `diff_hunk` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `links` | object |  |
| `node_id` | string |  |
| `original_commit_id` | string |  |
| `path` | string |  |
| `pull_request_review_id` | number |  |
| `pull_request_url` | string |  |
| `reactions` | object |  |
| `updated_at` | string |  |
| `url` | string |  |
| `user` | object |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const pull_request_review_comments = await seneca
  .entity('provider/github/pull_request_review_comment')
  .list$({ owner: '...', repo: '...' })
const pull_request_review_comment = await seneca
  .entity('provider/github/pull_request_review_comment')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/pull_request_simple`

Backed by `sdk.PullRequestSimple()`, whose results are `PullRequestSimpleEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`pull_request_simple` is nested under `/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers` in the API, so **every**
`pull_request_simple` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: pull_request_simple <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Created `pull_request_simple`; the API declares no update operation. |
| `remove$(q)` | `owner`, `repo`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/rate_limit`

Backed by `sdk.RateLimit()`, whose results are `RateLimitEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `rate_limit`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `rate` | object |  |
| `resources` | object |  |

```js
const rate_limit = await seneca
  .entity('provider/github/rate_limit')
  .load$({ null: '...' })
```

### `provider/github/reaction`

Backed by `sdk.Reaction()`, whose results are `ReactionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`reaction` is nested under `/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions` in the API, so **every**
`reaction` command requires `discussion_number` and `team_id`. Omitting one throws —
`@seneca/github-provider: reaction <cmd>: discussion_number is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `discussion_number` and `team_id`, both **required**, plus optional match fields | Array of `reaction` entities. |
| `save$()` | entity data, including `discussion_number` and `team_id` | Created `reaction`; the API declares no update operation. |
| `remove$(q)` | `discussion_number`, `team_id`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `content` | string |  |
| `created_at` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |
| `user` | object |  |
| `discussion_number` | string | Parent key. Required by every command. |
| `team_id` | string | Parent key: the id of a `team`. Required by every command. |

```js
const reactions = await seneca
  .entity('provider/github/reaction')
  .list$({ discussion_number: '...', team_id: '...' })
```

### `provider/github/referrer`

Backed by `sdk.Referrer()`, whose results are `ReferrerEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`referrer` is nested under `/repos/{owner}/{repo}/traffic/popular/referrers` in the API, so **every**
`referrer` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: referrer <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `referrer` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `count` | number |  |
| `referrer` | string |  |
| `uniques` | number |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const referrers = await seneca
  .entity('provider/github/referrer')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/release`

Backed by `sdk.Release()`, whose results are `ReleaseEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`release` is nested under `/repos/{owner}/{repo}/releases` in the API, so **every**
`release` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: release <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `release` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `release`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Created or updated `release`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `assets` | array |  |
| `assets_url` | string |  |
| `author` | object |  |
| `browser_download_url` | string |  |
| `content_type` | string |  |
| `created_at` | string |  |
| `digest` | string |  |
| `download_count` | number |  |
| `draft` | boolean |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `label` | string |  |
| `name` | string |  |
| `node_id` | string |  |
| `prerelease` | boolean |  |
| `published_at` | string |  |
| `reactions` | object |  |
| `size` | number |  |
| `state` | string |  |
| `tag_name` | string |  |
| `tarball_url` | string |  |
| `target_commitish` | string |  |
| `upload_url` | string |  |
| `uploader` | object |  |
| `url` | string |  |
| `zipball_url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const releases = await seneca
  .entity('provider/github/release')
  .list$({ owner: '...', repo: '...' })
const release = await seneca
  .entity('provider/github/release')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/release_asset`

Backed by `sdk.ReleaseAsset()`, whose results are `ReleaseAssetEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`release_asset` is nested under `/repos/{owner}/{repo}/releases/{release_id}/assets` in the API, so **every**
`release_asset` command requires `name`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: release_asset <cmd>: name is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `name`, `owner`, `repo`, all **required**, plus optional match fields | Array of `release_asset` entities. |
| `load$(q)` | `name`, `owner`, `repo`, `id`, all **required** | One `release_asset`, or `null` if not found. |
| `save$()` | entity data, including `name`, `owner` and `repo` | Created or updated `release_asset`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |
| `name` | string | Parent key. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const release_assets = await seneca
  .entity('provider/github/release_asset')
  .list$({ name: '...', owner: '...', repo: '...' })
const release_asset = await seneca
  .entity('provider/github/release_asset')
  .load$({ name: '...', owner: '...', repo: '...', id: '...' })
```

### `provider/github/release_notes_content`

Backed by `sdk.ReleaseNotesContent()`, whose results are `ReleaseNotesContentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`release_notes_content` is nested under `/repos/{owner}/{repo}/releases/generate-notes` in the API, so **every**
`release_notes_content` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: release_notes_content <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Created `release_notes_content`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `body` | string |  |
| `name` | string |  |
| `tag_name` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/remove`

Backed by `sdk.Remove()`, whose results are `RemoveEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`remove` is nested under `/enterprises/{enterprise}/teams/{enterprise-team}/memberships/remove` in the API, so **every**
`remove` command requires `enterprise` and `team_id`. Omitting one throws —
`@seneca/github-provider: remove <cmd>: enterprise is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `enterprise` and `team_id` | Created `remove`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `usernames` | array |  |
| `enterprise` | string | Parent key. Required by every command. |
| `team_id` | string | Parent key: the id of a `team`. Required by every command. |

### `provider/github/repo`

Backed by `sdk.Repo()`, whose results are `RepoEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`repo` is nested under `/user/repos` in the API, so **every**
`repo` command requires `branch_id`, `invitation_id`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: repo <cmd>: branch_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `branch_id`, `invitation_id`, `owner`, `repo`, all **required**, plus optional match fields | Array of `repo` entities. |
| `load$(q)` | `branch_id`, `invitation_id`, `owner`, `repo`, ``, all **required** | One `repo`, or `null` if not found. |
| `save$()` | entity data, including `branch_id`, `invitation_id`, `owner` and `repo` | Created or updated `repo`. |
| `remove$(q)` | `branch_id`, `invitation_id`, `owner`, `repo`, ``, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `app` | object |  |
| `archive_url` | string |  |
| `archived` | boolean |  |
| `assignees_url` | string |  |
| `blobs_url` | string |  |
| `branches_url` | string |  |
| `bundle` | object |  |
| `clone_url` | string |  |
| `collaborators_url` | string |  |
| `comments_url` | string |  |
| `commits_url` | string |  |
| `compare_url` | string |  |
| `contents_url` | string |  |
| `contributors_url` | string |  |
| `created_at` | string |  |
| `default_branch` | string |  |
| `deployment_branch_policy` | object |  |
| `deployments_url` | string |  |
| `description` | string |  |
| `disabled` | boolean |  |
| `downloads_url` | string |  |
| `enabled` | boolean |  |
| `event_type` | string |  |
| `events_url` | string |  |
| `fork` | boolean |  |
| `forks` | number |  |
| `forks_count` | number |  |
| `forks_url` | string |  |
| `full_name` | string |  |
| `git_commits_url` | string |  |
| `git_refs_url` | string |  |
| `git_tags_url` | string |  |
| `github_id` | number |  |
| `has_downloads` | boolean |  |
| `has_issues` | boolean |  |
| `has_pages` | boolean |  |
| `has_projects` | boolean |  |
| `has_wiki` | boolean |  |
| `homepage` | string |  |
| `hooks_url` | string |  |
| `id` | string |  |
| `integration_url` | string |  |
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
| `new_owner` | string |  |
| `node_id` | string |  |
| `notifications_url` | string |  |
| `open_issues` | number |  |
| `open_issues_count` | number |  |
| `owner` | object | Parent key. Required by every command. |
| `permissions` | object |  |
| `private` | boolean |  |
| `properties` | array |  |
| `pulls_url` | string |  |
| `pushed_at` | string |  |
| `releases_url` | string |  |
| `slug` | string |  |
| `ssh_url` | string |  |
| `stargazers_count` | number |  |
| `stargazers_url` | string |  |
| `statuses_url` | string |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `svn_url` | string |  |
| `tags_url` | string |  |
| `teams_url` | string |  |
| `trees_url` | string |  |
| `updated_at` | string |  |
| `watchers` | number |  |
| `watchers_count` | number |  |
| `branch_id` | string | Parent key: the id of a `branch`. Required by every command. |
| `invitation_id` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const repos = await seneca
  .entity('provider/github/repo')
  .list$({ branch_id: '...', invitation_id: '...', owner: '...', repo: '...' })
const repo = await seneca
  .entity('provider/github/repo')
  .load$({ branch_id: '...', invitation_id: '...', owner: '...', repo: '...', null: '...' })
```

### `provider/github/repository`

Backed by `sdk.Repository()`, whose results are `RepositoryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `repository` entities. |

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
| `has_downloads` | boolean |  |
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
| `node_id` | string |  |
| `notifications_url` | string |  |
| `open_issues` | number |  |
| `open_issues_count` | number |  |
| `owner` | object |  |
| `permissions` | object |  |
| `private` | boolean |  |
| `pulls_url` | string |  |
| `pushed_at` | string |  |
| `releases_url` | string |  |
| `size` | number |  |
| `ssh_url` | string |  |
| `stargazers_count` | number |  |
| `stargazers_url` | string |  |
| `statuses_url` | string |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `svn_url` | string |  |
| `tags_url` | string |  |
| `teams_url` | string |  |
| `trees_url` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `watchers` | number |  |
| `watchers_count` | number |  |

```js
const repositorys = await seneca
  .entity('provider/github/repository')
  .list$()
```

### `provider/github/repository_advisory`

Backed by `sdk.RepositoryAdvisory()`, whose results are `RepositoryAdvisoryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`repository_advisory` is nested under `/repos/{owner}/{repo}/security-advisories` in the API, so **every**
`repository_advisory` command requires `org_id`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: repository_advisory <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id`, `owner`, `repo`, all **required**, plus optional match fields | Array of `repository_advisory` entities. |
| `load$(q)` | `org_id`, `owner`, `repo`, ``, all **required** | One `repository_advisory`, or `null` if not found. |
| `save$()` | entity data, including `org_id`, `owner` and `repo` | Created or updated `repository_advisory`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `author` | string |  |
| `closed_at` | string |  |
| `collaborating_teams` | array |  |
| `collaborating_users` | array |  |
| `created_at` | string |  |
| `credits` | array |  |
| `credits_detailed` | array |  |
| `cve_id` | string |  |
| `cvss` | object |  |
| `cwe_ids` | array |  |
| `cwes` | array |  |
| `description` | string |  |
| `ghsa_id` | string |  |
| `html_url` | string |  |
| `identifiers` | array |  |
| `private_fork` | string |  |
| `published_at` | string |  |
| `publisher` | string |  |
| `severity` | string |  |
| `state` | string |  |
| `submission` | object |  |
| `summary` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `vulnerabilities` | array |  |
| `withdrawn_at` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const repository_advisorys = await seneca
  .entity('provider/github/repository_advisory')
  .list$({ org_id: '...', owner: '...', repo: '...' })
const repository_advisory = await seneca
  .entity('provider/github/repository_advisory')
  .load$({ org_id: '...', owner: '...', repo: '...', null: '...' })
```

### `provider/github/repository_collaborator_permission`

Backed by `sdk.RepositoryCollaboratorPermission()`, whose results are `RepositoryCollaboratorPermissionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`repository_collaborator_permission` is nested under `/repos/{owner}/{repo}/collaborators/{username}/permission` in the API, so **every**
`repository_collaborator_permission` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: repository_collaborator_permission <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `repository_collaborator_permission`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `permissions` | object |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `role_name` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const repository_collaborator_permission = await seneca
  .entity('provider/github/repository_collaborator_permission')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/repository_invitation`

Backed by `sdk.RepositoryInvitation()`, whose results are `RepositoryInvitationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`repository_invitation` is nested under `/repos/{owner}/{repo}/invitations` in the API, so **every**
`repository_invitation` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: repository_invitation <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `repository_invitation` entities. |
| `save$()` | entity data, including `owner` and `repo` | Updated `repository_invitation`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `invitee` | object |  |
| `inviter` | object |  |
| `node_id` | string |  |
| `permissions` | string |  |
| `repository` | object |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const repository_invitations = await seneca
  .entity('provider/github/repository_invitation')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/repository_rule_detailed`

Backed by `sdk.RepositoryRuleDetailed()`, whose results are `RepositoryRuleDetailedEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`repository_rule_detailed` is nested under `/repos/{owner}/{repo}/rules/branches/{branch}` in the API, so **every**
`repository_rule_detailed` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: repository_rule_detailed <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `repository_rule_detailed`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const repository_rule_detailed = await seneca
  .entity('provider/github/repository_rule_detailed')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/repository_ruleset`

Backed by `sdk.RepositoryRuleset()`, whose results are `RepositoryRulesetEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`repository_ruleset` is nested under `/repos/{owner}/{repo}/rulesets` in the API, so **every**
`repository_ruleset` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: repository_ruleset <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `repository_ruleset` entities. |
| `load$(q)` | `org_id` and `id`, both **required** | One `repository_ruleset`, or `null` if not found. |
| `save$()` | entity data, including `org_id` | Created or updated `repository_ruleset`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `enforcement` | string |  |
| `id` | number | Id field. |
| `name` | string |  |
| `source` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const repository_rulesets = await seneca
  .entity('provider/github/repository_ruleset')
  .list$({ org_id: '...' })
const repository_ruleset = await seneca
  .entity('provider/github/repository_ruleset')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/repository_subscription`

Backed by `sdk.RepositorySubscription()`, whose results are `RepositorySubscriptionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`repository_subscription` is nested under `/repos/{owner}/{repo}/subscription` in the API, so **every**
`repository_subscription` command requires `owner`. Omitting one throws —
`@seneca/github-provider: repository_subscription <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner` and `null`, both **required** | One `repository_subscription`, or `null` if not found. |
| `save$()` | entity data, including `owner` | Updated `repository_subscription`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `ignored` | boolean |  |
| `reason` | string |  |
| `repository_url` | string |  |
| `subscribed` | boolean |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |

```js
const repository_subscription = await seneca
  .entity('provider/github/repository_subscription')
  .load$({ owner: '...', null: '...' })
```

### `provider/github/review_comment`

Backed by `sdk.ReviewComment()`, whose results are `ReviewCommentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`review_comment` is nested under `/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments` in the API, so **every**
`review_comment` command requires `owner`, `pull_id` and `repo`. Omitting one throws —
`@seneca/github-provider: review_comment <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner`, `pull_id`, `repo`, all **required**, plus optional match fields | Array of `review_comment` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `author_association` | string |  |
| `body` | string |  |
| `commit_id` | string |  |
| `created_at` | string |  |
| `diff_hunk` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `links` | object |  |
| `node_id` | string |  |
| `original_commit_id` | string |  |
| `original_position` | number |  |
| `path` | string |  |
| `position` | number |  |
| `pull_request_review_id` | number |  |
| `pull_request_url` | string |  |
| `reactions` | object |  |
| `updated_at` | string |  |
| `url` | string |  |
| `user` | object |  |
| `owner` | string | Parent key. Required by every command. |
| `pull_id` | string | Parent key: the id of a `pull`. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const review_comments = await seneca
  .entity('provider/github/review_comment')
  .list$({ owner: '...', pull_id: '...', repo: '...' })
```

### `provider/github/rule_suite`

Backed by `sdk.RuleSuite()`, whose results are `RuleSuiteEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`rule_suite` is nested under `/orgs/{org}/rulesets/rule-suites` in the API, so **every**
`rule_suite` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: rule_suite <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `rule_suite` entities. |
| `load$(q)` | `org_id` and `id`, both **required** | One `rule_suite`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const rule_suites = await seneca
  .entity('provider/github/rule_suite')
  .list$({ org_id: '...' })
const rule_suite = await seneca
  .entity('provider/github/rule_suite')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/ruleset_version`

Backed by `sdk.RulesetVersion()`, whose results are `RulesetVersionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `ruleset_version` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `actor` | object |  |
| `updated_at` | string |  |
| `version_id` | number |  |

```js
const ruleset_versions = await seneca
  .entity('provider/github/ruleset_version')
  .list$()
```

### `provider/github/ruleset_version_with_state`

Backed by `sdk.RulesetVersionWithState()`, whose results are `RulesetVersionWithStateEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`ruleset_version_with_state` is nested under `/repos/{owner}/{repo}/rulesets/{ruleset_id}/history/{version_id}` in the API, so **every**
`ruleset_version_with_state` command requires `ruleset_id`. Omitting one throws —
`@seneca/github-provider: ruleset_version_with_state <cmd>: ruleset_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `ruleset_id` and `null`, both **required** | One `ruleset_version_with_state`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `actor` | object |  |
| `state` | object |  |
| `updated_at` | string |  |
| `version_id` | number |  |
| `ruleset_id` | string | Parent key. Required by every command. |

```js
const ruleset_version_with_state = await seneca
  .entity('provider/github/ruleset_version_with_state')
  .load$({ ruleset_id: '...', null: '...' })
```

### `provider/github/runner`

Backed by `sdk.Runner()`, whose results are `RunnerEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `id` **required** | One `runner`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `busy` | boolean |  |
| `id` | number | Id field. |
| `labels` | array |  |
| `name` | string |  |
| `os` | string |  |
| `status` | string |  |

```js
const runner = await seneca
  .entity('provider/github/runner')
  .load$('...')
```

### `provider/github/runner_application`

Backed by `sdk.RunnerApplication()`, whose results are `RunnerApplicationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`runner_application` is nested under `/repos/{owner}/{repo}/actions/runners/downloads` in the API, so **every**
`runner_application` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: runner_application <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `runner_application` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `architecture` | string |  |
| `download_url` | string |  |
| `filename` | string |  |
| `os` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const runner_applications = await seneca
  .entity('provider/github/runner_application')
  .list$({ org_id: '...' })
```

### `provider/github/runner_group`

Backed by `sdk.RunnerGroup()`, whose results are `RunnerGroupEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`runner_group` is nested under `/orgs/{org}/actions/runner-groups/{runner_group_id}` in the API, so **every**
`runner_group` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: runner_group <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `org_id` and `id`, both **required** | One `runner_group`, or `null` if not found. |
| `save$()` | entity data, including `org_id` | Created or updated `runner_group`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `allows_public_repositories` | boolean |  |
| `default` | boolean |  |
| `id` | number | Id field. |
| `inherited` | boolean |  |
| `name` | string |  |
| `runners_url` | string |  |
| `visibility` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const runner_group = await seneca
  .entity('provider/github/runner_group')
  .load$({ org_id: '...', id: '...' })
```

### `provider/github/search`

Backed by `sdk.Search()`, whose results are `SearchEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`search` is nested under `/search/issues` in the API, so **every**
`search` command requires `q`. Omitting one throws —
`@seneca/github-provider: search <cmd>: q is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `q` **required**, plus optional match fields | Array of `search` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `archive_url` | string |  |
| `archived` | boolean |  |
| `assignee` | object |  |
| `assignees_url` | string |  |
| `author` | object |  |
| `author_association` | string |  |
| `avatar_url` | string |  |
| `blobs_url` | string |  |
| `branches_url` | string |  |
| `clone_url` | string |  |
| `closed_at` | string |  |
| `collaborators_url` | string |  |
| `color` | string |  |
| `comments` | number |  |
| `comments_url` | string |  |
| `commit` | object |  |
| `commits_url` | string |  |
| `committer` | object |  |
| `compare_url` | string |  |
| `contents_url` | string |  |
| `contributors_url` | string |  |
| `created_at` | string |  |
| `created_by` | string |  |
| `curated` | boolean |  |
| `default` | boolean |  |
| `default_branch` | string |  |
| `deployments_url` | string |  |
| `description` | string |  |
| `disabled` | boolean |  |
| `display_name` | string |  |
| `downloads_url` | string |  |
| `events_url` | string |  |
| `featured` | boolean |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `fork` | boolean |  |
| `forks` | number |  |
| `forks_count` | number |  |
| `forks_url` | string |  |
| `full_name` | string |  |
| `gists_url` | string |  |
| `git_commits_url` | string |  |
| `git_refs_url` | string |  |
| `git_tags_url` | string |  |
| `git_url` | string |  |
| `gravatar_id` | string |  |
| `has_downloads` | boolean |  |
| `has_issues` | boolean |  |
| `has_pages` | boolean |  |
| `has_projects` | boolean |  |
| `has_wiki` | boolean |  |
| `homepage` | string |  |
| `hooks_url` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `issue_comment_url` | string |  |
| `issue_dependencies_summary` | object |  |
| `issue_events_url` | string |  |
| `issues_url` | string |  |
| `keys_url` | string |  |
| `labels` | array |  |
| `labels_url` | string |  |
| `languages_url` | string |  |
| `license` | object |  |
| `locked` | boolean |  |
| `login` | string |  |
| `merges_url` | string |  |
| `milestone` | object |  |
| `milestones_url` | string |  |
| `mirror_url` | string |  |
| `name` | string |  |
| `node_id` | string |  |
| `notifications_url` | string |  |
| `number` | number |  |
| `open_issues` | number |  |
| `open_issues_count` | number |  |
| `organizations_url` | string |  |
| `owner` | object |  |
| `parents` | array |  |
| `path` | string |  |
| `performed_via_github_app` | object |  |
| `permissions` | object |  |
| `private` | boolean |  |
| `pull_request` | object |  |
| `pulls_url` | string |  |
| `pushed_at` | string |  |
| `reactions` | object |  |
| `received_events_url` | string |  |
| `released` | string |  |
| `releases_url` | string |  |
| `repos_url` | string |  |
| `repository` | object |  |
| `repository_url` | string |  |
| `score` | number |  |
| `sha` | string |  |
| `short_description` | string |  |
| `site_admin` | boolean |  |
| `size` | number |  |
| `ssh_url` | string |  |
| `stargazers_count` | number |  |
| `stargazers_url` | string |  |
| `starred_url` | string |  |
| `state` | string |  |
| `statuses_url` | string |  |
| `sub_issues_summary` | object |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `subscriptions_url` | string |  |
| `svn_url` | string |  |
| `tags_url` | string |  |
| `teams_url` | string |  |
| `title` | string |  |
| `trees_url` | string |  |
| `type` | object |  |
| `updated_at` | string |  |
| `url` | string |  |
| `user` | object |  |
| `watchers` | number |  |
| `watchers_count` | number |  |
| `q` | string | Parent key. Required by every command. |

```js
const searchs = await seneca
  .entity('provider/github/search')
  .list$({ q: '...' })
```

### `provider/github/secret_scanning`

Backed by `sdk.SecretScanning()`, whose results are `SecretScanningEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data | Updated `secret_scanning`; the API declares no create operation. |

The API definition declares no required fields for this entity; whatever it
returns is passed through unchanged.

### `provider/github/secret_scanning_alert`

Backed by `sdk.SecretScanningAlert()`, whose results are `SecretScanningAlertEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`secret_scanning_alert` is nested under `/repos/{owner}/{repo}/secret-scanning/alerts` in the API, so **every**
`secret_scanning_alert` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: secret_scanning_alert <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `secret_scanning_alert` entities. |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `secret_scanning_alert`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Updated `secret_scanning_alert`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `push_protection_bypass_request_reviewer` | object |  |
| `push_protection_bypassed_by` | object |  |
| `resolved_by` | object |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const secret_scanning_alerts = await seneca
  .entity('provider/github/secret_scanning_alert')
  .list$({ owner: '...', repo: '...' })
const secret_scanning_alert = await seneca
  .entity('provider/github/secret_scanning_alert')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/secret_scanning_location`

Backed by `sdk.SecretScanningLocation()`, whose results are `SecretScanningLocationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`secret_scanning_location` is nested under `/repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations` in the API, so **every**
`secret_scanning_location` command requires `alert_number`, `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: secret_scanning_location <cmd>: alert_number is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `alert_number`, `owner`, `repo`, all **required**, plus optional match fields | Array of `secret_scanning_location` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `alert_number` | string | Parent key. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const secret_scanning_locations = await seneca
  .entity('provider/github/secret_scanning_location')
  .list$({ alert_number: '...', owner: '...', repo: '...' })
```

### `provider/github/secret_scanning_pattern_configuration`

Backed by `sdk.SecretScanningPatternConfiguration()`, whose results are `SecretScanningPatternConfigurationEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`secret_scanning_pattern_configuration` is nested under `/orgs/{org}/secret-scanning/pattern-configurations` in the API, so **every**
`secret_scanning_pattern_configuration` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: secret_scanning_pattern_configuration <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `secret_scanning_pattern_configuration` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const secret_scanning_pattern_configurations = await seneca
  .entity('provider/github/secret_scanning_pattern_configuration')
  .list$({ org_id: '...' })
```

### `provider/github/secret_scanning_push_protection_bypass`

Backed by `sdk.SecretScanningPushProtectionBypass()`, whose results are `SecretScanningPushProtectionBypassEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`secret_scanning_push_protection_bypass` is nested under `/repos/{owner}/{repo}/secret-scanning/push-protection-bypasses` in the API, so **every**
`secret_scanning_push_protection_bypass` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: secret_scanning_push_protection_bypass <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Created `secret_scanning_push_protection_bypass`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `placeholder_id` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/secret_scanning_scan_history`

Backed by `sdk.SecretScanningScanHistory()`, whose results are `SecretScanningScanHistoryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`secret_scanning_scan_history` is nested under `/repos/{owner}/{repo}/secret-scanning/scan-history` in the API, so **every**
`secret_scanning_scan_history` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: secret_scanning_scan_history <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `secret_scanning_scan_history` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const secret_scanning_scan_historys = await seneca
  .entity('provider/github/secret_scanning_scan_history')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/security_advisory`

Backed by `sdk.SecurityAdvisory()`, whose results are `SecurityAdvisoryEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`security_advisory` is nested under `/repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks` in the API, so **every**
`security_advisory` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: security_advisory <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Created `security_advisory`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/selected_action`

Backed by `sdk.SelectedAction()`, whose results are `SelectedActionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`selected_action` is nested under `/repos/{owner}/{repo}/actions/permissions/selected-actions` in the API, so **every**
`selected_action` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: selected_action <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `selected_action` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const selected_actions = await seneca
  .entity('provider/github/selected_action')
  .list$({ org_id: '...' })
```

### `provider/github/self_hosted_runner`

Backed by `sdk.SelfHostedRunner()`, whose results are `SelfHostedRunnerEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `self_hosted_runner`, or `null` if not found. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `enabled_repositories` | string |  |

```js
const self_hosted_runner = await seneca
  .entity('provider/github/self_hosted_runner')
  .load$({ null: '...' })
```

### `provider/github/short_blob`

Backed by `sdk.ShortBlob()`, whose results are `ShortBlobEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`short_blob` is nested under `/repos/{owner}/{repo}/git/blobs` in the API, so **every**
`short_blob` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: short_blob <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `save$()` | entity data, including `owner` and `repo` | Created `short_blob`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `content` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

### `provider/github/short_branch`

Backed by `sdk.ShortBranch()`, whose results are `ShortBranchEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`short_branch` is nested under `/repos/{owner}/{repo}/branches` in the API, so **every**
`short_branch` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: short_branch <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `short_branch` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `commit` | object |  |
| `name` | string |  |
| `protected` | boolean |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const short_branchs = await seneca
  .entity('provider/github/short_branch')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/simple_classroom_assignment`

Backed by `sdk.SimpleClassroomAssignment()`, whose results are `SimpleClassroomAssignmentEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`simple_classroom_assignment` is nested under `/classrooms/{classroom_id}/assignments` in the API, so **every**
`simple_classroom_assignment` command requires `classroom_id`. Omitting one throws —
`@seneca/github-provider: simple_classroom_assignment <cmd>: classroom_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `classroom_id` **required**, plus optional match fields | Array of `simple_classroom_assignment` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `accepted` | number |  |
| `classroom` | object |  |
| `deadline` | string |  |
| `editor` | string |  |
| `feedback_pull_requests_enabled` | boolean |  |
| `id` | number |  |
| `invitations_enabled` | boolean |  |
| `invite_link` | string |  |
| `language` | string |  |
| `passing` | number |  |
| `public_repo` | boolean |  |
| `slug` | string |  |
| `students_are_repo_admins` | boolean |  |
| `submitted` | number |  |
| `title` | string |  |
| `type` | string |  |
| `classroom_id` | string | Parent key: the id of a `classroom`. Required by every command. |

```js
const simple_classroom_assignments = await seneca
  .entity('provider/github/simple_classroom_assignment')
  .list$({ classroom_id: '...' })
```

### `provider/github/social_account`

Backed by `sdk.SocialAccount()`, whose results are `SocialAccountEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `social_account` entities. |
| `save$()` | entity data | Created `social_account`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `account_urls` | array |  |
| `provider` | string |  |
| `url` | string |  |

```js
const social_accounts = await seneca
  .entity('provider/github/social_account')
  .list$()
```

### `provider/github/ssh_signing_key`

Backed by `sdk.SshSigningKey()`, whose results are `SshSigningKeyEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `ssh_signing_key` entities. |
| `load$(q)` | `id` **required** | One `ssh_signing_key`, or `null` if not found. |
| `save$()` | entity data | Created `ssh_signing_key`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `id` | number | Id field. |
| `key` | string |  |
| `title` | string |  |

```js
const ssh_signing_keys = await seneca
  .entity('provider/github/ssh_signing_key')
  .list$()
const ssh_signing_key = await seneca
  .entity('provider/github/ssh_signing_key')
  .load$('...')
```

### `provider/github/status`

Backed by `sdk.Status()`, whose results are `StatusEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`status` is nested under `/repos/{owner}/{repo}/commits/{ref}/statuses` in the API, so **every**
`status` command requires `owner`, `ref` and `repo`. Omitting one throws —
`@seneca/github-provider: status <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner`, `ref`, `repo`, all **required**, plus optional match fields | Array of `status` entities. |
| `save$()` | entity data, including `owner`, `ref` and `repo` | Created `status`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `created_at` | string |  |
| `creator` | object |  |
| `id` | number |  |
| `node_id` | string |  |
| `state` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `ref` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const statuss = await seneca
  .entity('provider/github/status')
  .list$({ owner: '...', ref: '...', repo: '...' })
```

### `provider/github/status_check_policy`

Backed by `sdk.StatusCheckPolicy()`, whose results are `StatusCheckPolicyEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`status_check_policy` is nested under `/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks` in the API, so **every**
`status_check_policy` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: status_check_policy <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `status_check_policy` entities. |
| `save$()` | entity data, including `owner` and `repo` | Updated `status_check_policy`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `app_id` | number |  |
| `checks` | array |  |
| `context` | string |  |
| `contexts` | array |  |
| `contexts_url` | string |  |
| `strict` | boolean |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const status_check_policys = await seneca
  .entity('provider/github/status_check_policy')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/subscriber`

Backed by `sdk.Subscriber()`, whose results are `SubscriberEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`subscriber` is nested under `/repos/{owner}/{repo}/subscribers` in the API, so **every**
`subscriber` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: subscriber <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `subscriber` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `avatar_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `gists_url` | string |  |
| `gravatar_id` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `login` | string |  |
| `node_id` | string |  |
| `organizations_url` | string |  |
| `received_events_url` | string |  |
| `repos_url` | string |  |
| `site_admin` | boolean |  |
| `starred_url` | string |  |
| `subscriptions_url` | string |  |
| `type` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const subscribers = await seneca
  .entity('provider/github/subscriber')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/tag`

Backed by `sdk.Tag()`, whose results are `TagEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`tag` is nested under `/repos/{owner}/{repo}/tags` in the API, so **every**
`tag` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: tag <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `tag` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `commit` | object |  |
| `name` | string |  |
| `node_id` | string |  |
| `tarball_url` | string |  |
| `zipball_url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const tags = await seneca
  .entity('provider/github/tag')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/tag_protection`

Backed by `sdk.TagProtection()`, whose results are `TagProtectionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`tag_protection` is nested under `/repos/{owner}/{repo}/tags/protection` in the API, so **every**
`tag_protection` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: tag_protection <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `tag_protection` entities. |
| `save$()` | entity data, including `owner` and `repo` | Created `tag_protection`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `pattern` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const tag_protections = await seneca
  .entity('provider/github/tag_protection')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/team`

Backed by `sdk.Team()`, whose results are `TeamEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`team` is nested under `/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments` in the API, so **every**
`team` command requires `org_id` and `project_id`. Omitting one throws —
`@seneca/github-provider: team <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` and `project_id`, both **required**, plus optional match fields | Array of `team` entities. |
| `load$(q)` | `org_id`, `project_id`, `id`, all **required** | One `team`, or `null` if not found. |
| `save$()` | entity data, including `org_id` and `project_id` | Created or updated `team`. |
| `remove$(q)` | `org_id`, `project_id`, `id`, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `archive_url` | string |  |
| `archived` | boolean |  |
| `assignees_url` | string |  |
| `author` | object |  |
| `avatar_url` | string |  |
| `blobs_url` | string |  |
| `body` | string |  |
| `body_html` | string |  |
| `body_version` | string |  |
| `branches_url` | string |  |
| `clone_url` | string |  |
| `code_of_conduct` | object |  |
| `collaborators_url` | string |  |
| `columns_url` | string |  |
| `comments_count` | number |  |
| `comments_url` | string |  |
| `commits_url` | string |  |
| `compare_url` | string |  |
| `contents_url` | string |  |
| `contributors_url` | string |  |
| `created_at` | string |  |
| `creator` | object |  |
| `default_branch` | string |  |
| `deployments_url` | string |  |
| `description` | string |  |
| `disabled` | boolean |  |
| `discussion_url` | string |  |
| `downloads_url` | string |  |
| `events_url` | string |  |
| `followers_url` | string |  |
| `following_url` | string |  |
| `fork` | boolean |  |
| `forks` | number |  |
| `forks_count` | number |  |
| `forks_url` | string |  |
| `full_name` | string |  |
| `gists_url` | string |  |
| `git_commits_url` | string |  |
| `git_refs_url` | string |  |
| `git_tags_url` | string |  |
| `git_url` | string |  |
| `gravatar_id` | string |  |
| `has_downloads` | boolean |  |
| `has_issues` | boolean |  |
| `has_pages` | boolean |  |
| `has_projects` | boolean |  |
| `has_wiki` | boolean |  |
| `homepage` | string |  |
| `hooks_url` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `invitation_teams_url` | string |  |
| `inviter` | object |  |
| `issue_comment_url` | string |  |
| `issue_events_url` | string |  |
| `issues_url` | string |  |
| `keys_url` | string |  |
| `labels_url` | string |  |
| `language` | string |  |
| `languages_url` | string |  |
| `last_edited_at` | string |  |
| `license` | object |  |
| `login` | string |  |
| `members_count` | number |  |
| `members_url` | string |  |
| `merges_url` | string |  |
| `milestones_url` | string |  |
| `mirror_url` | string |  |
| `name` | string |  |
| `node_id` | string |  |
| `notifications_url` | string |  |
| `number` | number |  |
| `open_issues` | number |  |
| `open_issues_count` | number |  |
| `organization` | object |  |
| `organizations_url` | string |  |
| `owner` | object |  |
| `owner_url` | string |  |
| `parent` | object |  |
| `permission` | string |  |
| `permissions` | object |  |
| `pinned` | boolean |  |
| `private` | boolean |  |
| `pulls_url` | string |  |
| `pushed_at` | string |  |
| `reactions` | object |  |
| `received_events_url` | string |  |
| `releases_url` | string |  |
| `repos_count` | number |  |
| `repos_url` | string |  |
| `repositories_url` | string |  |
| `role` | string |  |
| `site_admin` | boolean |  |
| `size` | number |  |
| `slug` | string |  |
| `ssh_url` | string |  |
| `stargazers_count` | number |  |
| `stargazers_url` | string |  |
| `starred_url` | string |  |
| `state` | string |  |
| `statuses_url` | string |  |
| `subscribers_url` | string |  |
| `subscription_url` | string |  |
| `subscriptions_url` | string |  |
| `svn_url` | string |  |
| `tags_url` | string |  |
| `team_count` | number |  |
| `team_url` | string |  |
| `teams_url` | string |  |
| `title` | string |  |
| `trees_url` | string |  |
| `type` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `watchers` | number |  |
| `watchers_count` | number |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |
| `project_id` | string | Parent key: the id of a `project`. Required by every command. |

```js
const teams = await seneca
  .entity('provider/github/team')
  .list$({ org_id: '...', project_id: '...' })
const team = await seneca
  .entity('provider/github/team')
  .load$({ org_id: '...', project_id: '...', id: '...' })
```

### `provider/github/team_simple`

Backed by `sdk.TeamSimple()`, whose results are `TeamSimpleEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`team_simple` is nested under `/orgs/{org}/security-managers` in the API, so **every**
`team_simple` command requires `org_id`. Omitting one throws —
`@seneca/github-provider: team_simple <cmd>: org_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `org_id` **required**, plus optional match fields | Array of `team_simple` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `description` | string |  |
| `html_url` | string |  |
| `id` | number |  |
| `members_url` | string |  |
| `name` | string |  |
| `node_id` | string |  |
| `permission` | string |  |
| `repositories_url` | string |  |
| `slug` | string |  |
| `url` | string |  |
| `org_id` | string | Parent key: the id of a `org`. Required by every command. |

```js
const team_simples = await seneca
  .entity('provider/github/team_simple')
  .list$({ org_id: '...' })
```

### `provider/github/thread`

Backed by `sdk.Thread()`, whose results are `ThreadEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `thread` entities. |
| `load$(q)` | `id` **required** | One `thread`, or `null` if not found. |
| `remove$(q)` | `id` **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `id` | string | Id field. |
| `last_read_at` | string |  |
| `reason` | string |  |
| `repository` | object |  |
| `subject` | object |  |
| `subscription_url` | string |  |
| `unread` | boolean |  |
| `updated_at` | string |  |
| `url` | string |  |

```js
const threads = await seneca
  .entity('provider/github/thread')
  .list$()
const thread = await seneca
  .entity('provider/github/thread')
  .load$('...')
```

### `provider/github/thread_subscription`

Backed by `sdk.ThreadSubscription()`, whose results are `ThreadSubscriptionEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `id` **required** | One `thread_subscription`, or `null` if not found. |
| `save$()` | entity data | Updated `thread_subscription`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `created_at` | string |  |
| `ignored` | boolean |  |
| `reason` | string |  |
| `subscribed` | boolean |  |
| `url` | string |  |

```js
const thread_subscription = await seneca
  .entity('provider/github/thread_subscription')
  .load$('...')
```

### `provider/github/topic`

Backed by `sdk.Topic()`, whose results are `TopicEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`topic` is nested under `/repos/{owner}/{repo}/topics` in the API, so **every**
`topic` command requires `owner`. Omitting one throws —
`@seneca/github-provider: topic <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` **required**, plus optional match fields | Array of `topic` entities. |
| `save$()` | entity data, including `owner` | Updated `topic`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `names` | array |  |
| `owner` | string | Parent key. Required by every command. |

```js
const topics = await seneca
  .entity('provider/github/topic')
  .list$({ owner: '...' })
```

### `provider/github/user`

Backed by `sdk.User()`, whose results are `UserEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`user` is nested under `/orgs/{org}/organization-roles/{role_id}/users` in the API, so **every**
`user` command requires `branch_id`, `gpg_key_id`, `owner`, `repo` and `username`. Omitting one throws —
`@seneca/github-provider: user <cmd>: branch_id is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `branch_id`, `gpg_key_id`, `owner`, `repo`, `username`, all **required**, plus optional match fields | Array of `user` entities. |
| `load$(q)` | `branch_id`, `gpg_key_id`, `owner`, `repo`, `username`, `id`, all **required** | One `user`, or `null` if not found. |
| `save$()` | entity data, including `branch_id`, `gpg_key_id`, `owner`, `repo` and `username` | Created or updated `user`. |
| `remove$(q)` | `branch_id`, `gpg_key_id`, `owner`, `repo`, `username`, `id`, all **required** | `null`. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `private_repos` | number |  |
| `space` | number |  |
| `subject_digests` | array |  |
| `users` | array |  |
| `branch_id` | string | Parent key: the id of a `branch`. Required by every command. |
| `gpg_key_id` | string | Parent key: the id of a `gpg_key`. Required by every command. |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |
| `username` | string | Parent key. Required by every command. |

```js
const users = await seneca
  .entity('provider/github/user')
  .list$({ branch_id: '...', gpg_key_id: '...', owner: '...', repo: '...', username: '...' })
const user = await seneca
  .entity('provider/github/user')
  .load$({ branch_id: '...', gpg_key_id: '...', owner: '...', repo: '...', username: '...', id: '...' })
```

### `provider/github/user_marketplace_purchase`

Backed by `sdk.UserMarketplacePurchase()`, whose results are `UserMarketplacePurchaseEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | optional match fields | Array of `user_marketplace_purchase` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `account` | object |  |
| `billing_cycle` | string |  |
| `free_trial_ends_on` | string |  |
| `next_billing_date` | string |  |
| `on_free_trial` | boolean |  |
| `plan` | object |  |
| `unit_count` | number |  |
| `updated_at` | string |  |

```js
const user_marketplace_purchases = await seneca
  .entity('provider/github/user_marketplace_purchase')
  .list$()
```

### `provider/github/view`

Backed by `sdk.View()`, whose results are `ViewEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`view` is nested under `/repos/{owner}/{repo}/traffic/views` in the API, so **every**
`view` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: view <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `list$(q)` | `owner` and `repo`, both **required**, plus optional match fields | Array of `view` entities. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `count` | number |  |
| `timestamp` | string |  |
| `uniques` | number |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const views = await seneca
  .entity('provider/github/view')
  .list$({ owner: '...', repo: '...' })
```

### `provider/github/webhook_config`

Backed by `sdk.WebhookConfig()`, whose results are `WebhookConfigEntity` instances; the
provider hands Seneca the plain record from `.data()`.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `` **required** | One `webhook_config`, or `null` if not found. |
| `save$()` | entity data | Updated `webhook_config`; the API declares no create operation. |

This entity is keyed by `null` rather than `id`, so the short
form `load$('...')` does not address it: Seneca reads a bare string as
`{id: '...'}`, which is not a key this entity uses. Pass
`{ null: '...' }` instead.

The API definition declares no required fields for this entity; whatever it
returns is passed through unchanged.

```js
const webhook_config = await seneca
  .entity('provider/github/webhook_config')
  .load$({ null: '...' })
```

### `provider/github/workflow`

Backed by `sdk.Workflow()`, whose results are `WorkflowEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`workflow` is nested under `/repos/{owner}/{repo}/actions/workflows/{workflow_id}` in the API, so **every**
`workflow` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: workflow <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `workflow`, or `null` if not found. |
| `save$()` | entity data, including `owner` and `repo` | Updated `workflow`; the API declares no create operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `badge_url` | string |  |
| `created_at` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `name` | string |  |
| `node_id` | string |  |
| `path` | string |  |
| `state` | string |  |
| `updated_at` | string |  |
| `url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const workflow = await seneca
  .entity('provider/github/workflow')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### `provider/github/workflow_run`

Backed by `sdk.WorkflowRun()`, whose results are `WorkflowRunEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`workflow_run` is nested under `/repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}` in the API, so **every**
`workflow_run` command requires `owner`, `repo` and `run_id`. Omitting one throws —
`@seneca/github-provider: workflow_run <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `run_id`, `id`, all **required** | One `workflow_run`, or `null` if not found. |
| `save$()` | entity data, including `owner`, `repo` and `run_id` | Created `workflow_run`; the API declares no update operation. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `actor` | object |  |
| `artifacts_url` | string |  |
| `cancel_url` | string |  |
| `check_suite_url` | string |  |
| `conclusion` | string |  |
| `created_at` | string |  |
| `display_title` | string |  |
| `event` | string |  |
| `head_branch` | string |  |
| `head_commit` | object |  |
| `head_repository` | object |  |
| `head_sha` | string |  |
| `html_url` | string |  |
| `id` | number | Id field. |
| `jobs_url` | string |  |
| `logs_url` | string |  |
| `node_id` | string |  |
| `path` | string |  |
| `pull_requests` | array |  |
| `repository` | object |  |
| `rerun_url` | string |  |
| `run_number` | number |  |
| `status` | string |  |
| `triggering_actor` | object |  |
| `updated_at` | string |  |
| `url` | string |  |
| `workflow_id` | number |  |
| `workflow_url` | string |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |
| `run_id` | string | Parent key. Required by every command. |

```js
const workflow_run = await seneca
  .entity('provider/github/workflow_run')
  .load$({ owner: '...', repo: '...', run_id: '...', id: '...' })
```

### `provider/github/workflow_run_usage`

Backed by `sdk.WorkflowRunUsage()`, whose results are `WorkflowRunUsageEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`workflow_run_usage` is nested under `/repos/{owner}/{repo}/actions/runs/{run_id}/timing` in the API, so **every**
`workflow_run_usage` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: workflow_run_usage <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, ``, all **required** | One `workflow_run_usage`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `MACOS` | object |  |
| `UBUNTU` | object |  |
| `WINDOWS` | object |  |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const workflow_run_usage = await seneca
  .entity('provider/github/workflow_run_usage')
  .load$({ owner: '...', repo: '...', null: '...' })
```

### `provider/github/workflow_usage`

Backed by `sdk.WorkflowUsage()`, whose results are `WorkflowUsageEntity` instances; the
provider hands Seneca the plain record from `.data()`.

`workflow_usage` is nested under `/repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing` in the API, so **every**
`workflow_usage` command requires `owner` and `repo`. Omitting one throws —
`@seneca/github-provider: workflow_usage <cmd>: owner is required` —
before any request is made, rather than issuing one that would 404.

| Command | Query / data | Returns |
| ------- | ------------ | ------- |
| `load$(q)` | `owner`, `repo`, `id`, all **required** | One `workflow_usage`, or `null` if not found. |

Required fields, as declared by the API definition. Optional fields the API
also defines are passed through unchanged in both directions.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `owner` | string | Parent key. Required by every command. |
| `repo` | string | Parent key: the id of a `repo`. Required by every command. |

```js
const workflow_usage = await seneca
  .entity('provider/github/workflow_usage')
  .load$({ owner: '...', repo: '...', id: '...' })
```

### Create versus update

`save$` follows the Seneca convention: an entity **without** an id is
created, an entity **with** one is updated. The provider dispatches on the
id field, so the same call does both.

```js
// Create — no id.
const gist = await seneca
  .entity('provider/github/gist')
  .make$({ fork_of: 'fork_of-value', owner: 'owner-value' })
  .save$()

// Update — id present.
gist.fork_of = 'fork_of-changed'
await gist.save$()
```

Whether a client-supplied id survives a create is a property of the API, not
of this plugin: many assign the id themselves and ignore the one sent. Read
the id back off the returned entity rather than assuming the one you set.

These entities support only one half of that pair, so `save$` does not
dispatch for them:

| Canon | Behaviour of `save$` |
| ----- | -------------------- |
| `provider/github/activity` | Always updates; the API declares no create operation. |
| `provider/github/add` | Always creates; the API declares no update operation. |
| `provider/github/authentication_token` | Always creates; the API declares no update operation. |
| `provider/github/autolink` | Always creates; the API declares no update operation. |
| `provider/github/base_gist` | Always creates; the API declares no update operation. |
| `provider/github/branch_with_protection` | Always creates; the API declares no update operation. |
| `provider/github/check_suite` | Always creates; the API declares no update operation. |
| `provider/github/check_suite_preference` | Always updates; the API declares no create operation. |
| `provider/github/code_scanning` | Always creates; the API declares no update operation. |
| `provider/github/code_scanning_alert` | Always updates; the API declares no create operation. |
| `provider/github/code_scanning_autofix` | Always creates; the API declares no update operation. |
| `provider/github/code_scanning_autofix_commit` | Always creates; the API declares no update operation. |
| `provider/github/code_scanning_variant_analysi` | Always creates; the API declares no update operation. |
| `provider/github/code_security` | Always updates; the API declares no create operation. |
| `provider/github/commit` | Always creates; the API declares no update operation. |
| `provider/github/copilot` | Always creates; the API declares no update operation. |
| `provider/github/credential` | Always creates; the API declares no update operation. |
| `provider/github/custom_property` | Always updates; the API declares no create operation. |
| `provider/github/dependabot` | Always updates; the API declares no create operation. |
| `provider/github/dependabot_alert` | Always updates; the API declares no create operation. |
| `provider/github/dependency_graph` | Always creates; the API declares no update operation. |
| `provider/github/deploy_key` | Always creates; the API declares no update operation. |
| `provider/github/deployment` | Always creates; the API declares no update operation. |
| `provider/github/deployment_protection_rule` | Always creates; the API declares no update operation. |
| `provider/github/deployment_status` | Always creates; the API declares no update operation. |
| `provider/github/environment` | Always updates; the API declares no create operation. |
| `provider/github/file_commit` | Always updates; the API declares no create operation. |
| `provider/github/git_commit` | Always creates; the API declares no update operation. |
| `provider/github/git_tag` | Always creates; the API declares no update operation. |
| `provider/github/git_tree` | Always creates; the API declares no update operation. |
| `provider/github/gpg_key` | Always creates; the API declares no update operation. |
| `provider/github/import` | Always updates; the API declares no create operation. |
| `provider/github/installation` | Always updates; the API declares no create operation. |
| `provider/github/installation_token` | Always creates; the API declares no update operation. |
| `provider/github/interaction_limit` | Always updates; the API declares no create operation. |
| `provider/github/key` | Always creates; the API declares no update operation. |
| `provider/github/markdown` | Always creates; the API declares no update operation. |
| `provider/github/membership` | Always updates; the API declares no create operation. |
| `provider/github/merged_upstream` | Always creates; the API declares no update operation. |
| `provider/github/migration` | Always creates; the API declares no update operation. |
| `provider/github/org_membership` | Always updates; the API declares no create operation. |
| `provider/github/org_private_registry_configuration_with_selected_repository` | Always creates; the API declares no update operation. |
| `provider/github/organization_invitation` | Always creates; the API declares no update operation. |
| `provider/github/package` | Always creates; the API declares no update operation. |
| `provider/github/page` | Always creates; the API declares no update operation. |
| `provider/github/page_build_status` | Always creates; the API declares no update operation. |
| `provider/github/page_deployment` | Always creates; the API declares no update operation. |
| `provider/github/pages_deployment_status` | Always creates; the API declares no update operation. |
| `provider/github/porter_author` | Always updates; the API declares no create operation. |
| `provider/github/private_registry` | Always updates; the API declares no create operation. |
| `provider/github/projects_v2_item_simple` | Always creates; the API declares no update operation. |
| `provider/github/projects_v2_item_with_content` | Always updates; the API declares no create operation. |
| `provider/github/protected_branch` | Always updates; the API declares no create operation. |
| `provider/github/protected_branch_admin_enforced` | Always creates; the API declares no update operation. |
| `provider/github/protected_branch_pull_request_review` | Always updates; the API declares no create operation. |
| `provider/github/pull_request_simple` | Always creates; the API declares no update operation. |
| `provider/github/reaction` | Always creates; the API declares no update operation. |
| `provider/github/release_notes_content` | Always creates; the API declares no update operation. |
| `provider/github/remove` | Always creates; the API declares no update operation. |
| `provider/github/repository_invitation` | Always updates; the API declares no create operation. |
| `provider/github/repository_subscription` | Always updates; the API declares no create operation. |
| `provider/github/secret_scanning` | Always updates; the API declares no create operation. |
| `provider/github/secret_scanning_alert` | Always updates; the API declares no create operation. |
| `provider/github/secret_scanning_push_protection_bypass` | Always creates; the API declares no update operation. |
| `provider/github/security_advisory` | Always creates; the API declares no update operation. |
| `provider/github/short_blob` | Always creates; the API declares no update operation. |
| `provider/github/social_account` | Always creates; the API declares no update operation. |
| `provider/github/ssh_signing_key` | Always creates; the API declares no update operation. |
| `provider/github/status` | Always creates; the API declares no update operation. |
| `provider/github/status_check_policy` | Always updates; the API declares no create operation. |
| `provider/github/tag_protection` | Always creates; the API declares no update operation. |
| `provider/github/thread_subscription` | Always updates; the API declares no create operation. |
| `provider/github/topic` | Always updates; the API declares no create operation. |
| `provider/github/webhook_config` | Always updates; the API declares no create operation. |
| `provider/github/workflow` | Always updates; the API declares no create operation. |
| `provider/github/workflow_run` | Always creates; the API declares no update operation. |

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
| `action` | `artifact` | `/repos/{owner}/{repo}/actions/artifacts` | `list` | `list$` |
| `action` | `hosted_runner` | `/orgs/{org}/actions/hosted-runners` | `list` | `list$` |
| `action` | `organization_secret` | `/repos/{owner}/{repo}/actions/organization-secrets` | `list` | `list$` |
| `action` | `organization_variable` | `/repos/{owner}/{repo}/actions/organization-variables` | `list` | `list$` |
| `action` | `run` | `/repos/{owner}/{repo}/actions/runs` | `list` | `list$` |
| `action` | `runner` | `/repos/{owner}/{repo}/actions/runners` | `list` | `list$` |
| `action` | `runner` | `/orgs/{org}/actions/runners` | `list` | `list$` |
| `action` | `runner_group` | `/orgs/{org}/actions/runner-groups` | `list` | `list$` |
| `action` | `secret` | `/repos/{owner}/{repo}/actions/secrets` | `list` | `list$` |
| `action` | `secret` | `/orgs/{org}/actions/secrets` | `list` | `list$` |
| `action` | `variable` | `/repos/{owner}/{repo}/actions/variables` | `list` | `list$` |
| `action` | `variable` | `/orgs/{org}/actions/variables` | `list` | `list$` |
| `action` | `workflow` | `/repos/{owner}/{repo}/actions/workflows` | `list` | `list$` |
| `action` | `permission` | `/repos/{owner}/{repo}/actions/permissions` | `update` | `save$` |
| `action` | `permission` | `/orgs/{org}/actions/permissions` | `update` | `save$` |
| `branch_with_protection` | `rename` | `/repos/{owner}/{repo}/branches/{branch}/rename` | `create` | `save$` |
| `code_scanning` | `sarif` | `/repos/{owner}/{repo}/code-scanning/sarifs` | `create` | `save$` |
| `code_security_configuration` | `attach` | `/enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach` | `create` | `save$` |
| `code_security_configuration` | `attach` | `/orgs/{org}/code-security/configurations/{configuration_id}/attach` | `create` | `save$` |
| `codespace` | `devcontainer` | `/repos/{owner}/{repo}/codespaces/devcontainers` | `list` | `list$` |
| `codespace` | `machine` | `/repos/{owner}/{repo}/codespaces/machines` | `list` | `list$` |
| `codespace` | `machine` | `/user/codespaces/{codespace_name}/machines` | `list` | `list$` |
| `codespace` | `secret` | `/repos/{owner}/{repo}/codespaces/secrets` | `list` | `list$` |
| `codespace` | `secret` | `/orgs/{org}/codespaces/secrets` | `list` | `list$` |
| `codespace` | `secret` | `/user/codespaces/secrets` | `list` | `list$` |
| `codespace` | `new` | `/repos/{owner}/{repo}/codespaces/new` | `load` | `load$` |
| `codespace` | `permissions_check` | `/repos/{owner}/{repo}/codespaces/permissions_check` | `load` | `load$` |
| `codespace` | `export` | `/user/codespaces/{codespace_name}/exports` | `create` | `save$` |
| `codespace` | `publish` | `/user/codespaces/{codespace_name}/publish` | `create` | `save$` |
| `codespace` | `start` | `/user/codespaces/{codespace_name}/start` | `create` | `save$` |
| `codespace` | `stop` | `/orgs/{org}/members/{username}/codespaces/{codespace_name}/stop` | `create` | `save$` |
| `codespace` | `stop` | `/user/codespaces/{codespace_name}/stop` | `create` | `save$` |
| `codespace` | `access` | `/orgs/{org}/codespaces/access` | `update` | `save$` |
| `credential` | `revoke` | `/credentials/revoke` | `create` | `save$` |
| `dependabot` | `secret` | `/repos/{owner}/{repo}/dependabot/secrets` | `list` | `list$` |
| `dependabot` | `secret` | `/orgs/{org}/dependabot/secrets` | `list` | `list$` |
| `dependency_graph` | `snapshot` | `/repos/{owner}/{repo}/dependency-graph/snapshots` | `create` | `save$` |
| `email` | `visibility` | `/user/email/visibility` | `update` | `save$` |
| `event` | `public` | `/users/{username}/events/public` | `list` | `list$` |
| `gist` | `star` | `/gists/{gist_id}/star` | `load` | `load$` |
| `gist` | `star` | `/gists/{gist_id}/star` | `remove` | `remove$` |
| `gist` | `star` | `/gists/{gist_id}/star` | `update` | `save$` |
| `gist_simple` | `forks` | `/gists/{gist_id}/forks` | `list` | `list$` |
| `gitignore` | `template` | `/gitignore/templates` | `list` | `list$` |
| `hook_delivery_item` | `deliveries` | `/repos/{owner}/{repo}/hooks/{hook_id}/deliveries` | `list` | `list$` |
| `hook_delivery_item` | `deliveries` | `/orgs/{org}/hooks/{hook_id}/deliveries` | `list` | `list$` |
| `installation` | `suspended` | `/app/installations/{installation_id}/suspended` | `remove` | `remove$` |
| `installation` | `suspended` | `/app/installations/{installation_id}/suspended` | `update` | `save$` |
| `installation_token` | `access_tokens` | `/app/installations/{installation_id}/access_tokens` | `create` | `save$` |
| `issue` | `comment` | `/repos/{owner}/{repo}/issues/comments` | `list` | `list$` |
| `issue` | `comment` | `/repos/{owner}/{repo}/issues/{issue_number}/comments` | `list` | `list$` |
| `issue` | `dependency_blocked_by` | `/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by` | `list` | `list$` |
| `issue` | `dependency_blocking` | `/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocking` | `list` | `list$` |
| `issue` | `event` | `/repos/{owner}/{repo}/issues/{issue_number}/events` | `list` | `list$` |
| `issue` | `event` | `/repos/{owner}/{repo}/issues/events` | `list` | `list$` |
| `issue` | `label` | `/repos/{owner}/{repo}/issues/{issue_number}/labels` | `list` | `list$` |
| `issue` | `parent` | `/repos/{owner}/{repo}/issues/{issue_number}/parent` | `list` | `list$` |
| `issue` | `sub_issue` | `/repos/{owner}/{repo}/issues/{issue_number}/sub_issues` | `list` | `list$` |
| `issue` | `timeline` | `/repos/{owner}/{repo}/issues/{issue_number}/timeline` | `list` | `list$` |
| `issue` | `assignee` | `/repos/{owner}/{repo}/issues/{issue_number}/assignees` | `remove` | `remove$` |
| `issue` | `label` | `/repos/{owner}/{repo}/issues/{issue_number}/labels` | `remove` | `remove$` |
| `issue` | `lock` | `/repos/{owner}/{repo}/issues/{issue_number}/lock` | `remove` | `remove$` |
| `issue` | `sub_issue` | `/repos/{owner}/{repo}/issues/{issue_number}/sub_issue` | `remove` | `remove$` |
| `issue` | `assignee` | `/repos/{owner}/{repo}/issues/{issue_number}/assignees` | `create` | `save$` |
| `issue` | `comment` | `/repos/{owner}/{repo}/issues/{issue_number}/comments` | `create` | `save$` |
| `issue` | `dependency_blocked_by` | `/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by` | `create` | `save$` |
| `issue` | `label` | `/repos/{owner}/{repo}/issues/{issue_number}/labels` | `create` | `save$` |
| `issue` | `sub_issue` | `/repos/{owner}/{repo}/issues/{issue_number}/sub_issues` | `create` | `save$` |
| `issue` | `lock` | `/repos/{owner}/{repo}/issues/{issue_number}/lock` | `update` | `save$` |
| `issue` | `sub_issue_priority` | `/repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority` | `update` | `save$` |
| `markdown` | `raw` | `/markdown/raw` | `create` | `save$` |
| `migration` | `repository` | `/orgs/{org}/migrations/{migration_id}/repositories` | `list` | `list$` |
| `migration` | `repository` | `/user/migrations/{migration_id}/repositories` | `list` | `list$` |
| `migration` | `archive` | `/orgs/{org}/migrations/{migration_id}/archive` | `load` | `load$` |
| `migration` | `archive` | `/user/migrations/{migration_id}/archive` | `load` | `load$` |
| `migration` | `archive` | `/orgs/{org}/migrations/{migration_id}/archive` | `remove` | `remove$` |
| `migration` | `archive` | `/user/migrations/{migration_id}/archive` | `remove` | `remove$` |
| `org` | `installation` | `/orgs/{org}/installations` | `list` | `list$` |
| `org` | `organization_role` | `/orgs/{org}/organization-roles` | `list` | `list$` |
| `org` | `personal_access_token` | `/orgs/{org}/personal-access-tokens` | `create` | `save$` |
| `org` | `personal_access_token_request` | `/orgs/{org}/personal-access-token-requests` | `create` | `save$` |
| `org_private_registry_configuration_with_selected_repository` | `private-registries` | `/orgs/{org}/private-registries` | `create` | `save$` |
| `package` | `restore` | `/orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore` | `create` | `save$` |
| `package` | `restore` | `/users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore` | `create` | `save$` |
| `package` | `restore` | `/user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore` | `create` | `save$` |
| `pages_deployment_status` | `cancel` | `/repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel` | `create` | `save$` |
| `private_registry` | `public_key` | `/orgs/{org}/private-registries/public-key` | `load` | `load$` |
| `pull` | `merge` | `/repos/{owner}/{repo}/pulls/{pull_number}/merge` | `load` | `load$` |
| `pull` | `merge` | `/repos/{owner}/{repo}/pulls/{pull_number}/merge` | `update` | `save$` |
| `pull` | `update_branch` | `/repos/{owner}/{repo}/pulls/{pull_number}/update-branch` | `update` | `save$` |
| `release` | `latest` | `/repos/{owner}/{repo}/releases/latest` | `list` | `list$` |
| `repo` | `environment` | `/repos/{owner}/{repo}/environments` | `list` | `list$` |
| `repo` | `private_vulnerability_reporting` | `/repos/{owner}/{repo}/private-vulnerability-reporting` | `load` | `load$` |
| `repo` | `vulnerability_alert` | `/repos/{owner}/{repo}/vulnerability-alerts` | `load` | `load$` |
| `repo` | `automated_security_fix` | `/repos/{owner}/{repo}/automated-security-fixes` | `remove` | `remove$` |
| `repo` | `page` | `/repos/{owner}/{repo}/pages` | `remove` | `remove$` |
| `repo` | `private_vulnerability_reporting` | `/repos/{owner}/{repo}/private-vulnerability-reporting` | `remove` | `remove$` |
| `repo` | `vulnerability_alert` | `/repos/{owner}/{repo}/vulnerability-alerts` | `remove` | `remove$` |
| `repo` | `attestation` | `/repos/{owner}/{repo}/attestations` | `create` | `save$` |
| `repo` | `dispatch` | `/repos/{owner}/{repo}/dispatches` | `create` | `save$` |
| `repo` | `fork` | `/repos/{owner}/{repo}/forks` | `create` | `save$` |
| `repo` | `transfer` | `/repos/{owner}/{repo}/transfer` | `create` | `save$` |
| `repo` | `automated_security_fix` | `/repos/{owner}/{repo}/automated-security-fixes` | `update` | `save$` |
| `repo` | `page` | `/repos/{owner}/{repo}/pages` | `update` | `save$` |
| `repo` | `private_vulnerability_reporting` | `/repos/{owner}/{repo}/private-vulnerability-reporting` | `update` | `save$` |
| `repo` | `vulnerability_alert` | `/repos/{owner}/{repo}/vulnerability-alerts` | `update` | `save$` |
| `repository_advisory` | `cve` | `/repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve` | `create` | `save$` |
| `ruleset_version` | `history` | `/repos/{owner}/{repo}/rulesets/{ruleset_id}/history` | `list` | `list$` |
| `ruleset_version` | `history` | `/orgs/{org}/rulesets/{ruleset_id}/history` | `list` | `list$` |
| `search` | `code` | `/search/code` | `list` | `list$` |
| `search` | `commit` | `/search/commits` | `list` | `list$` |
| `search` | `issue` | `/search/issues` | `list` | `list$` |
| `search` | `label` | `/search/labels` | `list` | `list$` |
| `search` | `repository` | `/search/repositories` | `list` | `list$` |
| `search` | `topic` | `/search/topics` | `list` | `list$` |
| `search` | `user` | `/search/users` | `list` | `list$` |
| `secret_scanning` | `pattern_configuration` | `/orgs/{org}/secret-scanning/pattern-configurations` | `update` | `save$` |
| `security_advisory` | `fork` | `/repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks` | `create` | `save$` |
| `team` | `discussion` | `/orgs/{org}/teams/{team_slug}/discussions` | `list` | `list$` |
| `team` | `discussion` | `/teams/{team_id}/discussions` | `list` | `list$` |
| `team` | `invitation` | `/orgs/{org}/teams/{team_slug}/invitations` | `list` | `list$` |
| `team` | `invitation` | `/teams/{team_id}/invitations` | `list` | `list$` |
| `team` | `member` | `/orgs/{org}/teams/{team_slug}/members` | `list` | `list$` |
| `team` | `member` | `/teams/{team_id}/members` | `list` | `list$` |
| `team` | `project` | `/orgs/{org}/teams/{team_slug}/projects` | `list` | `list$` |
| `team` | `project` | `/teams/{team_id}/projects` | `list` | `list$` |
| `team` | `repo` | `/orgs/{org}/teams/{team_slug}/repos` | `list` | `list$` |
| `team` | `repo` | `/teams/{team_id}/repos` | `list` | `list$` |
| `team` | `discussion` | `/orgs/{org}/teams/{team_slug}/discussions` | `create` | `save$` |
| `team` | `discussion` | `/teams/{team_id}/discussions` | `create` | `save$` |
| `thread` | `subscription` | `/notifications/threads/{thread_id}/subscription` | `remove` | `remove$` |
| `user` | `email` | `/user/emails` | `remove` | `remove$` |
| `user` | `social_account` | `/user/social_accounts` | `remove` | `remove$` |
| `user` | `attestation_bulk_list` | `/users/{username}/attestations/bulk-list` | `create` | `save$` |
| `user` | `attestation_delete_request` | `/users/{username}/attestations/delete-request` | `create` | `save$` |
| `workflow` | `disable` | `/repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable` | `update` | `save$` |
| `workflow` | `enable` | `/repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable` | `update` | `save$` |
| `workflow_run` | `cancel` | `/repos/{owner}/{repo}/actions/runs/{run_id}/cancel` | `create` | `save$` |
| `workflow_run` | `deployment_protection_rule` | `/repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule` | `create` | `save$` |
| `workflow_run` | `force_cancel` | `/repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel` | `create` | `save$` |
| `workflow_usage` | `timing` | `/repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing` | `load` | `load$` |

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
  version: '0.3.1',
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
| `sys:entity,zone:provider,base:github,name:action,cmd:list` |
| `sys:entity,zone:provider,base:github,name:action,cmd:load` |
| `sys:entity,zone:provider,base:github,name:action,cmd:save` |
| `sys:entity,zone:provider,base:github,name:action,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:actions_artifact_and_log_retention,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_cache_list,cmd:list` |
| `sys:entity,zone:provider,base:github,name:actions_cache_list,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:actions_cache_usage_by_repository,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_cache_usage_org_enterprise,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_fork_pr_contributor_approval,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_fork_pr_workflows_private_repo,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_get_default_workflow_permission,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_hosted_runner,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_hosted_runner,cmd:save` |
| `sys:entity,zone:provider,base:github,name:actions_hosted_runner_limit,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_organization_permission,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_public_key,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_repository_permission,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_secret,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_variable,cmd:load` |
| `sys:entity,zone:provider,base:github,name:actions_workflow_access_to_repository,cmd:load` |
| `sys:entity,zone:provider,base:github,name:activity,cmd:list` |
| `sys:entity,zone:provider,base:github,name:activity,cmd:load` |
| `sys:entity,zone:provider,base:github,name:activity,cmd:save` |
| `sys:entity,zone:provider,base:github,name:activity,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:add,cmd:save` |
| `sys:entity,zone:provider,base:github,name:api_insights_route_stat,cmd:list` |
| `sys:entity,zone:provider,base:github,name:api_insights_subject_stat,cmd:list` |
| `sys:entity,zone:provider,base:github,name:api_insights_summary_stat,cmd:load` |
| `sys:entity,zone:provider,base:github,name:api_insights_time_stat,cmd:list` |
| `sys:entity,zone:provider,base:github,name:api_insights_time_stat,cmd:load` |
| `sys:entity,zone:provider,base:github,name:api_insights_user_stat,cmd:load` |
| `sys:entity,zone:provider,base:github,name:api_overview,cmd:list` |
| `sys:entity,zone:provider,base:github,name:app,cmd:list` |
| `sys:entity,zone:provider,base:github,name:app,cmd:save` |
| `sys:entity,zone:provider,base:github,name:app,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:artifact,cmd:load` |
| `sys:entity,zone:provider,base:github,name:assignee,cmd:list` |
| `sys:entity,zone:provider,base:github,name:authentication_token,cmd:save` |
| `sys:entity,zone:provider,base:github,name:authorization,cmd:save` |
| `sys:entity,zone:provider,base:github,name:autolink,cmd:list` |
| `sys:entity,zone:provider,base:github,name:autolink,cmd:load` |
| `sys:entity,zone:provider,base:github,name:autolink,cmd:save` |
| `sys:entity,zone:provider,base:github,name:base_gist,cmd:list` |
| `sys:entity,zone:provider,base:github,name:base_gist,cmd:save` |
| `sys:entity,zone:provider,base:github,name:billing_usage_report,cmd:list` |
| `sys:entity,zone:provider,base:github,name:billing_usage_report_user,cmd:list` |
| `sys:entity,zone:provider,base:github,name:blob,cmd:load` |
| `sys:entity,zone:provider,base:github,name:block,cmd:list` |
| `sys:entity,zone:provider,base:github,name:branch,cmd:load` |
| `sys:entity,zone:provider,base:github,name:branch_protection,cmd:load` |
| `sys:entity,zone:provider,base:github,name:branch_restriction_policy,cmd:list` |
| `sys:entity,zone:provider,base:github,name:branch_short,cmd:list` |
| `sys:entity,zone:provider,base:github,name:branch_with_protection,cmd:save` |
| `sys:entity,zone:provider,base:github,name:campaign,cmd:list` |
| `sys:entity,zone:provider,base:github,name:campaign,cmd:load` |
| `sys:entity,zone:provider,base:github,name:campaign,cmd:save` |
| `sys:entity,zone:provider,base:github,name:campaign,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:check,cmd:list` |
| `sys:entity,zone:provider,base:github,name:check_annotation,cmd:list` |
| `sys:entity,zone:provider,base:github,name:check_automated_security_fix,cmd:load` |
| `sys:entity,zone:provider,base:github,name:check_run,cmd:load` |
| `sys:entity,zone:provider,base:github,name:check_run,cmd:save` |
| `sys:entity,zone:provider,base:github,name:check_suite,cmd:load` |
| `sys:entity,zone:provider,base:github,name:check_suite,cmd:save` |
| `sys:entity,zone:provider,base:github,name:check_suite_preference,cmd:save` |
| `sys:entity,zone:provider,base:github,name:classroom,cmd:list` |
| `sys:entity,zone:provider,base:github,name:classroom,cmd:load` |
| `sys:entity,zone:provider,base:github,name:classroom_accepted_assignment,cmd:list` |
| `sys:entity,zone:provider,base:github,name:classroom_assignment,cmd:load` |
| `sys:entity,zone:provider,base:github,name:classroom_assignment_grade,cmd:list` |
| `sys:entity,zone:provider,base:github,name:clone,cmd:list` |
| `sys:entity,zone:provider,base:github,name:code_frequency,cmd:list` |
| `sys:entity,zone:provider,base:github,name:code_frequency_stat,cmd:list` |
| `sys:entity,zone:provider,base:github,name:code_of_conduct,cmd:list` |
| `sys:entity,zone:provider,base:github,name:code_of_conduct,cmd:load` |
| `sys:entity,zone:provider,base:github,name:code_scanning,cmd:save` |
| `sys:entity,zone:provider,base:github,name:code_scanning,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:code_scanning_alert,cmd:load` |
| `sys:entity,zone:provider,base:github,name:code_scanning_alert,cmd:save` |
| `sys:entity,zone:provider,base:github,name:code_scanning_alert_instance,cmd:list` |
| `sys:entity,zone:provider,base:github,name:code_scanning_alert_item,cmd:list` |
| `sys:entity,zone:provider,base:github,name:code_scanning_analysi,cmd:list` |
| `sys:entity,zone:provider,base:github,name:code_scanning_analysi,cmd:load` |
| `sys:entity,zone:provider,base:github,name:code_scanning_analysis_deletion,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:code_scanning_autofix,cmd:load` |
| `sys:entity,zone:provider,base:github,name:code_scanning_autofix,cmd:save` |
| `sys:entity,zone:provider,base:github,name:code_scanning_autofix_commit,cmd:save` |
| `sys:entity,zone:provider,base:github,name:code_scanning_codeql_database,cmd:list` |
| `sys:entity,zone:provider,base:github,name:code_scanning_codeql_database,cmd:load` |
| `sys:entity,zone:provider,base:github,name:code_scanning_default_setup,cmd:list` |
| `sys:entity,zone:provider,base:github,name:code_scanning_organization_alert_item,cmd:list` |
| `sys:entity,zone:provider,base:github,name:code_scanning_sarifs_status,cmd:load` |
| `sys:entity,zone:provider,base:github,name:code_scanning_variant_analysi,cmd:load` |
| `sys:entity,zone:provider,base:github,name:code_scanning_variant_analysi,cmd:save` |
| `sys:entity,zone:provider,base:github,name:code_scanning_variant_analysis_repo_task,cmd:load` |
| `sys:entity,zone:provider,base:github,name:code_security,cmd:save` |
| `sys:entity,zone:provider,base:github,name:code_security,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:code_security_configuration,cmd:list` |
| `sys:entity,zone:provider,base:github,name:code_security_configuration,cmd:load` |
| `sys:entity,zone:provider,base:github,name:code_security_configuration,cmd:save` |
| `sys:entity,zone:provider,base:github,name:code_security_configuration_repository,cmd:list` |
| `sys:entity,zone:provider,base:github,name:code_security_default_configuration,cmd:list` |
| `sys:entity,zone:provider,base:github,name:codeowners_error,cmd:list` |
| `sys:entity,zone:provider,base:github,name:codespace,cmd:list` |
| `sys:entity,zone:provider,base:github,name:codespace,cmd:load` |
| `sys:entity,zone:provider,base:github,name:codespace,cmd:save` |
| `sys:entity,zone:provider,base:github,name:codespace,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:collaborator,cmd:list` |
| `sys:entity,zone:provider,base:github,name:combined_billing_usage,cmd:load` |
| `sys:entity,zone:provider,base:github,name:combined_commit_status,cmd:list` |
| `sys:entity,zone:provider,base:github,name:commit,cmd:list` |
| `sys:entity,zone:provider,base:github,name:commit,cmd:load` |
| `sys:entity,zone:provider,base:github,name:commit,cmd:save` |
| `sys:entity,zone:provider,base:github,name:commit_activity,cmd:list` |
| `sys:entity,zone:provider,base:github,name:commit_comment,cmd:list` |
| `sys:entity,zone:provider,base:github,name:commit_comment,cmd:load` |
| `sys:entity,zone:provider,base:github,name:commit_comment,cmd:save` |
| `sys:entity,zone:provider,base:github,name:commit_comparison,cmd:load` |
| `sys:entity,zone:provider,base:github,name:community_profile,cmd:load` |
| `sys:entity,zone:provider,base:github,name:content_file,cmd:load` |
| `sys:entity,zone:provider,base:github,name:content_traffic,cmd:list` |
| `sys:entity,zone:provider,base:github,name:contributor,cmd:list` |
| `sys:entity,zone:provider,base:github,name:copilot,cmd:list` |
| `sys:entity,zone:provider,base:github,name:copilot,cmd:load` |
| `sys:entity,zone:provider,base:github,name:copilot,cmd:save` |
| `sys:entity,zone:provider,base:github,name:copilot,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:copilot_organization_detail,cmd:load` |
| `sys:entity,zone:provider,base:github,name:copilot_usage_metrics_day,cmd:list` |
| `sys:entity,zone:provider,base:github,name:credential,cmd:save` |
| `sys:entity,zone:provider,base:github,name:custom_property,cmd:list` |
| `sys:entity,zone:provider,base:github,name:custom_property,cmd:load` |
| `sys:entity,zone:provider,base:github,name:custom_property,cmd:save` |
| `sys:entity,zone:provider,base:github,name:custom_property_value,cmd:list` |
| `sys:entity,zone:provider,base:github,name:dependabot,cmd:list` |
| `sys:entity,zone:provider,base:github,name:dependabot,cmd:save` |
| `sys:entity,zone:provider,base:github,name:dependabot,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:dependabot_alert,cmd:list` |
| `sys:entity,zone:provider,base:github,name:dependabot_alert,cmd:load` |
| `sys:entity,zone:provider,base:github,name:dependabot_alert,cmd:save` |
| `sys:entity,zone:provider,base:github,name:dependabot_alert_with_repository,cmd:list` |
| `sys:entity,zone:provider,base:github,name:dependabot_public_key,cmd:load` |
| `sys:entity,zone:provider,base:github,name:dependabot_repository_access_detail,cmd:list` |
| `sys:entity,zone:provider,base:github,name:dependabot_secret,cmd:load` |
| `sys:entity,zone:provider,base:github,name:dependency_graph,cmd:save` |
| `sys:entity,zone:provider,base:github,name:dependency_graph_diff,cmd:load` |
| `sys:entity,zone:provider,base:github,name:dependency_graph_spdx_sbom,cmd:load` |
| `sys:entity,zone:provider,base:github,name:deploy_key,cmd:list` |
| `sys:entity,zone:provider,base:github,name:deploy_key,cmd:load` |
| `sys:entity,zone:provider,base:github,name:deploy_key,cmd:save` |
| `sys:entity,zone:provider,base:github,name:deployment,cmd:list` |
| `sys:entity,zone:provider,base:github,name:deployment,cmd:load` |
| `sys:entity,zone:provider,base:github,name:deployment,cmd:save` |
| `sys:entity,zone:provider,base:github,name:deployment_branch_policy,cmd:load` |
| `sys:entity,zone:provider,base:github,name:deployment_branch_policy,cmd:save` |
| `sys:entity,zone:provider,base:github,name:deployment_protection_rule,cmd:load` |
| `sys:entity,zone:provider,base:github,name:deployment_protection_rule,cmd:save` |
| `sys:entity,zone:provider,base:github,name:deployment_status,cmd:list` |
| `sys:entity,zone:provider,base:github,name:deployment_status,cmd:load` |
| `sys:entity,zone:provider,base:github,name:deployment_status,cmd:save` |
| `sys:entity,zone:provider,base:github,name:diff_entry,cmd:list` |
| `sys:entity,zone:provider,base:github,name:email,cmd:list` |
| `sys:entity,zone:provider,base:github,name:email,cmd:save` |
| `sys:entity,zone:provider,base:github,name:emoji,cmd:load` |
| `sys:entity,zone:provider,base:github,name:empty_object,cmd:load` |
| `sys:entity,zone:provider,base:github,name:empty_object,cmd:save` |
| `sys:entity,zone:provider,base:github,name:enterprise_team,cmd:list` |
| `sys:entity,zone:provider,base:github,name:enterprise_team,cmd:load` |
| `sys:entity,zone:provider,base:github,name:enterprise_team,cmd:save` |
| `sys:entity,zone:provider,base:github,name:enterprise_team,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:enterprise_team_membership,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:environment,cmd:load` |
| `sys:entity,zone:provider,base:github,name:environment,cmd:save` |
| `sys:entity,zone:provider,base:github,name:environment_approval,cmd:list` |
| `sys:entity,zone:provider,base:github,name:event,cmd:list` |
| `sys:entity,zone:provider,base:github,name:event,cmd:load` |
| `sys:entity,zone:provider,base:github,name:feed,cmd:list` |
| `sys:entity,zone:provider,base:github,name:file_commit,cmd:save` |
| `sys:entity,zone:provider,base:github,name:file_commit,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:follower,cmd:list` |
| `sys:entity,zone:provider,base:github,name:following,cmd:list` |
| `sys:entity,zone:provider,base:github,name:full_repository,cmd:load` |
| `sys:entity,zone:provider,base:github,name:full_repository,cmd:save` |
| `sys:entity,zone:provider,base:github,name:gist,cmd:list` |
| `sys:entity,zone:provider,base:github,name:gist,cmd:load` |
| `sys:entity,zone:provider,base:github,name:gist,cmd:save` |
| `sys:entity,zone:provider,base:github,name:gist,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:gist_comment,cmd:list` |
| `sys:entity,zone:provider,base:github,name:gist_comment,cmd:load` |
| `sys:entity,zone:provider,base:github,name:gist_comment,cmd:save` |
| `sys:entity,zone:provider,base:github,name:gist_commit,cmd:list` |
| `sys:entity,zone:provider,base:github,name:gist_simple,cmd:list` |
| `sys:entity,zone:provider,base:github,name:git,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:git_commit,cmd:load` |
| `sys:entity,zone:provider,base:github,name:git_commit,cmd:save` |
| `sys:entity,zone:provider,base:github,name:git_ref,cmd:load` |
| `sys:entity,zone:provider,base:github,name:git_ref,cmd:save` |
| `sys:entity,zone:provider,base:github,name:git_tag,cmd:load` |
| `sys:entity,zone:provider,base:github,name:git_tag,cmd:save` |
| `sys:entity,zone:provider,base:github,name:git_tree,cmd:load` |
| `sys:entity,zone:provider,base:github,name:git_tree,cmd:save` |
| `sys:entity,zone:provider,base:github,name:gitignore,cmd:list` |
| `sys:entity,zone:provider,base:github,name:gitignore_template,cmd:load` |
| `sys:entity,zone:provider,base:github,name:global_advisory,cmd:list` |
| `sys:entity,zone:provider,base:github,name:global_advisory,cmd:load` |
| `sys:entity,zone:provider,base:github,name:gpg_key,cmd:list` |
| `sys:entity,zone:provider,base:github,name:gpg_key,cmd:load` |
| `sys:entity,zone:provider,base:github,name:gpg_key,cmd:save` |
| `sys:entity,zone:provider,base:github,name:hook,cmd:list` |
| `sys:entity,zone:provider,base:github,name:hook,cmd:load` |
| `sys:entity,zone:provider,base:github,name:hook,cmd:save` |
| `sys:entity,zone:provider,base:github,name:hook_delivery,cmd:load` |
| `sys:entity,zone:provider,base:github,name:hook_delivery_item,cmd:list` |
| `sys:entity,zone:provider,base:github,name:hosted_compute,cmd:list` |
| `sys:entity,zone:provider,base:github,name:hosted_compute,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:hovercard,cmd:list` |
| `sys:entity,zone:provider,base:github,name:import,cmd:list` |
| `sys:entity,zone:provider,base:github,name:import,cmd:save` |
| `sys:entity,zone:provider,base:github,name:installation,cmd:list` |
| `sys:entity,zone:provider,base:github,name:installation,cmd:load` |
| `sys:entity,zone:provider,base:github,name:installation,cmd:save` |
| `sys:entity,zone:provider,base:github,name:installation,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:installation_token,cmd:save` |
| `sys:entity,zone:provider,base:github,name:integration,cmd:list` |
| `sys:entity,zone:provider,base:github,name:integration,cmd:load` |
| `sys:entity,zone:provider,base:github,name:integration,cmd:save` |
| `sys:entity,zone:provider,base:github,name:integration,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:integration_installation,cmd:list` |
| `sys:entity,zone:provider,base:github,name:interaction,cmd:load` |
| `sys:entity,zone:provider,base:github,name:interaction,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:interaction_limit,cmd:save` |
| `sys:entity,zone:provider,base:github,name:issue,cmd:list` |
| `sys:entity,zone:provider,base:github,name:issue,cmd:load` |
| `sys:entity,zone:provider,base:github,name:issue,cmd:save` |
| `sys:entity,zone:provider,base:github,name:issue,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:issue_type,cmd:list` |
| `sys:entity,zone:provider,base:github,name:issue_type,cmd:save` |
| `sys:entity,zone:provider,base:github,name:job,cmd:load` |
| `sys:entity,zone:provider,base:github,name:key,cmd:list` |
| `sys:entity,zone:provider,base:github,name:key,cmd:load` |
| `sys:entity,zone:provider,base:github,name:key,cmd:save` |
| `sys:entity,zone:provider,base:github,name:label,cmd:list` |
| `sys:entity,zone:provider,base:github,name:label,cmd:load` |
| `sys:entity,zone:provider,base:github,name:label,cmd:save` |
| `sys:entity,zone:provider,base:github,name:language,cmd:load` |
| `sys:entity,zone:provider,base:github,name:license,cmd:list` |
| `sys:entity,zone:provider,base:github,name:license,cmd:load` |
| `sys:entity,zone:provider,base:github,name:markdown,cmd:save` |
| `sys:entity,zone:provider,base:github,name:marketplace_listing_plan,cmd:list` |
| `sys:entity,zone:provider,base:github,name:marketplace_purchase,cmd:list` |
| `sys:entity,zone:provider,base:github,name:marketplace_purchase,cmd:load` |
| `sys:entity,zone:provider,base:github,name:member,cmd:list` |
| `sys:entity,zone:provider,base:github,name:membership,cmd:list` |
| `sys:entity,zone:provider,base:github,name:membership,cmd:load` |
| `sys:entity,zone:provider,base:github,name:membership,cmd:save` |
| `sys:entity,zone:provider,base:github,name:merged_upstream,cmd:save` |
| `sys:entity,zone:provider,base:github,name:meta,cmd:list` |
| `sys:entity,zone:provider,base:github,name:meta,cmd:load` |
| `sys:entity,zone:provider,base:github,name:metaroot,cmd:load` |
| `sys:entity,zone:provider,base:github,name:migration,cmd:list` |
| `sys:entity,zone:provider,base:github,name:migration,cmd:load` |
| `sys:entity,zone:provider,base:github,name:migration,cmd:save` |
| `sys:entity,zone:provider,base:github,name:migration,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:milestone,cmd:list` |
| `sys:entity,zone:provider,base:github,name:milestone,cmd:load` |
| `sys:entity,zone:provider,base:github,name:milestone,cmd:save` |
| `sys:entity,zone:provider,base:github,name:minimal_repository,cmd:list` |
| `sys:entity,zone:provider,base:github,name:network_configuration,cmd:load` |
| `sys:entity,zone:provider,base:github,name:network_configuration,cmd:save` |
| `sys:entity,zone:provider,base:github,name:network_setting,cmd:load` |
| `sys:entity,zone:provider,base:github,name:oidc_custom_sub,cmd:list` |
| `sys:entity,zone:provider,base:github,name:oidc_custom_sub_repo,cmd:list` |
| `sys:entity,zone:provider,base:github,name:org,cmd:list` |
| `sys:entity,zone:provider,base:github,name:org,cmd:load` |
| `sys:entity,zone:provider,base:github,name:org,cmd:save` |
| `sys:entity,zone:provider,base:github,name:org,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:org_hook,cmd:list` |
| `sys:entity,zone:provider,base:github,name:org_hook,cmd:load` |
| `sys:entity,zone:provider,base:github,name:org_hook,cmd:save` |
| `sys:entity,zone:provider,base:github,name:org_membership,cmd:load` |
| `sys:entity,zone:provider,base:github,name:org_membership,cmd:save` |
| `sys:entity,zone:provider,base:github,name:org_private_registry_configuration,cmd:load` |
| `sys:entity,zone:provider,base:github,name:org_private_registry_configuration_with_selected_repository,cmd:save` |
| `sys:entity,zone:provider,base:github,name:org_repo_custom_property_value,cmd:list` |
| `sys:entity,zone:provider,base:github,name:organization_actions_secret,cmd:load` |
| `sys:entity,zone:provider,base:github,name:organization_actions_variable,cmd:load` |
| `sys:entity,zone:provider,base:github,name:organization_dependabot_secret,cmd:load` |
| `sys:entity,zone:provider,base:github,name:organization_invitation,cmd:list` |
| `sys:entity,zone:provider,base:github,name:organization_invitation,cmd:save` |
| `sys:entity,zone:provider,base:github,name:organization_programmatic_access_grant,cmd:list` |
| `sys:entity,zone:provider,base:github,name:organization_role,cmd:load` |
| `sys:entity,zone:provider,base:github,name:organization_secret_scanning_alert,cmd:list` |
| `sys:entity,zone:provider,base:github,name:outside_collaborator,cmd:list` |
| `sys:entity,zone:provider,base:github,name:package,cmd:list` |
| `sys:entity,zone:provider,base:github,name:package,cmd:load` |
| `sys:entity,zone:provider,base:github,name:package,cmd:save` |
| `sys:entity,zone:provider,base:github,name:package,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:page,cmd:load` |
| `sys:entity,zone:provider,base:github,name:page,cmd:save` |
| `sys:entity,zone:provider,base:github,name:page_build,cmd:list` |
| `sys:entity,zone:provider,base:github,name:page_build,cmd:load` |
| `sys:entity,zone:provider,base:github,name:page_build_status,cmd:save` |
| `sys:entity,zone:provider,base:github,name:page_deployment,cmd:save` |
| `sys:entity,zone:provider,base:github,name:pages_deployment_status,cmd:load` |
| `sys:entity,zone:provider,base:github,name:pages_deployment_status,cmd:save` |
| `sys:entity,zone:provider,base:github,name:pages_health_check,cmd:load` |
| `sys:entity,zone:provider,base:github,name:participation,cmd:list` |
| `sys:entity,zone:provider,base:github,name:pending_deployment,cmd:list` |
| `sys:entity,zone:provider,base:github,name:porter_author,cmd:list` |
| `sys:entity,zone:provider,base:github,name:porter_author,cmd:save` |
| `sys:entity,zone:provider,base:github,name:porter_large_file,cmd:list` |
| `sys:entity,zone:provider,base:github,name:private_registry,cmd:list` |
| `sys:entity,zone:provider,base:github,name:private_registry,cmd:load` |
| `sys:entity,zone:provider,base:github,name:private_registry,cmd:save` |
| `sys:entity,zone:provider,base:github,name:private_registry,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:project,cmd:list` |
| `sys:entity,zone:provider,base:github,name:project,cmd:load` |
| `sys:entity,zone:provider,base:github,name:project,cmd:save` |
| `sys:entity,zone:provider,base:github,name:project,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:project_collaborator_permission,cmd:load` |
| `sys:entity,zone:provider,base:github,name:project_column,cmd:list` |
| `sys:entity,zone:provider,base:github,name:project_column,cmd:load` |
| `sys:entity,zone:provider,base:github,name:project_column,cmd:save` |
| `sys:entity,zone:provider,base:github,name:projects_classic,cmd:save` |
| `sys:entity,zone:provider,base:github,name:projects_classic,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:projects_v2,cmd:list` |
| `sys:entity,zone:provider,base:github,name:projects_v2,cmd:load` |
| `sys:entity,zone:provider,base:github,name:projects_v2_field,cmd:list` |
| `sys:entity,zone:provider,base:github,name:projects_v2_field,cmd:load` |
| `sys:entity,zone:provider,base:github,name:projects_v2_item_simple,cmd:save` |
| `sys:entity,zone:provider,base:github,name:projects_v2_item_with_content,cmd:list` |
| `sys:entity,zone:provider,base:github,name:projects_v2_item_with_content,cmd:load` |
| `sys:entity,zone:provider,base:github,name:projects_v2_item_with_content,cmd:save` |
| `sys:entity,zone:provider,base:github,name:protected_branch,cmd:save` |
| `sys:entity,zone:provider,base:github,name:protected_branch_admin_enforced,cmd:load` |
| `sys:entity,zone:provider,base:github,name:protected_branch_admin_enforced,cmd:save` |
| `sys:entity,zone:provider,base:github,name:protected_branch_pull_request_review,cmd:load` |
| `sys:entity,zone:provider,base:github,name:protected_branch_pull_request_review,cmd:save` |
| `sys:entity,zone:provider,base:github,name:public_member,cmd:list` |
| `sys:entity,zone:provider,base:github,name:pull,cmd:list` |
| `sys:entity,zone:provider,base:github,name:pull,cmd:load` |
| `sys:entity,zone:provider,base:github,name:pull,cmd:save` |
| `sys:entity,zone:provider,base:github,name:pull,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:pull_request_review,cmd:list` |
| `sys:entity,zone:provider,base:github,name:pull_request_review,cmd:load` |
| `sys:entity,zone:provider,base:github,name:pull_request_review,cmd:save` |
| `sys:entity,zone:provider,base:github,name:pull_request_review,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:pull_request_review_comment,cmd:list` |
| `sys:entity,zone:provider,base:github,name:pull_request_review_comment,cmd:load` |
| `sys:entity,zone:provider,base:github,name:pull_request_review_comment,cmd:save` |
| `sys:entity,zone:provider,base:github,name:pull_request_simple,cmd:save` |
| `sys:entity,zone:provider,base:github,name:pull_request_simple,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:rate_limit,cmd:load` |
| `sys:entity,zone:provider,base:github,name:reaction,cmd:list` |
| `sys:entity,zone:provider,base:github,name:reaction,cmd:save` |
| `sys:entity,zone:provider,base:github,name:reaction,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:referrer,cmd:list` |
| `sys:entity,zone:provider,base:github,name:release,cmd:list` |
| `sys:entity,zone:provider,base:github,name:release,cmd:load` |
| `sys:entity,zone:provider,base:github,name:release,cmd:save` |
| `sys:entity,zone:provider,base:github,name:release_asset,cmd:list` |
| `sys:entity,zone:provider,base:github,name:release_asset,cmd:load` |
| `sys:entity,zone:provider,base:github,name:release_asset,cmd:save` |
| `sys:entity,zone:provider,base:github,name:release_notes_content,cmd:save` |
| `sys:entity,zone:provider,base:github,name:remove,cmd:save` |
| `sys:entity,zone:provider,base:github,name:repo,cmd:list` |
| `sys:entity,zone:provider,base:github,name:repo,cmd:load` |
| `sys:entity,zone:provider,base:github,name:repo,cmd:save` |
| `sys:entity,zone:provider,base:github,name:repo,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:repository,cmd:list` |
| `sys:entity,zone:provider,base:github,name:repository_advisory,cmd:list` |
| `sys:entity,zone:provider,base:github,name:repository_advisory,cmd:load` |
| `sys:entity,zone:provider,base:github,name:repository_advisory,cmd:save` |
| `sys:entity,zone:provider,base:github,name:repository_collaborator_permission,cmd:load` |
| `sys:entity,zone:provider,base:github,name:repository_invitation,cmd:list` |
| `sys:entity,zone:provider,base:github,name:repository_invitation,cmd:save` |
| `sys:entity,zone:provider,base:github,name:repository_rule_detailed,cmd:load` |
| `sys:entity,zone:provider,base:github,name:repository_ruleset,cmd:list` |
| `sys:entity,zone:provider,base:github,name:repository_ruleset,cmd:load` |
| `sys:entity,zone:provider,base:github,name:repository_ruleset,cmd:save` |
| `sys:entity,zone:provider,base:github,name:repository_subscription,cmd:load` |
| `sys:entity,zone:provider,base:github,name:repository_subscription,cmd:save` |
| `sys:entity,zone:provider,base:github,name:review_comment,cmd:list` |
| `sys:entity,zone:provider,base:github,name:rule_suite,cmd:list` |
| `sys:entity,zone:provider,base:github,name:rule_suite,cmd:load` |
| `sys:entity,zone:provider,base:github,name:ruleset_version,cmd:list` |
| `sys:entity,zone:provider,base:github,name:ruleset_version_with_state,cmd:load` |
| `sys:entity,zone:provider,base:github,name:runner,cmd:load` |
| `sys:entity,zone:provider,base:github,name:runner_application,cmd:list` |
| `sys:entity,zone:provider,base:github,name:runner_group,cmd:load` |
| `sys:entity,zone:provider,base:github,name:runner_group,cmd:save` |
| `sys:entity,zone:provider,base:github,name:search,cmd:list` |
| `sys:entity,zone:provider,base:github,name:secret_scanning,cmd:save` |
| `sys:entity,zone:provider,base:github,name:secret_scanning_alert,cmd:list` |
| `sys:entity,zone:provider,base:github,name:secret_scanning_alert,cmd:load` |
| `sys:entity,zone:provider,base:github,name:secret_scanning_alert,cmd:save` |
| `sys:entity,zone:provider,base:github,name:secret_scanning_location,cmd:list` |
| `sys:entity,zone:provider,base:github,name:secret_scanning_pattern_configuration,cmd:list` |
| `sys:entity,zone:provider,base:github,name:secret_scanning_push_protection_bypass,cmd:save` |
| `sys:entity,zone:provider,base:github,name:secret_scanning_scan_history,cmd:list` |
| `sys:entity,zone:provider,base:github,name:security_advisory,cmd:save` |
| `sys:entity,zone:provider,base:github,name:selected_action,cmd:list` |
| `sys:entity,zone:provider,base:github,name:self_hosted_runner,cmd:load` |
| `sys:entity,zone:provider,base:github,name:short_blob,cmd:save` |
| `sys:entity,zone:provider,base:github,name:short_branch,cmd:list` |
| `sys:entity,zone:provider,base:github,name:simple_classroom_assignment,cmd:list` |
| `sys:entity,zone:provider,base:github,name:social_account,cmd:list` |
| `sys:entity,zone:provider,base:github,name:social_account,cmd:save` |
| `sys:entity,zone:provider,base:github,name:ssh_signing_key,cmd:list` |
| `sys:entity,zone:provider,base:github,name:ssh_signing_key,cmd:load` |
| `sys:entity,zone:provider,base:github,name:ssh_signing_key,cmd:save` |
| `sys:entity,zone:provider,base:github,name:status,cmd:list` |
| `sys:entity,zone:provider,base:github,name:status,cmd:save` |
| `sys:entity,zone:provider,base:github,name:status_check_policy,cmd:list` |
| `sys:entity,zone:provider,base:github,name:status_check_policy,cmd:save` |
| `sys:entity,zone:provider,base:github,name:subscriber,cmd:list` |
| `sys:entity,zone:provider,base:github,name:tag,cmd:list` |
| `sys:entity,zone:provider,base:github,name:tag_protection,cmd:list` |
| `sys:entity,zone:provider,base:github,name:tag_protection,cmd:save` |
| `sys:entity,zone:provider,base:github,name:team,cmd:list` |
| `sys:entity,zone:provider,base:github,name:team,cmd:load` |
| `sys:entity,zone:provider,base:github,name:team,cmd:save` |
| `sys:entity,zone:provider,base:github,name:team,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:team_simple,cmd:list` |
| `sys:entity,zone:provider,base:github,name:thread,cmd:list` |
| `sys:entity,zone:provider,base:github,name:thread,cmd:load` |
| `sys:entity,zone:provider,base:github,name:thread,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:thread_subscription,cmd:load` |
| `sys:entity,zone:provider,base:github,name:thread_subscription,cmd:save` |
| `sys:entity,zone:provider,base:github,name:topic,cmd:list` |
| `sys:entity,zone:provider,base:github,name:topic,cmd:save` |
| `sys:entity,zone:provider,base:github,name:user,cmd:list` |
| `sys:entity,zone:provider,base:github,name:user,cmd:load` |
| `sys:entity,zone:provider,base:github,name:user,cmd:save` |
| `sys:entity,zone:provider,base:github,name:user,cmd:remove` |
| `sys:entity,zone:provider,base:github,name:user_marketplace_purchase,cmd:list` |
| `sys:entity,zone:provider,base:github,name:view,cmd:list` |
| `sys:entity,zone:provider,base:github,name:webhook_config,cmd:load` |
| `sys:entity,zone:provider,base:github,name:webhook_config,cmd:save` |
| `sys:entity,zone:provider,base:github,name:workflow,cmd:load` |
| `sys:entity,zone:provider,base:github,name:workflow,cmd:save` |
| `sys:entity,zone:provider,base:github,name:workflow_run,cmd:load` |
| `sys:entity,zone:provider,base:github,name:workflow_run,cmd:save` |
| `sys:entity,zone:provider,base:github,name:workflow_run_usage,cmd:load` |
| `sys:entity,zone:provider,base:github,name:workflow_usage,cmd:load` |

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
const gists = (await sdk.Gist().list()).map((e) => e.data())

// `direct` reaches endpoints outside the entity model.
const res = await sdk.direct({ path: '/meta', method: 'GET' })
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
  await seneca.entity('provider/github/gist').list$()
}
catch (err) {
  console.error(err.code, err.status, err.notFound)
}
```

The missing-parent-key guard is this plugin's own, thrown before the SDK is
called at all. Its message names the entity, the command and the key:

| Entity | Message |
| ------ | ------- |
| `action` | `@seneca/github-provider: action <cmd>: artifact_id is required` |
| `action` | `@seneca/github-provider: action <cmd>: hosted_runner_id is required` |
| `action` | `@seneca/github-provider: action <cmd>: name is required` |
| `action` | `@seneca/github-provider: action <cmd>: org_id is required` |
| `action` | `@seneca/github-provider: action <cmd>: owner is required` |
| `action` | `@seneca/github-provider: action <cmd>: repo is required` |
| `action` | `@seneca/github-provider: action <cmd>: repository_id is required` |
| `actions_cache_list` | `@seneca/github-provider: actions_cache_list <cmd>: key is required` |
| `actions_cache_list` | `@seneca/github-provider: actions_cache_list <cmd>: owner is required` |
| `actions_cache_usage_by_repository` | `@seneca/github-provider: actions_cache_usage_by_repository <cmd>: owner is required` |
| `actions_hosted_runner` | `@seneca/github-provider: actions_hosted_runner <cmd>: org_id is required` |
| `actions_repository_permission` | `@seneca/github-provider: actions_repository_permission <cmd>: owner is required` |
| `actions_secret` | `@seneca/github-provider: actions_secret <cmd>: owner is required` |
| `actions_secret` | `@seneca/github-provider: actions_secret <cmd>: repo is required` |
| `actions_variable` | `@seneca/github-provider: actions_variable <cmd>: owner is required` |
| `actions_variable` | `@seneca/github-provider: actions_variable <cmd>: repo is required` |
| `actions_workflow_access_to_repository` | `@seneca/github-provider: actions_workflow_access_to_repository <cmd>: owner is required` |
| `activity` | `@seneca/github-provider: activity <cmd>: owner is required` |
| `activity` | `@seneca/github-provider: activity <cmd>: thread_id is required` |
| `add` | `@seneca/github-provider: add <cmd>: enterprise is required` |
| `add` | `@seneca/github-provider: add <cmd>: team_id is required` |
| `api_insights_route_stat` | `@seneca/github-provider: api_insights_route_stat <cmd>: actor_id is required` |
| `api_insights_route_stat` | `@seneca/github-provider: api_insights_route_stat <cmd>: actor_type is required` |
| `api_insights_route_stat` | `@seneca/github-provider: api_insights_route_stat <cmd>: min_timestamp is required` |
| `api_insights_route_stat` | `@seneca/github-provider: api_insights_route_stat <cmd>: org is required` |
| `api_insights_subject_stat` | `@seneca/github-provider: api_insights_subject_stat <cmd>: min_timestamp is required` |
| `api_insights_subject_stat` | `@seneca/github-provider: api_insights_subject_stat <cmd>: org_id is required` |
| `api_insights_summary_stat` | `@seneca/github-provider: api_insights_summary_stat <cmd>: min_timestamp is required` |
| `api_insights_time_stat` | `@seneca/github-provider: api_insights_time_stat <cmd>: min_timestamp is required` |
| `api_insights_time_stat` | `@seneca/github-provider: api_insights_time_stat <cmd>: org_id is required` |
| `api_insights_time_stat` | `@seneca/github-provider: api_insights_time_stat <cmd>: timestamp_increment is required` |
| `api_insights_user_stat` | `@seneca/github-provider: api_insights_user_stat <cmd>: min_timestamp is required` |
| `api_insights_user_stat` | `@seneca/github-provider: api_insights_user_stat <cmd>: org_id is required` |
| `app` | `@seneca/github-provider: app <cmd>: code is required` |
| `app` | `@seneca/github-provider: app <cmd>: repository_id is required` |
| `artifact` | `@seneca/github-provider: artifact <cmd>: owner is required` |
| `artifact` | `@seneca/github-provider: artifact <cmd>: repo is required` |
| `assignee` | `@seneca/github-provider: assignee <cmd>: owner is required` |
| `assignee` | `@seneca/github-provider: assignee <cmd>: repo is required` |
| `authentication_token` | `@seneca/github-provider: authentication_token <cmd>: org_id is required` |
| `autolink` | `@seneca/github-provider: autolink <cmd>: owner is required` |
| `autolink` | `@seneca/github-provider: autolink <cmd>: repo is required` |
| `base_gist` | `@seneca/github-provider: base_gist <cmd>: gist_id is required` |
| `billing_usage_report` | `@seneca/github-provider: billing_usage_report <cmd>: org is required` |
| `billing_usage_report_user` | `@seneca/github-provider: billing_usage_report_user <cmd>: username is required` |
| `blob` | `@seneca/github-provider: blob <cmd>: owner is required` |
| `blob` | `@seneca/github-provider: blob <cmd>: repo is required` |
| `branch` | `@seneca/github-provider: branch <cmd>: owner is required` |
| `branch` | `@seneca/github-provider: branch <cmd>: repo is required` |
| `branch_protection` | `@seneca/github-provider: branch_protection <cmd>: owner is required` |
| `branch_protection` | `@seneca/github-provider: branch_protection <cmd>: repo is required` |
| `branch_restriction_policy` | `@seneca/github-provider: branch_restriction_policy <cmd>: branch_id is required` |
| `branch_restriction_policy` | `@seneca/github-provider: branch_restriction_policy <cmd>: owner is required` |
| `branch_restriction_policy` | `@seneca/github-provider: branch_restriction_policy <cmd>: repo is required` |
| `branch_short` | `@seneca/github-provider: branch_short <cmd>: commit_sha is required` |
| `branch_short` | `@seneca/github-provider: branch_short <cmd>: owner is required` |
| `branch_short` | `@seneca/github-provider: branch_short <cmd>: repo is required` |
| `branch_with_protection` | `@seneca/github-provider: branch_with_protection <cmd>: owner is required` |
| `branch_with_protection` | `@seneca/github-provider: branch_with_protection <cmd>: repo is required` |
| `campaign` | `@seneca/github-provider: campaign <cmd>: org_id is required` |
| `check` | `@seneca/github-provider: check <cmd>: owner is required` |
| `check` | `@seneca/github-provider: check <cmd>: repo is required` |
| `check_annotation` | `@seneca/github-provider: check_annotation <cmd>: check_run_id is required` |
| `check_annotation` | `@seneca/github-provider: check_annotation <cmd>: owner is required` |
| `check_annotation` | `@seneca/github-provider: check_annotation <cmd>: repo is required` |
| `check_automated_security_fix` | `@seneca/github-provider: check_automated_security_fix <cmd>: owner is required` |
| `check_run` | `@seneca/github-provider: check_run <cmd>: owner is required` |
| `check_run` | `@seneca/github-provider: check_run <cmd>: repo is required` |
| `check_suite` | `@seneca/github-provider: check_suite <cmd>: owner is required` |
| `check_suite` | `@seneca/github-provider: check_suite <cmd>: repo is required` |
| `check_suite_preference` | `@seneca/github-provider: check_suite_preference <cmd>: owner is required` |
| `classroom_accepted_assignment` | `@seneca/github-provider: classroom_accepted_assignment <cmd>: assignment_id is required` |
| `classroom_assignment_grade` | `@seneca/github-provider: classroom_assignment_grade <cmd>: assignment_id is required` |
| `clone` | `@seneca/github-provider: clone <cmd>: owner is required` |
| `clone` | `@seneca/github-provider: clone <cmd>: repo is required` |
| `code_frequency` | `@seneca/github-provider: code_frequency <cmd>: owner is required` |
| `code_frequency` | `@seneca/github-provider: code_frequency <cmd>: repo is required` |
| `code_frequency_stat` | `@seneca/github-provider: code_frequency_stat <cmd>: owner is required` |
| `code_frequency_stat` | `@seneca/github-provider: code_frequency_stat <cmd>: repo is required` |
| `code_scanning` | `@seneca/github-provider: code_scanning <cmd>: owner is required` |
| `code_scanning` | `@seneca/github-provider: code_scanning <cmd>: repo is required` |
| `code_scanning_alert` | `@seneca/github-provider: code_scanning_alert <cmd>: owner is required` |
| `code_scanning_alert` | `@seneca/github-provider: code_scanning_alert <cmd>: repo is required` |
| `code_scanning_alert_instance` | `@seneca/github-provider: code_scanning_alert_instance <cmd>: alert_number is required` |
| `code_scanning_alert_instance` | `@seneca/github-provider: code_scanning_alert_instance <cmd>: owner is required` |
| `code_scanning_alert_instance` | `@seneca/github-provider: code_scanning_alert_instance <cmd>: repo is required` |
| `code_scanning_alert_item` | `@seneca/github-provider: code_scanning_alert_item <cmd>: owner is required` |
| `code_scanning_alert_item` | `@seneca/github-provider: code_scanning_alert_item <cmd>: repo is required` |
| `code_scanning_analysi` | `@seneca/github-provider: code_scanning_analysi <cmd>: owner is required` |
| `code_scanning_analysi` | `@seneca/github-provider: code_scanning_analysi <cmd>: repo is required` |
| `code_scanning_analysis_deletion` | `@seneca/github-provider: code_scanning_analysis_deletion <cmd>: owner is required` |
| `code_scanning_analysis_deletion` | `@seneca/github-provider: code_scanning_analysis_deletion <cmd>: repo is required` |
| `code_scanning_autofix` | `@seneca/github-provider: code_scanning_autofix <cmd>: owner is required` |
| `code_scanning_autofix` | `@seneca/github-provider: code_scanning_autofix <cmd>: repo is required` |
| `code_scanning_autofix_commit` | `@seneca/github-provider: code_scanning_autofix_commit <cmd>: alert_id is required` |
| `code_scanning_autofix_commit` | `@seneca/github-provider: code_scanning_autofix_commit <cmd>: owner is required` |
| `code_scanning_autofix_commit` | `@seneca/github-provider: code_scanning_autofix_commit <cmd>: repo is required` |
| `code_scanning_codeql_database` | `@seneca/github-provider: code_scanning_codeql_database <cmd>: owner is required` |
| `code_scanning_codeql_database` | `@seneca/github-provider: code_scanning_codeql_database <cmd>: repo is required` |
| `code_scanning_default_setup` | `@seneca/github-provider: code_scanning_default_setup <cmd>: owner is required` |
| `code_scanning_default_setup` | `@seneca/github-provider: code_scanning_default_setup <cmd>: repo is required` |
| `code_scanning_organization_alert_item` | `@seneca/github-provider: code_scanning_organization_alert_item <cmd>: org_id is required` |
| `code_scanning_sarifs_status` | `@seneca/github-provider: code_scanning_sarifs_status <cmd>: owner is required` |
| `code_scanning_sarifs_status` | `@seneca/github-provider: code_scanning_sarifs_status <cmd>: repo is required` |
| `code_scanning_variant_analysi` | `@seneca/github-provider: code_scanning_variant_analysi <cmd>: owner is required` |
| `code_scanning_variant_analysi` | `@seneca/github-provider: code_scanning_variant_analysi <cmd>: repo is required` |
| `code_scanning_variant_analysis_repo_task` | `@seneca/github-provider: code_scanning_variant_analysis_repo_task <cmd>: codeql_variant_analysis_id is required` |
| `code_scanning_variant_analysis_repo_task` | `@seneca/github-provider: code_scanning_variant_analysis_repo_task <cmd>: owner is required` |
| `code_scanning_variant_analysis_repo_task` | `@seneca/github-provider: code_scanning_variant_analysis_repo_task <cmd>: repo is required` |
| `code_scanning_variant_analysis_repo_task` | `@seneca/github-provider: code_scanning_variant_analysis_repo_task <cmd>: repo_owner is required` |
| `code_security` | `@seneca/github-provider: code_security <cmd>: enterprise is required` |
| `code_security_configuration` | `@seneca/github-provider: code_security_configuration <cmd>: enterprise is required` |
| `code_security_configuration` | `@seneca/github-provider: code_security_configuration <cmd>: org_id is required` |
| `code_security_configuration_repository` | `@seneca/github-provider: code_security_configuration_repository <cmd>: configuration_id is required` |
| `code_security_default_configuration` | `@seneca/github-provider: code_security_default_configuration <cmd>: enterprise is required` |
| `codeowners_error` | `@seneca/github-provider: codeowners_error <cmd>: owner is required` |
| `codeowners_error` | `@seneca/github-provider: codeowners_error <cmd>: repo is required` |
| `codespace` | `@seneca/github-provider: codespace <cmd>: secret_name is required` |
| `collaborator` | `@seneca/github-provider: collaborator <cmd>: project_id is required` |
| `combined_commit_status` | `@seneca/github-provider: combined_commit_status <cmd>: owner is required` |
| `combined_commit_status` | `@seneca/github-provider: combined_commit_status <cmd>: ref is required` |
| `combined_commit_status` | `@seneca/github-provider: combined_commit_status <cmd>: repo is required` |
| `commit` | `@seneca/github-provider: commit <cmd>: owner is required` |
| `commit` | `@seneca/github-provider: commit <cmd>: repo is required` |
| `commit_activity` | `@seneca/github-provider: commit_activity <cmd>: owner is required` |
| `commit_activity` | `@seneca/github-provider: commit_activity <cmd>: repo is required` |
| `commit_comment` | `@seneca/github-provider: commit_comment <cmd>: commit_sha is required` |
| `commit_comment` | `@seneca/github-provider: commit_comment <cmd>: owner is required` |
| `commit_comment` | `@seneca/github-provider: commit_comment <cmd>: repo is required` |
| `commit_comparison` | `@seneca/github-provider: commit_comparison <cmd>: owner is required` |
| `commit_comparison` | `@seneca/github-provider: commit_comparison <cmd>: repo is required` |
| `community_profile` | `@seneca/github-provider: community_profile <cmd>: owner is required` |
| `content_file` | `@seneca/github-provider: content_file <cmd>: owner is required` |
| `content_file` | `@seneca/github-provider: content_file <cmd>: repo is required` |
| `content_traffic` | `@seneca/github-provider: content_traffic <cmd>: owner is required` |
| `content_traffic` | `@seneca/github-provider: content_traffic <cmd>: repo is required` |
| `contributor` | `@seneca/github-provider: contributor <cmd>: owner is required` |
| `contributor` | `@seneca/github-provider: contributor <cmd>: repo is required` |
| `copilot` | `@seneca/github-provider: copilot <cmd>: org_id is required` |
| `copilot_usage_metrics_day` | `@seneca/github-provider: copilot_usage_metrics_day <cmd>: org_id is required` |
| `custom_property` | `@seneca/github-provider: custom_property <cmd>: org_id is required` |
| `custom_property_value` | `@seneca/github-provider: custom_property_value <cmd>: owner is required` |
| `custom_property_value` | `@seneca/github-provider: custom_property_value <cmd>: repo is required` |
| `dependabot` | `@seneca/github-provider: dependabot <cmd>: org is required` |
| `dependabot` | `@seneca/github-provider: dependabot <cmd>: org_id is required` |
| `dependabot` | `@seneca/github-provider: dependabot <cmd>: repository_id is required` |
| `dependabot` | `@seneca/github-provider: dependabot <cmd>: secret_id is required` |
| `dependabot_alert` | `@seneca/github-provider: dependabot_alert <cmd>: owner is required` |
| `dependabot_alert` | `@seneca/github-provider: dependabot_alert <cmd>: repo is required` |
| `dependabot_alert_with_repository` | `@seneca/github-provider: dependabot_alert_with_repository <cmd>: org_id is required` |
| `dependabot_repository_access_detail` | `@seneca/github-provider: dependabot_repository_access_detail <cmd>: org is required` |
| `dependabot_secret` | `@seneca/github-provider: dependabot_secret <cmd>: owner is required` |
| `dependabot_secret` | `@seneca/github-provider: dependabot_secret <cmd>: repo is required` |
| `dependency_graph` | `@seneca/github-provider: dependency_graph <cmd>: owner is required` |
| `dependency_graph` | `@seneca/github-provider: dependency_graph <cmd>: repo is required` |
| `dependency_graph_diff` | `@seneca/github-provider: dependency_graph_diff <cmd>: owner is required` |
| `dependency_graph_diff` | `@seneca/github-provider: dependency_graph_diff <cmd>: repo is required` |
| `dependency_graph_spdx_sbom` | `@seneca/github-provider: dependency_graph_spdx_sbom <cmd>: owner is required` |
| `deploy_key` | `@seneca/github-provider: deploy_key <cmd>: owner is required` |
| `deploy_key` | `@seneca/github-provider: deploy_key <cmd>: repo is required` |
| `deployment` | `@seneca/github-provider: deployment <cmd>: owner is required` |
| `deployment` | `@seneca/github-provider: deployment <cmd>: repo is required` |
| `deployment_branch_policy` | `@seneca/github-provider: deployment_branch_policy <cmd>: environment_id is required` |
| `deployment_branch_policy` | `@seneca/github-provider: deployment_branch_policy <cmd>: environment_name is required` |
| `deployment_branch_policy` | `@seneca/github-provider: deployment_branch_policy <cmd>: owner is required` |
| `deployment_branch_policy` | `@seneca/github-provider: deployment_branch_policy <cmd>: repo is required` |
| `deployment_protection_rule` | `@seneca/github-provider: deployment_protection_rule <cmd>: environment_id is required` |
| `deployment_protection_rule` | `@seneca/github-provider: deployment_protection_rule <cmd>: environment_name is required` |
| `deployment_protection_rule` | `@seneca/github-provider: deployment_protection_rule <cmd>: owner is required` |
| `deployment_protection_rule` | `@seneca/github-provider: deployment_protection_rule <cmd>: repo is required` |
| `deployment_status` | `@seneca/github-provider: deployment_status <cmd>: deployment_id is required` |
| `deployment_status` | `@seneca/github-provider: deployment_status <cmd>: owner is required` |
| `deployment_status` | `@seneca/github-provider: deployment_status <cmd>: repo is required` |
| `diff_entry` | `@seneca/github-provider: diff_entry <cmd>: owner is required` |
| `diff_entry` | `@seneca/github-provider: diff_entry <cmd>: pull_number is required` |
| `diff_entry` | `@seneca/github-provider: diff_entry <cmd>: repo is required` |
| `empty_object` | `@seneca/github-provider: empty_object <cmd>: org_id is required` |
| `empty_object` | `@seneca/github-provider: empty_object <cmd>: owner is required` |
| `empty_object` | `@seneca/github-provider: empty_object <cmd>: repo is required` |
| `empty_object` | `@seneca/github-provider: empty_object <cmd>: secret_name is required` |
| `empty_object` | `@seneca/github-provider: empty_object <cmd>: username is required` |
| `enterprise_team` | `@seneca/github-provider: enterprise_team <cmd>: enterprise is required` |
| `enterprise_team_membership` | `@seneca/github-provider: enterprise_team_membership <cmd>: enterprise is required` |
| `enterprise_team_membership` | `@seneca/github-provider: enterprise_team_membership <cmd>: team_id is required` |
| `environment` | `@seneca/github-provider: environment <cmd>: owner is required` |
| `environment` | `@seneca/github-provider: environment <cmd>: repo is required` |
| `environment_approval` | `@seneca/github-provider: environment_approval <cmd>: owner is required` |
| `environment_approval` | `@seneca/github-provider: environment_approval <cmd>: repo is required` |
| `environment_approval` | `@seneca/github-provider: environment_approval <cmd>: run_id is required` |
| `event` | `@seneca/github-provider: event <cmd>: username is required` |
| `file_commit` | `@seneca/github-provider: file_commit <cmd>: owner is required` |
| `file_commit` | `@seneca/github-provider: file_commit <cmd>: repo is required` |
| `full_repository` | `@seneca/github-provider: full_repository <cmd>: owner is required` |
| `gist_comment` | `@seneca/github-provider: gist_comment <cmd>: gist_id is required` |
| `git` | `@seneca/github-provider: git <cmd>: owner is required` |
| `git` | `@seneca/github-provider: git <cmd>: repo is required` |
| `git_commit` | `@seneca/github-provider: git_commit <cmd>: owner is required` |
| `git_commit` | `@seneca/github-provider: git_commit <cmd>: repo is required` |
| `git_ref` | `@seneca/github-provider: git_ref <cmd>: owner is required` |
| `git_ref` | `@seneca/github-provider: git_ref <cmd>: repo is required` |
| `git_tag` | `@seneca/github-provider: git_tag <cmd>: owner is required` |
| `git_tag` | `@seneca/github-provider: git_tag <cmd>: repo is required` |
| `git_tree` | `@seneca/github-provider: git_tree <cmd>: owner is required` |
| `git_tree` | `@seneca/github-provider: git_tree <cmd>: repo is required` |
| `hook` | `@seneca/github-provider: hook <cmd>: owner is required` |
| `hook` | `@seneca/github-provider: hook <cmd>: repo is required` |
| `hosted_compute` | `@seneca/github-provider: hosted_compute <cmd>: org_id is required` |
| `hovercard` | `@seneca/github-provider: hovercard <cmd>: username is required` |
| `import` | `@seneca/github-provider: import <cmd>: owner is required` |
| `integration` | `@seneca/github-provider: integration <cmd>: branch_id is required` |
| `integration` | `@seneca/github-provider: integration <cmd>: owner is required` |
| `integration` | `@seneca/github-provider: integration <cmd>: repo is required` |
| `issue` | `@seneca/github-provider: issue <cmd>: owner is required` |
| `issue` | `@seneca/github-provider: issue <cmd>: repo is required` |
| `issue_type` | `@seneca/github-provider: issue_type <cmd>: org_id is required` |
| `job` | `@seneca/github-provider: job <cmd>: owner is required` |
| `job` | `@seneca/github-provider: job <cmd>: repo is required` |
| `label` | `@seneca/github-provider: label <cmd>: owner is required` |
| `label` | `@seneca/github-provider: label <cmd>: repo is required` |
| `language` | `@seneca/github-provider: language <cmd>: owner is required` |
| `marketplace_purchase` | `@seneca/github-provider: marketplace_purchase <cmd>: plan_id is required` |
| `member` | `@seneca/github-provider: member <cmd>: org_id is required` |
| `membership` | `@seneca/github-provider: membership <cmd>: enterprise is required` |
| `membership` | `@seneca/github-provider: membership <cmd>: enterprise_team is required` |
| `membership` | `@seneca/github-provider: membership <cmd>: team_id is required` |
| `merged_upstream` | `@seneca/github-provider: merged_upstream <cmd>: owner is required` |
| `merged_upstream` | `@seneca/github-provider: merged_upstream <cmd>: repo is required` |
| `migration` | `@seneca/github-provider: migration <cmd>: owner is required` |
| `migration` | `@seneca/github-provider: migration <cmd>: repo is required` |
| `milestone` | `@seneca/github-provider: milestone <cmd>: owner is required` |
| `milestone` | `@seneca/github-provider: milestone <cmd>: repo is required` |
| `network_configuration` | `@seneca/github-provider: network_configuration <cmd>: org_id is required` |
| `network_setting` | `@seneca/github-provider: network_setting <cmd>: org_id is required` |
| `oidc_custom_sub` | `@seneca/github-provider: oidc_custom_sub <cmd>: org_id is required` |
| `oidc_custom_sub_repo` | `@seneca/github-provider: oidc_custom_sub_repo <cmd>: owner is required` |
| `oidc_custom_sub_repo` | `@seneca/github-provider: oidc_custom_sub_repo <cmd>: repo is required` |
| `org` | `@seneca/github-provider: org <cmd>: enablement is required` |
| `org` | `@seneca/github-provider: org <cmd>: org is required` |
| `org` | `@seneca/github-provider: org <cmd>: security_product is required` |
| `org` | `@seneca/github-provider: org <cmd>: username is required` |
| `org_hook` | `@seneca/github-provider: org_hook <cmd>: org_id is required` |
| `org_membership` | `@seneca/github-provider: org_membership <cmd>: org_id is required` |
| `org_private_registry_configuration` | `@seneca/github-provider: org_private_registry_configuration <cmd>: org_id is required` |
| `org_repo_custom_property_value` | `@seneca/github-provider: org_repo_custom_property_value <cmd>: org_id is required` |
| `organization_actions_secret` | `@seneca/github-provider: organization_actions_secret <cmd>: org_id is required` |
| `organization_actions_variable` | `@seneca/github-provider: organization_actions_variable <cmd>: org_id is required` |
| `organization_dependabot_secret` | `@seneca/github-provider: organization_dependabot_secret <cmd>: org_id is required` |
| `organization_invitation` | `@seneca/github-provider: organization_invitation <cmd>: org_id is required` |
| `organization_programmatic_access_grant` | `@seneca/github-provider: organization_programmatic_access_grant <cmd>: org_id is required` |
| `organization_role` | `@seneca/github-provider: organization_role <cmd>: org_id is required` |
| `organization_secret_scanning_alert` | `@seneca/github-provider: organization_secret_scanning_alert <cmd>: org_id is required` |
| `outside_collaborator` | `@seneca/github-provider: outside_collaborator <cmd>: org_id is required` |
| `package` | `@seneca/github-provider: package <cmd>: package_id is required` |
| `package` | `@seneca/github-provider: package <cmd>: package_type is required` |
| `page` | `@seneca/github-provider: page <cmd>: owner is required` |
| `page_build` | `@seneca/github-provider: page_build <cmd>: owner is required` |
| `page_build` | `@seneca/github-provider: page_build <cmd>: repo is required` |
| `page_build_status` | `@seneca/github-provider: page_build_status <cmd>: owner is required` |
| `page_build_status` | `@seneca/github-provider: page_build_status <cmd>: repo is required` |
| `page_deployment` | `@seneca/github-provider: page_deployment <cmd>: owner is required` |
| `page_deployment` | `@seneca/github-provider: page_deployment <cmd>: repo is required` |
| `pages_deployment_status` | `@seneca/github-provider: pages_deployment_status <cmd>: deployment_id is required` |
| `pages_deployment_status` | `@seneca/github-provider: pages_deployment_status <cmd>: owner is required` |
| `pages_deployment_status` | `@seneca/github-provider: pages_deployment_status <cmd>: repo is required` |
| `pages_health_check` | `@seneca/github-provider: pages_health_check <cmd>: owner is required` |
| `participation` | `@seneca/github-provider: participation <cmd>: owner is required` |
| `participation` | `@seneca/github-provider: participation <cmd>: repo is required` |
| `pending_deployment` | `@seneca/github-provider: pending_deployment <cmd>: owner is required` |
| `pending_deployment` | `@seneca/github-provider: pending_deployment <cmd>: repo is required` |
| `pending_deployment` | `@seneca/github-provider: pending_deployment <cmd>: run_id is required` |
| `porter_author` | `@seneca/github-provider: porter_author <cmd>: owner is required` |
| `porter_author` | `@seneca/github-provider: porter_author <cmd>: repo is required` |
| `porter_large_file` | `@seneca/github-provider: porter_large_file <cmd>: owner is required` |
| `porter_large_file` | `@seneca/github-provider: porter_large_file <cmd>: repo is required` |
| `project` | `@seneca/github-provider: project <cmd>: org_id is required` |
| `project_collaborator_permission` | `@seneca/github-provider: project_collaborator_permission <cmd>: project_id is required` |
| `projects_classic` | `@seneca/github-provider: projects_classic <cmd>: project_id is required` |
| `projects_classic` | `@seneca/github-provider: projects_classic <cmd>: username is required` |
| `projects_v2` | `@seneca/github-provider: projects_v2 <cmd>: org_id is required` |
| `projects_v2_field` | `@seneca/github-provider: projects_v2_field <cmd>: project_number is required` |
| `projects_v2_field` | `@seneca/github-provider: projects_v2_field <cmd>: projects_v2_id is required` |
| `projects_v2_item_simple` | `@seneca/github-provider: projects_v2_item_simple <cmd>: project_number is required` |
| `projects_v2_item_with_content` | `@seneca/github-provider: projects_v2_item_with_content <cmd>: project_number is required` |
| `projects_v2_item_with_content` | `@seneca/github-provider: projects_v2_item_with_content <cmd>: projects_v2_id is required` |
| `protected_branch` | `@seneca/github-provider: protected_branch <cmd>: owner is required` |
| `protected_branch` | `@seneca/github-provider: protected_branch <cmd>: repo is required` |
| `protected_branch_admin_enforced` | `@seneca/github-provider: protected_branch_admin_enforced <cmd>: owner is required` |
| `protected_branch_admin_enforced` | `@seneca/github-provider: protected_branch_admin_enforced <cmd>: repo is required` |
| `protected_branch_pull_request_review` | `@seneca/github-provider: protected_branch_pull_request_review <cmd>: owner is required` |
| `protected_branch_pull_request_review` | `@seneca/github-provider: protected_branch_pull_request_review <cmd>: repo is required` |
| `public_member` | `@seneca/github-provider: public_member <cmd>: org_id is required` |
| `pull` | `@seneca/github-provider: pull <cmd>: comment_id is required` |
| `pull` | `@seneca/github-provider: pull <cmd>: owner is required` |
| `pull` | `@seneca/github-provider: pull <cmd>: repo is required` |
| `pull_request_review` | `@seneca/github-provider: pull_request_review <cmd>: owner is required` |
| `pull_request_review` | `@seneca/github-provider: pull_request_review <cmd>: pull_id is required` |
| `pull_request_review` | `@seneca/github-provider: pull_request_review <cmd>: pull_number is required` |
| `pull_request_review` | `@seneca/github-provider: pull_request_review <cmd>: repo is required` |
| `pull_request_review_comment` | `@seneca/github-provider: pull_request_review_comment <cmd>: owner is required` |
| `pull_request_review_comment` | `@seneca/github-provider: pull_request_review_comment <cmd>: repo is required` |
| `pull_request_simple` | `@seneca/github-provider: pull_request_simple <cmd>: owner is required` |
| `pull_request_simple` | `@seneca/github-provider: pull_request_simple <cmd>: repo is required` |
| `reaction` | `@seneca/github-provider: reaction <cmd>: discussion_number is required` |
| `reaction` | `@seneca/github-provider: reaction <cmd>: team_id is required` |
| `referrer` | `@seneca/github-provider: referrer <cmd>: owner is required` |
| `referrer` | `@seneca/github-provider: referrer <cmd>: repo is required` |
| `release` | `@seneca/github-provider: release <cmd>: owner is required` |
| `release` | `@seneca/github-provider: release <cmd>: repo is required` |
| `release_asset` | `@seneca/github-provider: release_asset <cmd>: name is required` |
| `release_asset` | `@seneca/github-provider: release_asset <cmd>: owner is required` |
| `release_asset` | `@seneca/github-provider: release_asset <cmd>: repo is required` |
| `release_notes_content` | `@seneca/github-provider: release_notes_content <cmd>: owner is required` |
| `release_notes_content` | `@seneca/github-provider: release_notes_content <cmd>: repo is required` |
| `remove` | `@seneca/github-provider: remove <cmd>: enterprise is required` |
| `remove` | `@seneca/github-provider: remove <cmd>: team_id is required` |
| `repo` | `@seneca/github-provider: repo <cmd>: branch_id is required` |
| `repo` | `@seneca/github-provider: repo <cmd>: invitation_id is required` |
| `repo` | `@seneca/github-provider: repo <cmd>: owner is required` |
| `repo` | `@seneca/github-provider: repo <cmd>: repo is required` |
| `repository_advisory` | `@seneca/github-provider: repository_advisory <cmd>: org_id is required` |
| `repository_advisory` | `@seneca/github-provider: repository_advisory <cmd>: owner is required` |
| `repository_advisory` | `@seneca/github-provider: repository_advisory <cmd>: repo is required` |
| `repository_collaborator_permission` | `@seneca/github-provider: repository_collaborator_permission <cmd>: owner is required` |
| `repository_collaborator_permission` | `@seneca/github-provider: repository_collaborator_permission <cmd>: repo is required` |
| `repository_invitation` | `@seneca/github-provider: repository_invitation <cmd>: owner is required` |
| `repository_invitation` | `@seneca/github-provider: repository_invitation <cmd>: repo is required` |
| `repository_rule_detailed` | `@seneca/github-provider: repository_rule_detailed <cmd>: owner is required` |
| `repository_rule_detailed` | `@seneca/github-provider: repository_rule_detailed <cmd>: repo is required` |
| `repository_ruleset` | `@seneca/github-provider: repository_ruleset <cmd>: org_id is required` |
| `repository_subscription` | `@seneca/github-provider: repository_subscription <cmd>: owner is required` |
| `review_comment` | `@seneca/github-provider: review_comment <cmd>: owner is required` |
| `review_comment` | `@seneca/github-provider: review_comment <cmd>: pull_id is required` |
| `review_comment` | `@seneca/github-provider: review_comment <cmd>: repo is required` |
| `rule_suite` | `@seneca/github-provider: rule_suite <cmd>: org_id is required` |
| `ruleset_version_with_state` | `@seneca/github-provider: ruleset_version_with_state <cmd>: ruleset_id is required` |
| `runner_application` | `@seneca/github-provider: runner_application <cmd>: org_id is required` |
| `runner_group` | `@seneca/github-provider: runner_group <cmd>: org_id is required` |
| `search` | `@seneca/github-provider: search <cmd>: q is required` |
| `secret_scanning_alert` | `@seneca/github-provider: secret_scanning_alert <cmd>: owner is required` |
| `secret_scanning_alert` | `@seneca/github-provider: secret_scanning_alert <cmd>: repo is required` |
| `secret_scanning_location` | `@seneca/github-provider: secret_scanning_location <cmd>: alert_number is required` |
| `secret_scanning_location` | `@seneca/github-provider: secret_scanning_location <cmd>: owner is required` |
| `secret_scanning_location` | `@seneca/github-provider: secret_scanning_location <cmd>: repo is required` |
| `secret_scanning_pattern_configuration` | `@seneca/github-provider: secret_scanning_pattern_configuration <cmd>: org_id is required` |
| `secret_scanning_push_protection_bypass` | `@seneca/github-provider: secret_scanning_push_protection_bypass <cmd>: owner is required` |
| `secret_scanning_push_protection_bypass` | `@seneca/github-provider: secret_scanning_push_protection_bypass <cmd>: repo is required` |
| `secret_scanning_scan_history` | `@seneca/github-provider: secret_scanning_scan_history <cmd>: owner is required` |
| `secret_scanning_scan_history` | `@seneca/github-provider: secret_scanning_scan_history <cmd>: repo is required` |
| `security_advisory` | `@seneca/github-provider: security_advisory <cmd>: owner is required` |
| `security_advisory` | `@seneca/github-provider: security_advisory <cmd>: repo is required` |
| `selected_action` | `@seneca/github-provider: selected_action <cmd>: org_id is required` |
| `short_blob` | `@seneca/github-provider: short_blob <cmd>: owner is required` |
| `short_blob` | `@seneca/github-provider: short_blob <cmd>: repo is required` |
| `short_branch` | `@seneca/github-provider: short_branch <cmd>: owner is required` |
| `short_branch` | `@seneca/github-provider: short_branch <cmd>: repo is required` |
| `simple_classroom_assignment` | `@seneca/github-provider: simple_classroom_assignment <cmd>: classroom_id is required` |
| `status` | `@seneca/github-provider: status <cmd>: owner is required` |
| `status` | `@seneca/github-provider: status <cmd>: ref is required` |
| `status` | `@seneca/github-provider: status <cmd>: repo is required` |
| `status_check_policy` | `@seneca/github-provider: status_check_policy <cmd>: owner is required` |
| `status_check_policy` | `@seneca/github-provider: status_check_policy <cmd>: repo is required` |
| `subscriber` | `@seneca/github-provider: subscriber <cmd>: owner is required` |
| `subscriber` | `@seneca/github-provider: subscriber <cmd>: repo is required` |
| `tag` | `@seneca/github-provider: tag <cmd>: owner is required` |
| `tag` | `@seneca/github-provider: tag <cmd>: repo is required` |
| `tag_protection` | `@seneca/github-provider: tag_protection <cmd>: owner is required` |
| `tag_protection` | `@seneca/github-provider: tag_protection <cmd>: repo is required` |
| `team` | `@seneca/github-provider: team <cmd>: org_id is required` |
| `team` | `@seneca/github-provider: team <cmd>: project_id is required` |
| `team_simple` | `@seneca/github-provider: team_simple <cmd>: org_id is required` |
| `topic` | `@seneca/github-provider: topic <cmd>: owner is required` |
| `user` | `@seneca/github-provider: user <cmd>: branch_id is required` |
| `user` | `@seneca/github-provider: user <cmd>: gpg_key_id is required` |
| `user` | `@seneca/github-provider: user <cmd>: owner is required` |
| `user` | `@seneca/github-provider: user <cmd>: repo is required` |
| `user` | `@seneca/github-provider: user <cmd>: username is required` |
| `view` | `@seneca/github-provider: view <cmd>: owner is required` |
| `view` | `@seneca/github-provider: view <cmd>: repo is required` |
| `workflow` | `@seneca/github-provider: workflow <cmd>: owner is required` |
| `workflow` | `@seneca/github-provider: workflow <cmd>: repo is required` |
| `workflow_run` | `@seneca/github-provider: workflow_run <cmd>: owner is required` |
| `workflow_run` | `@seneca/github-provider: workflow_run <cmd>: repo is required` |
| `workflow_run` | `@seneca/github-provider: workflow_run <cmd>: run_id is required` |
| `workflow_run_usage` | `@seneca/github-provider: workflow_run_usage <cmd>: owner is required` |
| `workflow_run_usage` | `@seneca/github-provider: workflow_run_usage <cmd>: repo is required` |
| `workflow_usage` | `@seneca/github-provider: workflow_usage <cmd>: owner is required` |
| `workflow_usage` | `@seneca/github-provider: workflow_usage <cmd>: repo is required` |

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
