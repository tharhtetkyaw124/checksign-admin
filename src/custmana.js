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

// --- Member Points Management ---
function MemberPointsManagement() {
  const [activeTab, setActiveTab] = useState('balances');

  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>Member Points</h1>
      <div className='flex border-b mb-6'>
        <button
          onClick={() => setActiveTab('balances')}
          className={`py-2 px-4 font-semibold ${
            activeTab === 'balances'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          Balances
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-4 font-semibold ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          History
        </button>
      </div>
      {activeTab === 'balances' ? <PointsBalances /> : <PointsHistory />}
    </div>
  );
}

function PointsBalances() {
  const { customers, fetchCustomers, fetchLoyaltyTransactions } =
    useContext(AppContext);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSave = async () => {
    await fetchCustomers();
    await fetchLoyaltyTransactions();
    setSelectedCustomer(null);
  };

  return (
    <div>
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

function PointsHistory() {
  const { loyaltyTransactions } = useContext(AppContext);
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });
  const [sort, setSort] = useState({ key: 'created_at', direction: 'desc' });

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredTransactions = loyaltyTransactions
    .filter((tx) => {
      if (!tx.created_at || !tx.created_at.toDate) return true; // Keep transactions without a date for now
      const txDate = tx.created_at.toDate();
      if (filters.startDate && txDate < new Date(filters.startDate))
        return false;
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // Include the whole end day
        if (txDate > endDate) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const valA = a[sort.key];
      const valB = b[sort.key];
      if (sort.direction === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

  return (
    <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
      <div className='flex items-center gap-4 mb-4'>
        <input
          type='date'
          name='startDate'
          value={filters.startDate}
          onChange={handleFilterChange}
          className='form-input'
        />
        <span>to</span>
        <input
          type='date'
          name='endDate'
          value={filters.endDate}
          onChange={handleFilterChange}
          className='form-input'
        />
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 cursor-pointer'
                onClick={() => handleSort('created_at')}
              >
                Date
              </th>
              <th scope='col' className='px-6 py-3'>
                Customer
              </th>
              <th
                scope='col'
                className='px-6 py-3 cursor-pointer'
                onClick={() => handleSort('points')}
              >
                Points
              </th>
              <th scope='col' className='px-6 py-3'>
                Reason
              </th>
              <th scope='col' className='px-6 py-3'>
                Balance After
              </th>
              <th scope='col' className='px-6 py-3'>
                Transaction ID
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className='bg-white border-b hover:bg-gray-50'>
                <td className='px-6 py-4'>
                  {tx.created_at
                    ? new Date(tx.created_at.seconds * 1000).toLocaleString()
                    : 'N/A'}
                </td>
                <td className='px-6 py-4'>{tx.customer_name}</td>
                <td
                  className={`px-6 py-4 font-semibold ${
                    tx.points > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {tx.points > 0 ? `+${tx.points}` : tx.points}
                </td>
                <td className='px-6 py-4'>{tx.reason}</td>
                <td className='px-6 py-4 font-bold'>{tx.balance_after}</td>
                <td className='px-6 py-4 text-xs text-gray-500'>
                  {tx.id.slice(0, 8)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        reason_code: 'MANUAL_ADJUSTMENT',
        balance_after: newPoints,
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
            <FloatingLabelInput
              label='Points to Add/Remove'
              type='number'
              value={adjustment}
              onChange={(e) => setAdjustment(parseInt(e.target.value, 10))}
              placeholder='e.g., 50 or -20'
              required
            />
            <FloatingLabelInput
              label='Reason'
              type='text'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder='e.g., Special promotion'
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
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
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
