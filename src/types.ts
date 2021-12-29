import { Octokit } from "@octokit/rest";

type InitialCommandsArgs = {
  octokit: Octokit;
  ZONE_BASE: string;
};

export type {
  InitialCommandsArgs,
}