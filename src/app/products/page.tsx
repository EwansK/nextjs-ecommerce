"use client";
import React, { useState, useEffect } from 'react';
import { Wrench, Search, Filter, Grid, List, Star, ShoppingCart, ArrowUpDown, RefreshCw, Package, AlertCircle } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  
  // Exchange rate for calculator
  const [exchangeRate, setExchangeRate] = useState(850);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [calculatorAmount, setCalculatorAmount] = useState(100);
  const [calculatorMode, setCalculatorMode] = useState('USD_to_CLP');

  // Mock categories - replace with database data
  const categories = [
    { id: 'all', name: 'Todas las Categorías', count: 0 },
    { id: 'tools', name: 'Herramientas', count: 15 },
    { id: 'construction', name: 'Construcción', count: 23 },
    { id: 'electrical', name: 'Eléctrico', count: 12 },
    { id: 'plumbing', name: 'Plomería', count: 8 },
    { id: 'hardware', name: 'Ferretería', count: 18 }
  ];

  // Mock products data - replace with database integration
  const mockProducts = [
    {
      id: 1,
      name: 'Taladro Percutor Profesional',
      category: 'tools',
      price: 89990,
      originalPrice: 109990,
      rating: 4.5,
      reviews: 24,
      stock: 5,
      image: null,
      description: 'Taladro percutor de alta potencia con mango ergonómico',
      brand: 'DeWalt',
      isOnSale: true
    },
    {
      id: 2,
      name: 'Kit de Llaves Combinadas',
      category: 'tools',
      price: 45990,
      rating: 4.8,
      reviews: 18,
      stock: 12,
      image: null,
      description: 'Set completo de llaves combinadas métricas',
      brand: 'Stanley'
    },
    {
      id: 3,
      name: 'Sierra Circular 7 1/4"',
      category: 'tools',
      price: 159990,
      rating: 4.6,
      reviews: 31,
      stock: 3,
      image: null,
      description: 'Sierra circular profesional con guía láser',
      brand: 'Makita'
    },
    {
      id: 4,
      name: 'Cemento Portland 25kg',
      category: 'construction',
      price: 8990,
      rating: 4.2,
      reviews: 67,
      stock: 45,
      image: null,
      description: 'Cemento Portland de alta calidad para construcción',
      brand: 'Polpaico'
    }
  ];

  // Simulate database loading
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In real implementation, replace with:
        // const response = await fetch('/api/products');
        // const data = await response.json();
        // setProducts(data);
        
        setProducts(mockProducts);
      } catch (err) {
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Exchange rate functions
  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('http://ec2-18-205-187-186.compute-1.amazonaws.com:3001/api/exchange-rates');
      const data = await response.json();
      setExchangeRate(data.rates.USD);
      setLastUpdated(new Date(data.lastUpdated));
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const convertAmount = () => {
    if (calculatorMode === 'USD_to_CLP') {
      return Math.round(calculatorAmount * exchangeRate);
    } else {
      return Math.round((calculatorAmount / exchangeRate) * 100) / 100;
    }
  };

  const toggleCalculatorMode = () => {
    setCalculatorMode(calculatorMode === 'USD_to_CLP' ? 'CLP_to_USD' : 'USD_to_CLP');
  };

  const formatCurrency = (amount, currency) => {
    if (currency === 'CLP') {
      return `$${amount.toLocaleString('es-CL')} CLP`;
    } else {
      return `US$${amount.toLocaleString('en-US')}`;
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-300 h-48 rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16">
      <Package className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
      <p className="text-gray-600 text-center max-w-md">
        No hay productos que coincidan con tus criterios de búsqueda. Intenta ajustar los filtros o el término de búsqueda.
      </p>
      <button 
        onClick={() => {
          setSearchTerm('');
          setSelectedCategory('all');
          setPriceRange({ min: 0, max: 1000000 });
        }}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Limpiar Filtros
      </button>
    </div>
  );

  const ErrorState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16">
      <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar productos</h3>
      <p className="text-gray-600 text-center max-w-md mb-4">
        Hubo un problema al cargar los productos. Por favor, intenta nuevamente.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
        rel="stylesheet" 
      />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">FERREMAS</span>
            </div>
            
            <nav className="hidden lg:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Inicio
              </a>
              <a href="/productos" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                Productos
              </a>
              <a href="/contacto" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Contacto
              </a>
              <a href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Administrar
              </a>
            </nav>
            
            {/* Currency Calculator */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-1">
                      <input
                        type="number"
                        value={calculatorAmount}
                        onChange={(e) => setCalculatorAmount(Number(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {calculatorMode === 'USD_to_CLP' ? 'USD' : 'CLP'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      = {formatCurrency(convertAmount(), calculatorMode === 'USD_to_CLP' ? 'CLP' : 'USD')}
                    </div>
                  </div>
                  
                  <button
                    onClick={toggleCalculatorMode}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    title="Cambiar dirección de conversión"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-600">
                  <div>1 USD = ${exchangeRate.toLocaleString('es-CL')} CLP</div>
                  <div className="text-xs text-gray-500">
                    Act: {lastUpdated.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <button
                  onClick={fetchExchangeRates}
                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  title="Actualizar tipo de cambio"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <button className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros <span className="text-blue-600">Productos</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra amplia selección de herramientas y materiales de construcción de la más alta calidad
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} {category.count > 0 && `(${category.count})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Precio</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Precio mínimo"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Precio máximo"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value) || 1000000})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Controls Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {loading ? 'Cargando...' : `${filteredProducts.length} productos encontrados`}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Ordenar por Nombre</option>
                    <option value="price-low">Precio: Menor a Mayor</option>
                    <option value="price-high">Precio: Mayor a Menor</option>
                    <option value="rating">Mejor Valorado</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
              {loading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <LoadingSkeleton />
                  </div>
                ))
              ) : error ? (
                <ErrorState />
              ) : filteredProducts.length === 0 ? (
                <EmptyState />
              ) : (
                // Products
                filteredProducts.map((product) => (
                  <div key={product.id} className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative`}>
                      {product.isOnSale && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                          OFERTA
                        </div>
                      )}
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-12 w-12 text-gray-400" />
                      )}
                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute bottom-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs">
                          ¡Últimas {product.stock}!
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold">Agotado</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                        {product.brand && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {product.brand}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${product.originalPrice.toLocaleString('es-CL')}
                            </span>
                          )}
                          <span className="text-xl font-bold text-blue-600">
                            ${product.price.toLocaleString('es-CL')}
                          </span>
                        </div>
                        
                        <button 
                          disabled={product.stock === 0}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                            product.stock === 0 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {product.stock === 0 ? 'Agotado' : 'Agregar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination - for future database integration */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                    Anterior
                  </button>
                  <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md">
                    1
                  </button>
                  <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wrench className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">FERREMAS</span>
              </div>
              <p className="text-gray-400 mb-4">
                Tu destino confiable para herramientas y materiales de construcción de calidad con servicio excepcional.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors duration-200">Inicio</a></li>
                <li><a href="/productos" className="text-gray-400 hover:text-white transition-colors duration-200">Productos</a></li>
                <li><a href="/contacto" className="text-gray-400 hover:text-white transition-colors duration-200">Contacto</a></li>
                <li><a href="/admin" className="text-gray-400 hover:text-white transition-colors duration-200">Administrar</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Atención al Cliente</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Centro de Ayuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Devoluciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Info de Envío</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Seguir Pedido</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contáctanos</h3>
              <div className="space-y-2 text-gray-400">
                <p>Email: soporte@ferremas.cl</p>
                <p>Teléfono: +56 2 2345 6789</p>
                <p>Dirección: Av. Libertador 1234, Santiago, Chile</p>
                <p>Horario: Lun-Vie 8:00-18:00, Sáb 9:00-14:00</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FERREMAS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}