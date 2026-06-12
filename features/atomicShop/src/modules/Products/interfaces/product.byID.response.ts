export interface Product {
    status:  number;
    message: string;
    data:    Data;
}

export interface Data {
    _id:         string;
    code:        string;
    brandId:     string;
    categoryId:  string;
    providerId:  string;
    name:        string;
    description: string;
    images:      string[];
    stock:       number;
    price:       number;
    discount:    number;
    state:       boolean;
    __v:         number;
    createdAt:   Date;
    updatedAt:   Date;
}
