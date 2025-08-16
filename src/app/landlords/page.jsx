import { useContext } from 'react';
import { DashboardContext } from '@/app/component/landlord/context';

export default function Dashboard() {
  const { tenants, properties, notifications } = useContext(DashboardContext);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Landlord Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold">Tenants</h3>
          <p>{tenants.length} Total</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold">Properties</h3>
          <p>{properties.length} Total</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <p>{notifications.length} Pending</p>
        </div>
      </div>
    </div>
  );
}
