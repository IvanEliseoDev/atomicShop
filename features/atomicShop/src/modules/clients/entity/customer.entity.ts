
export interface CustomerEntity {
    name: string
    mail: string
    password: string | null,
    telephone: string,
    direction: string
    typeCustomer: string
    dui: string
    nit: string
    typeGiro: string
    state: string
    isVerified: boolean
    loginAttemps: number
    timeOut: string
}