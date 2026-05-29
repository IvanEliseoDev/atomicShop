import { Request } from "express"
import { customerModel } from "../../models/customer"

const customer = {
    name: "Ivan Eliseo Hernandez",
    mail: "ivaneliseodev@gmail.com",
    password: null,
    telephone: "7405-9926",
    direction: "Apopa - SanSalvador - El Salvador",
    dui: "12345678-9",
    nit:"102101221-1",
    state: "frecuente",
    isVerified: false,
    loginAttemps: 0,
    timeOut: new Date()
}

export const customerSeed = async () => {
    try {
        await customerModel.deleteMany()
        const newCustomer = new customerModel(customer)
        const result = await newCustomer.save()
        if (!result) throw new Error("Customer Seed can't execute")
        return true
    }catch(error){
        console.log(error)
        throw new Error("Can't Customer seed execute - Internal Server Error - Check Server Logs")
    }
}