export interface Employee {
    status:  number;
    message: string;
    data:    Data;
}

export interface Data {
    _id:               string;
    name:              string;
    dui:               string;
    birthDay:          Date;
    number_phone:      string;
    afp_affiliated:    string;
    isss:              string;
    dui_img:           string;
    direction:         string;
    position:          string;
    payroll_month:     string;
    salary:            Salary;
    email:             string;
    password:          string;
    isGenericPassword: boolean;
    isVerified:        boolean;
    loginAttemps:      number;
    createdAt:         Date;
    updatedAt:         Date;
    __v:               number;
    id:                string;
}

export interface Salary {
    $numberDecimal: string;
}
