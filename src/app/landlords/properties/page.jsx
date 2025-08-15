"use client";
import { useContext } from "react";
import { DashboardContext } from "@/app/landlords/layout";
function PropertiesList() {
  const {properties } = useContext(DashboardContext);

  return (
    <div>
      <h2>Properties</h2>
      <ul>
        {properties && properties.length > 0 ? (
          properties.map((property, idx) => (
            <li key={property.id || idx}>
              {property.name}
            </li>
          ))
        ) : (
          <li>No properties found.</li>
        )}
      </ul>
    </div>
  );
}

export default PropertiesList;
