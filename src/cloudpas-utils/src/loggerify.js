function loggerify ({ format = defaultFormat, log = console.log } = {}) {
  return function (module) {
    for (let key in module) {
      const func = module[key]

      if (typeof func !== 'function') {
        continue
      }

      module[key] = function (...args) {
        try {
          let result = func(...args)

          if (result instanceof Promise) {
            return result.then(logSuccess).catch(logError)
          }

          return logSuccess(result)
        } catch (error) {
          logError(error)
        }

        function logSuccess (result) {
          log(...format({ name: key, args, result }))
          return result
        }

        function logError (error) {
          log(...format({ name: key, args, error }))
          throw error
        }
      }
    }

    return module
  }
}

function defaultFormat ({ name, args, result, error }) {
  return [
    'Function call:\n\n',
    `${name}(\n`,
    ...args.map(arg => ['\t', arg, ',\n']).reduce((r, c) => r.concat(c)),
    result && ')\n\nResult:\n',
    result,
    error && '\nError:\n',
    error
  ].filter(x => x)
}

module.exports = {
  loggerify
}
