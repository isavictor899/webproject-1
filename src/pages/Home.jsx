import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1642764732251-9dacf60eb423?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    badge: 'In Stock', title: 'Household Items',
    desc: 'From cleaning supplies to kitchen essentials, our household items are designed to make everyday living easier.',
    tooltipTitle: 'Household Essentials',
    tooltipItems: [
      { icon: 'fa-broom',     label: 'Cleaning Agents & Detergents' },
      { icon: 'fa-utensils',  label: 'Kitchen Utensils & Storage' },
      { icon: 'fa-soap',      label: 'Sanitary & Paper Products' },
      { icon: 'fa-spray-can', label: 'Home Fragrances & Air Fresheners' },
    ], tooltipLeft: false,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1557543506-2656f0961c10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    badge: 'Best Seller', title: 'Food and Beverages',
    desc: 'We offer a diverse selection of food and beverage products that cater to the tastes and preferences of our customers.',
    tooltipTitle: 'Groceries & Refreshments',
    tooltipItems: [
      { icon: 'fa-wheat-awn',   label: 'Grains, Flours, and Cereals' },
      { icon: 'fa-cookie-bite', label: 'Packaged Snacks & Confectionery' },
      { icon: 'fa-mug-hot',     label: 'Non-alcoholic Drinks' },
      { icon: 'fa-box',         label: 'Canned & Preserved Foods' },
    ], tooltipLeft: false,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1610161030119-22452b016153?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    badge: 'New', title: 'Personal Care',
    desc: 'Our personal care products ensure that everyone has access to quality hygiene and beauty essentials.',
    tooltipTitle: 'Health & Hygiene',
    tooltipItems: [
      { icon: 'fa-pump-soap', label: 'Soap, Shampoo & Conditioners' },
      { icon: 'fa-tooth',     label: 'Toothpaste & Oral Care' },
      { icon: 'fa-sun',       label: 'Body Lotions & Skincare' },
      { icon: 'fa-baby',      label: 'Essential Baby Care Items' },
    ], tooltipLeft: true,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1664004924947-2a2b6fbefb8b?w=600&auto=format&fit=crop&q=60',
    badge: 'In Stock', title: 'Cleaning Supplies',
    desc: 'Deep cleaning and maintenance supplies for your home and business.',
    tooltipTitle: 'Cleaning & Maintenance',
    tooltipItems: [
      { icon: 'fa-brush',     label: 'Heavy Duty Cleaners' },
      { icon: 'fa-broom',     label: 'Floor and Surface Care' },
      { icon: 'fa-spray-can', label: 'Disinfectants' },
      { icon: 'fa-wind',      label: 'Tools and Cloths' },
    ], tooltipLeft: false,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1614735241165-6756e1df61ab?q=80&w=1332&auto=format&fit=crop',
    badge: 'Value Pack', title: 'Snacks and Treats',
    desc: 'All your confectionery and quick snack inventory needs in one place.',
    tooltipTitle: 'Confectionery Details',
    tooltipItems: [
      { icon: 'fa-cookie-bite', label: 'Biscuits & Cookies' },
      { icon: 'fa-candy-cane',  label: 'Chocolates & Candies' },
      { icon: 'fa-box-open',    label: 'Salty Snacks & Crisps' },
      { icon: 'fa-box',         label: 'Bulk Variety Packs' },
    ], tooltipLeft: false,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1610161030119-22452b016153?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    badge: 'On Sale', title: 'Baby Products',
    desc: 'Essential items tailored for baby care, including diapers, wipes, and sensitive skin formulas.',
    tooltipTitle: 'Infant Care Range',
    tooltipItems: [
      { icon: 'fa-baby',      label: 'Diapers (Various Sizes)' },
      { icon: 'fa-pump-soap', label: 'Sensitive Wipes' },
      { icon: 'fa-sun',       label: 'Baby Lotions & Oils' },
      { icon: 'fa-bath',      label: 'Shampoo & Wash' },
    ], tooltipLeft: true,
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1738484708927-c1f45df0b56e?q=80&w=1167&auto=format&fit=crop',
    badge: 'In Stock', title: 'Kitchen Supplies',
    desc: 'Items essential for cooking, food preparation, and storage in the kitchen.',
    tooltipTitle: 'Cooking & Storage',
    tooltipItems: [
      { icon: 'fa-utensils', label: 'Aluminum Foil & Wrap' },
      { icon: 'fa-trash',    label: 'Garbage Bags' },
      { icon: 'fa-boxes',    label: 'Storage Containers' },
      { icon: 'fa-soap',     label: 'Dish Cloths & Sponges' },
    ], tooltipLeft: false,
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1567948928621-836c2fcf6165?q=80&w=687&auto=format&fit=crop',
    badge: 'Best Seller', title: 'Cold Beverages',
    desc: 'Cold drinks, juices, and water for all your refreshment needs.',
    tooltipTitle: 'Cold Drinks & Juices',
    tooltipItems: [
      { icon: 'fa-bottle-water', label: 'Mineral Water' },
      { icon: 'fa-wine-glass',   label: 'Fruit Juices' },
      { icon: 'fa-mug-hot',      label: 'Carbonated Drinks' },
      { icon: 'fa-bolt',         label: 'Energy Drinks' },
    ], tooltipLeft: false,
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1695972235610-0c68661d537c?w=600&auto=format&fit=crop&q=60',
    badge: 'New', title: 'Beauty & Cosmetics',
    desc: 'Essential beauty and cosmetic items for daily use and personal care.',
    tooltipTitle: 'Beauty Essentials',
    tooltipItems: [
      { icon: 'fa-heart',    label: 'Lip Balms & Tints' },
      { icon: 'fa-sun',      label: 'Hand & Face Creams' },
      { icon: 'fa-spa',      label: 'Facial Masks' },
      { icon: 'fa-scissors', label: 'Hair Accessories' },
    ], tooltipLeft: true,
  },
]

