//client/src/app/(dashboard)/admin/parents/page.tsx


'use client';

import { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../../components/ui/tabs';
import { ParentList } from '../../admin/components/parents/ParentList';
import { AddParentForm } from '../../admin/components/parents/AddParentForm';

export default function ParentsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleParentAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.6rem] font-bold text-gray-900">Parents</h2>
          <p className="text-sm text-gray-600">
            Manage parent accounts and student links.
          </p>
        </div>

        <Button 
          className="bg-gray-900 hover:bg-gray-800"
          onClick={() => setShowAddForm(true)}
        >
          + Add Parent
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-fit bg-gray-100 rounded-md p-[4px] border border-gray-200">
          <TabsTrigger 
            value="list" 
            className="px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            All Parents
          </TabsTrigger>
          <TabsTrigger 
            value="active" 
            className="px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Active
          </TabsTrigger>
          <TabsTrigger 
            value="inactive" 
            className="px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Inactive
          </TabsTrigger>
        </TabsList>
        <div className="pt-6">
          <TabsContent value="list" className="mt-0">
            <ParentList type="list" refresh={refreshKey} />
          </TabsContent>
          <TabsContent value="active" className="mt-0">
            <ParentList type="active" refresh={refreshKey} />
          </TabsContent>
          <TabsContent value="inactive" className="mt-0">
            <ParentList type="inactive" refresh={refreshKey} />
          </TabsContent>
        </div>
      </Tabs>

      {showAddForm && (
        <AddParentForm 
          onClose={() => setShowAddForm(false)}
          onSuccess={handleParentAdded}
        />
      )}
    </div>
  );
}
