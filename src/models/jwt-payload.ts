import { Uuid } from './id.dto'

export interface JwtPayload {
    readonly id: string
    readonly email: string
    iat: number
    exp: number
    hash?: string
}

export interface Current extends Uuid {
    email: string
    roleCode: string
}
