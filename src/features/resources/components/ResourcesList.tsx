'use client';

import { useListResourcesQuery } from '../queries/useListResourcesQuery';

export function ResourcesList() {
  const [data] = useListResourcesQuery();

  return (
    <div className="grid gap-4 w-full max-w-2xl">
      {data.map((resource) => (
        <div
          key={resource.id}
          className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-100 border-gray-500"
        >
          <h2 className="text-xl font-semibold">{resource.title}</h2>
          <p className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
            resource.status === 'active' ? 'bg-green-900 text-green-100' :
            resource.status === 'inactive' ? 'bg-gray-700 text-gray-300' :
            'bg-yellow-900 text-yellow-100'
          }`}>
            {resource.status}
          </p>
        </div>
      ))}
    </div>
  );
}
