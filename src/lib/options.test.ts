import { expect, test } from 'vitest'
import { optionName, parseOptionList } from './options'

test('a pasted list becomes options: code, name and colour are read from each line, in any spreadsheet layout', () => {
  const list = parseOptionList('RAL 3020, Traffic red, #CC0605\nRAL 9010\tPure white\t#f4f4f4\n\nWalnut\nOak, #b88a54\n#ffffff')
  expect(list).toEqual([
    { code: 'RAL 3020', label: 'Traffic red', color: '#cc0605' },
    { code: 'RAL 9010', label: 'Pure white', color: '#f4f4f4' },
    { code: null, label: 'Walnut', color: null },
    { code: null, label: 'Oak', color: '#b88a54' },
  ])  // a line with only a colour has no name, so it is skipped
})

test('an option shows its code before its name', () => {
  expect(optionName({ label: 'Traffic red', code: 'RAL 3020' })).toBe('RAL 3020 · Traffic red')
  expect(optionName({ label: 'Matte', code: null })).toBe('Matte')
})
