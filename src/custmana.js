

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // ... (rest of the submit logic is unchanged)
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
          {/* ... (rest of the modal JSX is unchanged) */}
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
