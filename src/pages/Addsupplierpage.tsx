import { useState } from 'react';

import { Modal, Button, Form } from 'antd';

interface BankAccountDetails {
  accountNumber: string;
  bankName: string;
  branch: string;
  accountType: string;
}


interface SupplierFormData {
  supplierID: string;
  supplierName: string;
  telephone: string;
  address: string;

  bankAccount?: BankAccountDetails;

}

interface AddSupplierPageProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: SupplierFormData) => void;
}

const Addsupplierpage = ({ visible, onCancel, onSubmit }: AddSupplierPageProps) => {
  const [formData, setFormData] = useState<SupplierFormData>({
    supplierID: 'S0096',
    supplierName: '',
    telephone: '',
    address: '',
  });
  
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankFormData, setBankFormData] = useState<BankAccountDetails>({
    accountNumber: '',
    bankName: '',
    branch: '',
    accountType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (showBankForm) {
      dataToSubmit.bankAccount = bankFormData;
    }
    onSubmit(dataToSubmit);
    
    // Reset form
    setFormData({
      supplierID: `S${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')}`,
      supplierName: '',
      telephone: '',
      address: '',
    });
    setBankFormData({
      accountNumber: '',
      bankName: '',
      branch: '',
      accountType: '',
    });
    setShowBankForm(false);
  };

  const handleBankFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleBankForm = () => {
    setShowBankForm(!showBankForm);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      title={
        <div className="flex justify-between items-center bg-white p-4 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800 m-0">Add Supplier</h2>
        </div>
      }
      bodyStyle={{ padding: 0 }}
    >
      <div className="p-6 bg-white">
        {/* Photo Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-gray-500 m-0">Add Photo</p>
        </div>

        {/* Photo Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <Button style={{ backgroundColor: '#b08968', color: 'white' }}>Profile Image</Button>
          <Button>Remove</Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier ID</label>
            <input
              type="text"
              name="supplierID"
              value={formData.supplierID}
              disabled
              className="w-full rounded-lg p-2 border border-gray-300 bg-gray-100 text-gray-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              placeholder="Type Supplier name here"
              className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Telephone Number</label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="Enter Supplier's Phone Number"
              className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Supplier's Address"
              className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          {/* Bank Account Button */}
          <div className="mb-4">
            <Button 
              onClick={toggleBankForm}
              type="default"
              className="w-full h-10 rounded-lg border-dashed"
              style={{ borderColor: '#b08968', color: '#b08968' }}
            >
              {showBankForm ? 'Hide Bank Account Details' : 'Add Bank Account Details (Optional)'}
            </Button>
          </div>

          {/* Bank Account Form */}
          {showBankForm && (
            <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">Bank Account Details</h3>
                <span className="text-xs text-gray-500 italic">Optional</span>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankFormData.accountNumber}
                  onChange={handleBankFormChange}
                  placeholder="Enter Account Number"
                  className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={bankFormData.bankName}
                  onChange={handleBankFormChange}
                  placeholder="Enter Bank Name"
                  className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={bankFormData.branch}
                  onChange={handleBankFormChange}
                  placeholder="Enter Branch Name"
                  className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <input
                  type="text"
                  name="accountType"
                  value={bankFormData.accountType}
                  onChange={handleBankFormChange}
                  placeholder="Enter Account Type"
                  className="w-full rounded-lg p-2 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div className="my-6 border-t border-gray-200"></div>

          {/* Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-10 rounded-lg"
            style={{ backgroundColor: '#b08968', borderColor: '#b08968' }}
          >
            Add Supplier
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default Addsupplierpage;