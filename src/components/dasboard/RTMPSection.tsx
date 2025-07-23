import { RTMPConnectionItem } from "@/mediamtx";

interface RTMPSectionProps {
    type: 'publish' | 'read';
    connections: RTMPConnectionItem[];
    title: string;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const getStatusColor = (state: string) => {
    switch (state.toLowerCase()) {
        case 'active':
        case 'connected':
            return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
        case 'idle':
            return 'text-amber-700 bg-amber-50 border border-amber-200';
        case 'error':
        case 'disconnected':
            return 'text-rose-700 bg-rose-50 border border-rose-200';
        default:
            return 'text-slate-600 bg-slate-50 border border-slate-200';
    }
};

export function RTMPSection({ type, connections, title }: RTMPSectionProps) {
    const isPublish = type === 'publish';
    
    const sectionConfig = {
        publish: {
            gradient: 'from-sabs-gradient-1 to-sabs-gradient-2',
            titleGradient: 'from-sabs-primary to-blue-600',
            iconAnimation: 'group-hover:rotate-12',
            icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
            emptyIcon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
            emptyText: 'Aucune publication',
            connectionIcon: <path d="M8 5v14l11-7z"/>,
            connectionGradient: 'from-emerald-400 to-emerald-600',
            hoverBorder: 'hover:border-emerald-200/60'
        },
        read: {
            gradient: 'from-sabs-gradient-2 to-sabs-gradient-3',
            titleGradient: 'from-sabs-primary to-purple-600',
            iconAnimation: 'group-hover:scale-110',
            icon: <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />,
            emptyIcon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
            emptyText: 'Aucune lecture',
            connectionIcon: <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"/>,
            connectionGradient: 'from-blue-400 to-blue-600',
            hoverBorder: 'hover:border-blue-200/60'
        }
    };
    
    const config = sectionConfig[type];
    const statusDotColor = connections.length > 0 ? (isPublish ? 'bg-emerald-500' : 'bg-blue-500') : 'bg-gray-400';

    return (
        <div className="group p-4 md:p-6 bg-white/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-gray-200/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.15)] transition-all duration-300 will-change-transform">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] group-hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.2)] transition-all duration-300`}>
                        <svg className={`w-5 h-5 text-white ${config.iconAnimation} transition-transform duration-300 ease-out`} fill="currentColor" viewBox="0 0 24 24">
                            {config.icon}
                        </svg>
                    </div>
                    <div>
                        <h3 className={`text-lg font-medium tracking-tight bg-gradient-to-r ${config.titleGradient} bg-clip-text text-transparent`}>
                            {title}
                        </h3>
                        <div className={`w-8 h-[1px] bg-gradient-to-r ${config.gradient} rounded-full`}></div>
                    </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className={`w-2 h-2 rounded-full ${statusDotColor} ${connections.length > 0 ? 'animate-pulse' : ''}`}></span>
                    <span className="font-light">{connections.length} active{connections.length > 1 ? 's' : ''}</span>
                </div>
            </div>

            {!connections.length ? (
                <div className="text-center py-6 text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {config.emptyIcon}
                    </svg>
                    <p className="text-sm font-light">{config.emptyText}</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {connections.map((conn) => (
                        <div 
                            key={conn.id} 
                            className={`group/item flex items-center justify-between p-3 bg-white/50 backdrop-blur-xl rounded-lg hover:bg-white/80 transition-all duration-200 border border-gray-200/30 ${config.hoverBorder} shadow-sm hover:shadow-md will-change-transform`}
                        >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className={`w-8 h-8 bg-gradient-to-br ${config.connectionGradient} rounded-lg flex items-center justify-center shadow-sm group-hover/item:shadow-md transition-all duration-200`}>
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        {config.connectionIcon}
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 text-sm truncate group-hover/item:text-sabs-primary transition-colors duration-200">{conn.path}</div>
                                    <div className="text-gray-500 text-xs font-light truncate opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">{conn.remoteAddr}</div>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(conn.state)} transition-all duration-200`}>
                                {capitalize(conn.state)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
