//client/src/app/(dashboard)/admin/components/parents/AddParentForm.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../../../../components/ui/button';
import { Input } from '../../../../../../components/ui/input';
import { Label } from '../../../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../../components/ui/select';
import { parentAPI } from '../../../../../../lib/api';

interface AddParentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddParentForm({ onClose, onSuccess }: AddParentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    relationship: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await parentAPI.create(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create parent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Parent</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Email *</Label>
                  <Input
                    placeholder="parent@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Password *</Label>
                  <Input
                    type="password"
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">First Name *</Label>
                  <Input
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Last Name *</Label>
                  <Input
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Phone Number *</Label>
                  <Input
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Relationship *</Label>
                  <Select value={formData.relationship} onValueChange={(val) => handleChange('relationship', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Address (Optional) */}
            <details className="border-t border-gray-200 pt-6">
              <summary className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-gray-700 select-none">
                Address (Optional)
              </summary>
              <div className="mt-3 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-600 mb-1.5 block">Address</Label>
                    <Input
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1.5 block">City</Label>
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1.5 block">State</Label>
                    <Input
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1.5 block">Pincode</Label>
                    <Input
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </details>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gray-900 hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Parent'}
          </Button>
        </div>
      </div>
    </div>
  );
}
