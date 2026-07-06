export interface Employees {
    status:  number;
    message: string;
    data:    Datum[];
}

export interface Datum {
    _id:          string;
    name:         string;
    number_phone: string;
    direction:    string;
    position:     string;
    payroll_month: string;
    email:        string;
    isVerified:   boolean;
    createdAt:    Date;
    updatedAt:    Date;
    __v:          number;
}
