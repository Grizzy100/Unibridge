//client/src/app/(dashboard)/admin/components/students/AddStudentForm.tsx
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
import { studentAPI } from '../../../../../../lib/api';

interface AddStudentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddStudentForm({ onClose, onSuccess }: AddStudentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    enrollmentNumber: '',
    school: '',
    batch: '',
    year: 1,
    semester: 1,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    bloodGroup: '',
    specialization: '',
    fatherName: '',
    motherName: '',
    guardianName: '',
    parentContact: '',
    emergencyContact: '',
    currentAddress: '',
    permanentAddress: '',
    city: '',
    state: '',
    pincode: '',
    hostelAssigned: false,
    hostelName: '',
    roomNumber: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await studentAPI.create(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Student</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
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
                    placeholder="e23cseu1234@university.edu.in"
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
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Date of Birth *</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
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

            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Academic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Enrollment Number *</Label>
                  <Input
                    placeholder="Enrollment Number"
                    value={formData.enrollmentNumber}
                    onChange={(e) => handleChange('enrollmentNumber', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">School *</Label>
                  <Select value={formData.school} onValueChange={(val) => handleChange('school', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select School" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTECH">BTECH</SelectItem>
                      <SelectItem value="BBA">BBA</SelectItem>
                      <SelectItem value="BCOM">BCOM</SelectItem>
                      <SelectItem value="BSC">BSC</SelectItem>
                      <SelectItem value="BA">BA</SelectItem>
                      <SelectItem value="MTECH">MTECH</SelectItem>
                      <SelectItem value="MBA">MBA</SelectItem>
                      <SelectItem value="MSC">MSC</SelectItem>
                      <SelectItem value="MA">MA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Batch *</Label>
                  <Input
                    placeholder="e.g., 2023-2027"
                    value={formData.batch}
                    onChange={(e) => handleChange('batch', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Year *</Label>
                  <Input
                    type="number"
                    placeholder="1-5"
                    min="1"
                    max="5"
                    value={formData.year}
                    onChange={(e) => handleChange('year', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Semester *</Label>
                  <Input
                    type="number"
                    placeholder="1-10"
                    min="1"
                    max="10"
                    value={formData.semester}
                    onChange={(e) => handleChange('semester', parseInt(e.target.value))}
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
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Parent/Guardian Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Father's Name</Label>
                  <Input
                    placeholder="Father's Name"
                    value={formData.fatherName}
                    onChange={(e) => handleChange('fatherName', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Mother's Name</Label>
                  <Input
                    placeholder="Mother's Name"
                    value={formData.motherName}
                    onChange={(e) => handleChange('motherName', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Guardian Name</Label>
                  <Input
                    placeholder="Guardian Name"
                    value={formData.guardianName}
                    onChange={(e) => handleChange('guardianName', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Parent Contact</Label>
                  <Input
                    placeholder="Parent Contact Number"
                    value={formData.parentContact}
                    onChange={(e) => handleChange('parentContact', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1.5 block">Emergency Contact</Label>
                  <Input
                    placeholder="Emergency Contact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleChange('emergencyContact', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Collapsible Sections */}
            <details className="border-t pt-6">
              <summary className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-gray-700 select-none">
                Address Information (Optional)
              </summary>
              <div className="mt-3 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-600 mb-1.5 block">Current Address</Label>
                    <Input
                      placeholder="Current Address"
                      value={formData.currentAddress}
                      onChange={(e) => handleChange('currentAddress', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-600 mb-1.5 block">Permanent Address</Label>
                    <Input
                      placeholder="Permanent Address"
                      value={formData.permanentAddress}
                      onChange={(e) => handleChange('permanentAddress', e.target.value)}
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

            <details className="border-t pt-6">
              <summary className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-gray-700 select-none">
                Hostel Information (Optional)
              </summary>
              <div className="mt-3 space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hostelAssigned"
                    checked={formData.hostelAssigned}
                    onChange={(e) => handleChange('hostelAssigned', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor="hostelAssigned" className="text-sm text-gray-700">
                    Hostel Assigned
                  </label>
                </div>
                {formData.hostelAssigned && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">Hostel Name</Label>
                      <Input
                        placeholder="Hostel Name"
                        value={formData.hostelName}
                        onChange={(e) => handleChange('hostelName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1.5 block">Room Number</Label>
                      <Input
                        placeholder="Room Number"
                        value={formData.roomNumber}
                        onChange={(e) => handleChange('roomNumber', e.target.value)}
                      />
                    </div>
                  </div>
                )}
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
            {loading ? 'Creating...' : 'Create Student'}
          </Button>
        </div>
      </div>
    </div>
  );
}
