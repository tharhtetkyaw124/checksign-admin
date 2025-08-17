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
  const { orders, customers, products, isDataLoading } = useContext(AppContext);
  const [dateFilter, setDateFilter] = useState('this_month');

  const { stats, recentOrders, lowStockItems } = useMemo(() => {
    let startDate = new Date();
    const endDate = new Date();

    switch (dateFilter) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'this_week':
        startDate.setDate(endDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'this_month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        break;
    }

    const filteredOrders = orders.filter(
      (order) =>
        order.created_at?.toDate() >= startDate &&
        order.created_at?.toDate() <= endDate
    );
    const filteredCustomers = customers.filter(
      (customer) =>
        customer.created_at?.toDate() >= startDate &&
        customer.created_at?.toDate() <= endDate
    );

    const totalSales = filteredOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );

    const stats = [
      {
        title: 'Total Sales',
        value: `Ks ${totalSales.toLocaleString()}`,
        icon: <TrendingUp className='text-green-500' />,
      },
      {
        title: 'New Orders',
        value: filteredOrders.length,
        icon: <PackageCheck className='text-blue-500' />,
      },
      {
        title: 'New Customers',
        value: filteredCustomers.length,
        icon: <UserPlus className='text-indigo-500' />,
      },
    ];

    const recent = [...orders]
      .sort((a, b) => b.created_at.seconds - a.created_at.seconds)
      .slice(0, 5);

    const lowStock = products
      .flatMap((p) =>
        (p.variations || [])
          .filter((v) => v.stock <= 10)
          .map((v) => ({ ...v, productName: p.name }))
      )
      .sort((a, b) => a.stock - b.stock);

    return { stats, recentOrders: recent, lowStockItems: lowStock };
  }, [dateFilter, orders, customers, products]);

  if (isDataLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader2 className='animate-spin text-blue-500' size={32} />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className='form-input'
        >
          <option value='today'>Today</option>
          <option value='this_week'>This Week</option>
          <option value='this_month'>This Month</option>
        </select>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {stats.map((stat) => (
          <div
            key={stat.title}
            className='bg-white p-6 rounded-xl border flex items-center gap-5'
          >
            <div className='p-3 bg-gray-100 rounded-full'>{stat.icon}</div>
            <div>
              <p className='text-sm text-gray-500'>{stat.title}</p>
              <p className='text-3xl font-bold text-gray-800'>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 bg-white p-6 rounded-xl border'>
          <h3 className='text-lg font-bold mb-4'>Recent Orders</h3>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className='border-b'>
                    <td className='py-2 font-semibold'>
                      {order.customer_name}
                    </td>
                    <td className='py-2 text-gray-600'>
                      Ks {order.total_amount.toLocaleString()}
                    </td>
                    <td className='py-2 text-right'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='bg-white p-6 rounded-xl border'>
          <h3 className='text-lg font-bold mb-4 flex items-center gap-2'>
            <AlertTriangle className='text-red-500' /> Low Stock Items
          </h3>
          <div className='space-y-2 max-h-64 overflow-y-auto'>
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item, i) => (
                <div
                  key={i}
                  className='flex justify-between items-center text-sm'
                >
                  <div>
                    <p className='font-semibold'>
                      {item.productName} ({item.color}, {item.size})
                    </p>
                    <p className='text-xs text-gray-500'>SKU: {item.sku}</p>
                  </div>
                  <span className='font-bold text-red-600'>
                    {item.stock} left
                  </span>
                </div>
              ))
            ) : (
              <p className='text-sm text-gray-500'>
                No items are low on stock.
              </p>
            )}
          </div>
        </div>
      </div>
      <style>{`.form-input { display: block; width: auto; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem; color: #374151; background-color: #fff; border: 1px solid #D1D5DB; border-radius: 0.5rem; }`}</style>
    </div>
  );
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
