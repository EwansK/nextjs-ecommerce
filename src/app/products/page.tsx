"use client";
import React, { useState, useEffect } from 'react';
import { Wrench, Search, Grid, List, Star, ShoppingCart, ArrowUpDown, RefreshCw, Package, AlertCircle } from 'lucide-react';

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  brand: string;
  isOnSale?: boolean;
};

const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todas las Categorías' },
  { id: 'tools', name: 'Herramientas' },
  { id: 'construction', name: 'Construcción' },
  { id: 'electrical', name: 'Eléctrico' },
  { id: 'plumbing', name: 'Plomería' },
  { id: 'hardware', name: 'Ferretería' }
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Taladro Percutor Profesional',
    category: 'tools',
    price: 89990,
    originalPrice: 109990,
    rating: 4.5,
    reviews: 24,
    stock: 5,
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
    description: 'Cemento Portland de alta calidad para construcción',
    brand: 'Polpaico'
  }
];

// Custom hooks
function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(MOCK_PRODUCTS);
      } catch (err) {
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return { products, loading, error };
}

function useExchangeRate() {
  const [rate, setRate] = useState<number>(850);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchRate = async () => {
    try {
      const response = await fetch('http://ec2-18-205-187-186.compute-1.amazonaws.com:3001/api/exchange-rates');
      const data = await response.json();
      setRate(data.rates.USD);
      setLastUpdated(new Date(data.lastUpdated));
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  useEffect(() => {
    fetchRate();
    const interval = setInterval(fetchRate, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { rate, lastUpdated, fetchRate };
}

type CurrencyCalculatorProps = {
  rate: number;
  lastUpdated: Date;
  onRefresh: () => void;
};

const CurrencyCalculator: React.FC<CurrencyCalculatorProps> = ({ rate, lastUpdated, onRefresh }) => {
  const [amount, setAmount] = useState<number>(100);
  const [mode, setMode] = useState<'USD_to_CLP' | 'CLP_to_USD'>('USD_to_CLP');

  const convert = (): number => {
    return mode === 'USD_to_CLP' 
      ? Math.round(amount * rate)
      : Math.round((amount / rate) * 100) / 100;
  };

  const formatCurrency = (value: number, currency: 'CLP' | 'USD'): string => {
    return currency === 'CLP' 
      ? `$${value.toLocaleString('es-CL')} CLP`
      : `US$${value.toLocaleString('en-US')}`;
  };

  return (
    <div className="hidden md:flex items-center space-x-4">
      <div className="bg-gray-100 rounded-lg p-3">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-1">
              <input
                type="number"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value) || 0)}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                min={0}
                step={0.01}
              />
              <span className="text-sm font-medium text-gray-700">
                {mode === 'USD_to_CLP' ? 'USD' : 'CLP'}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              = {formatCurrency(convert(), mode === 'USD_to_CLP' ? 'CLP' : 'USD')}
            </div>
          </div>
          
          <button
            onClick={() => setMode(mode === 'USD_to_CLP' ? 'CLP_to_USD' : 'USD_to_CLP')}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="text-sm text-gray-600">
          <div>1 USD = ${rate.toLocaleString('es-CL')} CLP</div>
          <div className="text-xs text-gray-500">
            Act: {lastUpdated.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

type ProductCardProps = {
  product: Product;
  viewMode: 'list' | 'grid';
};

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  const isListView = viewMode === 'list';
  
  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden ${isListView ? 'flex' : ''}`}>
      <div className={`${isListView ? 'w-48 h-32' : 'h-48'} bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative`}>
        {product.isOnSale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            OFERTA
          </div>
        )}
        <Package className="h-12 w-12 text-gray-400" />
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs">
            ¡Últimas {product.stock}!
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs">
            Sin stock
          </div>
        )}
      </div>

      <div className={`p-3 flex flex-col justify-between ${isListView ? 'flex-1 ml-4' : ''}`}>
        <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>

        <div className="flex items-center space-x-2 mb-1">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-sm text-gray-700">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({product.reviews} opiniones)</span>
        </div>

        <div className="text-gray-900 font-semibold text-xl mb-2">
          {product.isOnSale && product.originalPrice ? (
            <>
              <span className="line-through text-gray-500 mr-2">${product.originalPrice.toLocaleString('es-CL')}</span>
              <span className="text-red-600">${product.price.toLocaleString('es-CL')}</span>
            </>
          ) : (
            <>${product.price.toLocaleString('es-CL')}</>
          )}
        </div>

        <p className="text-gray-700 text-sm line-clamp-3">{product.description}</p>
      </div>
    </div>
  );
};

const ProductsList: React.FC<{
  products: Product[];
  viewMode: 'list' | 'grid';
}> = ({ products, viewMode }) => {
  if (products.length === 0) {
    return <div className="p-4 text-center text-gray-500">No hay productos para mostrar.</div>;
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map(p => (
          <ProductCard key={p.id} product={p} viewMode="list" />
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(p => (
        <ProductCard key={p.id} product={p} viewMode="grid" />
      ))}
    </div>
  );
};

export default function ProductsPage() {
  const { products, loading, error } = useProducts();
  const { rate, lastUpdated, fetchRate } = useExchangeRate();

  const [category, setCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const filteredProducts = products.filter(p => {
    const matchesCategory = category === 'all' || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any = a[sortField as keyof Product];
    let bValue: any = b[sortField as keyof Product];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return (
    <main className="max-w-7xl mx-auto p-4 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <CurrencyCalculator rate={rate} lastUpdated={lastUpdated} onRefresh={fetchRate} />
      </header>

      <section className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />

        <div className="flex items-center space-x-2">
          <label className="text-sm">Precio desde:</label>
          <input
            type="number"
            min={0}
            max={priceRange[1]}
            value={priceRange[0]}
            onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="border rounded px-2 py-1 w-20"
          />
          <label className="text-sm">hasta:</label>
          <input
            type="number"
            min={priceRange[0]}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="border rounded px-2 py-1 w-20"
          />
        </div>

        <select
          value={sortField}
          onChange={e => setSortField(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="name">Nombre</option>
          <option value="price">Precio</option>
          <option value="rating">Calificación</option>
          <option value="stock">Stock</option>
        </select>

        <select
          value={sortDirection}
          onChange={e => setSortDirection(e.target.value as 'asc' | 'desc')}
          className="border rounded px-3 py-2"
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>

        <div className="flex space-x-2">
          <button
            aria-label="Vista en cuadrícula"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            aria-label="Vista en lista"
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section>
        {loading && <p>Cargando productos...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <ProductsList products={sortedProducts} viewMode={viewMode} />
        )}
      </section>
    </main>
  );
}
