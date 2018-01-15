function createLoggerify (
  {
    format = defaultFormat,
    log = console.log,
    enable = process.env.NODE_ENV === 'development'
  } = {}
) {
  return function (module) {
    if (!enable) {
      return module
    }

    return new Proxy(module, {
      get (target, prop) {
        const func = target[prop]

        if (typeof func !== 'function') {
          return func
        }

        return function (...args) {
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
            log(...format({ name: prop, args, result }))
            return result
          }

          function logError (error) {
            log(...format({ name: prop, args, error }))
            throw error
          }
        }
      }
    })
  }
}

function defaultFormat ({ name, args, result, error }) {
  return [
    'Function call:\n\n',
    `${name}(`,
    args.length && '\n',
    ...args.map(arg => ['\t', arg, ',\n']).reduce((r, c) => r.concat(c), []),
    ')',
    result && '\n\nResult:\n',
    result,
    error && '\nError:\n',
    error
  ].filter(x => x)
}

module.exports = {
  loggerify: createLoggerify(),
  createLoggerify
}
