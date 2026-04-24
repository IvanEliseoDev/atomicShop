import type { Producto } from "../interfaces/product.interface";

export const mockProductos: Producto[] = [
    { id: '1', codigo: 'COD-001', nombre: 'Balanza analítica', categoria: 'Equipo de medicion Masa', marca: 'Sonar', cantidad: 100, precio: 10.50, estado: 'Frecuente' },
    { id: '2', codigo: 'COD-002', nombre: 'Balanza para Determinación de Humedad (90g) MB92-110V', categoria: 'Equipo de medicion Masa', marca: 'LB-KKA', cantidad: 0, precio: 12.50, estado: 'Restringido' },
    { id: '3', codigo: 'COD-003', nombre: 'Balanza de precision touch 620g / 0.01g cal. externa', categoria: 'Equipo de medicion Masa', marca: 'LB-KKA', cantidad: 100, precio: 15.50, estado: 'Frecuente' },
    { id: '4', codigo: 'COD-004', nombre: 'Pipeta volumetrica 15ml - Ceslab', categoria: 'Equipo de medicion Volumen', marca: 'LB-KKA', cantidad: 100, precio: 19.50, estado: 'Común' },
    { id: '5', codigo: 'COD-005', nombre: 'Pipeta volumétrica de vidrio 10 mL Clase A – Luzeren', categoria: 'Equipo de medicion Volumen', marca: 'LB-KKA', cantidad: 100, precio: 22.50, estado: 'Común' },
    { id: '6', codigo: 'COD-006', nombre: 'Calibración de Termómetro Digital o Bimetálico por Comparación Directa', categoria: 'Equipo de medicion Temperatura', marca: 'LB-KKA', cantidad: 200, precio: 1.50, estado: 'Común' },
    { id: '7', codigo: 'COD-007', nombre: 'Medidor portátil de turbidez con registro', categoria: 'Equipo de medicion en Química y Física', marca: 'LB-KKA', cantidad: 0, precio: 10.50, estado: 'Restringido' },
    { id: '8', codigo: 'COD-008', nombre: 'Microscopio binocular 1000x con iluminación LED', categoria: 'Equipo de medicion en Química y Física', marca: 'Sonar', cantidad: 45, precio: 89.00, estado: 'Frecuente' },
    { id: '9', codigo: 'COD-009', nombre: 'Bureta de vidrio 50ml graduación 0.1ml', categoria: 'Equipo de medicion Volumen', marca: 'LB-KKA', cantidad: 75, precio: 8.75, estado: 'Común' },
    { id: '10', codigo: 'COD-010', nombre: 'Termómetro digital de inmersión -50 a 300°C', categoria: 'Equipo de medicion Temperatura', marca: 'Sonar', cantidad: 30, precio: 34.00, estado: 'Frecuente' },
];