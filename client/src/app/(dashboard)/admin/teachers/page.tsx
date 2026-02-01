//client/src/app/(dashboard)/admin/teachers/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../../components/ui/tabs';
import { TeacherList } from '../components/teachers/TeacherList';
import { AddTeacherForm } from '../components/teachers/AddTeacherForm';

export default function TeachersPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTeacherAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.6rem] font-bold text-gray-900">Teachers</h2>
          <p className="text-sm text-muted-foreground">
            Manage faculty members and their assignments.
          </p>
        </div>

        <Button 
          className="bg-blue-600 hover:bg-blue-700 shadow-sm"
          onClick={() => setShowAddForm(true)}
        >
          + Add Teacher
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-fit bg-gray-100 rounded-xl p-[4px] border border-gray-200 shadow-sm">
          <TabsTrigger 
            value="list" 
            className="px-5 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            All Teachers
          </TabsTrigger>
          <TabsTrigger 
            value="active" 
            className="px-5 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Active
          </TabsTrigger>
          <TabsTrigger 
            value="inactive" 
            className="px-5 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Inactive
          </TabsTrigger>
        </TabsList>
        <div className="pt-6">
          <TabsContent value="list" className="mt-0">
            <TeacherList type="list" refresh={refreshKey} />
          </TabsContent>
          <TabsContent value="active" className="mt-0">
            <TeacherList type="active" refresh={refreshKey} />
          </TabsContent>
          <TabsContent value="inactive" className="mt-0">
            <TeacherList type="inactive" refresh={refreshKey} />
          </TabsContent>
        </div>
      </Tabs>

      {showAddForm && (
        <AddTeacherForm 
          onClose={() => setShowAddForm(false)}
          onSuccess={handleTeacherAdded}
        />
      )}
    </div>
  );
}
