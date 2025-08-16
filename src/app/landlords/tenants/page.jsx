import { useContext } from 'react';
import { DashboardContext } from '../../component/landlord/context';

export default function Tenants() {
  const { tenants } = useContext(DashboardContext);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tenants</h2>
      <p className="mb-4">Tenants are assigned by accepting applications in the Applications tab.</p>
      <ul className="space-y-2">
        {tenants.length === 0 ? (
          <li className="bg-white p-4 shadow rounded">No tenants assigned yet.</li>
        ) : (
          tenants.map((tenant) => (
            <li key={tenant.id} className="bg-white p-4 shadow rounded">
              {tenant.name} - {tenant.email}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
