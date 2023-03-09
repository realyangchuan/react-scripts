#!/usr/bin/env node
'use strict'

process.on('unhandledRejection', err => {
  throw err
})

const child_process = require('node:child_process')

const args = process.argv.slice(2);
const scripts = ['dev', 'build']
const script = args.find(x => scripts.includes(x)) ?? 'dev'

if (scripts.includes(script)) {
  const result = child_process.spawnSync(
    process.execPath,
    process.execArgv
      .concat(require.resolve(`../scripts/${script}`))
      .concat(args.filter(x => x !== script)),
    { stdio: 'inherit' }
  )
  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log(
        'The build failed because the process exited too early. ' +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
      )
    } else if (result.signal === 'SIGTERM') {
      console.log(
        'The build failed because the process exited too early. ' +
        'Someone might have called `kill` or `killall`, or the system could be shutting down.'
      )
    }

    process.exit(1)
  }

  process.exit(result.status)
} else {
  console.log(`Unknown script ${script}`)
}
