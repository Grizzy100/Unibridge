//client/src/app/(dashboard)/admin/components/teachers/AddTeacherForm.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../../../../components/ui/button';
import { Input } from '../../../../../../components/ui/input';
import { Label } from '../../../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../../components/ui/select';
import { teacherAPI } from '../../../../../../lib/api';

interface AddTeacherFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddTeacherForm({ onClose, onSuccess }: AddTeacherFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    employeeId: '',
    department: '',
    designation: '',
    dateOfJoining: '',
    dateOfBirth: '',  // Added
    firstName: '',
    lastName: '',
    gender: '',
    phoneNumber: '',
    bloodGroup: '',
    specialization: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    officeRoom: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await teacherAPI.create(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create teacher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Teacher</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Email *</Label>
                  <Input
                    placeholder="firstname.lastname@university.edu.in"
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

            {/* Personal */}
            <div className="border-t pt-6">
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
                
                {/* Date of Birth */}
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Date of Joining *</Label>
                  <Input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => handleChange('dateOfJoining', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(val) => handleChange('gender', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Phone Number</Label>
                  <Input
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Blood Group</Label>
                  <Select value={formData.bloodGroup} onValueChange={(val) => handleChange('bloodGroup', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A_POSITIVE">A+</SelectItem>
                      <SelectItem value="A_NEGATIVE">A-</SelectItem>
                      <SelectItem value="B_POSITIVE">B+</SelectItem>
                      <SelectItem value="B_NEGATIVE">B-</SelectItem>
                      <SelectItem value="O_POSITIVE">O+</SelectItem>
                      <SelectItem value="O_NEGATIVE">O-</SelectItem>
                      <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                      <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Professional */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Professional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Employee ID *</Label>
                  <Input
                    placeholder="Employee ID"
                    value={formData.employeeId}
                    onChange={(e) => handleChange('employeeId', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Department *</Label>
                  <Input
                    placeholder="Department"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Designation *</Label>
                  <Input
                    placeholder="Designation"
                    value={formData.designation}
                    onChange={(e) => handleChange('designation', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Specialization</Label>
                  <Input
                    placeholder="Specialization"
                    value={formData.specialization}
                    onChange={(e) => handleChange('specialization', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Office Room</Label>
                  <Input
                    placeholder="Office Room"
                    value={formData.officeRoom}
                    onChange={(e) => handleChange('officeRoom', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Collapsible Address */}
            <details className="border-t pt-6">
              <summary className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-gray-700 select-none">
                Address (Optional)
              </summary>
              <div className="mt-3 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
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
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Teacher'}
          </Button>
        </div>
      </div>
    </div>
  );
}
