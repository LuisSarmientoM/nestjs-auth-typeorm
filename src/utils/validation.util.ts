export const isUndefined = (value: unknown): value is undefined =>
    value === undefined

export const isNull = (value: unknown): value is null => value === null

export const isFalsy = (value: unknown) => isUndefined(value) || isNull(value)
