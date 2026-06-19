export interface ProductResponse {
    status:  number;
    message: string;
    data:    ProductI[];
}

export interface ProductI {
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
    createdAt:   Date;
    updatedAt:   Date;
    __v:         number;
}
