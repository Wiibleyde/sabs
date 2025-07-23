import { RTMPStatus } from '@/components/dasboard/RTMPStatus';
import { SystemStats } from './SystemStats';
import { RecentEvents } from './RecentEvents';

export function DashboardGrid() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="lg:col-span-2">
                <RTMPStatus />
            </div>
            
            <SystemStats />
            <RecentEvents />
        </div>
    );
}
