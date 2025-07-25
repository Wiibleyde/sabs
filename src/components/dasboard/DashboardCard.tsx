import { ReactNode } from 'react';

interface DashboardCardProps {
    title: string;
    icon: ReactNode;
    gradientFrom: string;
    gradientTo: string;
    children: ReactNode;
}

export function DashboardCard({ title, icon, gradientFrom, gradientTo, children }: DashboardCardProps) {
    return (
        <div className="group p-6 md:p-8 bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-[1.5rem] border border-gray-200/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.15)] transition-all duration-500 will-change-transform">
            <div className="flex items-center space-x-4 mb-6">
                <div
                    className={`w-12 h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]`}
                >
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl md:text-2xl font-medium tracking-tight bg-gradient-to-r from-sabs-primary to-purple-600 bg-clip-text text-transparent">
                        {title}
                    </h3>
                    <div
                        className={`w-12 h-[1px] bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full mt-2`}
                    ></div>
                </div>
            </div>
            {children}
        </div>
    );
}
