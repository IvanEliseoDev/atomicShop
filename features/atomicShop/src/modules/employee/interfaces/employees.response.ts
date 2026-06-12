export interface Employees {
    status:  number;
    message: string;
    data:    Datum[];
}

export interface Datum {
    _id:            string;
    name:           string;
    dui:            string;
    birthDay:       Date;
    number_phone:   string;
    afp_affiliated: string;
    isss:           string;
    dui_img:        string;
    direction:      string;
    position:       string;
    payroll_month:  string;
    salary:         Salary;
    email:          string;
    isVerified:     boolean;
    createdAt:      Date;
    updatedAt:      Date;
    __v:            number;
}

export interface Salary {
    $numberDecimal: string;
}
