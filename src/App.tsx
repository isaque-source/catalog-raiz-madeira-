import React, { useState, useEffect } from "react";
import { 
  Search, ShoppingBag, X, Plus, Minus, Trash2, Heart, 
  Check, Instagram, MapPin, ArrowRight, Filter, ArrowUpDown, 
  MessageCircle, Info, Sparkles, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS, HERO_IMAGE, PHONE_NUMBER, INSTAGRAM_HANDLE, INSTAGRAM_URL, ADDRESS_REPRESENTATION, Product } from "./data";

export default function App() {
  // State for Catalog
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("default");
  
  // State for Product Modal Detail
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // State for Quote Bag (Cart)
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(() => {
    try {
      const saved = localStorage.getItem("raiz_madeira_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<"retirada" | "entrega">("retirada");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("raiz_madeira_favs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize cart with localStorage
  useEffect(() => {
    localStorage.setItem("raiz_madeira_cart", JSON.stringify(cart));
  }, [cart]);

  // Synchronize favorites with localStorage
  useEffect(() => {
    localStorage.setItem("raiz_madeira_favs", JSON.stringify(favorites));
  }, [favorites]);

  // Show a temporary feedback toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Toggle favorite status
  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
      showToast("Removido dos favoritos ❤️");
    } else {
      setFavorites([...favorites, productId]);
      showToast("Adicionado aos favoritos! ❤️");
    }
  };

  // Cart operations
  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        showToast(`Quantidade de ${product.name} atualizada! 🧺`);
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      showToast(`${product.name} adicionado ao carrinho! 🧺`);
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + amount;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    showToast("Item removido do carrinho.");
  };

  // Get filtered and sorted products
  const categories = ["Todos", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0; // default order
  });

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Generate WhatsApp link text
  const generateWhatsAppMessage = () => {
    let msg = `Olá, Raiz & Madeira! 🌲\nGostaria de fazer um pedido de compra na Loja Online com os seguintes produtos:\n\n`;
    
    cart.forEach(item => {
      msg += `▪ *${item.quantity}x ${item.product.name}* - R$ ${(item.product.price * item.quantity).toFixed(2).replace(".", ",")}\n`;
    });
    
    msg += `\n*Valor Total do Pedido:* R$ ${cartTotal.toFixed(2).replace(".", ",")}\n\n`;
    msg += `*Nome do Comprador:* ${customerName || "Não informado"}\n`;
    msg += `*Forma de Entrega:* ${deliveryOption === "entrega" ? "🚚 Entrega em SP" : "🏪 Retirada no Ateliê"}\n`;
    
    if (deliveryOption === "entrega" && deliveryAddress) {
      msg += `*Endereço de Entrega:* ${deliveryAddress}\n`;
    }
    
    msg += `\nEnviado através da Loja Online Oficial da Raiz & Madeira.`;
    return msg;
  };

  const whatsAppLink = `https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(generateWhatsAppMessage())}`;

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-dark selection:bg-brand-accent selection:text-white pb-16">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-brand-dark text-brand-light px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-brand-accent/20"
          >
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="font-medium text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Header Area (Matches cover brand aesthetic) */}
      <header className="border-b border-brand-accent/15 py-8 px-4 bg-brand-light/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-accent font-medium">Deixando sua casa</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight mt-1 text-brand-dark flex items-baseline justify-center md:justify-start gap-1">
              RAIZ <span className="font-sans text-2xl md:text-3xl text-brand-accent font-light">&</span> MADEIRA
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-brand-accent/95 font-semibold mt-1">
              com cara de lar
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Favorites Count Indicator */}
            {favorites.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs bg-brand-light px-3 py-2 rounded-full border border-brand-accent/10">
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span className="font-medium">{favorites.length} salvos</span>
              </div>
            )}

            {/* Shopping Bag trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-brand-dark hover:bg-brand-accent text-brand-light p-3.5 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer group"
              id="cart-trigger-button"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-green text-brand-light text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Cover / Hero Area (Page 1 in PDF representation) */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-brand-light rounded-3xl overflow-hidden shadow-xl border border-brand-accent/10 grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Welcome Text Content */}
          <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-brand-accent/10 text-brand-accent text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full self-start mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Artesanato Sustentável e Afetuoso
            </div>
            
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-brand-dark leading-[1.1] font-bold mb-6">
              Móveis e utensílios que <span className="italic font-normal text-brand-accent">acolhem</span> a sua rotina.
            </h2>
            
            <p className="text-brand-dark/80 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
              Trabalhamos exclusivamente com <strong className="text-brand-dark font-semibold">madeira pinus de reflorestamento</strong>, selecionada a dedo. Cada nó e detalhe da madeira conta uma história única. Peças lixadas, montadas e acabadas artesanalmente para transformar o seu espaço em um verdadeiro ninho de aconchego.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a 
                href="#catalogo"
                className="bg-brand-accent hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-center flex items-center justify-center gap-2"
              >
                Explorar Loja Online
                <ArrowRight className="w-4 h-4" />
              </a>
              <button 
                onClick={() => {
                  setIsCartOpen(true);
                  showToast("Adicione produtos ao carrinho e conclua o pedido!");
                }}
                className="bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent border border-brand-accent/20 px-6 py-4 rounded-xl font-medium transition-all duration-300 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                Ver Meu Carrinho
              </button>
            </div>

            {/* Quick Badges of Trust */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-brand-accent/10">
              <div>
                <p className="font-serif text-2xl font-bold text-brand-accent">100%</p>
                <p className="text-xs text-brand-dark/70 uppercase tracking-wider font-medium mt-0.5">Madeira Pinus</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-brand-accent">Artesanal</p>
                <p className="text-xs text-brand-dark/70 uppercase tracking-wider font-medium mt-0.5">Feito à Mão</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-brand-accent">Local</p>
                <p className="text-xs text-brand-dark/70 uppercase tracking-wider font-medium mt-0.5">Sustentável</p>
              </div>
            </div>
          </div>

          {/* Cover Table Artwork Container */}
          <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-[500px] bg-brand-accent/5 overflow-hidden">
            <img 
              src={HERO_IMAGE} 
              alt="Mesa Lateral de Madeira Pinus Triângulo" 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Elegant glassmorphism floating label matching the PDF theme */}
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-brand-light/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
              <p className="font-serif text-sm italic text-brand-accent">"Deixando sua casa com cara de lar"</p>
              <p className="text-xs text-brand-dark/60 mt-1 font-mono">Destaque da Capa: Mesa Lateral Redonda Tripé</p>
            </div>
          </div>

        </div>
      </section>

      {/* Key Store Values Banner */}
      <section className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-light/70 p-6 rounded-2xl border border-brand-accent/10 flex items-start gap-4">
          <div className="bg-brand-accent/10 p-3 rounded-xl text-brand-accent">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-brand-dark">Artesanato Local</h4>
            <p className="text-sm text-brand-dark/70 mt-1">Cada produto é fabricado com cuidado carinhoso em nosso ateliê, apoiando o comércio ético local.</p>
          </div>
        </div>
        
        <div className="bg-brand-light/70 p-6 rounded-2xl border border-brand-accent/10 flex items-start gap-4">
          <div className="bg-brand-accent/10 p-3 rounded-xl text-brand-accent">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-brand-dark">Madeira Ecológica</h4>
            <p className="text-sm text-brand-dark/70 mt-1">Utilizamos pinus certificado de reflorestamento, ajudando a proteger o meio ambiente.</p>
          </div>
        </div>

        <div className="bg-brand-light/70 p-6 rounded-2xl border border-brand-accent/10 flex items-start gap-4">
          <div className="bg-brand-green/10 p-3 rounded-xl text-brand-green">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-brand-dark">Compre Online</h4>
            <p className="text-sm text-brand-dark/70 mt-1">Monte seu carrinho diretamente no site e envie seu pedido de compra via WhatsApp para combinar a entrega.</p>
          </div>
        </div>
      </section>

      {/* Main Catalog Section - "NOSSOS PRODUTOS" (Page 2 in PDF representation) */}
      <main id="catalogo" className="max-w-7xl mx-auto px-4 mt-16 scroll-mt-24">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-brand-accent">Ateliê Exclusivo</span>
          <h3 className="font-serif text-4xl md:text-5xl font-extrabold text-brand-dark mt-2">
            NOSSOS PRODUTOS
          </h3>
          <p className="text-brand-dark/70 text-sm md:text-base mt-3 leading-relaxed">
            Consulte todos os itens do nosso catálogo físico oficial de Pinus. Clique nos produtos para ver dimensões, características adicionais e detalhes.
          </p>
        </div>

        {/* Toolbar: Search, Category Filters, Sorting */}
        <div className="bg-brand-light/90 backdrop-blur-sm p-5 rounded-2xl border border-brand-accent/10 shadow-md flex flex-col gap-5 mb-8">
          
          {/* Top row: Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/50" />
              <input
                type="text"
                placeholder="Buscar produtos pelo nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-brand-dark text-sm pl-10 pr-4 py-3 rounded-xl border border-brand-accent/20 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-dark/40 hover:text-brand-dark cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <ArrowUpDown className="w-4 h-4 text-brand-accent" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white text-brand-dark text-sm px-4 py-3 rounded-xl border border-brand-accent/20 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all cursor-pointer w-full md:w-auto"
              >
                <option value="default">Ordenar: Padrão do PDF</option>
                <option value="price-asc">Menor Preço para Maior</option>
                <option value="price-desc">Maior Preço para Menor</option>
              </select>
            </div>
          </div>

          {/* Bottom row: Category filter list */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-xs uppercase tracking-wider font-bold text-brand-dark/60 flex items-center gap-1 shrink-0 mr-2">
              <Filter className="w-3 h-3" /> Categorias:
            </span>
            <div className="flex gap-1.5 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-4 py-2 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-brand-accent text-white font-semibold shadow-sm"
                      : "bg-brand-accent/5 text-brand-dark hover:bg-brand-accent/15"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => {
              const isFav = favorites.includes(product.id);
              const inBagCount = cart.find(item => item.product.id === product.id)?.quantity || 0;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-brand-light rounded-2xl overflow-hidden border border-brand-accent/10 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                  id={`product-card-${product.id}`}
                >
                  {/* Image container */}
                  <div className="relative aspect-square overflow-hidden bg-brand-accent/5">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 bg-brand-dark/70 text-brand-light text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {product.category}
                    </span>

                    {/* Action floating buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="bg-white/90 hover:bg-white text-brand-dark hover:text-red-500 p-2 rounded-full shadow-md transition-all duration-300 cursor-pointer backdrop-blur-xs"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? "text-red-500 fill-red-500" : ""}`} />
                      </button>
                    </div>

                    {/* Quick Indicator if already in Bag */}
                    {inBagCount > 0 && (
                      <div className="absolute bottom-3 left-3 bg-brand-green text-brand-light text-xs font-semibold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1 animate-fade-in">
                        <Check className="w-3 h-3" />
                        <span>{inBagCount} no carrinho</span>
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="font-serif text-xl font-bold text-brand-dark group-hover:text-brand-accent transition-colors">
                      {product.name}
                    </h4>
                    
                    <p className="text-brand-dark/70 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price and Add button section */}
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-brand-accent/10">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-brand-dark/50 font-bold block">Preço Especial</span>
                        <span className="font-mono text-xl font-extrabold text-brand-green">
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </span>
                      </div>

                      <button
                        onClick={(e) => addToCart(product, e)}
                        className="bg-brand-accent hover:bg-brand-dark text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-brand-light/50 rounded-2xl border border-dashed border-brand-accent/20">
            <AlertCircle className="w-12 h-12 text-brand-accent mx-auto mb-3" />
            <p className="text-lg font-serif font-bold text-brand-dark">Nenhum produto encontrado</p>
            <p className="text-sm text-brand-dark/60 mt-1">Tente ajustar seus termos de busca ou mudar a categoria selecionada.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); }}
              className="mt-4 bg-brand-accent text-white px-5 py-2 rounded-lg text-xs font-medium cursor-pointer"
            >
              Resetar Filtros
            </button>
          </div>
        )}
      </main>

      {/* Extra Interactive Section: Design Planner */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="bg-brand-dark text-brand-light rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle background circles for styling */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-brand-accent/15 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-brand-green/10 blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-brand-accent text-white text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full mb-6">
              Dica de Decoração
            </div>
            <h3 className="font-serif text-3xl md:text-4xl font-extrabold mb-4 leading-tight text-brand-light">
              Como combinar madeira pinus em seu ambiente?
            </h3>
            <p className="text-brand-light/80 text-sm md:text-base leading-relaxed mb-6">
              A madeira pinus tem tons claros naturais, o que a torna extremamente versátil! Ela harmoniza maravilhosamente bem com decorações de estilo <strong className="text-white font-semibold">Escandinavo</strong>, <strong className="text-white font-semibold">Boho Chic</strong>, e claro, o <strong className="text-white font-semibold">Rústico Moderno</strong>. Combine com folhagens verdes vivas, cerâmicas artesanais em tons pastéis ou off-white, e tecidos naturais como linho e algodão crú para evocar um clima aconchegante e afetuoso na sua moradia.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/10 text-brand-light text-xs px-3 py-1.5 rounded-md border border-white/15">#EstiloEscandinavo</span>
              <span className="bg-white/10 text-brand-light text-xs px-3 py-1.5 rounded-md border border-white/15">#AconchegoRústico</span>
              <span className="bg-white/10 text-brand-light text-xs px-3 py-1.5 rounded-md border border-white/15">#MadeiraDeReflorestamento</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Details */}
      <footer className="border-t border-brand-accent/15 mt-24 pt-16 bg-brand-light/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <h5 className="font-serif text-2xl font-bold text-brand-dark">
              RAIZ & MADEIRA
            </h5>
            <p className="text-xs uppercase tracking-[0.25em] text-brand-accent font-semibold mt-0.5 mb-4">
              com cara de lar
            </p>
            <p className="text-brand-dark/70 text-sm leading-relaxed max-w-sm">
              Criamos móveis e utilitários que trazem afeto, autenticidade e praticidade para sua casa, unindo design rústico ao cuidado artesanal da madeira de reflorestamento.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a 
                href={INSTAGRAM_URL} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-brand-accent/10 hover:bg-brand-accent text-brand-accent hover:text-white p-2.5 rounded-full transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={`https://api.whatsapp.com/send?phone=${PHONE_NUMBER}`} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-brand-accent/10 hover:bg-brand-accent text-brand-accent hover:text-white p-2.5 rounded-full transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Col */}
          <div>
            <h6 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-dark/80 mb-4">Categorias</h6>
            <ul className="space-y-2 text-sm text-brand-dark/70">
              <li><button onClick={() => { setSelectedCategory("Cozinha"); }} className="hover:text-brand-accent transition-colors">Cozinha</button></li>
              <li><button onClick={() => { setSelectedCategory("Café & Chá"); }} className="hover:text-brand-accent transition-colors">Café & Chá</button></li>
              <li><button onClick={() => { setSelectedCategory("Organização"); }} className="hover:text-brand-accent transition-colors">Organização</button></li>
              <li><button onClick={() => { setSelectedCategory("Decoração"); }} className="hover:text-brand-accent transition-colors">Decoração</button></li>
            </ul>
          </div>

          {/* Contact info Col */}
          <div>
            <h6 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-dark/80 mb-4">Atendimento</h6>
            <ul className="space-y-3 text-sm text-brand-dark/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <span>{ADDRESS_REPRESENTATION}</span>
              </li>
              <li className="flex items-center gap-2 hover:text-brand-accent transition-colors">
                <Instagram className="w-4 h-4 text-brand-accent shrink-0" />
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  {INSTAGRAM_HANDLE}
                </a>
              </li>
              <li className="flex items-center gap-2 hover:text-brand-accent transition-colors">
                <MessageCircle className="w-4 h-4 text-brand-accent shrink-0" />
                <a href={`https://api.whatsapp.com/send?phone=${PHONE_NUMBER}`} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  Enviar Dúvida por WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer credit bar */}
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-brand-accent/10 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-dark/50">
            © 2026 Ateliê Raiz & Madeira. Todos os direitos reservados.
          </p>
          <div className="flex gap-2 text-[10px] text-brand-dark/40 font-mono">
            <span>Pinus 100% reflorestamento</span>
            <span>•</span>
            <span>Estúdio Fotográfico por Inteligência Artificial</span>
          </div>
        </div>
      </footer>

      {/* PRODUCT DETAIL DIALOG / MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-brand-dark/60 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-brand-light text-brand-dark w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto shadow-2xl relative z-10 border border-brand-accent/20"
              id="product-detail-modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-brand-dark/10 hover:bg-brand-dark/20 text-brand-dark p-2.5 rounded-full z-20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Product Image Panel */}
                <div className="bg-brand-accent/5 relative aspect-square md:aspect-auto md:min-h-[450px]">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-brand-accent text-white text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full shadow-sm">
                    {selectedProduct.category}
                  </span>
                </div>

                {/* Text specifications panel */}
                <div className="p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-brand-accent/80 font-bold uppercase">Produto Oficial de Pinus</span>
                      {favorites.includes(selectedProduct.id) && (
                        <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-red-500" /> Salvo nos Favoritos
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-brand-dark">
                      {selectedProduct.name}
                    </h3>

                    {/* Price tag */}
                    <p className="font-mono text-2xl font-black text-brand-green mt-3 mb-6">
                      R$ {selectedProduct.price.toFixed(2).replace(".", ",")}
                    </p>

                    <p className="text-brand-dark/80 text-sm leading-relaxed mb-6">
                      {selectedProduct.description}
                    </p>

                    {/* Dimensions & Features checklist */}
                    <div className="space-y-4 mb-8">
                      {selectedProduct.dimensions && (
                        <div className="bg-brand-accent/5 p-3 rounded-xl border border-brand-accent/15 flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/60">Dimensões Médias:</span>
                          <span className="text-sm font-mono font-medium text-brand-accent">{selectedProduct.dimensions}</span>
                        </div>
                      )}

                      <div>
                        <h5 className="text-xs uppercase tracking-wider font-bold text-brand-dark/50 mb-2">Destaques da Peça:</h5>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-dark/80">
                          {selectedProduct.features.map((feat, index) => (
                            <li key={index} className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-brand-green" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex gap-4 pt-6 border-t border-brand-accent/10">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="bg-brand-accent hover:bg-brand-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex-grow flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar ao Carrinho de Compras
                    </button>
                    
                    <button
                      onClick={(e) => toggleFavorite(selectedProduct.id, e)}
                      className="bg-brand-light border border-brand-accent/30 hover:bg-brand-accent/10 text-brand-dark p-3.5 rounded-xl transition-all duration-300 cursor-pointer"
                      title="Salvar nos Favoritos"
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(selectedProduct.id) ? "text-red-500 fill-red-500" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHOPPING BAG (CART) SLIDING SIDEBAR */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-brand-dark/50 backdrop-blur-xs"
            ></motion.div>

            {/* Sidebar drawer container */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.35 }}
                className="w-screen max-w-md bg-brand-light text-brand-dark shadow-2xl flex flex-col justify-between h-full border-l border-brand-accent/20"
                id="cart-drawer-container"
              >
                {/* Header of Drawer */}
                <div className="p-6 border-b border-brand-accent/10 flex items-center justify-between bg-brand-light/95 sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-accent" />
                    <h3 className="font-serif text-lg font-bold">Seu Carrinho de Compras</h3>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 bg-brand-dark/5 hover:bg-brand-dark/10 rounded-full text-brand-dark transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Items List inside Drawer */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length > 0 ? (
                    <>
                      <div className="text-xs text-brand-dark/60 bg-brand-accent/5 p-3 rounded-xl border border-brand-accent/10 flex items-start gap-2">
                        <Info className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                        <span>Gerencie os produtos no seu carrinho. Ao finalizar, clique em enviar para enviar seu pedido diretamente ao WhatsApp da loja.</span>
                      </div>
                      
                      {cart.map((item) => (
                        <div 
                          key={item.product.id}
                          className="flex gap-3 bg-white p-3.5 rounded-xl border border-brand-accent/10 shadow-xs group/item transition-all"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-lg object-cover bg-brand-accent/5 shrink-0"
                          />
                          
                          <div className="flex-grow min-w-0">
                            <h5 className="font-serif text-sm font-bold truncate text-brand-dark">
                              {item.product.name}
                            </h5>
                            <p className="font-mono text-xs font-semibold text-brand-green mt-0.5">
                              R$ {item.product.price.toFixed(2).replace(".", ",")}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1.5 bg-brand-light border border-brand-accent/15 px-2 py-1 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.product.id, -1)}
                                  className="text-brand-dark/70 hover:text-brand-dark p-0.5 transition-colors cursor-pointer"
                                  title="Diminuir"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="font-mono text-xs font-bold w-5 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, 1)}
                                  className="text-brand-dark/70 hover:text-brand-dark p-0.5 transition-colors cursor-pointer"
                                  title="Aumentar"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                                title="Remover item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-20">
                      <ShoppingBag className="w-12 h-12 text-brand-accent/30 mx-auto mb-4" />
                      <p className="font-serif font-bold text-brand-dark text-base">Seu carrinho está vazio</p>
                      <p className="text-xs text-brand-dark/50 mt-1.5 max-w-[200px] mx-auto leading-relaxed">
                        Que tal adicionar alguns dos nossos lindos produtos de Pinus?
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 bg-brand-accent text-white px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow-md"
                      >
                        Ver Loja Online
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Section of Drawer (Form + Total & Checkout) */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-brand-accent/10 bg-brand-light sticky bottom-0 z-10 shadow-[0_-8px_24px_-4px_rgba(0,0,0,0.05)]">
                    {/* Customer Information Form */}
                    <div className="space-y-3.5 mb-5">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-brand-dark/70 border-b border-brand-accent/10 pb-1.5">Dados de Contato</h4>
                      
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-brand-dark/60 mb-1">Seu Nome</label>
                        <input
                          type="text"
                          placeholder="Ex: João da Silva"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-white text-brand-dark text-xs px-3.5 py-2.5 rounded-lg border border-brand-accent/20 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                        />
                      </div>

                      {/* Delivery selector */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-brand-dark/60 mb-1.5">Como quer receber?</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setDeliveryOption("retirada")}
                            className={`text-xs py-2 rounded-lg font-medium border cursor-pointer transition-all ${
                              deliveryOption === "retirada"
                                ? "bg-brand-accent text-white border-brand-accent font-semibold"
                                : "bg-white text-brand-dark border-brand-accent/20 hover:bg-brand-accent/5"
                            }`}
                          >
                            🏪 Retirada no Ateliê
                          </button>
                          <button
                            onClick={() => setDeliveryOption("entrega")}
                            className={`text-xs py-2 rounded-lg font-medium border cursor-pointer transition-all ${
                              deliveryOption === "entrega"
                                ? "bg-brand-accent text-white border-brand-accent font-semibold"
                                : "bg-white text-brand-dark border-brand-accent/20 hover:bg-brand-accent/5"
                            }`}
                          >
                            🚚 Entrega em SP
                          </button>
                        </div>
                      </div>

                      {/* Delivery Address (only shown if delivery chosen) */}
                      {deliveryOption === "entrega" && (
                        <div className="animate-fade-in">
                          <label className="block text-[10px] uppercase font-bold text-brand-dark/60 mb-1">Endereço de Entrega</label>
                          <textarea
                            placeholder="Rua, Número, Bairro, Cidade..."
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            rows={2}
                            className="w-full bg-white text-brand-dark text-xs px-3.5 py-2.5 rounded-lg border border-brand-accent/20 focus:outline-none focus:ring-1 focus:ring-brand-accent resize-none"
                          />
                        </div>
                      )}
                    </div>

                    {/* Total Summary */}
                    <div className="flex items-center justify-between mb-5 bg-brand-green/5 p-3 rounded-xl border border-brand-green/10">
                      <div>
                        <span className="text-xs text-brand-dark/60 font-semibold">Total do Pedido:</span>
                        <p className="text-[10px] text-brand-dark/50">Estimativa sem frete</p>
                      </div>
                      <span className="font-mono text-2xl font-black text-brand-green">
                        R$ {cartTotal.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    {/* Submit Button */}
                    <a
                      href={whatsAppLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-brand-green hover:bg-brand-dark text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      <MessageCircle className="w-5 h-5 fill-white text-brand-green" />
                      Enviar Pedido via WhatsApp
                    </a>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
