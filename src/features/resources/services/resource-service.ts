import 'server-only';

export type Resource = {
  id: string;
  title: string;
  status: 'active' | 'inactive' | 'archived';
};

const MOCK_RESOURCES: Resource[] = [
  { id: '1', title: 'Resource 1', status: 'active' },
  { id: '2', title: 'Resource 2', status: 'inactive' },
  { id: '3', title: 'Resource 3', status: 'archived' },
  { id: '4', title: 'Resource 4', status: 'active' },
  { id: '5', title: 'Resource 5', status: 'active' },
];

export async function getResources(query?: string): Promise<Resource[]> {
  // Simulate database delay of 1000ms
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!query) {
    return MOCK_RESOURCES;
  }

  const lowerQuery = query.toLowerCase();
  return MOCK_RESOURCES.filter((r) =>
    r.title.toLowerCase().includes(lowerQuery)
  );
}
