import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction,
  writeBatch,
  arrayRemove,
  orderBy,
  getDoc,
  setDoc,
  where,
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  LayoutDashboard,
  ShoppingBag,
  List,
  Users,
  Truck,
  Building,
  Award,
  User,
  BarChart2,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  UploadCloud,
  Folder,
  CornerDownRight,
  Loader2,
  MessageSquare,
  Send,
  AlertTriangle,
  ChevronDown,
  Download,
  FileUp,
  History,
  FileCheck2,
  FileX2,
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: 'AIzaSyBZniBrZCyss4JxJNoolQDxhKirfTtAJqE',
  authDomain: 'mobile-shop-app-3f4c0.firebaseapp.com',
  projectId: 'mobile-shop-app-3f4c0',
  storageBucket: 'mobile-shop-app-3f4c0.firebasestorage.app',
  messagingSenderId: '389145568053',
  appId: '1:389145568053:web:8fa2089d094d906f00a27c',
  measurementId: 'G-1S9BTTJXLC',
};

// --- Cloudinary Configuration ---
// IMPORTANT: Add your Cloudinary details here
const CLOUDINARY_CLOUD_NAME = 'dsaaakdqi';
const CLOUDINARY_UPLOAD_PRESET = 'checksign_uploads';

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Context ---
const SidebarContext = createContext();
const AppContext = createContext();

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [riders, setRiders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [settings, setSettings] = useState({ points_per_currency: 1000 });
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchAllData();
      } else {
        setLoading(false);
        setIsDataLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    setIsDataLoading(true);
    try {
      await Promise.all([
        fetchCategories(),
        fetchProducts(),
        fetchOrders(),
        fetchCustomers(),
        fetchRiders(),
        fetchAdminUsers(),
        fetchSettings(),
      ]);
    } catch (e) {
      console.error('Data fetching failed', e);
      alert(
        'Failed to fetch data from the database. Please check your Firestore security rules and ensure you have an active internet connection. Ad blockers can also cause this issue.'
      );
    } finally {
      setIsDataLoading(false);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const q = query(collection(db, 'categories'), orderBy('sort_order', 'asc'));
    const querySnapshot = await getDocs(q);
    setCategories(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };
  const fetchProducts = async () => {
    const q = query(collection(db, 'products'));
    const querySnapshot = await getDocs(q);
    setProducts(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };
  const fetchOrders = async () => {
    const q = query(collection(db, 'orders'));
    const querySnapshot = await getDocs(q);
    setOrders(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };
  const fetchCustomers = async () => {
    const q = query(collection(db, 'customers'));
    const querySnapshot = await getDocs(q);
    setCustomers(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };
  const fetchRiders = async () => {
    const q = query(collection(db, 'riders'));
    const querySnapshot = await getDocs(q);
    setRiders(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };
  const fetchAdminUsers = async () => {
    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    setAdminUsers(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };
  const fetchSettings = async () => {
    const docRef = doc(db, 'settings', 'loyalty');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSettings(docSnap.data());
    }
  };

  const handleLogin = async (email, password) => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };
  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <Loader2 className='animate-spin text-blue-500' size={48} />
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        categories,
        products,
        orders,
        customers,
        riders,
        adminUsers,
        settings,
        fetchCategories,
        fetchProducts,
        fetchOrders,
        fetchCustomers,
        fetchRiders,
        fetchAdminUsers,
        fetchSettings,
        isDataLoading,
      }}
    >
      <AnimatePresence mode='wait'>
        {user ? (
          <motion.div
            key='dashboard'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminDashboard onLogout={handleLogout} />
          </motion.div>
        ) : (
          <motion.div
            key='login'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Login onLogin={handleLogin} error={error} />
          </motion.div>
        )}
      </AnimatePresence>
    </AppContext.Provider>
  );
}

// --- Login Page ---
function Login({ onLogin, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onLogin(email, password);
    setIsSubmitting(false);
  };
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 font-sans'>
      {' '}
      <motion.div
        className='w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg'
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {' '}
        <div className='text-center'>
          {' '}
          <motion.div
            className='inline-block p-3 bg-blue-500 rounded-full'
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <ShoppingBag size={40} className='text-white' />
          </motion.div>{' '}
          <h1 className='mt-4 text-3xl font-bold text-gray-800'>
            CheckSign Admin
          </h1>{' '}
          <p className='text-gray-500'>Welcome back! Please log in.</p>{' '}
        </div>{' '}
        {error && (
          <motion.div
            className='p-3 text-sm text-red-700 bg-red-100 rounded-lg'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}{' '}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {' '}
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition'
            placeholder='Email Address'
          />{' '}
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition'
            placeholder='Password'
          />{' '}
          <div className='flex items-center justify-between'>
            <a href='#' className='text-sm text-blue-600 hover:underline'>
              Forgot Password?
            </a>
          </div>{' '}
          <motion.button
            type='submit'
            disabled={isSubmitting}
            className='w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Logging In...' : 'Log In'}
          </motion.button>{' '}
        </form>{' '}
      </motion.div>{' '}
    </div>
  );
}

// --- Admin Dashboard Layout ---
function AdminDashboard({ onLogout }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeView, setActiveView] = useState('Dashboard');
  const { isDataLoading } = useContext(AppContext);

  const renderContent = () => {
    if (isDataLoading && activeView !== 'Dashboard') {
      return (
        <div className='flex items-center justify-center h-full'>
          <Loader2 className='animate-spin text-blue-500' size={32} />
        </div>
      );
    }
    switch (activeView) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Products':
        return <ProductManagement />;
      case 'Categories':
        return <CategoryManagement />;
      case 'Orders':
        return <OrderManagement />;
      case 'Customers':
        return <CustomerManagement />;
      case 'Riders':
        return <RiderManagement />;
      case 'Member Points':
        return <MemberPointsManagement />;
      case 'User Roles':
        return <UserRolesManagement />;
      case 'Reports':
        return <ReportsPage />;
      case 'Settings':
        return <SettingsPage />;
      case 'Batch Upload':
        return <BatchUploadPage />;
      default:
        return <DashboardView />;
    }
  };
  return (
    <SidebarContext.Provider value={{ isExpanded: isSidebarExpanded }}>
      {' '}
      <div className='flex h-screen bg-gray-50 font-sans'>
        {' '}
        <Sidebar
          onLogout={onLogout}
          onToggle={() => setIsSidebarExpanded((prev) => !prev)}
          activeView={activeView}
          setActiveView={setActiveView}
        />{' '}
        <div className='flex-1 flex flex-col overflow-hidden'>
          {' '}
          <Header />{' '}
          <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6'>
            {' '}
            <AnimatePresence mode='wait'>
              {' '}
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {' '}
                {renderContent()}{' '}
              </motion.div>{' '}
            </AnimatePresence>{' '}
          </main>{' '}
        </div>{' '}
      </div>{' '}
    </SidebarContext.Provider>
  );
}
// --- Sidebar ---
function Sidebar({ onLogout, onToggle, activeView, setActiveView }) {
  const { isExpanded } = useContext(SidebarContext);
  const navItems = [
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { icon: <ShoppingBag size={20} />, text: 'Products' },
    { icon: <FileUp size={20} />, text: 'Batch Upload' },
    { icon: <Folder size={20} />, text: 'Categories' },
    { icon: <List size={20} />, text: 'Orders' },
    { icon: <Users size={20} />, text: 'Customers' },
    { icon: <Truck size={20} />, text: 'Riders' },
    { icon: <Award size={20} />, text: 'Member Points' },
    { icon: <User size={20} />, text: 'User Roles' },
    { icon: <BarChart2 size={20} />, text: 'Reports' },
  ];
  return (
    <motion.aside
      className='relative bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out'
      animate={{ width: isExpanded ? 256 : 80 }}
    >
      {' '}
      <div className='p-4 flex items-center justify-between h-16 border-b'>
        {' '}
        <div
          className={`flex items-center gap-3 ${
            !isExpanded && 'justify-center w-full'
          }`}
        >
          {' '}
          <div className='p-2 bg-blue-500 rounded-lg'>
            <ShoppingBag size={24} className='text-white' />
          </div>{' '}
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                className='font-bold text-xl text-gray-800'
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                CheckSign
              </motion.span>
            )}
          </AnimatePresence>{' '}
        </div>{' '}
      </div>{' '}
      <button
        onClick={onToggle}
        className='absolute -right-3 top-16 bg-white border-2 border-blue-500 text-blue-500 rounded-full p-1 z-10 hover:bg-blue-50 transition'
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>{' '}
      <nav className='flex-1 px-3 py-4 space-y-2 overflow-y-auto'>
        {' '}
        {navItems.map((item) => (
          <div key={item.text} onClick={() => setActiveView(item.text)}>
            <SidebarItem
              icon={item.icon}
              text={item.text}
              active={activeView === item.text}
            />
          </div>
        ))}{' '}
      </nav>{' '}
      <div className='px-3 py-4 border-t'>
        {' '}
        <div onClick={() => setActiveView('Settings')}>
          <SidebarItem
            icon={<Settings size={20} />}
            text='Settings'
            active={activeView === 'Settings'}
          />
        </div>{' '}
        <div onClick={onLogout}>
          <SidebarItem icon={<LogOut size={20} />} text='Logout' />
        </div>{' '}
      </div>{' '}
    </motion.aside>
  );
}

