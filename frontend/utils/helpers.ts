import * as dfns from 'date-fns'

export const formatJSONDate = (date: string): string => {
  return dfns.format(dfns.parseJSON(date), 'd.MM.yy')
}
