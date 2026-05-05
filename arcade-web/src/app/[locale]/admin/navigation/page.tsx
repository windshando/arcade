import { getAdminNavigations } from '@/lib/api';
import NavigationManager from '@/components/admin/NavigationManager';

export const revalidate = 0; // Ensures the dashboard always pulls fresh admin state

export default async function NavigationAdminPage() {
  const menus = await getAdminNavigations().catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Navigation Routing</h1>
          <p className="text-card-foreground opacity-70">
            Control the core website architecture and external linkages.
          </p>
        </div>
      </div>

      <NavigationManager initialMenus={menus} />
    </div>
  );
}
