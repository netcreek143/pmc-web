import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import BulkOrders from './pages/BulkOrders';
import CustomPrinting from './pages/CustomPrinting';
import Login from './pages/Login';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import OrderTracking from './pages/OrderTracking';
import Category from './pages/Category';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import AdminCoupons from './pages/AdminCoupons';
import AdminContent from './pages/AdminContent';
import AdminReports from './pages/AdminReports';
import AdminRoute from './components/AdminRoute';
import AdminCompany from './pages/AdminCompany';
import AdminEmployee from './pages/AdminEmployee';
import AdminCategory from './pages/AdminCategory';
import AdminProductsAdd from './pages/AdminProductsAdd';
import AdminTransmit from './pages/AdminTransmit';
import AdminCampaign from './pages/AdminCampaign';
import AdminReviews from './pages/AdminReviews';
import AdminCustomize from './pages/AdminCustomize';
import AdminInvoice from './pages/AdminInvoice';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/shop"
          element={
            <Layout>
              <Shop />
            </Layout>
          }
        />
        <Route
          path="/category/:id"
          element={
            <Layout>
              <Category />
            </Layout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <Layout>
              <ProductDetail />
            </Layout>
          }
        />
        <Route
          path="/blog"
          element={
            <Layout>
              <Blog />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/bulk-orders"
          element={
            <Layout>
              <BulkOrders />
            </Layout>
          }
        />
        <Route
          path="/custom-printing"
          element={
            <Layout>
              <CustomPrinting />
            </Layout>
          }
        />
        <Route
          path="/cart"
          element={
            <Layout>
              <Cart />
            </Layout>
          }
        />
        <Route
          path="/checkout"
          element={
            <Layout>
              <Checkout />
            </Layout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <Layout>
              <Wishlist />
            </Layout>
          }
        />
        <Route
          path="/order-tracking"
          element={
            <Layout>
              <OrderTracking />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/account"
          element={
            <Layout>
              <Account />
            </Layout>
          }
        />
        <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/company" element={<AdminRoute><AdminLayout><AdminCompany /></AdminLayout></AdminRoute>} />
        <Route path="/admin/employee" element={<AdminRoute><AdminLayout><AdminEmployee /></AdminLayout></AdminRoute>} />
        <Route path="/admin/category" element={<AdminRoute><AdminLayout><AdminCategory /></AdminLayout></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
        <Route path="/admin/products/add" element={<AdminRoute><AdminLayout><AdminProductsAdd /></AdminLayout></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
        <Route path="/admin/invoice" element={<AdminRoute><AdminLayout><AdminInvoice /></AdminLayout></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><AdminLayout><AdminCustomers /></AdminLayout></AdminRoute>} />
        <Route path="/admin/coupons" element={<AdminRoute><AdminLayout><AdminCoupons /></AdminLayout></AdminRoute>} />

        <Route path="/admin/transmit" element={<AdminRoute><AdminLayout><AdminTransmit /></AdminLayout></AdminRoute>} />
        <Route path="/admin/campaign" element={<AdminRoute><AdminLayout><AdminCampaign /></AdminLayout></AdminRoute>} />
        <Route path="/admin/reviews" element={<AdminRoute><AdminLayout><AdminReviews /></AdminLayout></AdminRoute>} />
        <Route path="/admin/customize" element={<AdminRoute><AdminLayout><AdminCustomize /></AdminLayout></AdminRoute>} />

        <Route path="/admin/content" element={<AdminRoute><AdminLayout><AdminContent /></AdminLayout></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminLayout><AdminReports /></AdminLayout></AdminRoute>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
