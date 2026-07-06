export interface LoginResponse {
    status:  number;
    message: string;
    data:    Data;
}

export interface Data {
    _id:      string;
    name:     string;
    email:    string;
    position: string;
}
