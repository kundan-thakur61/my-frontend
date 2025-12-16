import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
   <footer className="bg-secondary-900 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    {/* Top Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

      {/* Brand */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-sm">MC</span>
          </div>
          <span className="text-xl font-bold">Mobile Covers</span>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed">
          Design your own custom mobile covers with easy tools, premium quality,
          and fast delivery.
        </p>

        <div className="flex space-x-4">
          <a className="text-gray-400 hover:text-white transition">
            <FiFacebook className="w-5 h-5" />
          </a>
          <a className="text-gray-400 hover:text-white transition">
            <FiInstagram className="w-5 h-5" />
          </a>
          <a className="text-gray-400 hover:text-white transition">
            <FiYoutube className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Support */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Support</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="hover:text-white cursor-pointer">Shipping Policy</li>
          <li className="hover:text-white cursor-pointer">Returns & Refunds</li>
          <li className="hover:text-white cursor-pointer">Privacy Policy</li>
          <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Contact</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <p className="font-medium">Email</p>
            <a
              href="mailto:coverghar@gmail.com"
              className="hover:text-white transition"
            >
              coverghar@gmail.com
            </a>
          </div>
          <div>
            <p className="font-medium">Address</p>
            <p>Ranchi (JH) 825418</p>
          </div>
        </div>
      </div>

      {/* Empty / Future column */}
      <div className="hidden lg:block" />
    </div>

    {/* Bottom */}
    <div className="border-t border-gray-700 mt-10 pt-6 text-center md:flex md:justify-between">
      <p className="text-gray-400 text-sm">
        © {currentYear} Mobile Covers. All rights reserved.
      </p>
    </div>

  </div>
</footer>

  );
};

export default Footer;