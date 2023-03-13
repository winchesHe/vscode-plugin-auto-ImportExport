import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { ExtensionContext } from 'vscode'
import { commands, window } from 'vscode'
import type { Options } from './types'
import { excludeFn, getOptions } from './utils'

export function activate(cxt: ExtensionContext) {
  const options = getOptions()

  const disposable = commands.registerCommand('AutoExportImportFile', () => {
    const editor = window.activeTextEditor
    const activePath = editor?.document.uri.fsPath
    const actDir = activePath && join(activePath, '..')
    // 转换文件
    convert(activePath!, actDir!, options)
  })

  cxt.subscriptions.push(disposable)
}

function convert(activePath: string, actDir: string, options?: Options) {
  const { depsCollect, createIndex } = options! || {}
  const subList: Set<string> = new Set()
  const lastActPath = activePath?.match(/[\\/]([^\\/]+)$/)?.[1]
  // 获取活跃目录下的文件列表
  const res = excludeFn(readdirSync(actDir!, 'utf-8')).filter(path => !path.includes(lastActPath!))

  // 递归子路径
  if (depsCollect) {
    getSubRes(res, actDir)
    for (const subPath of subList) {
      const regex = new RegExp(`^${actDir}\/(.+)`)
      res.push((subPath.match(regex)?.[1]) as string)
    }
  }
  // 创建子目录
  if (createIndex)
    createIndexFn(res, actDir)

  // 开始写入当前活跃文件
  const actContent = readFileSync(activePath!, 'utf-8')
  const actContentList: string[] = actContent.split('\n')
  const resList = res.map((item) => {
    return `export * from './${item.split('.')[0]}'`
  })
  for (const res of resList)
    actContentList.unshift(res)
  const resStr = [...new Set(actContentList)].join('\n')
  writeFileSync(activePath!, resStr, 'utf-8')

  function getSubRes(curFileList: string[], dir: string) {
    for (const curFile of curFileList) {
      const absPath = join(dir, curFile)
      if (statSync(absPath).isDirectory()) {
        subList.add(absPath)
        getSubRes(excludeFn(readdirSync(absPath, 'utf-8')), absPath)
      }
    }
  }

  function createIndexFn(curFileList: string[], dir: string) {
    for (const curFile of curFileList) {
      const absPath = join(dir, curFile)
      if (statSync(absPath).isDirectory()) {
        let absSubIndex = existsSync(join(absPath, 'index.ts'))
          ? join(absPath, 'index.ts')
          : existsSync(join(absPath, 'index.js'))
            ? join(absPath, 'index.js')
            : 'create'
        // 当子目录不存在index目录时，创建并导出第一层
        if (absSubIndex === 'create') {
          absSubIndex = join(absPath, 'index.ts')
          writeFileSync(absSubIndex, '', 'utf-8')
          convert(absSubIndex, absPath)
        }
      }
    }
  }
}

export function deactivate() {

}
