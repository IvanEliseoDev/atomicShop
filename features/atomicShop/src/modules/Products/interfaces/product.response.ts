export interface ProductResponse {
    status:  number;
    message: string;
    data:    ProductI[];
}

export interface PopulatedRef {
    _id:  string;
    name: string;
}

export interface ProductI {
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
    createdAt:   Date;
    updatedAt:   Date;
    __v:         number;
}
