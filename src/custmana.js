import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  useMemo,
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
  TrendingUp,
  UserPlus,
  PackageCheck,
  Percent,
  Palette,
  Check,
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// --- Cloudinary Configuration ---
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME';
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';

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
  const [settings, setSettings] = useState({
    loyalty: { points_per_currency: 1000 },
  });
  const [attributes, setAttributes] = useState({
    colors: [],
    sizes: [],
    offer_tags: [],
  });
  const [loyaltyTransactions, setLoyaltyTransactions] = useState([]);
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
        fetchLoyaltyTransactions(),
        fetchAttributes(),
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
    const loyaltyRef = doc(db, 'settings', 'loyalty');
    const docSnap = await getDoc(loyaltyRef);
    if (docSnap.exists()) {
      setSettings((prev) => ({ ...prev, loyalty: docSnap.data() }));
    }
  };
  const fetchAttributes = async () => {
    const colorsQuery = query(collection(db, 'colors'), orderBy('name', 'asc'));
    const sizesQuery = query(
      collection(db, 'sizes'),
      orderBy('sort_order', 'asc')
    );
    const tagsQuery = query(
      collection(db, 'offer_tags'),
      orderBy('name', 'asc')
    );

    const [colorsSnap, sizesSnap, tagsSnap] = await Promise.all([
      getDocs(colorsQuery),
      getDocs(sizesQuery),
      getDocs(tagsQuery),
    ]);

    setAttributes({
      colors: colorsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      sizes: sizesSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      offer_tags: tagsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    });
  };
  const fetchLoyaltyTransactions = async () => {
    const q = query(
      collection(db, 'loyalty_transactions'),
      orderBy('created_at', 'desc')
    );
    const querySnapshot = await getDocs(q);
    setLoyaltyTransactions(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
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
        attributes,
        loyaltyTransactions,
        fetchCategories,
        fetchProducts,
        fetchOrders,
        fetchCustomers,
        fetchRiders,
        fetchAdminUsers,
        fetchSettings,
        fetchLoyaltyTransactions,
        fetchAttributes,
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

// --- Login Page (Unchanged) ---
function Login({ onLogin, error }) {
  /* ... */
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
      case 'Customer Analytics':
        return <CustomerAnalyticsPage />;
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
      case 'Product Attributes':
        return <ProductAttributesPage />;
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

// --- Sidebar (Unchanged) ---
function Sidebar({ onLogout, onToggle, activeView, setActiveView }) {
  /* ... */
}
function SidebarItem({ icon, text, active }) {
  /* ... */
}

// --- Header (Unchanged) ---
function Header() {
  /* ... */
}

// --- Dashboard View (Unchanged) ---
function DashboardView() {
  /* ... */
}

// --- Product Management (Unchanged) ---
function ProductManagement() {
  /* ... */
}
function ProductTable({ products, onEdit, onDelete, getCategoryName }) {
  /* ... */
}
function ProductModal({ product, onClose, onSave }) {
  /* ... */
}

// --- Category Management (Unchanged) ---
function CategoryManagement() {
  /* ... */
}
function CategoryList({ onEdit, onDelete }) {
  /* ... */
}
function CategoryModal({ category, onClose, onSave }) {
  /* ... */
}

// --- Order Management (Unchanged) ---
function OrderManagement() {
  /* ... */
}
function OrderTable({ orders, onSelectOrder, onEditOrder, onDeleteOrder }) {
  /* ... */
}
function OrderDetail({ order, onBack, onEdit }) {
  /* ... */
}
function AddOrderModal({ order, onClose, onSave }) {
  /* ... */
}

// --- Customer Management (Unchanged) ---
function CustomerManagement() {
  /* ... */
}
function CustomerTable({
  customers,
  onSelectCustomer,
  onEditCustomer,
  onDeleteCustomer,
}) {
  /* ... */
}
function CustomerDetail({ customer, onBack, onEdit }) {
  /* ... */
}
function AddCustomerModal({ customer, onClose, onSave }) {
  /* ... */
}

// --- Rider Management (Unchanged) ---
function RiderManagement() {
  /* ... */
}
function RiderTable({ riders, onEdit }) {
  /* ... */
}
function AddRiderModal({ rider, onClose, onSave }) {
  /* ... */
}

// --- Member Points Management (Unchanged) ---
function MemberPointsManagement() {
  /* ... */
}
function PointsBalances() {
  /* ... */
}
function PointsHistory() {
  /* ... */
}
function AdjustPointsModal({ customer, onClose, onSave }) {
  /* ... */
}

// --- User Roles Management (Unchanged) ---
function UserRolesManagement() {
  /* ... */
}
function UserRolesTable({ users }) {
  /* ... */
}
function InviteUserModal({ onClose, onSave }) {
  /* ... */
}

// --- Confirmation Modal (Unchanged) ---
function ConfirmationModal({ title, message, onConfirm, onCancel }) {
  /* ... */
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

// --- Reports Page (Unchanged) ---
function ReportsPage() {
  /* ... */
}

// --- Settings Page (Unchanged) ---
function SettingsPage() {
  /* ... */
}

// --- Batch Upload Page (Unchanged) ---
function BatchUploadPage() {
  /* ... */
}

// --- Customer Analytics Page (Unchanged) ---
function CustomerAnalyticsPage() {
  /* ... */
}

// --- Product Attributes Page (Unchanged) ---
function ProductAttributesPage() {
  /* ... */
}
function AttributeManager({ type, label }) {
  /* ... */
}
