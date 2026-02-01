//client/src/app/(dashboard)/admin/students/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../../components/ui/tabs';
import { StudentList } from '../components/students/StudentList';
import { AddStudentForm } from '../components/students/AddStudentForm';

export default function StudentsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStudentAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.6rem] font-bold text-gray-900">Students</h2>
          <p className="text-sm text-muted-foreground">
            Manage student records, active enrollments, and alumni.
          </p>
        </div>

        <Button 
          className="bg-blue-600 hover:bg-blue-700 shadow-sm"
          onClick={() => setShowAddForm(true)}
        >
          + Add Student
        </Button>
      </div>

      {/* Professional Tabs */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-fit bg-gray-100 rounded-xl p-[4px] border border-gray-200 shadow-sm">
          <TabsTrigger 
            value="list" 
            className="px-5 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            All Students
          </TabsTrigger>

          <TabsTrigger 
            value="active" 
            className="px-5 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Active
          </TabsTrigger>

          <TabsTrigger 
            value="left" 
            className="px-5 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Graduated / Left
          </TabsTrigger>
        </TabsList>

        <div className="pt-6">
          <TabsContent value="list" className="mt-0">
            <StudentList type="list" refresh={refreshKey} />
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            <StudentList type="active" refresh={refreshKey} />
          </TabsContent>

          <TabsContent value="left" className="mt-0">
            <StudentList type="left" refresh={refreshKey} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Add Student Modal */}
      {showAddForm && (
        <AddStudentForm 
          onClose={() => setShowAddForm(false)}
          onSuccess={handleStudentAdded}
        />
      )}
    </div>
  );
}
