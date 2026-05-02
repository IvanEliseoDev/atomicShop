
export interface CustomerEntity {
    name: string
    mail: string
    password: string | null,
    telephone: string,
    direction: string
    dui: string
    state: string
    isVerified: boolean
    loginAttemps: number
    timeOut: string
}