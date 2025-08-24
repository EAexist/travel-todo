export const rtrim = (inputString: string, charactersToRemove: string) => {
  const regex = new RegExp(`[${charactersToRemove}]+$`, 'g')
  return inputString.replace(regex, '')
}
