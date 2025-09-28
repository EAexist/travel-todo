import countryNameKrToIsoJSON from 'app/utils/countryNameKrToISO.json'

export const getFlagEmoji = (countryCode: string) => {
  if (!/^[A-Za-z]{2}$/.test(countryCode)) {
    return '🏳️' // Return white flag for invalid codes.
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  //   return '🏳️' // Return white flag for invalid codes.
  return String.fromCodePoint(...codePoints)
}

export const regionNames = new Intl.DisplayNames(['kr'], { type: 'region' })

export const countryNameKrToIso = countryNameKrToIsoJSON as {
  [key: string]: string
}
