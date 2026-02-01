//client/src/app/(dashboard)/admin/wardens/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../../components/ui/tabs';
import { WardenList } from '../components/wardens/WardenList';
import { AddWardenForm } from '../components/wardens/AddWardenForm';

export default function WardensPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleWardenAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.6rem] font-bold text-gray-900">Wardens</h2>
          <p className="text-sm text-muted-foreground">
            Manage hostel wardens and their assignments.
          </p>
        </div>

        <Button 
          className="bg-blue-600 hover:bg-blue-700 shadow-sm"
          onClick={() => setShowAddForm(true)}
        >
          + Add Warden
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-fit bg-gray-100 rounded-xl p-[4px] border border-gray-200 shadow-sm">
          <TabsTrigger 
            value="list" 
            className="px-5 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            All Wardens
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
            <WardenList type="list" refresh={refreshKey} />
          </TabsContent>
          <TabsContent value="active" className="mt-0">
            <WardenList type="active" refresh={refreshKey} />
          </TabsContent>
          <TabsContent value="inactive" className="mt-0">
            <WardenList type="inactive" refresh={refreshKey} />
          </TabsContent>
        </div>
      </Tabs>

      {showAddForm && (
        <AddWardenForm 
          onClose={() => setShowAddForm(false)}
          onSuccess={handleWardenAdded}
        />
      )}
    </div>
  );
}


