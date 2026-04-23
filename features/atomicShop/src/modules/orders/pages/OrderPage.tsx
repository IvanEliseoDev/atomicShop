import { useState } from "react";
import { MOCK_ORDERS } from "../mock/mockOrder";


export const OrderPage = () => {
    const [searchQuery, setsearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = Math.ceil(MOCK_ORDERS.length / itemsPerPage);
    const [statusFilter, setStatusFilter] = useState('Ninguno')
    const [documentFilter, setDocumentFIlter] = useState('Comercial')
    const [dateFilter, setDateFilter] = useState('Default')
    return (
        <div>OrderPage</div>
    )
}
