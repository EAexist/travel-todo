export const filterAlphaNumericUppercase = (text: string): string | false => {
  const upperCaseText = text.toUpperCase()
  if (/^[A-Z0-9]*$/.test(upperCaseText)) {
    return upperCaseText
  } else return false
}
export const filterNumeric = (text: string): string | false => {
  if (/^\d*$/.test(text)) {
    return text
  } else return false
}
