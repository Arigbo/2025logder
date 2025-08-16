"use client"
import { useContext, useState } from 'react';
import { DashboardContext } from '../../component/landlord/context';

export default function Tenants() {
  const { tenants, setTenants, user } = useContext(DashboardContext);
  const [newTenant, setNewTenant] = useState({ name: '', email: '' });

  const handleAddTenant = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: tenants.length + 1,
          name: newTenant.name,
          email: newTenant.email,
          role: 'student',
          landlordId: user.id,
        }),
      });
      if (res.ok) {
        const addedTenant = await res.json();
        setTenants([...tenants, addedTenant]);
        setNewTenant({ name: '', email: '' });
      } else {
        alert('Failed to add tenant');
      }
    } catch (err) {
      console.error('Add tenant error:', err);
      alert('Error adding tenant');
    }
  };

  const handleDeleteTenant = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTenants(tenants.filter((t) => t.id !== id));
      } else {
        alert('Failed to delete tenant');
      }
    } catch (err) {
      console.error('Delete tenant error:', err);
      alert('Error deleting tenant');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tenants</h2>
      <form onSubmit={handleAddTenant} className="mb-6">
        <input
          type="text"
          value={newTenant.name}
          onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
          placeholder="Tenant Name"
          className="border p-2 mr-2"
          required
        />
        <input
          type="email"
          value={newTenant.email}
          onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
          placeholder="Tenant Email"
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Tenant</button>
      </form>
      <ul className="space-y-2">
        {tenants.map((tenant) => (
          <li key={tenant.id} className="bg-white p-4 shadow rounded flex justify-between">
            <span>{tenant.name} - {tenant.email}</span>
            <button
              onClick={() => handleDeleteTenant(tenant.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
