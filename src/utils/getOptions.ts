import { workspace } from 'vscode'
import type { Options } from '../types'

export const getOptions = (): Options => {
  const depsCollect: boolean = workspace.getConfiguration().get('depsCollect')!
  const createIndex: boolean = workspace.getConfiguration().get('createIndex')!

  return {
    depsCollect,
    createIndex,
  }
}
