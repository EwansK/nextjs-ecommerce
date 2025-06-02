"use client";
import React, { useState, useEffect } from 'react';
import { Wrench, Star, Truck, Shield, Headphones, RefreshCw, ArrowUpDown } from 'lucide-react';

export default function HomePage() {
  const [exchangeRate, setExchangeRate] = useState(850);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [calculatorAmount, setCalculatorAmount] = useState(100);
  const [calculatorMode, setCalculatorMode] = useState('USD_to_CLP'); // 'USD_to_CLP' or 'CLP_to_USD'

  // Function to fetch exchange rates from the microservice
  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://ec2-18-205-187-186.compute-1.amazonaws.com:3001/api/exchange-rates');
      const data = await response.json();
      setExchangeRate(data.rates.USD);
      setLastUpdated(new Date(data.lastUpdated));
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    } finally {
      setLoading(false);
    }
  };
  const [promoProducts, setPromoProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      // Cambia el endpoint por el correcto de tu backend:
      const response = await fetch('http://192.168.1.86:3002/api/productos');
      const data = await response.json();
      const onlyPromos = data.filter(prod => prod.PROMOCION === true || prod.PROMOCION === 1);
      setPromoProducts(onlyPromos);
    } catch (err) {
      setPromoProducts([]);
    }
  };
  fetchProducts();
}, []);

  // Effect to load exchange rates on component mount
  useEffect(() => {
    fetchExchangeRates();
    // Update every 30 minutes
    const interval = setInterval(fetchExchangeRates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculator functions
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

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Add Google Fonts */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
        rel="stylesheet" 
      />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">FERREMAS</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <a href="/" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                Inicio
              </a>
              <a href="/products" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Productos
              </a>
              <a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
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
                  disabled={loading}
                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
                  title="Actualizar tipo de cambio"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <button className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Tu Ferretería
              <span className="text-blue-600 block">de Confianza</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Encuentra las mejores herramientas, materiales de construcción y todo lo que necesitas para tus proyectos en nuestra amplia selección de productos de calidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg">
                Comprar Ahora
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors duration-200">
                Ver Catálogo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por Qué Elegir FERREMAS?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nos comprometemos a brindarte la mejor experiencia de compra y productos de la más alta calidad.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Envío Gratuito</h3>
              <p className="text-gray-600">
                Disfruta de envío gratis en todas las compras sobre $50.000. Entrega rápida y confiable a tu domicilio.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pago Seguro</h3>
              <p className="text-gray-600">
                Tu información de pago está protegida con encriptación de nivel industrial y máxima seguridad.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Atención 24/7</h3>
              <p className="text-gray-600">
                Nuestro equipo de atención al cliente está disponible las 24 horas para ayudarte con cualquier consulta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {promoProducts.length === 0 && (
    <div className="col-span-4 text-center text-gray-400">
      No hay productos en promoción.
    </div>
  )}
  {promoProducts.map((product, index) => (
    <div key={product.ID} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 flex items-center justify-center">
        <span className="text-gray-500 text-sm">Imagen del Producto</span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{product.MARCA} - {product.TIPO_PRODUCTO}</h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
          ))}
          <span className="text-sm text-gray-600 ml-2">({product.STOCK} en stock)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            ${parseInt(product.PRECIO).toLocaleString('es-CL')}
          </span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors duration-200">
            Agregar
          </button>
        </div>
        <div className="mt-2">
          <span className="inline-block bg-red-500 text-white text-xs px-2 rounded">¡EN PROMO!</span>
        </div>
      </div>
    </div>
  ))}
</div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wrench className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">FERREMAS</span>
              </div>
              <p className="text-gray-400 mb-4">
                Tu destino confiable para herramientas y materiales de construcción de calidad con servicio excepcional.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors duration-200">Inicio</a></li>
                <li><a href="/products" className="text-gray-400 hover:text-white transition-colors duration-200">Productos</a></li>
                <li><a href="/contacto" className="text-gray-400 hover:text-white transition-colors duration-200">Contacto</a></li>
                <li><a href="/admin" className="text-gray-400 hover:text-white transition-colors duration-200">Administrar</a></li>
              </ul>
            </div>
            
            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Atención al Cliente</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Centro de Ayuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Devoluciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Info de Envío</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Seguir Pedido</a></li>
              </ul>
            </div>
            
            {/* Contact Info */}
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