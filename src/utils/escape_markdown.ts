const special_characters = [
  '\\',
  '_',
  '*',
  '[',
  ']',
  '(',
  ')',
  '~',
  '`',
  '>',
  '<',
  '&',
  '#',
  '+',
  '-',
  '=',
  '|',
  '{',
  '}',
  '.',
  '!',
]

export const escape_markdown = (text: string): string => {
  let escapedText = text

  for (const char of special_characters) {
    escapedText = escapedText.replaceAll(char, `\\${char}`)
  }

  return escapedText
}
