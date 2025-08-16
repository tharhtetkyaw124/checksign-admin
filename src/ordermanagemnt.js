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

// --- Mock Data ---
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
    const q = query(collection(db, 'categories'));
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
    const fetchedOrders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (fetchedOrders.length === 0) {
      setOrders([
        {
          id: 'ORD-001',
          customer_name: 'Aye Chan',
          customer_phone: '+959123456789',
          total_amount: 24000,
          status: 'completed',
          created_at: { seconds: Date.now() / 1000 - 86400 },
          items: [
            {
              product_id: 'prod_001',
              name: 'Classic T-Shirt',
              size: 'M',
              color: 'White',
              price: 12000,
              quantity: 2,
            },
          ],
          notes: [
            {
              text: 'Customer called to confirm address.',
              timestamp: { seconds: Date.now() / 1000 - 90000 },
            },
          ],
          shipping_address: '123 Main St, Yangon, Myanmar',
        },
        {
          id: 'ORD-002',
          customer_name: 'Ko Min',
          customer_phone: '+959876543210',
          total_amount: 45000,
          status: 'processing',
          created_at: { seconds: Date.now() / 1000 - 3600 },
          items: [
            {
              product_id: 'prod_002',
              name: 'Slim-Fit Jeans',
              size: 'L',
              color: 'Black',
              price: 45000,
              quantity: 1,
            },
          ],
          notes: [],
          shipping_address: '456 Oak Ave, Mandalay, Myanmar',
        },
      ]);
    } else {
      setOrders(fetchedOrders);
    }
  };
  const fetchCustomers = async () => {
    const q = query(collection(db, 'customers'));
    const querySnapshot = await getDocs(q);
    const fetchedCustomers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (fetchedCustomers.length === 0) {
      setCustomers([
        {
          id: 'CUST-001',
          name: 'Aye Chan',
          phone: '+959123456789',
          total_orders: 12,
          total_spent: 250000,
          loyalty_points: 320,
          notes: [
            {
              text: 'Prefers size M.',
              timestamp: { seconds: Date.now() / 1000 - 172800 },
            },
          ],
        },
        {
          id: 'CUST-002',
          name: 'Ko Min',
          phone: '+959876543210',
          total_orders: 8,
          total_spent: 180000,
          loyalty_points: 150,
          notes: [],
        },
      ]);
    } else {
      setCustomers(fetchedCustomers);
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
        fetchCategories,
        fetchProducts,
        fetchOrders,
        fetchCustomers,
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
function ProductTable({ products, onEdit, getCategoryName }) {
  /* ... */
}
function ProductModal({ product, onClose, onSave }) {
  /* ... */
}

// --- Category Management (Unchanged) ---
function CategoryManagement() {
  /* ... */
}

// --- Order Management (Unchanged) ---
function OrderManagement() {
  /* ... */
}
function OrderTable({ orders, onSelectOrder, onStatusChange }) {
  /* ... */
}
function OrderDetail({ order, onBack }) {
  /* ... */
}

// --- Customer Management ---
function CustomerManagement() {
  const { customers, fetchCustomers } = useContext(AppContext);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSaveCustomer = async () => {
    await fetchCustomers();
    setIsAddModalOpen(false);
  };

  if (selectedCustomer) {
    return (
      <CustomerDetail
        customer={selectedCustomer}
        onBack={() => setSelectedCustomer(null)}
      />
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Customers</h1>
        <motion.button
          onClick={() => setIsAddModalOpen(true)}
          className='flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} /> Add Customer
        </motion.button>
      </div>
      <CustomerTable
        customers={customers}
        onSelectCustomer={setSelectedCustomer}
      />
      <AnimatePresence>
        {isAddModalOpen && (
          <AddCustomerModal
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleSaveCustomer}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CustomerTable({ customers, onSelectCustomer }) {
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
                Total Orders
              </th>
              <th scope='col' className='px-6 py-3'>
                Total Spent
              </th>
              <th scope='col' className='px-6 py-3'>
                Loyalty Points
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
                <td className='px-6 py-4 text-center'>
                  {customer.total_orders}
                </td>
                <td className='px-6 py-4'>
                  Ks {customer.total_spent.toLocaleString()}
                </td>
                <td className='px-6 py-4 text-center font-semibold text-blue-600'>
                  {customer.loyalty_points}
                </td>
                <td className='px-6 py-4 text-center'>
                  <button
                    onClick={() => onSelectCustomer(customer)}
                    className='font-medium text-blue-600 hover:underline'
                  >
                    View
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

function CustomerDetail({ customer, onBack }) {
  const [newNote, setNewNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsSavingNote(true);
    const updatedNotes = [
      ...(customer.notes || []),
      { text: newNote, timestamp: serverTimestamp() },
    ];
    try {
      const customerRef = doc(db, 'customers', customer.id);
      await updateDoc(customerRef, { notes: updatedNotes });
      customer.notes = [
        ...(customer.notes || []),
        { text: newNote, timestamp: { seconds: Date.now() / 1000 } },
      ];
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
      alert('Could not save note. Please try again.');
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div>
      <button onClick={onBack} className='text-blue-600 font-semibold mb-4'>
        &larr; Back to all customers
      </button>
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
              <span className='font-semibold'>ID:</span> {customer.id}
            </p>
          </div>
        </div>
        <div className='lg:col-span-2 space-y-6'>
          <div className='grid grid-cols-3 gap-4'>
            <div className='bg-white p-4 rounded-xl border text-center'>
              <p className='text-sm text-gray-500'>Total Orders</p>
              <p className='text-2xl font-bold'>{customer.total_orders}</p>
            </div>
            <div className='bg-white p-4 rounded-xl border text-center'>
              <p className='text-sm text-gray-500'>Total Spent</p>
              <p className='text-2xl font-bold'>
                Ks {customer.total_spent.toLocaleString()}
              </p>
            </div>
            <div className='bg-white p-4 rounded-xl border text-center'>
              <p className='text-sm text-gray-500'>Loyalty Points</p>
              <p className='text-2xl font-bold text-blue-600'>
                {customer.loyalty_points}
              </p>
            </div>
          </div>
          <div className='bg-white p-6 rounded-xl border'>
            <h3 className='text-lg font-bold mb-4'>Notes</h3>
            <div className='space-y-3 max-h-48 overflow-y-auto pr-2'>
              {(customer.notes || []).map((note, index) => (
                <div key={index} className='bg-gray-50 p-3 rounded-md'>
                  <p className='text-sm'>{note.text}</p>
                  <p className='text-xs text-gray-400 mt-1 text-right'>
                    {new Date(note.timestamp.seconds * 1000).toLocaleString()}
                  </p>
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
      <style jsx>{`
        .form-input {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: #374151;
          background-color: #fff;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}

function AddCustomerModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'customers'), {
        ...formData,
        total_orders: 0,
        total_spent: 0,
        loyalty_points: 0,
        notes: [],
        created_at: serverTimestamp(),
      });
      onSave();
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer.');
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
          <h2 className='text-2xl font-bold text-gray-800'>Add New Customer</h2>
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
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Email (Optional)'
              className='w-full form-input'
            />
            <textarea
              name='address'
              value={formData.address}
              onChange={handleChange}
              placeholder='Shipping Address (Optional)'
              className='w-full form-input h-24'
            ></textarea>
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
                'Save Customer'
              )}
            </button>
          </div>
        </form>
      </motion.div>
      <style jsx>{`
        .form-input {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: #374151;
          background-color: #fff;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
        }
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </motion.div>
  );
}
