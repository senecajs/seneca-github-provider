function issues(args: any) {
  async function load_issue(this: any, msg: any) {
    const repo_id = msg.q.repo_id
    const issue_number = msg.q.issue_number

    const [ownername, reponame]: [string, string] = repo_id.split("/")

    const res = await args.octokit.rest.issues.get({
      owner: ownername,
      repo: reponame,
      issue_number,
    })

    const issue: any = res.data

    issue.repo_id = repo_id
    issue.issue_number = issue_number

    return this.make$(args.ZONE_BASE + "issue").data$(issue)
  }

  async function save_issue(this: any, msg: any) {

  }

  return {
    load_issue,
    save_issue,
  }
}

export default issues
