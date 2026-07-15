"use client";
import { useState, useEffect } from "react";
import axios from "axios";
interface Product {
    id: number;
    name: string;
}

const daftarProduk: Product[] = [
    { id: 1, name: 'Sepatu' },
    { id: 2, name: 'Sandal' },
    { id: 3, name: 'Topi' },
    { id: 4, name: 'Kacamata' },
]

export default function Produk() {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        console.log("--- Mounting ---")
        setProducts(daftarProduk)
    }, []);

    // asynchronous get data
    async function getData() {
        try {
            const response = await axios.get("http://192.168.100.93:8000/api/products");
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <h1>Daftar Produk</h1>

            <ol>
                {
                products.map((product, key) => 
                    <li key={key}>{product.name}</li>
                )
                }
            </ol>
        </div>
    );
}