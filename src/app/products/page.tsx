"use client";
import React, { useState, useEffect } from 'react';
import { 
  Wrench, Search, ShoppingCart, Package, Star, 
  Heart, Grid3X3, List, Tag
} from 'lucide-react';
import Link from 'next/link';

interface ApiProduct {
  ID: string;
  TIPO_PRODUCTO: string;
  MARCA: string;
  CODIGO: string;
  PRECIO: string;
  STOCK: string;
  FECHAUPDATE: string;
  PROMOCION: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3002/api/productos');
        const data: ApiProduct[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  const loadProducts = async () => {
  try {
    setLoading(true);
    const response = await fetch('http://192.168.1.86:3002/api/productos');
    const data: ApiProduct[] = await response.json();
    console.log('RESPONSE:', data); // <- VERIFICA QUE AQUÍ LLEGUEN LOS DATOS
    setProducts(data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = 
        product.MARCA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.CODIGO.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.TIPO_PRODUCTO.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || product.TIPO_PRODUCTO === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseInt(a.PRECIO) - parseInt(b.PRECIO);
        case 'price-high':
          return parseInt(b.PRECIO) - parseInt(a.PRECIO);
        default:
          return a.MARCA.localeCompare(b.MARCA);
      }
    });

  const categories = ['all', ...new Set(products.map(p => p.TIPO_PRODUCTO))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
                <Link href="http://192.168.1.86:3000/">
                <div className="flex items-center space-x-2 cursor-pointer">
                <Wrench className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">FERREMAS</span>
                </div>
                </Link>
            
            <div className="hidden md:block flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Nuestros Productos</h1>
          <p className="text-xl text-blue-100">Las mejores herramientas para tus proyectos</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {loading ? 'Cargando...' : `${filteredProducts.length} productos`}
              </span>
              
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="name">Ordenar por nombre</option>
              <option value="price-low">Precio: menor a mayor</option>
              <option value="price-high">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat === 'all' ? 'Todas las categorías' : cat}
            </button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProducts.map((product) => (
              viewMode === 'grid' ? (
                <div key={product.ID} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                    <Package className="h-16 w-16 text-gray-400" />
                    {product.PROMOCION && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                        ¡OFERTA!
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{product.MARCA}</h3>
                    <p className="text-gray-600 text-sm mb-2">Código: {product.CODIGO}</p>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm mb-3">
                      {product.TIPO_PRODUCTO}
                    </span>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                    </div>
                    
                    <p className="text-2xl font-bold text-blue-600 mb-1">
                      ${parseInt(product.PRECIO).toLocaleString('es-CL')}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">Stock: {product.STOCK} unidades</p>
                    
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ) : (
                <div key={product.ID} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex gap-4">
                  <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{product.MARCA}</h3>
                        <p className="text-gray-600">Código: {product.CODIGO}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {product.TIPO_PRODUCTO}
                        </span>
                      </div>
                      {product.PROMOCION && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                          ¡OFERTA!
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          ${parseInt(product.PRECIO).toLocaleString('es-CL')}
                        </p>
                        <p className="text-sm text-gray-500">Stock: {product.STOCK} unidades</p>
                      </div>
                      
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
}