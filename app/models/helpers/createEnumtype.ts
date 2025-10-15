import { types } from 'mobx-state-tree'

export const createEnumType = <T>(name: string) =>
    types.custom<T, T>({
        name,
        fromSnapshot(value: T) {
            return value
        },
        toSnapshot(value: T) {
            return value
        },
        isTargetType(): boolean {
            return true
        },
        getValidationMessage(value: T): string {
            return '' // OK
        },
    })
