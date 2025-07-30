"use client";
import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
}

const productsData: Product[] = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Smartphone" },
  { id: 3, name: "Headphones" },
  { id: 4, name: "Keyboard" },
  { id: 5, name: "Mouse" },
];

const page: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(productsData);

  // Handles search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === "") {
      setFilteredProducts(productsData);
    } else {
      setFilteredProducts(
        productsData.filter((product) =>
          product.name.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    }
  };

  // Resets the search input
  const handleReset = () => {
    setSearchTerm("");
    setFilteredProducts(productsData);
  };

  return (
    <div className="mx-auto max-w-md rounded-md border p-4 shadow-md">
      <h2 className="mb-4 text-lg font-bold">Product List</h2>

      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search for a product..."
        className="mb-2 w-full rounded-md border p-2"
      />

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white"
      >
        Reset
      </button>

      {/* Product List */}
      <ul>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <li key={product.id} className="border-b p-2">
              {product.name}
            </li>
          ))
        ) : (
          <p className="text-red-500">No products found</p>
        )}
      </ul>
    </div>
  );
};

export default page;
