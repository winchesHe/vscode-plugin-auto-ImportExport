import { excludeList } from '../constants'

export const excludeFn = (args: string[]) => {
  return args.filter((i) => {
    return !excludeList.some((exc) => {
      if (exc.startsWith('.'))
        return i.includes(exc)
      return exc === i
    })
  })
}
