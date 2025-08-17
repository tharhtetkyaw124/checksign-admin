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

// --- Customer Analytics Page ---
function CustomerAnalyticsPage() {
  const { customers } = useContext(AppContext);
  const [modalData, setModalData] = useState(null);
  const [dateFilter, setDateFilter] = useState('all_time');

  const analytics = useMemo(() => {
    let startDate = new Date(0); // The beginning of time
    const endDate = new Date();

    switch (dateFilter) {
      case 'last_30_days':
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'last_90_days':
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 90);
        break;
      case 'this_year':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      default: // all_time
        break;
    }
    startDate.setHours(0, 0, 0, 0);

    const filteredCustomers = customers.filter((c) => {
      if (dateFilter === 'all_time') return true;
      return (
        c.created_at?.toDate() >= startDate && c.created_at?.toDate() <= endDate
      );
    });

    const totalCustomers = filteredCustomers.length;
    const repeatCustomers = filteredCustomers.filter(
      (c) => (c.total_orders || 0) > 1
    ).length;
    const repeatRate =
      totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

    const tagCounts = filteredCustomers.reduce((acc, customer) => {
      (customer.tags || []).forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    const segmentationData = Object.entries(tagCounts).map(([name, value]) => ({
      name,
      customers: value,
    }));

    const topSpenders = [...filteredCustomers]
      .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
      .slice(0, 10);

    return { totalCustomers, repeatRate, segmentationData, topSpenders };
  }, [customers, dateFilter]);

  const handleBarClick = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const tagName = data.activePayload[0].payload.name;
      const taggedCustomers = customers.filter((c) =>
        (c.tags || []).includes(tagName)
      );
      setModalData({
        title: `Customers tagged "${tagName}"`,
        customers: taggedCustomers,
      });
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Customer Analytics</h1>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className='form-input'
        >
          <option value='all_time'>All Time</option>
          <option value='last_30_days'>Last 30 Days</option>
          <option value='last_90_days'>Last 90 Days</option>
          <option value='this_year'>This Year</option>
        </select>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <div className='bg-white p-6 rounded-xl border flex items-center gap-5'>
          <div className='p-3 bg-gray-100 rounded-full'>
            <Users className='text-blue-500' />
          </div>
          <div>
            <p className='text-sm text-gray-500'>Total Customers</p>
            <p className='text-3xl font-bold text-gray-800'>
              {analytics.totalCustomers}
            </p>
          </div>
        </div>
        <div className='bg-white p-6 rounded-xl border flex items-center gap-5'>
          <div className='p-3 bg-gray-100 rounded-full'>
            <Percent className='text-green-500' />
          </div>
          <div>
            <p className='text-sm text-gray-500'>Repeat Customer Rate</p>
            <p className='text-3xl font-bold text-gray-800'>
              {analytics.repeatRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 bg-white p-6 rounded-xl border'>
          <h3 className='text-lg font-bold mb-4'>
            Customer Segmentation by Tags
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={analytics.segmentationData}
                onClick={handleBarClick}
                cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }}
              >
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='customers' fill='#3B82F6' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className='bg-white p-6 rounded-xl border'>
          <h3 className='text-lg font-bold mb-4'>Top 10 Spenders</h3>
          <div className='space-y-2'>
            {analytics.topSpenders.map((customer) => (
              <div
                key={customer.id}
                className='flex justify-between items-center text-sm'
              >
                <span>{customer.name}</span>
                <span className='font-semibold'>
                  Ks {(customer.total_spent || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalData && (
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
                <h2 className='text-xl font-bold text-gray-800'>
                  {modalData.title}
                </h2>
                <button
                  onClick={() => setModalData(null)}
                  className='p-2 rounded-full hover:bg-gray-200'
                >
                  <X size={24} />
                </button>
              </div>
              <div className='p-6 max-h-96 overflow-y-auto'>
                {modalData.customers.map((c) => (
                  <div
                    key={c.id}
                    className='flex justify-between items-center py-2 border-b'
                  >
                    <span>{c.name}</span>
                    <span className='text-gray-500'>{c.phone}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`.form-input { display: block; width: auto; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem; color: #374151; background-color: #fff; border: 1px solid #D1D5DB; border-radius: 0.5rem; }`}</style>
    </div>
  );
}
