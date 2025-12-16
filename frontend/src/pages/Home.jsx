import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchTrendingProducts } from '../redux/slices/productSlice';
import { FiShoppingCart, FiZap, FiShield, FiTruck } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Loader, { CardSkeleton } from '../components/Loader';
import ThemeShowcase from '../components/ThemeShowcase';
import mainBackground from '../assets/main-background.png';
import Customised  from '../assets/Customised-theam[1].png';
const Home = () => {
  const dispatch = useDispatch();
  // const { loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ featured: true, limit: 8 }));
    dispatch(fetchTrendingProducts({ limit: 8 }));
  }, [dispatch]);

  return (


    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Design Your Perfect
                <span className="block text-yellow-300">Mobile Cover</span>
              </h1>
              

              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* optional buttons */}
              </div>
            </div>


               </div>
        </div>
      </section>

      

         {/* ===== single card with two different links ===== */}
<div className="w-full">
  <div className="bg-white/25 rounded-2xl p-3 backdrop-blur-sm">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      
      {/* Mobile Covers */}
      <Link
        to="/themes"
        className="block rounded-xl overflow-hidden "
      >
        <img
          src={mainBackground}
          alt="Mobile Covers"
          className="w-full h-auto object-contain"
        />
      </Link>

      {/* Customised Cover */}
      <Link
        to="/customizer"
        className="block rounded-xl overflow-hidden "
      >
        <img
          src={Customised}
          alt="Customised Cover"
          className="w-full h-auto object-contain"
        />
      </Link>

    </div>
  </div>
</div>
{/* ===== end card ===== */}

       
     
      
  

      {/* Featured Products */}
{/* 

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Products</h2>
              <p className="text-lg text-gray-600 mt-2">Discover our most popular mobile covers</p>
            </div>
            <Link
              to="/products"
              className="bg-sky-500 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <CardSkeleton count={4} />
          ) : Array.isArray(products) && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      </section> */}

      {/* Features Section */}
{/* <section className=" section-padding py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
    





    {/* Heading */}
    {/* <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Why Choose Us
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        We provide the best quality custom mobile covers with advanced printing
        technology and premium materials.
      </p>
    </div> */}

    {/* Cards */}
    {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
      
      {/* Card 1 */}
{/*       
       <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiZap className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Easy Design
        </h3>
        <p className="text-gray-600">
          User-friendly design tool to create your perfect mobile cover in minutes.
        </p>
      </div>  */}


      {/* Card 2 */}
      {/* <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiShield className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Premium Quality
        </h3>
        <p className="text-gray-600">
          High-quality materials with advanced UV printing for long-lasting prints.
        </p>
      </div> */}

      {/* Card 3 */}
      {/* <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiTruck className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Fast Delivery
        </h3>
        <p className="text-gray-600">
          Quick production and delivery across India in just 3–5 days.
        </p>
      </div> */}

      {/* Card 4 */}

{/*       
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiShoppingCart className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Secure Payment
        </h3>
        <p className="text-gray-600">
          Multiple payment options with a safe and secure checkout.
        </p>
      </div>

    </div>
  </div>
</section> */}






    </div>
  );
};

export default Home;
