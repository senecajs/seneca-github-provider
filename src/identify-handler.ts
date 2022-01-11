import cmd_handlers from "./cmd-handlers";
import { CommandDetails } from "./types";

function identify_handler(command_details: CommandDetails, github_action: CallableFunction) {
  const cmd_name = command_details.cmd

  const handlers: any = cmd_handlers(github_action, { ...command_details.body_args }, command_details.include)

  const handler = handlers[cmd_name]

  return handler
}

export {
  identify_handler
}