const TESTIMONIALS = [
  {
    img: 'https://images.unsplash.com/photo-1517642528016-265378cbcc0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    name: 'Reliable Service',
    text: '"House of Essential Commodities has been a game changer for our shop. Their delivery is always on time and the products are of excellent quality."',
  },
  {
    img: 'https://images.unsplash.com/photo-1644183921950-994e367147af?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    name: 'Quality Products',
    text: '"I trust House of Essential Commodities for all my supplies. The range of products they offer is impressive and always fresh!"',
  },
  {
    img: 'https://images.unsplash.com/photo-1573325226260-763ab986c214?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    name: 'Community Support',
    text: '"As a small retailer, I appreciate how House of Essential Commodities supports local businesses. Their service is exceptional."',
  },
]

// ─── Components ──────────────────────────────────────────────────────────────

function Navbar({ scrolled, mobileOpen, onToggleMobile }) {
  const links = [
    { href: '#intro', label: 'Home' },
    { href: '#welcome', label: 'Welcome' },
    { href: '#about', label: 'About Us' },
    { href: '#products', label: 'Products' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' },
  ]
  return (
    <>
      <nav id="navbar" className={`fixed w-full z-50 top-0 text-white py-6 px-6 lg:px-12 flex justify-between items-center ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="logo-text font-heading font-bold text-xl lg:text-2xl tracking-wide uppercase">
          House of Essential Commodities
        </a>
        <div className="hidden lg:flex space-x-8 text-sm font-semibold tracking-wide uppercase items-center">
          {links.map(l => <a key={l.href} href={l.href} className="nav-link hover:text-accent transition">{l.label}</a>)}
          <Link to="/blog" className="nav-link hover:text-accent transition">Blog</Link>
        </div>
        <button onClick={onToggleMobile} className="lg:hidden text-2xl focus:outline-none">
          <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} nav-link`}></i>
        </button>
      </nav>
      <div id="mobile-menu" className={`lg:hidden fixed top-[70px] w-full bg-white shadow-lg z-40 ${mobileOpen ? 'open' : ''}`}>
        <div className="flex flex-col p-4 space-y-4 text-center font-heading text-primary font-semibold">
          {links.map(l => <a key={l.href} href={l.href} onClick={onToggleMobile} className="hover:text-accent">{l.label}</a>)}
          <Link to="/blog" onClick={onToggleMobile} className="hover:text-accent">Blog</Link>
        </div>
      </div>
    </>
  )
}

function HeroSection() {
  function handleSubmit(e) {
    e.preventDefault()
    const f = e.target
    const name = f.querySelector('input[name="name"]').value
    const email = f.querySelector('input[name="email"]').value
    const comment = f.querySelector('textarea[name="comment"]').value
    const subject = `Inquiry from Website: ${name}`
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${comment}`
    window.location.href = `mailto:sales@houseofessentialcommodities.co.ke?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section id="intro" className="hero-bg relative h-screen min-h-[600px] flex items-center justify-center">
      <picture className="absolute inset-0 block w-full h-full" aria-hidden="true">
        <source type="image/webp"
          srcSet="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&fm=webp&w=480&q=60 480w, https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&fm=webp&w=1920&q=80 1920w"
          sizes="100vw" />
        <img className="hero-img" src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="" loading="eager" decoding="async" />
      </picture>
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      <div className="container mx-auto px-6 relative z-20 flex flex-col lg:flex-row items-center justify-between pt-20">
        <div className="lg:w-1/2 text-white text-center lg:text-left mb-10 lg:mb-0">
          <p className="text-lg lg:text-xl font-light opacity-90 mb-8 max-w-lg mx-auto lg:mx-0">
            Experience convenient access to essential goods for your home and business. Join us for exclusive offers and quality products tailored for your needs.
          </p>
          <a href="#products" className="inline-block bg-accent hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg uppercase text-sm tracking-wider">
            Explore Products
          </a>
        </div>
        <div className="lg:w-1/3 bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <h3 className="font-heading text-2xl font-bold text-gray-800 mb-6 text-center">Get in Touch</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-bold mb-2">Name</label>
              <input type="text" name="name" required placeholder="Your Name" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-accent" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-bold mb-2">Email</label>
              <input type="email" name="email" required placeholder="Your Email" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-accent" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-bold mb-2">Comment</label>
              <textarea name="comment" required rows="3" placeholder="How can we help?" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-accent"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary hover:bg-gray-800 text-white font-bold py-3 px-4 rounded transition">SEND MESSAGE</button>
          </form>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }) {
  return (
    <div className={`product-card bg-white rounded-lg overflow-visible shadow-lg border border-gray-100 flex flex-col relative group ${product.tooltipLeft ? 'tooltip-left' : ''}`}>
      <div className="h-64 overflow-hidden relative">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase">{product.badge}</div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="font-heading text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-6 flex-grow">{product.desc}</p>
      </div>
      <div className="product-hover-tooltip">
        <h4 className="font-heading font-semibold text-primary mb-3 uppercase tracking-wider text-sm border-b pb-2 border-gray-100">{product.tooltipTitle}</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          {product.tooltipItems.map((item, i) => (
            <li key={i} className="flex items-center"><i className={`fas ${item.icon} text-accent mr-2`}></i>{item.label}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Navbar scrolled={scrolled} mobileOpen={mobileOpen} onToggleMobile={() => setMobileOpen(o => !o)} />
      <HeroSection />

      {/* Why Choose Us */}
      <section id="welcome" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-primary section-title">Why Choose Us</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">We are dedicated to empowering neighborhood markets across Kenya.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: 'fa-truck-fast', title: 'Swift Delivery', desc: 'Guaranteed timely delivery across major metropolitan areas in Kenya, straight to your doorstep.' },
              { icon: 'fa-warehouse', title: 'Bulk & Retail Orders', desc: 'Whether for personal consumption or business supply, we cater to both large and small orders efficiently.' },
              { icon: 'fa-hand-holding-usd', title: 'Competitive Pricing', desc: 'We offer the best value for money without compromising on the quality of essential goods.' },
            ].map(f => (
              <div key={f.title} className="bg-white p-6 rounded-lg shadow-xl transition duration-300 hover:shadow-2xl">
                <i className={`fas ${f.icon} text-5xl text-primary mb-4`}></i>
                <h3 className="text-2xl font-heading font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20 bg-offwhite">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-primary section-title">Explore Our Product Range</h2>
            <h4 className="text-xl text-gray-500 mt-4">Discover a wide variety of essential commodities.</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-white">
        {[
          { reverse: false, img: 'https://images.unsplash.com/photo-1497548637115-d2bc86a3c716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', title: 'Our Mission', bg: 'bg-gray-50', text: 'To provide reliable distribution services that connect local markets with essential commodities, promoting sustainability and growth.' },
          { reverse: true,  img: 'https://images.unsplash.com/photo-1584789899980-14c1c2855de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', title: 'Our Vision',  bg: 'bg-white',   text: 'To be the leading FMCG distributor in Kenya, recognized for our commitment to quality and customer satisfaction.' },
          { reverse: false, img: 'https://images.unsplash.com/photo-1601855751393-fd676d45d239?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', title: 'Our Values',  bg: 'bg-gray-50', text: 'Integrity, community, and excellence are the core values that drive our operations and guide our interactions with clients.' },
        ].map(p => (
          <div key={p.title} className={`flex flex-col ${p.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} h-auto md:h-[500px]`}>
            <div className="md:w-1/2 relative h-64 md:h-full">
              <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className={`md:w-1/2 p-12 lg:p-24 flex flex-col justify-center ${p.bg}`}>
              <h2 className="font-heading text-3xl font-bold text-primary mb-4 section-title section-title-left">{p.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed mt-4">{p.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="opacity-80">Feedback from our clients is a testament to our dedication and quality.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm border border-white border-opacity-10">
                <div className="flex items-center mb-4">
                  <img src={t.img} alt="Client" className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-accent" />
                  <div>
                    <h4 className="font-bold font-heading">{t.name}</h4>
                    <div className="text-yellow-400 text-xs">{[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed italic opacity-90">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white pt-20 pb-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl font-bold mb-6">Dedicated Last Mile Delivery</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
            We are committed to ensuring that our deliveries reach every corner of the community, providing a seamless experience for our retail partners.
          </p>
          <p className="text-gray-500 text-sm mb-8">&copy; 2026 House of Essential Commodities.</p>
          <div className="flex space-x-6 justify-center">
            {['fa-facebook-f', 'fa-twitter', 'fa-tiktok', 'fa-linkedin-in'].map(icon => (
              <a key={icon} href="#" className="text-gray-400 hover:text-white transition"><i className={`fab ${icon} text-xl`}></i></a>
            ))}
          </div>
        </div>
      </footer>

      {/* WhatsApp */}
      <a href="https://wa.me/254707901947" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] hover:bg-[#20ba5a] text-white p-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
        <i className="fab fa-whatsapp text-2xl"></i>
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </a>
    </>
  )
}
