export default {
  code_of_conduct: {
    get: {
      method: "GET",
      url: "/codes_of_conduct/:key",
      mock_data: {
        key: "contributor_covenant",
        name: "Contributor Covenant",
        html_url: null,
        url: "https://api.github.com/codes_of_conduct/contributor_covenant",
        body: "# Contributor Covenant Code of Conduct\n\n## Our Pledge\n\nWe ... interrupted - mock data",
      },
    },
  },
  org: {
    get: {
      method: "GET",
      url: "/orgs/:org",
      mock_data: {
        login: "DemoOrganization20",
        id: 96800940,
        node_id: "O_kgDOBcUQrA",
        url: "https://api.github.com/orgs/DemoOrganization20",
        repos_url: "https://api.github.com/orgs/DemoOrganization20/repos",
        events_url: "https://api.github.com/orgs/DemoOrganization20/events",
        hooks_url: "https://api.github.com/orgs/DemoOrganization20/hooks",
        issues_url: "https://api.github.com/orgs/DemoOrganization20/issues",
        members_url:
          "https://api.github.com/orgs/DemoOrganization20/members{/member}",
        public_members_url:
          "https://api.github.com/orgs/DemoOrganization20/public_members{/member}",
        avatar_url: "https://avatars.githubusercontent.com/u/96800940?v=4",
        description: null,
        is_verified: false,
        has_organization_projects: true,
        has_repository_projects: true,
        public_repos: 0,
        public_gists: 0,
        followers: 0,
        following: 0,
        html_url: "https://github.com/DemoOrganization20",
        created_at: "2021-12-28T23:39:49Z",
        updated_at: "2021-12-28T23:39:49Z",
        type: "Organization",
        total_private_repos: 0,
        owned_private_repos: 0,
        private_gists: 0,
        disk_usage: 0,
        collaborators: 0,
        billing_email: "guhmerces@hotmail.com",
        default_repository_permission: "read",
        members_can_create_repositories: true,
        two_factor_requirement_enabled: false,
        members_allowed_repository_creation_type: "all",
        members_can_create_public_repositories: true,
        members_can_create_private_repositories: true,
        members_can_create_internal_repositories: false,
        members_can_create_pages: true,
        members_can_fork_private_repositories: false,
        members_can_create_public_pages: true,
        members_can_create_private_pages: true,
        plan: {
          name: "free",
          space: 976562499,
          private_repos: 10000,
          filled_seats: 1,
          seats: 0,
        },
      },
    },
  },
};
