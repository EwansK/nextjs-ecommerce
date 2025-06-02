"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Save, XCircle } from "lucide-react";

type Product = {
  name: string;
  price: number;
};

export default function ProductAdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<{ name: string; price: string }>({ name: "", price: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState<{ name: string; price: string }>({ name: "", price: "" });

  // Mock fetch products
  useEffect(() => {
    setProducts([
      { name: "Taladro Percutor", price: 89990 },
      { name: "Sierra Circular", price: 159990 },
    ]);
  }, []);

  const handleCreate = () => {
    if (!newProduct.name || !newProduct.price) return;
    setProducts([...products, { name: newProduct.name, price: Number(newProduct.price) }]);
    setNewProduct({ name: "", price: "" });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const product = products[index];
    setEditProduct({ name: product.name, price: product.price.toString() });
  };

  const handleSave = (index: number) => {
    const updated = [...products];
    updated[index] = { name: editProduct.name, price: Number(editProduct.price) };
    setProducts(updated);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Administrar Productos</h1>

        {/* Create New Product */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <input
            type="text"
            placeholder="Nombre del producto"
            className="border p-2 rounded w-full sm:w-1/2"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Precio"
            className="border p-2 rounded w-full sm:w-1/4"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <button
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            onClick={handleCreate}
          >
            <PlusCircle className="inline-block w-5 h-5 mr-1" />
            Agregar
          </button>
        </div>

        {/* Product List */}
        <table className="w-full border border-gray-200 text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border-b">Nombre</th>
              <th className="p-3 border-b">Precio</th>
              <th className="p-3 border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border-b">
                  {editingIndex === index ? (
                    <input
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="p-3 border-b">
                  {editingIndex === index ? (
                    <input
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                      className="border p-1 rounded w-full"
                      type="number"
                    />
                  ) : (
                    `$${product.price.toLocaleString("es-CL")}`
                  )}
                </td>
                <td className="p-3 border-b text-center space-x-2">
                  {editingIndex === index ? (
                    <>
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleSave(index)}
                      >
                        <Save className="w-5 h-5 inline" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setEditingIndex(null)}
                      >
                        <XCircle className="w-5 h-5 inline" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(index)}
                      >
                        <Pencil className="w-5 h-5 inline" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="w-5 h-5 inline" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
