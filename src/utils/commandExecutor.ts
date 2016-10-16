'use strict'

import child_process = require('child_process')

function execute (env: string, args: string[], options: Object, callback: ExecutionCallback) {
  const spawn = child_process.spawn(env, args, options)

  const errorChunks = []
  const outChunks = []

  spawn.stdout.on('data', (chunk) => {
    outChunks.push(chunk)
  })

  spawn.stderr.on('data', (chunk) => {
    errorChunks.push(errorChunks)
  })

  function done (code: number) {
    spawn.removeListener('error', done)
    spawn.removeListener('close', done)
    callback(code, Buffer.concat(errorChunks).toString(), Buffer.concat(outChunks).toString());
  }

  spawn.on('error', done)
  spawn.on('close', done)
}

export function executeCommand (path: string, args: any, options: any, callback: ExecutionCallback) {
  args.unshift(path)
  execute(process.execPath, args, options, callback);
}

export interface ExecutionCallback {
  (exitCode: number, error: string, output: string): void;
}
