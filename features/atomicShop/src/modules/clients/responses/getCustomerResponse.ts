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
    dui:          string;
    state:        string;
    loginAttemps: number;
    timeOut:      string;
    isVerified:   boolean;
    createdAt:    Date;
    updatedAt:    Date;
    __v:          number;
}
