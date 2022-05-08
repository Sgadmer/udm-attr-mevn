import { IRegExpObj } from '~@models/objects'

export const REG_EXP: IRegExpObj = {
  commaSeparator: /\s*\,\s*/gm,
  
  baseList: /[a-zA-Zа-яА-Я0-9\,\s]*/gm,
  exceptBaseList: /[^a-zA-Zа-яА-Я0-9\,\s]+/gm,
  
  lettersDigits: /[a-zA-Zа-яА-Я0-9]*/gm,
  ecxeptLettersDigits: /[^a-zA-Zа-яА-Я0-9]+/gm,
  
  letters: /[a-zA-Zа-яА-Я]*/gm,
  ecxeptLetters: /[^a-zA-Zа-яА-Я]+/gm,
  
  digits: /[0-9]*/gm,
  ecxeptDigits: /[^0-9]+/gm,
}
