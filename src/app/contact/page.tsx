"use client";
import React, { useState } from 'react';
import { Wrench, Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitMessage('Por favor completa todos los campos requeridos.');
      setTimeout(() => setSubmitMessage(''), 3000);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('¡Gracias por contactarnos! Te responderemos pronto.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 1500);
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
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Inicio
              </a>
              <a href="/products" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Productos
              </a>
              <a href="/contact" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                Contacto
              </a>
              <a href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Administrar
              </a>
            </nav>
            
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
      <section className="bg-gradient-to-br from-blue-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contáctanos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Información de Contacto</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Teléfono</h3>
                    <p className="text-gray-600">+56 2 2345 6789</p>
                    <p className="text-sm text-gray-500">Lunes a Viernes, 8:00 - 18:00</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">soporte@ferremas.cl</p>
                    <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Dirección</h3>
                    <p className="text-gray-600">Av. Libertador 1234</p>
                    <p className="text-gray-600">Santiago, Chile</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Horarios</h3>
                    <p className="text-gray-600">Lunes - Viernes: 8:00 - 18:00</p>
                    <p className="text-gray-600">Sábado: 9:00 - 14:00</p>
                    <p className="text-gray-600">Domingo: Cerrado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h2>
              
              {submitMessage && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  {submitMessage}
                </div>
              )}
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="consulta-producto">Consulta sobre Producto</option>
                    <option value="soporte-tecnico">Soporte Técnico</option>
                    <option value="pedido">Consulta sobre Pedido</option>
                    <option value="devolucion">Devolución</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 resize-vertical"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <li><a href="/productos" className="text-gray-400 hover:text-white transition-colors duration-200">Productos</a></li>
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