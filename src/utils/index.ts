import { excludeList } from '../constants'
export * from './getOptions'

export const excludeFn = (args: string[]) => {
  return args.filter((i) => {
    return !excludeList.some((exc) => {
      if (exc.startsWith('.'))
        return i.includes(exc)
      return exc === i
    })
  })
}
