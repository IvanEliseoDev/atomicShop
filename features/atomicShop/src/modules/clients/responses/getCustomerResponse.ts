export interface CustomerResponse {
    status:  string;
    message: string;
    data:    CustomerData[];
}

export interface CustomerData {
    _id:          string;
    name:         string;
    mail:         string;
    password:     null;
    telephone:    string;
    direction:    string;
    typeCustomer: string;
    dui:          string;
    nit:          string;
    state:        string;
    loginAttemps: number;
    timeOut:      Date;
    typeGiro:     string;
    isVerified:   boolean;
    createdAt:    Date;
    updatedAt:    Date;
    __v:          number;
}
