import cmd_handlers from "./cmd-handlers";
import { Action, CommandDetails } from "./types";

function identify_handler(command_details: CommandDetails, actions: Record<string, Action>) {
  const cmd_name = command_details.cmd
  const callback_name = command_details.callback

  const action_callback = actions[callback_name]

  if(!action_callback) {
    throw new Error('invalid callback: ' + callback_name)
  }

  const body = command_details.body_args
  const include = command_details.include

  const handlers: any = cmd_handlers(action_callback, body, include)

  const handler = handlers[cmd_name]

  return handler
}

export default identify_handler