import { rest } from "msw"
import { setupServer } from "msw/node"

/**
 * Set mock at transport layer level
 * @param ent_mocks
 * @returns
 */
function set_mock_worker(ents_mocks: any) {
  const rest_handler_arr = []

  Object.keys(ents_mocks).forEach((ent_name) => {
    const http_methods_data_mocks = ents_mocks[ent_name]

    Object.keys(http_methods_data_mocks).forEach((method) => {
      const mock = http_methods_data_mocks[method]

      rest_handler_arr.push(rest_handler(rest[method], mock))
    })
  })

  const worker = setupServer(...rest_handler_arr)

  return worker
}

function rest_handler(cb: CallableFunction, mock: any) {
  return cb("https://api.github.com" + mock.url, (req, res, ctx) => {
    return res(ctx.json(mock.mock_data))
  })
}

export { set_mock_worker }
