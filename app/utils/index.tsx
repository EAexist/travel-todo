export const rtrim = (inputString: string, charactersToRemove: string) => {
    const regex = new RegExp(`[${charactersToRemove}]+$`, 'g')
    return inputString.replace(regex, '')
}

export const getGwaWa = (noun: string): string => {
    if (!noun || noun.length === 0) {
        return ''
    }

    const lastChar = noun.charCodeAt(noun.length - 1)

    if (lastChar < 0xac00 || lastChar > 0xd7a3) {
        return '와'
    }

    const finalConsonant = (lastChar - 0xac00) % 28

    if (finalConsonant > 0) {
        return '과'
    } else {
        return '와'
    }
}
