import { DashboardLayout } from '@/components/dasboard/DashboardLayout';
import { DashboardHeader } from '@/components/dasboard/DashboardHeader';
import { DashboardGrid } from '@/components/dasboard/DashboardGrid';
import { memo } from 'react';

const DashboardPageComponent = () => {
    return (
        <DashboardLayout>
            <DashboardHeader />
            <DashboardGrid />
        </DashboardLayout>
    );
};

export default memo(DashboardPageComponent);
