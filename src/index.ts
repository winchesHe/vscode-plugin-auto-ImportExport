import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'pathe'
import type { ExtensionContext } from 'vscode'
import { commands, window, workspace } from 'vscode'
import { excludeFn } from './utils'

export function activate(cxt: ExtensionContext) {
  const disposable = commands.registerCommand('AutoExportImportFile', () => {
    const depsCollect: boolean = workspace.getConfiguration().get('depsCollect')!
    const editor = window.activeTextEditor
    const activePath = editor?.document.uri.fsPath
    const actDir = activePath && join(activePath, '..')
    // 转换文件
    convert(activePath!, actDir!, depsCollect)

    window.showInformationMessage('Congratulations, your extension "Auto ImportExport File" is already finished!')
  })

  cxt.subscriptions.push(disposable)
}

function convert(activePath: string, actDir: string, depsCollect: boolean) {
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
}

export function deactivate() {

}
