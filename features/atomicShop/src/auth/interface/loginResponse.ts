export interface LoginResponse {
    status:  number;
    message: string;
    data:    Data;
}

export interface Data {
    email:    string;
    position: string;
}