function SidebarItem({ icon, text, active }) {
  const { isExpanded } = useContext(SidebarContext);
  return (
    <div
      className={`relative flex items-center py-2.5 px-4 my-1 rounded-md cursor-pointer transition-colors group ${
        active
          ? 'bg-gradient-to-tr from-blue-200 to-blue-100 text-blue-800'
          : 'hover:bg-gray-100 text-gray-600'
      }`}
    >
      {' '}
      {icon}{' '}
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            className='overflow-hidden transition-all ml-4 font-medium'
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>{' '}
      {!isExpanded && (
        <div className='absolute left-full rounded-md px-2 py-1 ml-6 bg-blue-100 text-blue-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0'>
          {text}
        </div>
      )}{' '}
    </div>
  );
}
// --- Header ---
function Header() {
  return (
    <header className='h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6'>
      {' '}
      <div className='relative w-64'>
        <Search
          className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          size={20}
        />
        <input
          type='text'
          placeholder='Search...'
          className='w-full bg-gray-100 border border-transparent rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>{' '}
      <div className='flex items-center gap-4'>
        {' '}
        <button className='relative p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-full'>
          <Bell size={22} />
          <span className='absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white'></span>
        </button>{' '}
        <div className='relative'>
          {' '}
          <button className='flex items-center gap-2'>
            <img
              src={`https://i.pravatar.cc/150?u=${auth.currentUser.email}`}
              alt='User'
              className='w-9 h-9 rounded-full object-cover border-2 border-gray-200'
            />
            <div className='text-left hidden md:block'>
              <p className='text-sm font-semibold text-gray-800'>
                {auth.currentUser.email}
              </p>
              <p className='text-xs text-gray-500'>Admin</p>
            </div>
          </button>{' '}
        </div>{' '}
      </div>{' '}
    </header>
  );
}
// --- Dashboard View ---
function DashboardView() {
  const { isDataLoading } = useContext(AppContext);
  const statsCardsData = [
    {
      title: 'Total Sales (This Month)',
      value: 'Ks 12,500,000',
      change: '+15.2%',
      changeType: 'increase',
      icon: <BarChart2 size={24} className='text-blue-500' />,
    },
    {
      title: 'Orders Pending',
      value: '28',
      change: '+5',
      changeType: 'increase',
      icon: <List size={24} className='text-orange-500' />,
    },
    {
      title: 'Top-Selling Item',
      value: 'Classic Cotton T-Shirt',
      change: '150 units',
      changeType: 'neutral',
      icon: <ShoppingBag size={24} className='text-green-500' />,
    },
    {
      title: 'Low Stock Alerts',
      value: '5 items',
      change: 'Check inventory',
      changeType: 'decrease',
      icon: <Bell size={24} className='text-red-500' />,
    },
  ];
  const salesData = [
    { name: 'Week 1', sales: 4000 },
    { name: 'Week 2', sales: 3000 },
    { name: 'Week 3', sales: 2000 },
    { name: 'Week 4', sales: 2780 },
  ];
  const categoryData = [
    { name: 'Men', value: 400 },
    { name: 'Women', value: 300 },
    { name: 'Kids', value: 300 },
    { name: 'Accessories', value: 200 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  if (isDataLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader2 className='animate-spin text-blue-500' size={32} />
      </div>
    );
  }
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statsCardsData.map((card, index) => (
          <motion.div
            key={card.title}
            className='bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-5'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className='p-3 bg-gray-100 rounded-full'>{card.icon}</div>
            <div>
              <p className='text-sm text-gray-500'>{card.title}</p>
              <p className='text-2xl font-bold text-gray-800'>{card.value}</p>
              <p
                className={`text-xs ${
                  card.changeType === 'increase'
                    ? 'text-green-600'
                    : card.changeType === 'decrease'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {card.change}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <motion.div
          className='lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className='font-bold text-lg text-gray-800 mb-4'>
            Monthly Sales Trend
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis
                  dataKey='name'
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `Ks ${value / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend iconSize={10} />
                <Bar
                  dataKey='sales'
                  fill='#3B82F6'
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div
          className='bg-white p-6 rounded-xl border border-gray-200'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className='font-bold text-lg text-gray-800 mb-4'>
            Top Categories
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={100}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
// --- Product Management ---
function ProductManagement() {
  const { products, categories, fetchProducts } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async () => {
    await fetchProducts();
    handleCloseModal();
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      await fetchProducts();
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  const getCategoryPath = (categoryId, allCategories) => {
    let path = [];
    let currentId = categoryId;
    while (currentId) {
      const currentCategory = allCategories.find((c) => c.id === currentId);
      if (currentCategory) {
        path.unshift(currentCategory.name);
        currentId = currentCategory.parent_id;
      } else {
        break;
      }
    }
    return path.join(' > ');
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='relative'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Products</h1>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Search products...'
              className='w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {}}
            className='flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition'
          >
            <Download size={16} /> Export
          </button>
          <motion.button
            onClick={() => handleOpenModal()}
            className='flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} /> Add Product
          </motion.button>
        </div>
      </div>
      <ProductTable
        products={filteredProducts}
        onEdit={handleOpenModal}
        onDelete={(product) => setProductToDelete(product)}
        getCategoryName={(id) => getCategoryPath(id, categories)}
      />
      <AnimatePresence>
        {isModalOpen && (
          <ProductModal
            product={editingProduct}
            onClose={handleCloseModal}
            onSave={handleSaveProduct}
          />
        )}
        {productToDelete && (
          <ConfirmationModal
            title='Delete Product'
            message={`Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`}
            onConfirm={() => handleDeleteProduct(productToDelete.id)}
            onCancel={() => setProductToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductTable({ products, onEdit, onDelete, getCategoryName }) {
  if (products.length === 0) {
    return (
      <div className='text-center p-10 bg-white rounded-xl border'>
        <p className='text-gray-500'>No products found.</p>
      </div>
    );
  }
  return (
    <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Product
              </th>
              <th scope='col' className='px-6 py-3'>
                Category
              </th>
              <th scope='col' className='px-6 py-3'>
                Price Range
              </th>
              <th scope='col' className='px-6 py-3'>
                Stock
              </th>
              <th scope='col' className='px-6 py-3'>
                Status
              </th>
              <th scope='col' className='px-6 py-3 text-center'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = product.variations
                ? product.variations.reduce(
                    (acc, v) => acc + (Number(v.stock) || 0),
                    0
                  )
                : 0;
              const prices = product.variations
                ? product.variations.map((v) =>
                    Number(v.price || product.price || 0)
                  )
                : [Number(product.price || 0)];
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);

              return (
                <tr
                  key={product.id}
                  className='bg-white border-b hover:bg-gray-50'
                >
                  <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                    <div className='flex items-center gap-3'>
                      <img
                        src={
                          product.images?.[0] ||
                          product.variations?.[0]?.images?.[0] ||
                          'https://placehold.co/400x400/E2E8F0/4A5568?text=Img'
                        }
                        alt={product.name}
                        className='w-10 h-10 rounded-md object-cover'
                      />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    {getCategoryName(product.category_id)}
                  </td>
                  <td className='px-6 py-4'>
                    {minPrice === maxPrice
                      ? `Ks ${minPrice.toLocaleString()}`
                      : `Ks ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`}
                  </td>
                  <td className='px-6 py-4'>
                    {totalStock > 0 ? (
                      `${totalStock} units`
                    ) : (
                      <span className='text-red-500'>Out of stock</span>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status.charAt(0).toUpperCase() +
                        product.status.slice(1)}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <div className='relative inline-block'>
                      <button
                        onClick={() => onEdit(product)}
                        className='p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100'
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className='p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductModal({ product, onClose, onSave }) {
  const { categories, products: allProducts } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    category_id: product?.category_id || '',
    price: product?.price || 0,
    discount_price: product?.discount_price || 0,
    images: product?.images || [],
    status: product?.status || 'active',
    tags: Array.isArray(product?.tags)
      ? product.tags.join(', ')
      : product?.tags || '',
    attributes: product?.attributes
      ? Object.entries(product.attributes)
      : [['', '']],
    seo_title: product?.seo_title || '',
    seo_description: product?.seo_description || '',
    seo_keywords: Array.isArray(product?.seo_keywords)
      ? product.seo_keywords.join(', ')
      : product?.seo_keywords || '',
    variations: product?.variations || [
      {
        sku: '',
        size: '',
        color: '',
        price: 0,
        discount_price: 0,
        stock: 0,
        images: [],
      },
    ],
  });

  const [newBaseImageFiles, setNewBaseImageFiles] = useState([]);
  const [newVariantImageFiles, setNewVariantImageFiles] = useState({});

  const [isSaving, setIsSaving] = useState(false);
  const [isVariationsOpen, setIsVariationsOpen] = useState(true);
  const [isSeoOpen, setIsSeoOpen] = useState(false);

  const createSlug = (text) =>
    text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'name') {
      setFormData((prev) => ({ ...prev, slug: createSlug(value) }));
    }
  };

  const handleVariationChange = (index, e) => {
    const { name, value } = e.target;
    const newVariations = [...formData.variations];
    newVariations[index][name] = value;
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };

  const handleBaseImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewBaseImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveBaseImage = (indexToRemove) => {
    const allPreviews = [
      ...(formData.images || []),
      ...newBaseImageFiles.map((f) => URL.createObjectURL(f)),
    ];
    const imageToRemove = allPreviews[indexToRemove];

    if (imageToRemove.startsWith('blob:')) {
      setNewBaseImageFiles((prev) =>
        prev.filter((file) => URL.createObjectURL(file) !== imageToRemove)
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img !== imageToRemove),
      }));
    }
  };

  const handleVariantImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    setNewVariantImageFiles((prev) => ({
      ...prev,
      [index]: [...(prev[index] || []), ...files],
    }));
  };

  const handleRemoveVariantImage = (variantIndex, imageIndexToRemove) => {
    const allPreviews = [
      ...(formData.variations[variantIndex].images || []),
      ...(newVariantImageFiles[variantIndex] || []).map((f) =>
        URL.createObjectURL(f)
      ),
    ];
    const imageToRemove = allPreviews[imageIndexToRemove];

    if (imageToRemove.startsWith('blob:')) {
      setNewVariantImageFiles((prev) => {
        const newFiles = (prev[variantIndex] || []).filter(
          (file) => URL.createObjectURL(file) !== imageToRemove
        );
        return { ...prev, [variantIndex]: newFiles };
      });
    } else {
      const newVariations = [...formData.variations];
      newVariations[variantIndex].images = newVariations[
        variantIndex
      ].images.filter((img) => img !== imageToRemove);
      setFormData((prev) => ({ ...prev, variations: newVariations }));
    }
  };

  const addVariation = () =>
    setFormData((prev) => ({
      ...prev,
      variations: [
        ...prev.variations,
        {
          sku: '',
          size: '',
          color: '',
          price: 0,
          discount_price: 0,
          stock: 0,
          images: [],
        },
      ],
    }));
  const removeVariation = (index) =>
    setFormData((prev) => ({
      ...prev,
      variations: formData.variations.filter((_, i) => i !== index),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // SKU Uniqueness Check
      const allSkus = allProducts.flatMap((p) =>
        p.variations.map((v) => ({ sku: v.sku, productId: p.id }))
      );
      const currentSkus = new Set();
      for (const v of formData.variations) {
        if (!v.sku) continue;
        if (currentSkus.has(v.sku)) {
          alert(`Duplicate SKU "${v.sku}" found within this product.`);
          setIsSaving(false);
          return;
        }
        currentSkus.add(v.sku);
        const existingSku = allSkus.find(
          (s) => s.sku === v.sku && s.productId !== product?.id
        );
        if (existingSku) {
          alert(`SKU "${v.sku}" is already in use by another product.`);
          setIsSaving(false);
          return;
        }
      }

      // Upload base images
      let uploadedBaseImages = formData.images.filter(
        (img) => !img.startsWith('blob:')
      );
      if (newBaseImageFiles.length > 0) {
        const uploadPromises = newBaseImageFiles.map((file) => {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
          return fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: 'POST', body: fd }
          )
            .then((res) => res.json())
            .then((data) => data.secure_url);
        });
        const newImageUrls = await Promise.all(uploadPromises);
        uploadedBaseImages = [...uploadedBaseImages, ...newImageUrls];
      }

      // Upload variant images
      const finalVariations = await Promise.all(
        formData.variations.map(async (variant, index) => {
          let uploadedVariantImages = variant.images.filter(
            (img) => !img.startsWith('blob:')
          );
          const filesToUpload = newVariantImageFiles[index] || [];
          if (filesToUpload.length > 0) {
            const uploadPromises = filesToUpload.map((file) => {
              const fd = new FormData();
              fd.append('file', file);
              fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
              return fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: fd }
              )
                .then((res) => res.json())
                .then((data) => data.secure_url);
            });
            const newImageUrls = await Promise.all(uploadPromises);
            uploadedVariantImages = [...uploadedVariantImages, ...newImageUrls];
          }
          const { imageFiles, ...rest } = variant;
          return { ...rest, images: uploadedVariantImages };
        })
      );

      const { attributes, imageFiles, ...restOfFormData } = formData;

      const finalData = {
        ...restOfFormData,
        images: uploadedBaseImages,
        variations: finalVariations,
        tags: formData.tags.split(',').map((t) => t.trim()),
        seo_keywords: formData.seo_keywords.split(',').map((t) => t.trim()),
        updatedAt: serverTimestamp(),
      };

      if (product) {
        await updateDoc(doc(db, 'products', product.id), finalData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...finalData,
          createdAt: serverTimestamp(),
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className='bg-white rounded-xl w-full max-w-5xl max-h-[95vh] flex flex-col'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-2xl font-bold text-gray-800'>
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className='p-2 rounded-full hover:bg-gray-200'
          >
            <X size={24} />
          </button>
        </div>
        <form
          id='product-form'
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto p-6 space-y-6'
        >
          {/* Main Product Info */}
          <div className='p-5 bg-gray-50 rounded-lg border'>
            <h3 className='font-semibold text-lg mb-4'>Main Product Details</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FloatingLabelInput
                label='Product Name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
              />
              <FloatingLabelInput
                label='Slug'
                name='slug'
                value={formData.slug}
                onChange={handleChange}
              />
              <div className='md:col-span-2'>
                <FloatingLabelTextarea
                  label='Description'
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows='3'
                />
              </div>
              <FloatingLabelInput
                label='Base Price'
                name='price'
                type='number'
                value={formData.price}
                onChange={handleChange}
              />
              <FloatingLabelInput
                label='Base Discount Price'
                name='discount_price'
                type='number'
                value={formData.discount_price}
                onChange={handleChange}
              />
              <FloatingLabelSelect
                label='Category'
                name='category_id'
                value={formData.category_id}
                onChange={handleChange}
              >
                <option value=''>Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </FloatingLabelSelect>
              <FloatingLabelSelect
                label='Status'
                name='status'
                value={formData.status}
                onChange={handleChange}
              >
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
                <option value='out_of_stock'>Out of Stock</option>
              </FloatingLabelSelect>
              <div className='md:col-span-2'>
                <FloatingLabelInput
                  label='Tags (comma-separated)'
                  name='tags'
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          {/* Base Images */}
          <div className='p-5 bg-gray-50 rounded-lg border'>
            <h3 className='font-semibold text-lg mb-4'>
              Base Images (for listings & fallbacks)
            </h3>
            <div className='flex items-center gap-2 flex-wrap'>
              {[
                ...formData.images,
                ...newBaseImageFiles.map((f) => URL.createObjectURL(f)),
              ].map((src, index) => (
                <div key={index} className='relative group'>
                  <img
                    src={src}
                    className='w-20 h-20 object-cover rounded-md'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveBaseImage(index)}
                    className='absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className='w-20 h-20 border-2 border-dashed rounded-md flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100'>
                <Plus size={24} className='text-gray-400' />
                <input
                  type='file'
                  multiple
                  onChange={handleBaseImageChange}
                  className='hidden'
                />
              </label>
            </div>
          </div>
          {/* Variations */}
          <div className='p-5 bg-gray-50 rounded-lg border'>
            <button
              type='button'
              onClick={() => setIsVariationsOpen(!isVariationsOpen)}
              className='flex justify-between items-center w-full font-semibold text-lg'
            >
              Variations
              <ChevronDown
                className={`transition-transform ${
                  isVariationsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {isVariationsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className='overflow-hidden'
                >
                  {formData.variations.map((v, index) => {
                    const variantImagePreviews = [
                      ...(v.images || []),
                      ...(newVariantImageFiles[index] || []).map((f) =>
                        URL.createObjectURL(f)
                      ),
                    ];
                    return (
                      <div
                        key={index}
                        className='border-t pt-4 mt-4 space-y-4 bg-white p-4 rounded-md shadow-sm'
                      >
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                          <FloatingLabelInput
                            label='SKU'
                            name='sku'
                            value={v.sku}
                            onChange={(e) => handleVariationChange(index, e)}
                          />
                          <FloatingLabelInput
                            label='Color'
                            name='color'
                            value={v.color}
                            onChange={(e) => handleVariationChange(index, e)}
                          />
                          <FloatingLabelInput
                            label='Size'
                            name='size'
                            value={v.size}
                            onChange={(e) => handleVariationChange(index, e)}
                          />
                          <FloatingLabelInput
                            label='Stock'
                            name='stock'
                            type='number'
                            value={v.stock}
                            onChange={(e) => handleVariationChange(index, e)}
                          />
                          <FloatingLabelInput
                            label='Price'
                            name='price'
                            type='number'
                            value={v.price}
                            onChange={(e) => handleVariationChange(index, e)}
                          />
                          <FloatingLabelInput
                            label='Discount Price'
                            name='discount_price'
                            type='number'
                            value={v.discount_price}
                            onChange={(e) => handleVariationChange(index, e)}
                          />
                        </div>
                        <div>
                          <label className='block text-xs font-medium text-gray-500 mb-1'>
                            Variant Images
                          </label>
                          <div className='flex items-center gap-2 flex-wrap'>
                            {variantImagePreviews.map((src, imgIndex) => (
                              <div key={imgIndex} className='relative group'>
                                <img
                                  src={src}
                                  className='w-16 h-16 object-cover rounded-md'
                                />
                                <button
                                  type='button'
                                  onClick={() =>
                                    handleRemoveVariantImage(index, imgIndex)
                                  }
                                  className='absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                            <label className='w-16 h-16 border-2 border-dashed rounded-md flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100'>
                              <Plus size={20} className='text-gray-400' />
                              <input
                                type='file'
                                multiple
                                onChange={(e) =>
                                  handleVariantImageChange(index, e)
                                }
                                className='hidden'
                              />
                            </label>
                          </div>
                        </div>
                        <button
                          type='button'
                          onClick={() => removeVariation(index)}
                          className='text-sm font-semibold text-red-600'
                          disabled={formData.variations.length === 1}
                        >
                          Remove Variation
                        </button>
                      </div>
                    );
                  })}
                  <button
                    type='button'
                    onClick={addVariation}
                    className='mt-4 text-sm font-semibold text-blue-600'
                  >
                    + Add Another Variation
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* SEO */}
          <div className='p-5 bg-gray-50 rounded-lg border'>
            <button
              type='button'
              onClick={() => setIsSeoOpen(!isSeoOpen)}
              className='flex justify-between items-center w-full font-semibold text-lg'
            >
              Advanced SEO
              <ChevronDown
                className={`transition-transform ${
                  isSeoOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {isSeoOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className='overflow-hidden space-y-4 mt-4'
                >
                  <FloatingLabelInput
                    label='SEO Title'
                    name='seo_title'
                    value={formData.seo_title}
                    onChange={handleChange}
                  />
                  <FloatingLabelTextarea
                    label='SEO Description'
                    name='seo_description'
                    value={formData.seo_description}
                    onChange={handleChange}
                    rows='3'
                  />
                  <FloatingLabelInput
                    label='SEO Keywords (comma-separated)'
                    name='seo_keywords'
                    value={formData.seo_keywords}
                    onChange={handleChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
        <div className='flex justify-end items-center p-6 border-t bg-gray-50'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition'
          >
            Cancel
          </button>
          <button
            type='submit'
            form='product-form'
            disabled={isSaving}
            className='px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-blue-300'
          >
            {isSaving ? (
              <Loader2 className='animate-spin inline-block' />
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Category Management ---
function CategoryManagement() {
  const { products, fetchCategories } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleSaveCategory = async () => {
    await fetchCategories();
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const openModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryId) => {
    const hasProducts = products.some(
      (prod) => prod.category_id === categoryId
    );
    if (hasProducts) {
      alert(
        'Cannot delete category. It has products assigned to it. Please re-assign them to another category first.'
      );
      setCategoryToDelete(null);
      return;
    }

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      await fetchCategories();
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category.');
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>
          Category Management
        </h1>
        <motion.button
          onClick={() => openModal()}
          className='flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} /> Add Category
        </motion.button>
      </div>
      <div className='bg-white p-6 rounded-xl border shadow-sm'>
        <CategoryList
          onEdit={openModal}
          onDelete={(cat) => setCategoryToDelete(cat)}
        />
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <CategoryModal
            category={editingCategory}
            onClose={closeModal}
            onSave={handleSaveCategory}
          />
        )}
        {categoryToDelete && (
          <ConfirmationModal
            title='Delete Category'
            message={`Are you sure you want to delete "${categoryToDelete.name}"? This action cannot be undone.`}
            onConfirm={() => handleDeleteCategory(categoryToDelete.id)}
            onCancel={() => setCategoryToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryList({ onEdit, onDelete }) {
  const { categories } = useContext(AppContext);

  const buildCategoryTree = (items, parentId = null) => {
    return items
      .filter((item) => item.parent_id === parentId)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((item) => ({
        ...item,
        children: buildCategoryTree(items, item.id),
      }));
  };

  const categoryTree = buildCategoryTree(categories);

  const renderCategoryRows = (categories, level = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category.id}>
        <tr className='bg-white border-b hover:bg-gray-50'>
          <td className='px-6 py-4 font-medium text-gray-900'>
            <div
              style={{ paddingLeft: `${level * 1.5}rem` }}
              className='flex items-center gap-2'
            >
              {level > 0 && (
                <CornerDownRight size={16} className='text-gray-400' />
              )}
              {category.name}
            </div>
          </td>
          <td className='px-6 py-4'>{category.slug}</td>
          <td className='px-6 py-4'>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                category.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {category.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className='px-6 py-4 text-center'>
            <button
              onClick={() => onEdit(category)}
              className='p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100'
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(category)}
              className='p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100'
            >
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
        {category.children &&
          category.children.length > 0 &&
          renderCategoryRows(category.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm text-left text-gray-500'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Name
            </th>
            <th scope='col' className='px-6 py-3'>
              Slug
            </th>
            <th scope='col' className='px-6 py-3'>
              Status
            </th>
            <th scope='col' className='px-6 py-3 text-center'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>{renderCategoryRows(categoryTree)}</tbody>
      </table>
    </div>
  );
}

function CategoryModal({ category, onClose, onSave }) {
  const { categories } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    parent_id: category?.parent_id || '',
    description: category?.description || '',
    image: category?.image || '',
    status: category?.status || 'active',
    sort_order: category?.sort_order || 0,
    seo_title: category?.seo_title || '',
    seo_description: category?.seo_description || '',
    seo_keywords: category?.seo_keywords?.join(', ') || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const isEditMode = !!category;

  const createSlug = (text) =>
    text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'name') {
      setFormData((prev) => ({ ...prev, slug: createSlug(value) }));
    }
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === 'active' ? 'inactive' : 'active',
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setFormData((prev) => ({
        ...prev,
        image: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const q = query(
      collection(db, 'categories'),
      where('slug', '==', formData.slug)
    );
    const querySnapshot = await getDocs(q);
    const isSlugTaken =
      !querySnapshot.empty && querySnapshot.docs[0].id !== category?.id;

    if (isSlugTaken) {
      alert('This slug is already in use. Please choose a unique one.');
      setIsSaving(false);
      return;
    }

    let imageUrl = category?.image || '';

    try {
      if (imageFile) {
        const cloudFormData = new FormData();
        cloudFormData.append('file', imageFile);
        cloudFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: cloudFormData }
        );
        const data = await res.json();
        imageUrl = data.secure_url;
      }

      const finalData = {
        ...formData,
        image: imageUrl,
        sort_order: Number(formData.sort_order),
        parent_id: formData.parent_id || null,
        seo_keywords: formData.seo_keywords.split(',').map((k) => k.trim()),
        updatedAt: serverTimestamp(),
      };

      if (isEditMode) {
        await updateDoc(doc(db, 'categories', category.id), finalData);
      } else {
        await addDoc(collection(db, 'categories'), {
          ...finalData,
          createdAt: serverTimestamp(),
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category.');
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryPath = (categoryId, allCategories) => {
    let path = [];
    let currentId = categoryId;
    while (currentId) {
      const currentCategory = allCategories.find((c) => c.id === currentId);
      if (currentCategory) {
        path.unshift(currentCategory.name);
        currentId = currentCategory.parent_id;
      } else {
        break;
      }
    }
    return path.join(' > ');
  };

  const renderCategoryOptions = (allCategories) => {
    return allCategories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {getCategoryPath(cat.id, allCategories)}
      </option>
    ));
  };

  return (
    <motion.div
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className='bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-2xl font-bold text-gray-800'>
            {isEditMode ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onClose}
            className='p-2 rounded-full hover:bg-gray-200'
          >
            <X size={24} />
          </button>
        </div>
        <form
          id='category-form'
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto p-6 space-y-6'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FloatingLabelInput
              label='Category Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FloatingLabelSelect
              label='Parent Category'
              name='parent_id'
              value={formData.parent_id}
              onChange={handleChange}
            >
              <option value=''>No Parent (Top Level)</option>
              {renderCategoryOptions(categories)}
            </FloatingLabelSelect>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FloatingLabelInput
              label='Slug'
              name='slug'
              value={formData.slug}
              onChange={handleChange}
            />
            <FloatingLabelInput
              label='Display Order'
              name='sort_order'
              type='number'
              value={formData.sort_order}
              onChange={handleChange}
            />
          </div>
          <FloatingLabelTextarea
            label='Description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows='3'
          />

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Image
            </label>
            <div className='flex items-center gap-4'>
              <label className='w-full h-32 border-2 border-dashed rounded-md flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition'>
                <UploadCloud size={32} className='text-gray-400' />
                <span className='text-sm text-gray-500 mt-1'>
                  Drag & drop or click to upload
                </span>
                <input
                  type='file'
                  onChange={handleImageChange}
                  className='hidden'
                  accept='image/*'
                />
              </label>
              {formData.image && (
                <img
                  src={formData.image}
                  alt='preview'
                  className='w-32 h-32 object-cover rounded-md flex-shrink-0'
                />
              )}
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-gray-700'>Status</span>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={formData.status === 'active'}
                onChange={handleStatusToggle}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className='ml-3 text-sm font-medium text-gray-900'>
                {formData.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>

          <div className='border-t pt-4'>
            <button
              type='button'
              onClick={() => setIsSeoOpen(!isSeoOpen)}
              className='flex justify-between items-center w-full font-semibold'
            >
              Advanced SEO
              <ChevronDown
                className={`transition-transform ${
                  isSeoOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {isSeoOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className='overflow-hidden space-y-4 mt-4'
                >
                  <FloatingLabelInput
                    label='SEO Title'
                    name='seo_title'
                    value={formData.seo_title}
                    onChange={handleChange}
                  />
                  <FloatingLabelTextarea
                    label='SEO Description'
                    name='seo_description'
                    value={formData.seo_description}
                    onChange={handleChange}
                    rows='3'
                  />
                  <FloatingLabelInput
                    label='SEO Keywords (comma-separated)'
                    name='seo_keywords'
                    value={formData.seo_keywords}
                    onChange={handleChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
        <div className='flex justify-end items-center p-6 border-t bg-gray-50'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition'
          >
            Cancel
          </button>
          <button
            type='submit'
            form='category-form'
            disabled={isSaving}
            className='px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-blue-300'
          >
            {isSaving ? (
              <Loader2 className='animate-spin inline-block' />
            ) : (
              'Save Category'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Order Management ---
function OrderManagement() {
  const { orders, fetchOrders, fetchProducts, fetchCustomers } =
    useContext(AppContext);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveOrder = async () => {
    await fetchOrders();
    await fetchProducts();
    await fetchCustomers();
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      await fetchOrders();
      setOrderToDelete(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order.');
    }
  };

  const openModal = (order = null) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const filteredOrders = orders.filter(
    (order) =>
      (order.customer_name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedOrderId(null)}
        onEdit={() => openModal(selectedOrder)}
      />
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Order Management</h1>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Search by name or ID...'
              className='w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.button
            onClick={() => openModal()}
            className='flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} /> Add Order
          </motion.button>
        </div>
      </div>
      <OrderTable
        orders={filteredOrders}
        onSelectOrder={(order) => setSelectedOrderId(order.id)}
        onEditOrder={openModal}
        onDeleteOrder={(order) => setOrderToDelete(order)}
      />
      <AnimatePresence>
        {isModalOpen && (
          <AddOrderModal
            order={editingOrder}
            onClose={closeModal}
            onSave={handleSaveOrder}
          />
        )}
        {orderToDelete && (
          <ConfirmationModal
            title='Delete Order'
            message={`Are you sure you want to delete order #${orderToDelete.id.slice(
              0,
              8
            )}...? This action cannot be undone.`}
            onConfirm={() => handleDeleteOrder(orderToDelete.id)}
            onCancel={() => setOrderToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderTable({ orders, onSelectOrder, onEditOrder, onDeleteOrder }) {
  const { fetchOrders, fetchCustomers, customers, settings } =
    useContext(AppContext);
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (order, newStatus) => {
    const orderRef = doc(db, 'orders', order.id);
    await updateDoc(orderRef, { status: newStatus });

    if (newStatus === 'completed' && order.status !== 'completed') {
      const customerRef = doc(db, 'customers', order.customer_id);
      const customer = customers.find((c) => c.id === order.customer_id);
      if (customer && settings && settings.points_per_currency > 0) {
        const pointsEarned = Math.floor(
          order.total_amount / settings.points_per_currency
        );
        const newTotalPoints = (customer.loyalty_points || 0) + pointsEarned;
        await updateDoc(customerRef, { loyalty_points: newTotalPoints });
        await fetchCustomers();
      }
    }

    await fetchOrders();
  };

  return (
    <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Order ID
              </th>
              <th scope='col' className='px-6 py-3'>
                Customer
              </th>
              <th scope='col' className='px-6 py-3'>
                Amount
              </th>
              <th scope='col' className='px-6 py-3'>
                Date
              </th>
              <th scope='col' className='px-6 py-3'>
                Status
              </th>
              <th scope='col' className='px-6 py-3 text-center'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders
              .sort(
                (a, b) =>
                  (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)
              )
              .map((order) => (
                <tr
                  key={order.id}
                  className='bg-white border-b hover:bg-gray-50'
                >
                  <td className='px-6 py-4 font-medium text-gray-900'>
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className='px-6 py-4'>{order.customer_name}</td>
                  <td className='px-6 py-4'>
                    Ks {order.total_amount.toLocaleString()}
                  </td>
                  <td className='px-6 py-4'>
                    {order.created_at
                      ? new Date(
                          order.created_at.seconds * 1000
                        ).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className='px-6 py-4'>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order, e.target.value)
                      }
                      className={`px-2 py-1 text-xs font-medium rounded-full border-none focus:ring-0 ${getStatusClass(
                        order.status
                      )}`}
                    >
                      <option value='pending'>Pending</option>
                      <option value='processing'>Processing</option>
                      <option value='completed'>Completed</option>
                      <option value='canceled'>Canceled</option>
                    </select>
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <button
                      onClick={() => onSelectOrder(order)}
                      className='font-medium text-blue-600 hover:underline px-2'
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEditOrder(order)}
                      className='font-medium text-indigo-600 hover:underline px-2'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteOrder(order)}
                      className='font-medium text-red-600 hover:underline px-2'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderDetail({ order, onBack, onEdit }) {
  const { riders, fetchOrders, products } = useContext(AppContext);
  const [newNote, setNewNote] = useState('');
  const [newDeliveryNote, setNewDeliveryNote] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState({
    assigned_rider_id: order.assigned_rider_id || '',
    estimated_delivery_date: order.estimated_delivery_date || '',
    payment_status: order.payment_status || 'unpaid',
    payment_method: order.payment_method || 'COD',
    delivery_status: order.delivery_status || 'not_yet_shipped',
  });

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    if (typeof address === 'string') return address;
    return `${address.street || ''}, ${address.township || ''}, ${
      address.city || ''
    } ${address.postal_code || ''}`
      .replace(/ ,/g, '')
      .trim();
  };

  const handleDeliveryInfoChange = (e) => {
    setDeliveryInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveDeliveryInfo = async () => {
    const rider = riders.find((r) => r.id === deliveryInfo.assigned_rider_id);
    const updatedData = {
      ...deliveryInfo,
      assigned_rider_name: rider ? rider.name : null,
    };
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, updatedData);
      alert('Delivery info updated!');
      await fetchOrders();
    } catch (error) {
      console.error('Failed to update delivery info:', error);
      alert('Could not update delivery info.');
    }
  };

  const handleAddNote = async (noteText, noteType) => {
    if (!noteText.trim()) return;
    const noteField = noteType === 'delivery' ? 'delivery_notes' : 'notes';
    const currentNotes = order[noteField] || [];
    const newNoteObject = { text: noteText, timestamp: new Date() };
    const updatedNotes = [...currentNotes, newNoteObject];

    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, { [noteField]: updatedNotes });
      if (noteType === 'delivery') setNewDeliveryNote('');
      else setNewNote('');
      await fetchOrders();
    } catch (error) {
      console.error(`Failed to add ${noteType} note:`, error);
      alert(`Could not save ${noteType} note. Please try again.`);
    }
  };

  const handleDeleteNote = async (noteToDelete, noteType) => {
    const noteField = noteType === 'delivery' ? 'delivery_notes' : 'notes';
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, { [noteField]: arrayRemove(noteToDelete) });
      await fetchOrders();
    } catch (error) {
      console.error(`Failed to delete ${noteType} note:`, error);
      alert(`Could not delete ${noteType} note.`);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <button onClick={onBack} className='text-blue-600 font-semibold'>
          &larr; Back to all orders
        </button>
        <button
          onClick={() => onEdit(order)}
          className='font-medium text-blue-600 hover:underline'
        >
          Edit Order
        </button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white p-6 rounded-xl border'>
            <h3 className='text-lg font-bold mb-4'>
              Order #{order.id.slice(0, 8)}...
            </h3>
            <div className='space-y-4'>
              {(order.items || []).map((item, index) => {
                const product = products.find((p) => p.id === item.product_id);
                return (
                  <div
                    key={index}
                    className='flex justify-between items-center'
                  >
                    <div className='flex items-center gap-4'>
                      <img
                        src={
                          product?.images?.[0] ||
                          'https://placehold.co/400x400/E2E8F0/4A5568?text=Img'
                        }
                        alt={item.name}
                        className='w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 object-cover'
                      />
                      <div>
                        <p className='font-semibold'>{item.name}</p>
                        <p className='text-sm text-gray-500'>
                          Size: {item.size} | Color: {item.color}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold'>
                        Ks {item.price.toLocaleString()}
                      </p>
                      <p className='text-sm text-gray-500'>
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='border-t mt-4 pt-4 text-right'>
              <p className='text-lg font-bold'>
                Total: Ks {order.total_amount.toLocaleString()}
              </p>
            </div>
          </div>
          <div className='bg-white p-6 rounded-xl border'>
            <h3 className='text-lg font-bold mb-4'>Payment & Delivery</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FloatingLabelSelect
                label='Payment Status'
                name='payment_status'
                value={deliveryInfo.payment_status}
                onChange={handleDeliveryInfoChange}
              >
                <option value='unpaid'>Unpaid</option>
                <option value='paid'>Paid</option>
                <option value='partially_paid'>Partially Paid</option>
                <option value='refunded'>Refunded</option>
              </FloatingLabelSelect>
              <FloatingLabelSelect
                label='Payment Method'
                name='payment_method'
                value={deliveryInfo.payment_method}
                onChange={handleDeliveryInfoChange}
              >
                <option value='COD'>COD</option>
                <option value='Bank Transfer'>Bank Transfer</option>
                <option value='Viber Pay'>Viber Pay</option>
                <option value='KPay'>KPay</option>
                <option value='WavePay'>WavePay</option>
              </FloatingLabelSelect>
              <FloatingLabelSelect
                label='Delivery Status'
                name='delivery_status'
                value={deliveryInfo.delivery_status}
                onChange={handleDeliveryInfoChange}
              >
                <option value='not_yet_shipped'>Not Yet Shipped</option>
                <option value='shipped'>Shipped</option>
                <option value='delivered'>Delivered</option>
                <option value='returned'>Returned</option>
              </FloatingLabelSelect>
              <FloatingLabelSelect
                label='Assign Rider'
                name='assigned_rider_id'
                value={deliveryInfo.assigned_rider_id}
                onChange={handleDeliveryInfoChange}
              >
                <option value=''>Select a rider</option>
                {riders
                  .filter(
                    (r) =>
                      r.status === 'available' ||
                      r.id === deliveryInfo.assigned_rider_id
                  )
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
              </FloatingLabelSelect>
              <div className='md:col-span-2'>
                <FloatingLabelInput
                  label='Estimated Delivery Date'
                  name='estimated_delivery_date'
                  type='date'
                  value={deliveryInfo.estimated_delivery_date}
                  onChange={handleDeliveryInfoChange}
                />
              </div>
            </div>
            <button
              onClick={handleSaveDeliveryInfo}
              className='mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition'
            >
              Save Changes
            </button>
          </div>
          <div className='bg-white p-6 rounded-xl border'>
            <h3 className='text-lg font-bold mb-4'>Delivery Notes</h3>
            <div className='space-y-3 max-h-48 overflow-y-auto pr-2'>
              {(order.delivery_notes || []).map((note, index) => (
                <div
                  key={index}
                  className='bg-gray-50 p-3 rounded-md flex justify-between items-start'
                >
                  <div>
                    <p className='text-sm'>{note.text}</p>
                    <p className='text-xs text-gray-400 mt-1'>
                      {note.timestamp?.seconds
                        ? new Date(
                            note.timestamp.seconds * 1000
                          ).toLocaleString()
                        : 'Just now'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note, 'delivery')}
                    className='p-1 text-gray-400 hover:text-red-600'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {(order.delivery_notes || []).length === 0 && (
                <p className='text-sm text-gray-400'>No delivery notes yet.</p>
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddNote(newDeliveryNote, 'delivery');
              }}
              className='mt-4 flex gap-2'
            >
              <input
                type='text'
                value={newDeliveryNote}
                onChange={(e) => setNewDeliveryNote(e.target.value)}
                placeholder='Add a delivery status...'
                className='w-full form-input'
              />
              <button
                type='submit'
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
              >
                <Send size={20} />
              </button>
            </form>
          </div>
          <div className='bg-white p-6 rounded-xl border'>
            <h3 className='text-lg font-bold mb-4'>Internal Notes</h3>
            <div className='space-y-3 max-h-48 overflow-y-auto pr-2'>
              {(order.notes || []).map((note, index) => (
                <div
                  key={index}
                  className='bg-gray-50 p-3 rounded-md flex justify-between items-start'
                >
                  <div>
                    <p className='text-sm'>{note.text}</p>
                    <p className='text-xs text-gray-400 mt-1'>
                      {note.timestamp?.seconds
                        ? new Date(
                            note.timestamp.seconds * 1000
                          ).toLocaleString()
                        : 'Just now'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note, 'order')}
                    className='p-1 text-gray-400 hover:text-red-600'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {(order.notes || []).length === 0 && (
                <p className='text-sm text-gray-400'>No internal notes yet.</p>
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddNote(newNote, 'order');
              }}
              className='mt-4 flex gap-2'
            >
              <input
                type='text'
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder='Add an internal note...'
                className='w-full form-input'
              />
              <button
                type='submit'
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
        <div className='lg:col-span-1 bg-white p-6 rounded-xl border h-fit'>
          <h3 className='text-lg font-bold mb-4'>Customer Details</h3>
          <div className='space-y-2'>
            <p>
              <span className='font-semibold'>Name:</span> {order.customer_name}
            </p>
            <p>
              <span className='font-semibold'>Phone:</span>{' '}
              {order.customer_phone}
            </p>
            <p>
              <span className='font-semibold'>Address:</span>{' '}
              {formatAddress(order.shipping_address)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Add/Edit Order Modal ---
function AddOrderModal({ order, onClose, onSave }) {
  const { customers, products } = useContext(AppContext);
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    order?.customer_id || ''
  );
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [orderItems, setOrderItems] = useState(order?.items || []);
  const [isSaving, setIsSaving] = useState(false);
  const [currentProductId, setCurrentProductId] = useState('');
  const [currentVariation, setCurrentVariation] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const selectedProduct = products.find((p) => p.id === currentProductId);
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const isEditMode = !!order;

  const handleAddItem = () => {
    if (!selectedProduct || !currentVariation || currentQuantity <= 0) {
      alert('Please select a product, variation, and quantity.');
      return;
    }
    const [size, color] = currentVariation.split('|');
    const variationDetails = selectedProduct.variations.find(
      (v) => v.size === size && v.color === color
    );
    if (Number(variationDetails.stock) < Number(currentQuantity)) {
      alert(`Not enough stock. Only ${variationDetails.stock} available.`);
      return;
    }
    setOrderItems((prev) => [
      ...prev,
      {
        product_id: selectedProduct.id,
        name: selectedProduct.name,
        size,
        color,
        quantity: Number(currentQuantity),
        price: Number(variationDetails.price || selectedProduct.price),
      },
    ]);
    setCurrentProductId('');
    setCurrentVariation('');
    setCurrentQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleSubmit = async () => {
    if (!selectedCustomerId || orderItems.length === 0) {
      alert('Please select a customer and add at least one item.');
      return;
    }
    setIsSaving(true);
    const customer = customers.find((c) => c.id === selectedCustomerId);

    try {
      await runTransaction(db, async (transaction) => {
        const stockAdjustments = new Map();

        if (isEditMode) {
          order.items.forEach((item) => {
            const key = `${item.product_id}|${item.size}|${item.color}`;
            stockAdjustments.set(
              key,
              (stockAdjustments.get(key) || 0) + item.quantity
            );
          });
        }

        orderItems.forEach((item) => {
          const key = `${item.product_id}|${item.size}|${item.color}`;
          stockAdjustments.set(
            key,
            (stockAdjustments.get(key) || 0) - item.quantity
          );
        });

        for (const [key, adjustment] of stockAdjustments.entries()) {
          if (adjustment === 0) continue;
          const [productId, size, color] = key.split('|');
          const productRef = doc(db, 'products', productId);
          const productDoc = await transaction.get(productRef);
          if (!productDoc.exists()) throw `Product ${productId} not found!`;

          const productData = productDoc.data();
          const newVariations = productData.variations.map((v) => {
            if (v.size === size && v.color === color) {
              const newStock = Number(v.stock) + adjustment;
              if (newStock < 0)
                throw `Not enough stock for ${productData.name}.`;
              return { ...v, stock: newStock };
            }
            return v;
          });
          transaction.update(productRef, { variations: newVariations });
        }

        const newOrderData = {
          customer_id: customer.id,
          customer_name: customer.name,
          customer_phone: customer.phone,
          shipping_address: customer.addresses[selectedAddressIndex],
          items: orderItems,
          total_amount: totalAmount,
          status: order?.status || 'pending',
          payment_status: order?.payment_status || 'unpaid',
          payment_method: order?.payment_method || 'COD',
          delivery_status: order?.delivery_status || 'not_yet_shipped',
          notes: order?.notes || [],
          delivery_notes: order?.delivery_notes || [],
          updatedAt: serverTimestamp(),
        };

        const customerRef = doc(db, 'customers', customer.id);
        if (isEditMode) {
          const totalDifference = totalAmount - order.total_amount;
          transaction.update(customerRef, {
            total_spent: (customer.total_spent || 0) + totalDifference,
            last_order_date: serverTimestamp(),
          });
          transaction.update(doc(db, 'orders', order.id), newOrderData);
        } else {
          transaction.update(customerRef, {
            total_orders: (customer.total_orders || 0) + 1,
            total_spent: (customer.total_spent || 0) + totalAmount,
            last_order_date: serverTimestamp(),
          });
          transaction.set(doc(collection(db, 'orders')), {
            ...newOrderData,
            created_at: serverTimestamp(),
          });
        }
      });
      onSave();
    } catch (error) {
      console.error('Order operation failed: ', error);
      alert(`Failed to save order: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className='bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-2xl font-bold text-gray-800'>
            {isEditMode ? 'Edit Order' : 'Create New Order'}
          </h2>
          <button
            onClick={onClose}
            className='p-2 rounded-full hover:bg-gray-200'
          >
            <X size={24} />
          </button>
        </div>
        <div className='p-6 space-y-4 overflow-y-auto'>
          <FloatingLabelSelect
            label='Customer'
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            disabled={isEditMode}
          >
            <option value=''>Select a customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.phone}
              </option>
            ))}
          </FloatingLabelSelect>
          {selectedCustomer && (
            <FloatingLabelSelect
              label='Shipping Address'
              value={selectedAddressIndex}
              onChange={(e) => setSelectedAddressIndex(Number(e.target.value))}
            >
              {(selectedCustomer.addresses || []).map((addr, index) => (
                <option key={index} value={index}>
                  {addr.street}, {addr.township}
                </option>
              ))}
            </FloatingLabelSelect>
          )}
          <div className='border rounded-lg p-4 space-y-2'>
            <h4 className='font-semibold'>Add Product to Order</h4>
            <div className='grid grid-cols-5 gap-3'>
              <div className='col-span-2'>
                <FloatingLabelSelect
                  label='Product'
                  value={currentProductId}
                  onChange={(e) => {
                    setCurrentProductId(e.target.value);
                    setCurrentVariation('');
                  }}
                >
                  <option value=''>Select Product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </FloatingLabelSelect>
              </div>
              <div className='col-span-2'>
                <FloatingLabelSelect
                  label='Variation'
                  value={currentVariation}
                  onChange={(e) => setCurrentVariation(e.target.value)}
                  disabled={!selectedProduct}
                >
                  <option value=''>Select Variation</option>
                  {selectedProduct?.variations?.map((v, i) => (
                    <option key={i} value={`${v.size}|${v.color}`}>
                      {v.size} - {v.color} ({v.stock} left)
                    </option>
                  ))}
                </FloatingLabelSelect>
              </div>
              <FloatingLabelInput
                label='Qty'
                type='number'
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                min='1'
              />
            </div>
            <button
              onClick={handleAddItem}
              className='w-full py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300'
            >
              Add Item
            </button>
          </div>
          <div className='space-y-2'>
            <h4 className='font-semibold'>Order Items</h4>
            {orderItems.length === 0 && (
              <p className='text-sm text-gray-500'>No items added yet.</p>
            )}
            {orderItems.map((item, index) => (
              <div
                key={index}
                className='flex justify-between items-center bg-gray-50 p-2 rounded-md'
              >
                <div>
                  <p className='font-semibold'>{item.name}</p>
                  <p className='text-sm text-gray-600'>
                    {item.size} - {item.color} x {item.quantity}
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <p>Ks {(item.price * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {orderItems.length > 0 && (
            <div className='text-right font-bold text-xl border-t pt-4 mt-4'>
              Total: Ks {totalAmount.toLocaleString()}
            </div>
          )}
        </div>
        <div className='flex justify-end items-center p-6 border-t bg-gray-50'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className='px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-blue-300'
          >
            {isSaving ? (
              <Loader2 className='animate-spin inline-block' />
            ) : isEditMode ? (
              'Save Changes'
            ) : (
              'Create Order'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
// --- Customer Management ---
function CustomerManagement() {
  const { customers, fetchCustomers } = useContext(AppContext);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveCustomer = async () => {
    await fetchCustomers();
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteDoc(doc(db, 'customers', customerId));
      await fetchCustomers();
      setCustomerToDelete(null);
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer.');
    }
  };

  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  if (selectedCustomer) {
    return (
      <CustomerDetail
        customer={selectedCustomer}
        onBack={() => setSelectedCustomerId(null)}
        onEdit={openModal}
      />
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Customers</h1>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Search by name or phone...'
              className='w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.button
            onClick={() => openModal()}
            className='flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} /> Add Customer
          </motion.button>
        </div>
      </div>
      <CustomerTable
        customers={filteredCustomers}
        onSelectCustomer={(customer) => setSelectedCustomerId(customer.id)}
        onEditCustomer={openModal}
        onDeleteCustomer={(customer) => setCustomerToDelete(customer)}
      />
      <AnimatePresence>
        {isModalOpen && (
          <AddCustomerModal
            customer={editingCustomer}
            onClose={closeModal}
            onSave={handleSaveCustomer}
          />
        )}
        {customerToDelete && (
          <ConfirmationModal
            title='Delete Customer'
            message={`Are you sure you want to delete "${customerToDelete.name}"? This action cannot be undone.`}
            onConfirm={() => handleDeleteCustomer(customerToDelete.id)}
            onCancel={() => setCustomerToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CustomerTable({
  customers,
  onSelectCustomer,
  onEditCustomer,
  onDeleteCustomer,
}) {
  return (
    <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Phone
              </th>
              <th scope='col' className='px-6 py-3'>
                Tags
              </th>
              <th scope='col' className='px-6 py-3'>
                Last Order
              </th>
              <th scope='col' className='px-6 py-3 text-center'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className='bg-white border-b hover:bg-gray-50'
              >
                <td className='px-6 py-4 font-medium text-gray-900'>
                  {customer.name}
                </td>
                <td className='px-6 py-4'>{customer.phone}</td>
                <td className='px-6 py-4'>
                  <div className='flex flex-wrap gap-1'>
                    {(customer.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className='px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className='px-6 py-4'>
                  {customer.last_order_date
                    ? new Date(
                        customer.last_order_date.seconds * 1000
                      ).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className='px-6 py-4 text-center'>
                  <button
                    onClick={() => onSelectCustomer(customer)}
                    className='font-medium text-blue-600 hover:underline px-2'
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEditCustomer(customer)}
                    className='font-medium text-indigo-600 hover:underline px-2'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteCustomer(customer)}
                    className='font-medium text-red-600 hover:underline px-2'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomerDetail({ customer, onBack, onEdit }) {
  const { fetchCustomers } = useContext(AppContext);
  const [newNote, setNewNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.street || ''}, ${address.township || ''}, ${
      address.city || ''
    } ${address.postal_code || ''}`
      .replace(/ ,/g, '')
      .trim();
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsSavingNote(true);
    const updatedNotes = [
      ...(customer.notes || []),
      { text: newNote, timestamp: new Date() },
    ];
    try {
      const customerRef = doc(db, 'customers', customer.id);
      await updateDoc(customerRef, { notes: updatedNotes });
      await fetchCustomers();
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
      alert('Could not save note. Please try again.');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteToDelete) => {
    try {
      const customerRef = doc(db, 'customers', customer.id);
      await updateDoc(customerRef, { notes: arrayRemove(noteToDelete) });
      await fetchCustomers();
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Could not delete note.');
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <button onClick={onBack} className='text-blue-600 font-semibold'>
          &larr; Back to all customers
        </button>
        <button
          onClick={() => onEdit(customer)}
          className='font-medium text-blue-600 hover:underline'
        >
          Edit Customer
        </button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-1 bg-white p-6 rounded-xl border h-fit'>
          <h3 className='text-lg font-bold mb-4'>Customer Profile</h3>
          <div className='space-y-2'>
            <p>
              <span className='font-semibold'>Name:</span> {customer.name}
            </p>
            <p>
              <span className='font-semibold'>Phone:</span> {customer.phone}
            </p>
            <p>
              <span className='font-semibold'>Email:</span>{' '}
              {customer.email || 'N/A'}
            </p>
            <p>
              <span className='font-semibold'>Last Order:</span>{' '}
              {customer.last_order_date
                ? new Date(
                    customer.last_order_date.seconds * 1000
                  ).toLocaleString()
                : 'N/A'}
            </p>
            <div className='pt-2'>
              <h4 className='font-semibold'>Addresses:</h4>
              {(customer.addresses || []).map((addr, i) => (
                <div
                  key={i}
                  className='text-sm text-gray-600 pl-2 border-l-2 mt-1'
                >
                  {formatAddress(addr)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='lg:col-span-2 space-y-6'>
          <div className='grid grid-cols-3 gap-4'>
            <div className='bg-white p-4 rounded-xl border text-center'>
              <p className='text-sm text-gray-500'>Total Orders</p>
              <p className='text-2xl font-bold'>{customer.total_orders || 0}</p>
            </div>
            <div className='bg-white p-4 rounded-xl border text-center'>
              <p className='text-sm text-gray-500'>Total Spent</p>
              <p className='text-2xl font-bold'>
                Ks {(customer.total_spent || 0).toLocaleString()}
              </p>
            </div>
            <div className='bg-white p-4 rounded-xl border text-center'>
              <p className='text-sm text-gray-500'>Loyalty Points</p>
              <p className='text-2xl font-bold text-blue-600'>
                {customer.loyalty_points || 0}
              </p>
            </div>
          </div>
          <div className='bg-white p-6 rounded-xl border'>
            <h3 className='text-lg font-bold mb-4'>Notes</h3>
            <div className='space-y-3 max-h-48 overflow-y-auto pr-2'>
              {(customer.notes || []).map((note, index) => (
                <div
                  key={index}
                  className='bg-gray-50 p-3 rounded-md flex justify-between items-start'
                >
                  <div>
                    <p className='text-sm'>{note.text}</p>
                    <p className='text-xs text-gray-400 mt-1'>
                      {note.timestamp?.seconds
                        ? new Date(
                            note.timestamp.seconds * 1000
                          ).toLocaleString()
                        : 'Just now'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note)}
                    className='p-1 text-gray-400 hover:text-red-600'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {(customer.notes || []).length === 0 && (
                <p className='text-sm text-gray-400'>
                  No notes for this customer yet.
                </p>
              )}
            </div>
            <form onSubmit={handleAddNote} className='mt-4 flex gap-2'>
              <input
                type='text'
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder='Add a new note...'
                className='w-full form-input'
              />
              <button
                type='submit'
                disabled={isSavingNote}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300'
              >
                {isSavingNote ? (
                  <Loader2 size={20} className='animate-spin' />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddCustomerModal({ customer, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    addresses: customer?.addresses || [
      { street: '', township: '', city: '', postal_code: '' },
    ],
    tags: Array.isArray(customer?.tags) ? customer.tags.join(', ') : '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const isEditMode = !!customer;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressChange = (index, e) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index][e.target.name] = e.target.value;
    setFormData((prev) => ({ ...prev, addresses: newAddresses }));
  };

  const addAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        { street: '', township: '', city: '', postal_code: '' },
      ],
    }));
  };

  const removeAddress = (index) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const finalData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      updatedAt: serverTimestamp(),
    };

    try {
      if (isEditMode) {
        const customerRef = doc(db, 'customers', customer.id);
        await updateDoc(customerRef, finalData);
      } else {
        await addDoc(collection(db, 'customers'), {
          ...finalData,
          total_orders: 0,
          total_spent: 0,
          loyalty_points: 0,
          notes: [],
          created_at: serverTimestamp(),
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className='bg-white rounded-xl w-full max-w-lg'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-2xl font-bold text-gray-800'>
            {isEditMode ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button
            onClick={onClose}
            className='p-2 rounded-full hover:bg-gray-200'
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='p-6 space-y-4 max-h-[70vh] overflow-y-auto'>
            <FloatingLabelInput
              label='Full Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FloatingLabelInput
              label='Phone Number'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <FloatingLabelInput
              label='Email (Optional)'
              name='email'
              value={formData.email}
              onChange={handleChange}
            />

            {formData.addresses.map((addr, index) => (
              <div
                key={index}
                className='border p-4 rounded-lg space-y-4 relative'
              >
                <h4 className='text-sm font-medium text-gray-600'>
                  Address {index + 1}
                </h4>
                {formData.addresses.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeAddress(index)}
                    className='absolute top-2 right-2 p-1 text-red-500 hover:text-red-700'
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <FloatingLabelInput
                  label='Street Address'
                  name='street'
                  value={addr.street}
                  onChange={(e) => handleAddressChange(index, e)}
                />
                <div className='grid grid-cols-2 gap-4'>
                  <FloatingLabelInput
                    label='Township'
                    name='township'
                    value={addr.township}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                  <FloatingLabelInput
                    label='City'
                    name='city'
                    value={addr.city}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </div>
                <FloatingLabelInput
                  label='Postal Code (Optional)'
                  name='postal_code'
                  value={addr.postal_code}
                  onChange={(e) => handleAddressChange(index, e)}
                />
              </div>
            ))}
            <button
              type='button'
              onClick={addAddress}
              className='w-full py-2 text-sm text-blue-600 font-semibold border-2 border-dashed rounded-lg hover:bg-blue-50 transition'
            >
              + Add Another Address
            </button>

            <FloatingLabelInput
              label='Tags (VIP, Frequent Buyer, etc.)'
              name='tags'
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
          <div className='flex justify-end items-center p-6 border-t bg-gray-50'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSaving}
              className='px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-blue-300'
            >
              {isSaving ? (
                <Loader2 className='animate-spin inline-block' />
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Save Customer'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
// --- Rider Management ---
function RiderManagement() {
  const { riders, fetchRiders } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRider, setEditingRider] = useState(null);

  const handleSaveRider = async () => {
    await fetchRiders();
    setIsModalOpen(false);
    setEditingRider(null);
  };

  const openModal = (rider = null) => {
    setEditingRider(rider);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRider(null);
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Riders</h1>
        <motion.button
          onClick={() => openModal()}
          className='flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} /> Add Rider
        </motion.button>
      </div>
      <RiderTable riders={riders} onEdit={openModal} />
      <AnimatePresence>
        {isModalOpen && (
          <AddRiderModal
            rider={editingRider}
            onClose={closeModal}
            onSave={handleSaveRider}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RiderTable({ riders, onEdit }) {
  const { fetchRiders } = useContext(AppContext);
  const getStatusClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (riderId, newStatus) => {
    const riderRef = doc(db, 'riders', riderId);
    await updateDoc(riderRef, { status: newStatus });
    await fetchRiders();
  };

  return (
    <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Phone
              </th>
              <th scope='col' className='px-6 py-3'>
                Status
              </th>
              <th scope='col' className='px-6 py-3 text-center'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider) => (
              <tr key={rider.id} className='bg-white border-b hover:bg-gray-50'>
                <td className='px-6 py-4 font-medium text-gray-900'>
                  {rider.name}
                </td>
                <td className='px-6 py-4'>{rider.phone}</td>
                <td className='px-6 py-4'>
                  <select
                    value={rider.status}
                    onChange={(e) =>
                      handleStatusChange(rider.id, e.target.value)
                    }
                    className={`px-2 py-1 text-xs font-medium rounded-full border-none focus:ring-0 ${getStatusClass(
                      rider.status
                    )}`}
                  >
                    <option value='available'>Available</option>
                    <option value='busy'>Busy</option>
                  </select>
                </td>
                <td className='px-6 py-4 text-center'>
                  <button
                    onClick={() => onEdit(rider)}
                    className='font-medium text-blue-600 hover:underline'
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddRiderModal({ rider, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: rider?.name || '',
    phone: rider?.phone || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const isEditMode = !!rider;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditMode) {
        const riderRef = doc(db, 'riders', rider.id);
        await updateDoc(riderRef, formData);
      } else {
        await addDoc(collection(db, 'riders'), {
          ...formData,
          status: 'available',
          created_at: serverTimestamp(),
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving rider:', error);
      alert('Failed to save rider.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className='bg-white rounded-xl w-full max-w-lg'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-2xl font-bold text-gray-800'>
            {isEditMode ? 'Edit Rider' : 'Add New Rider'}
          </h2>
          <button
            onClick={onClose}
            className='p-2 rounded-full hover:bg-gray-200'
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='p-6 space-y-4'>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Full Name'
              className='w-full form-input'
              required
            />
            <input
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              placeholder='Phone Number'
              className='w-full form-input'
              required
            />
          </div>
          <div className='flex justify-end items-center p-6 border-t bg-gray-50'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSaving}
              className='px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-blue-300'
            >
              {isSaving ? (
                <Loader2 className='animate-spin inline-block' />
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Save Rider'
              )}
            </button>
          </div>
        </form>
      </motion.div>
      <style>{`.form-input { display: block; width: 100%; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem; color: #374151; background-color: #fff; border: 1px solid #D1D5DB; border-radius: 0.5rem; } .form-input:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); }`}</style>
    </motion.div>
  );
}

// --- Member Points Management ---
function MemberPointsManagement() {
  const { customers, fetchCustomers } = useContext(AppContext);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSave = async () => {
    await fetchCustomers();
    setSelectedCustomer(null);
  };

  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>
        Member Points Control
      </h1>
      <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left text-gray-500'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Customer
                </th>
                <th scope='col' className='px-6 py-3'>
                  Total Spent
                </th>
                <th scope='col' className='px-6 py-3'>
                  Current Points
                </th>
                <th scope='col' className='px-6 py-3 text-center'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className='bg-white border-b hover:bg-gray-50'
                >
                  <td className='px-6 py-4 font-medium text-gray-900'>
                    {customer.name}
                  </td>
                  <td className='px-6 py-4'>
                    Ks {(customer.total_spent || 0).toLocaleString()}
                  </td>
                  <td className='px-6 py-4 font-bold text-blue-600'>
                    {customer.loyalty_points || 0}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className='font-medium text-blue-600 hover:underline'
                    >
                      Adjust Points
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AnimatePresence>
        {selectedCustomer && (
          <AdjustPointsModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AdjustPointsModal({ customer, onClose, onSave }) {
  const [adjustment, setAdjustment] = useState(0);
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (adjustment === 0 || !reason) {
      alert('Please enter a non-zero point value and a reason.');
      return;
    }
    setIsSaving(true);

    const newPoints = (customer.loyalty_points || 0) + adjustment;

    try {
      // Use a batch write to update customer and create a transaction log
      const batch = writeBatch(db);

      const customerRef = doc(db, 'customers', customer.id);
      batch.update(customerRef, { loyalty_points: newPoints });

      const transactionRef = doc(collection(db, 'loyalty_transactions'));
      batch.set(transactionRef, {
        customer_id: customer.id,
        customer_name: customer.name,
        points: adjustment,
        type: adjustment > 0 ? 'earn' : 'redeem',
        reason: reason,
        created_at: serverTimestamp(),
      });

      await batch.commit();
      onSave();
    } catch (error) {
      console.error('Error adjusting points:', error);
      alert('Failed to adjust points.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className='bg-white rounded-xl w-full max-w-md'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-2xl font-bold text-gray-800'>
            Adjust Points for {customer.name}
          </h2>
          <button
            onClick={onClose}
            className='p-2 rounded-full hover:bg-gray-200'
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='p-6 space-y-4'>
            <p>
              Current Points:{' '}
              <span className='font-bold'>{customer.loyalty_points || 0}</span>
            </p>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Points to Add/Remove
              </label>
              <input
                type='number'
                value={adjustment}
                onChange={(e) => setAdjustment(parseInt(e.target.value, 10))}
                placeholder='e.g., 50 or -20'
                className='w-full form-input mt-1'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Reason
              </label>
              <input
                type='text'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder='e.g., Special promotion'
                className='w-full form-input mt-1'
                required
              />
            </div>
          </div>
          <div className='flex justify-end items-center p-6 border-t bg-gray-50'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSaving}
              className='px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-blue-300'
            >
              {isSaving ? (
                <Loader2 className='animate-spin inline-block' />
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </motion.div>
      <style>{`.form-input { display: block; width: 100%; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem; color: #374151; background-color: #fff; border: 1px solid #D1D5DB; border-radius: 0.5rem; } .form-input:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); }`}</style>
    </motion.div>
  );
}
// --- User Roles Management ---
function UserRolesManagement() {
  const { adminUsers, fetchAdminUsers } = useContext(AppContext);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleSave = async () => {
    await fetchAdminUsers();
    setIsInviteModalOpen(false);
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>
          User Roles & Authentication
        </h1>
        <motion.button
          onClick={() => setIsInviteModalOpen(true)}
          className='flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} /> Invite User
        </motion.button>
      </div>
      <UserRolesTable users={adminUsers} />
      <AnimatePresence>
        {isInviteModalOpen && (
          <InviteUserModal
            onClose={() => setIsInviteModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function UserRolesTable({ users }) {
  const getRoleClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'staff':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Email
              </th>
              <th scope='col' className='px-6 py-3'>
                Role
              </th>
              <th scope='col' className='px-6 py-3'>
                Status
              </th>
              <th scope='col' className='px-6 py-3 text-center'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className='bg-white border-b hover:bg-gray-50'>
                <td className='px-6 py-4 font-medium text-gray-900'>
                  {user.name}
                </td>
                <td className='px-6 py-4'>{user.email}</td>
                <td className='px-6 py-4'>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleClass(
                      user.role
                    )}`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className='px-6 py-4'>{user.status}</td>
                <td className='px-6 py-4 text-center'>
                  <button className='font-medium text-blue-600 hover:underline'>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InviteUserModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Note: This only creates the user document in Firestore.
      // A full implementation would use Firebase Functions to create an Auth user
      // and send an invitation email.
      await addDoc(collection(db, 'users'), {
        ...formData,
        status: 'active',
        created_at: serverTimestamp(),
      });
      onSave();
    } catch (error) {
      console.error('Error inviting user:', error);
      alert('Failed to invite user.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className='bg-white rounded-xl w-full max-w-lg'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-2xl font-bold text-gray-800'>Invite New User</h2>
          <button
            onClick={onClose}
            className='p-2 rounded-full hover:bg-gray-200'
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='p-6 space-y-4'>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Full Name'
              className='w-full form-input'
              required
            />
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Email Address'
              className='w-full form-input'
              required
            />
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Role
              </label>
              <select
                name='role'
                value={formData.role}
                onChange={handleChange}
                className='w-full form-input mt-1'
              >
                <option value='staff'>Staff</option>
                <option value='manager'>Manager</option>
                <option value='admin'>Admin</option>
              </select>
            </div>
          </div>
          <div className='flex justify-end items-center p-6 border-t bg-gray-50'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSaving}
              className='px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-blue-300'
            >
              {isSaving ? (
                <Loader2 className='animate-spin inline-block' />
              ) : (
                'Send Invite'
              )}
            </button>
          </div>
        </form>
      </motion.div>
      <style>{`.form-input { display: block; width: 100%; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem; color: #374151; background-color: #fff; border: 1px solid #D1D5DB; border-radius: 0.5rem; } .form-input:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); }`}</style>
    </motion.div>
  );
}
// --- Confirmation Modal ---
function ConfirmationModal({ title, message, onConfirm, onCancel }) {
  return (
    <motion.div
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className='bg-white rounded-xl w-full max-w-md'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <div className='p-6'>
          <div className='flex items-center gap-4'>
            <div className='bg-red-100 p-3 rounded-full'>
              <AlertTriangle className='text-red-600' size={24} />
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-800'>{title}</h2>
            </div>
          </div>
          <p className='text-gray-600 mt-4'>{message}</p>
        </div>
        <div className='flex justify-end items-center p-4 border-t bg-gray-50 gap-3'>
          <button
            onClick={onCancel}
            className='px-4 py-2 rounded-lg text-gray-600 bg-white border hover:bg-gray-100 transition'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition'
          >
            Confirm Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Styled Form Components (Unchanged) ---
const FloatingLabelInput = ({ label, ...props }) => (
  <div className='relative'>
    <input
      {...props}
      placeholder=' '
      className='block px-3.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
    />
    <label className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1'>
      {label}
    </label>
  </div>
);

const FloatingLabelTextarea = ({ label, ...props }) => (
  <div className='relative'>
    <textarea
      {...props}
      placeholder=' '
      className='block px-3.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
    />
    <label className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1'>
      {label}
    </label>
  </div>
);

const FloatingLabelSelect = ({ label, children, ...props }) => (
  <div className='relative'>
    <select
      {...props}
      className='block px-3.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
    >
      {children}
    </select>
    <label className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 left-1'>
      {label}
    </label>
  </div>
);

// --- Reports Page ---
function ReportsPage() {
  const { orders, customers, products } = useContext(AppContext);
  const [dateRange, setDateRange] = useState('last_7_days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const calculateReport = () => {
      let startDate = new Date();
      let endDate = new Date();

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'last_7_days':
          startDate.setDate(endDate.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'last_30_days':
          startDate.setDate(endDate.getDate() - 30);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'this_month':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'custom':
          if (customStartDate && customEndDate) {
            startDate = new Date(customStartDate);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(customEndDate);
            endDate.setHours(23, 59, 59, 999);
          } else {
            setReportData(null);
            return;
          }
          break;
        default:
          return;
      }

      const filteredOrders = orders.filter((order) => {
        if (!order.created_at || !order.created_at.toDate) return false;
        const orderDate = order.created_at.toDate();
        return orderDate >= startDate && orderDate <= endDate;
      });

      const filteredCustomers = customers.filter((customer) => {
        if (!customer.created_at || !customer.created_at.toDate) return false;
        const customerDate = customer.created_at.toDate();
        return customerDate >= startDate && customerDate <= endDate;
      });

      const totalSales = filteredOrders.reduce(
        (sum, order) => sum + order.total_amount,
        0
      );
      const totalOrders = filteredOrders.length;
      const newCustomers = filteredCustomers.length;

      const productSales = {};
      filteredOrders.forEach((order) => {
        order.items.forEach((item) => {
          productSales[item.product_id] =
            (productSales[item.product_id] || 0) + item.quantity;
        });
      });

      const topProducts = Object.entries(productSales)
        .map(([productId, quantity]) => {
          const product = products.find((p) => p.id === productId);
          return {
            name: product ? product.name : 'Unknown Product',
            image:
              product?.images?.[0] || product?.variations?.[0]?.images?.[0],
            quantity,
          };
        })
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      const salesByDay = {};
      filteredOrders.forEach((order) => {
        const day = order.created_at.toDate().toLocaleDateString();
        salesByDay[day] = (salesByDay[day] || 0) + order.total_amount;
      });

      const chartData = Object.entries(salesByDay).map(([date, sales]) => ({
        date,
        sales,
      }));

      setReportData({
        totalSales,
        totalOrders,
        newCustomers,
        topProducts,
        chartData,
      });
    };

    calculateReport();
  }, [dateRange, customStartDate, customEndDate, orders, customers, products]);

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
    if (e.target.value !== 'custom') {
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  const handleExport = () => {
    if (!reportData) {
      alert('No data to export.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';

    csvContent += 'Metric,Value\n';
    csvContent += `Total Sales,${reportData.totalSales}\n`;
    csvContent += `Total Orders,${reportData.totalOrders}\n`;
    csvContent += `New Customers,${reportData.newCustomers}\n\n`;

    csvContent += 'Top Selling Products\n';
    csvContent += 'Product Name,Units Sold\n';
    reportData.topProducts.forEach((p) => {
      csvContent += `"${p.name}",${p.quantity}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sales_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>
          Reports & Analytics
        </h1>
        <div className='flex items-center gap-2'>
          <button
            onClick={handleExport}
            className='flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition'
          >
            <Download size={16} /> Export as CSV
          </button>
        </div>
      </div>

      <div className='bg-white p-4 rounded-xl border mb-6 flex items-center gap-4 flex-wrap'>
        <select
          value={dateRange}
          onChange={handleDateRangeChange}
          className='form-input'
        >
          <option value='today'>Today</option>
          <option value='last_7_days'>Last 7 Days</option>
          <option value='last_30_days'>Last 30 Days</option>
          <option value='this_month'>This Month</option>
          <option value='custom'>Custom Range</option>
        </select>
        {dateRange === 'custom' && (
          <>
            <input
              type='date'
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className='form-input'
            />
            <span>to</span>
            <input
              type='date'
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className='form-input'
            />
          </>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
        <div className='bg-white p-6 rounded-xl border'>
          <h3 className='text-gray-500'>Total Sales</h3>
          <p className='text-3xl font-bold'>
            Ks {reportData ? reportData.totalSales.toLocaleString() : '0'}
          </p>
        </div>
        <div className='bg-white p-6 rounded-xl border'>
          <h3 className='text-gray-500'>Total Orders</h3>
          <p className='text-3xl font-bold'>
            {reportData ? reportData.totalOrders : '0'}
          </p>
        </div>
        <div className='bg-white p-6 rounded-xl border'>
          <h3 className='text-gray-500'>New Customers</h3>
          <p className='text-3xl font-bold'>
            {reportData ? reportData.newCustomers : '0'}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 bg-white p-6 rounded-xl border'>
          <h3 className='text-lg font-bold mb-4'>Sales Trend</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={reportData?.chartData}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='date' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='sales' fill='#8884d8' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className='bg-white p-6 rounded-xl border'>
          <h3 className='text-lg font-bold mb-4'>Top Selling Products</h3>
          {reportData && reportData.topProducts.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <tbody>
                  {reportData.topProducts.map((product, index) => (
                    <tr key={index} className='border-b'>
                      <td className='py-2'>
                        <div className='flex items-center gap-3'>
                          <img
                            src={
                              product.image ||
                              'https://placehold.co/400x400/E2E8F0/4A5568?text=Img'
                            }
                            alt={product.name}
                            className='w-10 h-10 rounded-md object-cover'
                          />
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td className='py-2 text-right font-semibold'>
                        {product.quantity} units sold
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-gray-500'>
              No sales data for the selected period.
            </p>
          )}
        </div>
      </div>
      <style>{`.form-input { display: block; width: auto; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem; color: #374151; background-color: #fff; border: 1px solid #D1D5DB; border-radius: 0.5rem; }`}</style>
    </div>
  );
}

// --- Settings Page ---
function SettingsPage() {
  const { settings, fetchSettings } = useContext(AppContext);
  const [pointsRule, setPointsRule] = useState(
    settings.points_per_currency || 1000
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPointsRule(settings.points_per_currency || 1000);
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsRef = doc(db, 'settings', 'loyalty');
      await setDoc(settingsRef, { points_per_currency: Number(pointsRule) });
      await fetchSettings();
      alert('Settings saved!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>Settings</h1>
      <div className='bg-white p-6 rounded-xl border shadow-sm max-w-lg'>
        <h3 className='text-lg font-bold mb-4'>Loyalty Points System</h3>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Points Rule
            </label>
            <p className='text-xs text-gray-500 mb-2'>
              Set how many Kyats a customer must spend to earn 1 loyalty point.
            </p>
            <div className='flex items-center gap-2'>
              <span>Earn 1 point for every</span>
              <input
                type='number'
                value={pointsRule}
                onChange={(e) => setPointsRule(e.target.value)}
                className='form-input w-24'
              />
              <span>Ks spent.</span>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className='w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300'
          >
            {isSaving ? (
              <Loader2 className='animate-spin inline-block' />
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
      <style>{`.form-input { display: block; width: auto; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem; color: #374151; background-color: #fff; border: 1px solid #D1D5DB; border-radius: 0.5rem; }`}</style>
    </div>
  );
}

// --- Batch Upload Page ---
function BatchUploadPage() {
  const { fetchProducts, categories, products } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorReportCsv, setErrorReportCsv] = useState(null);

  const createSlug = (text) =>
    text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      parseAndValidateCSV(selectedFile);
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  const parseAndValidateCSV = (csvFile) => {
    setIsProcessing(true);
    const allSkus = products.flatMap((p) => p.variations.map((v) => v.sku));
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').filter((row) => row.trim() !== '');
      const headers = rows[0].split(',').map((h) => h.trim());

      let errorCsv = `${headers.join(',')},error_reason\n`;
      const invalidRowsForReport = [];

      const data = rows.slice(1).map((rowStr, rowIndex) => {
        const values = rowStr.split(',');
        let rowData = headers.reduce((obj, header, index) => {
          obj[header] = values[index]?.trim();
          return obj;
        }, {});

        let errors = [];
        if (!rowData.name) errors.push('Product name is missing.');
        if (!rowData.variant_sku) errors.push('SKU is missing.');
        if (allSkus.includes(rowData.variant_sku))
          errors.push('SKU already exists.');
        if (isNaN(Number(rowData.variant_price)))
          errors.push('Variant price must be a number.');
        if (isNaN(Number(rowData.variant_stock)))
          errors.push('Variant stock must be a number.');

        const categoryPath = (rowData.category || '')
          .split('>')
          .map((c) => c.trim());
        let categoryId = null;
        let currentParentId = null;
        for (const catName of categoryPath) {
          const foundCat = categories.find(
            (c) => c.name === catName && c.parent_id === currentParentId
          );
          if (foundCat) {
            categoryId = foundCat.id;
            currentParentId = foundCat.id;
          } else {
            categoryId = null;
            break;
          }
        }
        if (!categoryId)
          errors.push(`Category "${rowData.category}" not found.`);

        rowData.category_id = categoryId;

        const isValid = errors.length === 0;
        if (!isValid) {
          invalidRowsForReport.push(`${rowStr},"${errors.join('; ')}"`);
        }

        return { ...rowData, isValid, errors, originalIndex: rowIndex + 2 };
      });

      if (invalidRowsForReport.length > 0) {
        setErrorReportCsv(errorCsv + invalidRowsForReport.join('\n'));
      } else {
        setErrorReportCsv(null);
      }

      setParsedData(data);
      setIsProcessing(false);
    };
    reader.readAsText(csvFile);
  };

  const handleImport = async (importOnlyValid) => {
    setIsProcessing(true);
    const dataToImport = importOnlyValid
      ? parsedData.filter((row) => row.isValid)
      : parsedData;

    const productsMap = new Map();

    for (const row of dataToImport) {
      const productName = row.name;
      if (!productsMap.has(productName)) {
        productsMap.set(productName, {
          name: productName,
          slug: createSlug(productName),
          description: row.description || '',
          category_id: row.category_id,
          price: Number(row.base_price) || 0,
          discount_price: Number(row.base_discount_price) || 0,
          status: 'active',
          tags: row.tags ? row.tags.split(';').map((t) => t.trim()) : [],
          images: row.base_images
            ? row.base_images.split(';').map((url) => url.trim())
            : [],
          seo_title: row.seo_title || '',
          seo_description: row.seo_description || '',
          seo_keywords: row.seo_keywords
            ? row.seo_keywords.split(';').map((k) => k.trim())
            : [],
          variations: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      const product = productsMap.get(productName);
      product.variations.push({
        sku: row.variant_sku || '',
        color: row.color || '',
        size: row.size || '',
        price: Number(row.variant_price) || 0,
        discount_price: Number(row.variant_discount_price) || 0,
        stock: Number(row.variant_stock) || 0,
        images: row.variant_images
          ? row.variant_images.split(';').map((url) => url.trim())
          : [],
      });
    }

    try {
      const batch = writeBatch(db);
      for (const productData of productsMap.values()) {
        const productRef = doc(collection(db, 'products'));
        batch.set(productRef, productData);
      }
      await batch.commit();

      alert(`Successfully imported ${productsMap.size} products.`);
      await fetchProducts();
      setFile(null);
      setParsedData([]);
      setFileName('');
      setErrorReportCsv(null);
    } catch (error) {
      console.error('Error importing products:', error);
      alert('Failed to import products. Please check the console for errors.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const headers =
      'name,description,category,base_price,base_discount_price,base_images,tags,seo_title,seo_description,seo_keywords,variant_sku,color,size,variant_price,variant_discount_price,variant_stock,variant_images';
    const sampleData = [
      `"Classic T-Shirt","A comfortable 100% cotton t-shirt","Men > Shirts",15000,0,"https://url.to/image1.jpg;https://url.to/image2.jpg","tshirt;summer","Classic T-Shirt for Men","Buy the best classic t-shirt","t-shirt;men;summer",TS-WHT-S,White,S,15000,0,50,"https://url.to/white-s-1.jpg"`,
      `"Classic T-Shirt","","Men > Shirts",,,,,,,,TS-WHT-M,White,M,15000,0,30,"https://url.to/white-m-1.jpg"`,
      `"Denim Jeans","Stylish slim-fit denim jeans","Men > Pants",35000,32000,"https://url.to/jeans1.jpg","jeans;denim","Slim-Fit Denim Jeans","High-quality denim jeans for all occasions","jeans;men;denim",DNM-BLK-L,Black,L,35000,32000,25,"https://url.to/jeans-black-l.jpg"`,
      `"Summer Dress","A light and airy summer dress","Women > Dresses",42000,0,"https://url.to/dress1.jpg","dress;summer;floral","Floral Summer Dress","Beautiful floral dress for summer","dress;women;summer",DRS-FLR-M,Floral,M,42000,0,15,"https://url.to/dress-floral-m.jpg"`,
      `"Leather Jacket","A stylish leather biker jacket","Women > Jackets",85000,0,"https://url.to/jacket1.jpg","jacket;leather;biker","Leather Biker Jacket for Women","Premium leather biker jacket","jacket;women;leather",JKT-LTH-S,Black,S,85000,0,10,"https://url.to/jacket-black-s.jpg"`,
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' + headers + '\n' + sampleData.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'product_template_with_samples.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadErrorReport = () => {
    if (!errorReportCsv) return;
    const encodedUri = encodeURI(
      'data:text/csv;charset=utf-8,' + errorReportCsv
    );
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'error_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validRows = parsedData.filter((r) => r.isValid).length;
  const invalidRows = parsedData.length - validRows;

  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>
        Batch Product Upload
      </h1>

      {!file ? (
        <div className='bg-white p-6 rounded-xl border'>
          <label className='w-full h-48 border-2 border-dashed rounded-md flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition'>
            <UploadCloud size={48} className='text-gray-400' />
            <span className='text-lg text-gray-600 mt-2'>
              Drag & drop CSV file or click to upload
            </span>
            <input
              type='file'
              onChange={handleFileChange}
              className='hidden'
              accept='.csv'
            />
          </label>
          <div className='mt-4 text-center'>
            <button
              onClick={downloadTemplate}
              className='text-blue-600 hover:underline font-semibold'
            >
              Download Template with Samples
            </button>
            <p className='text-sm text-gray-500 mt-2'>
              Use the template to ensure your data is formatted correctly.
            </p>
          </div>
        </div>
      ) : (
        <div className='bg-white p-6 rounded-xl border'>
          <h3 className='text-lg font-bold mb-4'>Preview: {fileName}</h3>
          <div className='flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4'>
            <div className='flex gap-4'>
              <div className='flex items-center gap-2 text-green-600'>
                <FileCheck2 size={20} /> {validRows} Valid Rows
              </div>
              <div className='flex items-center gap-2 text-red-600'>
                <FileX2 size={20} /> {invalidRows} Invalid Rows
              </div>
            </div>
            <div className='flex items-center gap-2'>
              {invalidRows > 0 && (
                <button
                  onClick={downloadErrorReport}
                  className='bg-orange-500 text-white px-4 py-2 rounded-lg'
                >
                  Download Error Report
                </button>
              )}
              <button
                onClick={() => handleImport(true)}
                disabled={validRows === 0 || isProcessing}
                className='bg-green-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400'
              >
                {isProcessing ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  `Import ${validRows} Products`
                )}
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setParsedData([]);
                  setErrorReportCsv(null);
                }}
                className='bg-gray-200 text-gray-800 px-4 py-2 rounded-lg'
              >
                Cancel
              </button>
            </div>
          </div>
          <div className='max-h-96 overflow-y-auto'>
            <table className='w-full text-sm text-left'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 sticky top-0'>
                <tr>
                  <th className='px-4 py-2'>Row</th>
                  <th className='px-4 py-2'>Name</th>
                  <th className='px-4 py-2'>SKU</th>
                  <th className='px-4 py-2'>Price</th>
                  <th className='px-4 py-2'>Stock</th>
                  <th className='px-4 py-2'>Status</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((row, index) => (
                  <tr key={index} className={!row.isValid ? 'bg-red-50' : ''}>
                    <td className='border px-4 py-2'>{row.originalIndex}</td>
                    <td className='border px-4 py-2'>{row.name}</td>
                    <td className='border px-4 py-2'>{row.variant_sku}</td>
                    <td className='border px-4 py-2'>{row.variant_price}</td>
                    <td className='border px-4 py-2'>{row.variant_stock}</td>
                    <td className='border px-4 py-2'>
                      {!row.isValid ? (
                        <span
                          className='text-red-600'
                          title={row.errors.join(', ')}
                        >
                          Invalid
                        </span>
                      ) : (
                        <span className='text-green-600'>Valid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
