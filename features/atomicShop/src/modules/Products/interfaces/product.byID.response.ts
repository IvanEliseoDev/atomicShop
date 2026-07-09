import type { PopulatedRef } from "./product.response";

export interface Product {
    status:  number;
    message: string;
    data:    Data;
}

export interface Data {
    _id:         string;
    code:        string;
    brandId:     string | PopulatedRef;
    categoryId:  string | PopulatedRef;
    providerId:  string;
    name:        string;
    description: string;
    images:      string[];
    stock:       number;
    price:       number;
    discount:    number;
    state:       boolean;
    minStock?:   number;
    costPrice?:  number;
    __v:         number;
    createdAt:   Date;
    updatedAt:   Date;
}
