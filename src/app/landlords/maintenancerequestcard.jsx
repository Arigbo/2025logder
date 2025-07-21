// src/components/MaintenanceRequestCard.jsx
// Component to display an individual maintenance request.

import React from 'react';

export default function MaintenanceRequestCard({ request, onUpdateStatus, onDelete }) {
    if (!request) return null;
    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <h4 className="font-bold text-lg text-indigo-700 mb-2">{request.title}</h4>
            <p className="text-sm text-slate-600 mb-1">Property: {request.property}</p>
            <p className="text-sm text-slate-600 mb-1">Reported by: {request.reportedBy}</p>
            <p className="text-sm text-slate-600 mb-3">Status: <span className={`font-semibold ${request.status === 'Completed' ? 'text-green-500' : request.status === 'In Progress' ? 'text-amber-500' : 'text-red-500'}`}>{request.status}</span></p>
            <p className="text-sm text-slate-600 mb-3">{request.description}</p>
            <div className="flex justify-end gap-2 mt-auto">
                <select
                    value={request.status}
                    onChange={(e) => onUpdateStatus(request.id, e.target.value)}
                    className="p-1 border rounded-md text-sm"
                >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <button onClick={() => onDelete(request.id, request.title)} className="button-delete text-sm px-3 py-1 rounded-md">Delete</button>
            </div>
        </div>
    );
}