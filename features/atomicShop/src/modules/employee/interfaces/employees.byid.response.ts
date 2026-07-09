export interface Employee {
    status:  number;
    message: string;
    data:    Data;
}

export interface Data {
    _id:               string;
    name:              string;
    number_phone:      string;
    direction:         string;
    position:          string;
    payroll_month:     string;
    email:             string;
    isGenericPassword: boolean;
    isVerified:        boolean;
    createdAt:         Date;
    updatedAt:         Date;
    __v:               number;
    id:                string;
}
