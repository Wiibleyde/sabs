"use client";

import { RTMPConnectionItem } from "@/mediamtx";
import useSWR from "swr";
import { Be_Vietnam_Pro } from 'next/font/google';

const BeVietnam = Be_Vietnam_Pro({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json());

export function RTMPStatus() {
    const { data, error } = useSWR<{
        activePublishConnections: RTMPConnectionItem[];
        activeReadConnections: RTMPConnectionItem[];
    }>('/api/v1/sabs/rtmp/status', fetcher, { refreshInterval: 2000 });

    if (error) return (
        <div 
            className="p-4 md:p-6 bg-white/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-red-200/50 text-red-700 shadow-[0_8px_32px_0_rgba(248,113,113,0.15)] transition-all duration-300"
            style={{ fontFamily: BeVietnam.style.fontFamily }}
        >
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/25">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <span className="font-semibold text-base tracking-tight">Erreur RTMP</span>
                    <p className="text-red-600/80 text-sm font-light">Impossible de récupérer le statut</p>
                </div>
            </div>
        </div>
    );

    if (!data) return (
        <div 
            className="p-4 md:p-6 bg-white/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-gray-200/50 text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] transition-all duration-300"
            style={{ fontFamily: BeVietnam.style.fontFamily }}
        >
            <div className="flex items-center justify-center space-x-3 text-gray-700">
                <div className="w-10 h-10 bg-gradient-to-br from-sabs-gradient-1 to-sabs-gradient-2 rounded-lg flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <div>
                    <span className="text-base font-medium tracking-tight">Chargement RTMP...</span>
                </div>
            </div>
        </div>
    );

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

    return (
        <div 
            className="space-y-4"
            style={{ fontFamily: BeVietnam.style.fontFamily }}
        >
            {/* Active Publish Connections */}
            <div className="group p-4 md:p-6 bg-white/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-gray-200/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.15)] transition-all duration-300 will-change-transform">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-sabs-gradient-1 to-sabs-gradient-2 rounded-lg flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] group-hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.2)] transition-all duration-300">
                            <svg className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300 ease-out" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium tracking-tight bg-gradient-to-r from-sabs-primary to-blue-600 bg-clip-text text-transparent">
                                Publication
                            </h3>
                            <div className="w-8 h-[1px] bg-gradient-to-r from-sabs-gradient-1 to-sabs-gradient-2 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className={`w-2 h-2 rounded-full ${data?.activePublishConnections?.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                        <span className="font-light">{data?.activePublishConnections?.length || 0} active{(data?.activePublishConnections?.length || 0) > 1 ? 's' : ''}</span>
                    </div>
                </div>

                {!data?.activePublishConnections?.length ? (
                    <div className="text-center py-6 text-gray-500">
                        <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-light">Aucune publication</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {data.activePublishConnections.map((conn, index) => (
                            <div 
                                key={conn.id} 
                                className="group/item flex items-center justify-between p-3 bg-white/50 backdrop-blur-xl rounded-lg hover:bg-white/80 transition-all duration-200 border border-gray-200/30 hover:border-emerald-200/60 shadow-sm hover:shadow-md will-change-transform"
                            >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm group-hover/item:shadow-md transition-all duration-200">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 text-sm truncate group-hover/item:text-sabs-primary transition-colors duration-200">{conn.path}</div>
                                        <div className="text-gray-500 text-xs font-light truncate">{conn.remoteAddr}</div>
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

            {/* Active Read Connections */}
            <div className="group p-4 md:p-6 bg-white/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-gray-200/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.15)] transition-all duration-300 will-change-transform">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-sabs-gradient-2 to-sabs-gradient-3 rounded-lg flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] group-hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.2)] transition-all duration-300">
                            <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium tracking-tight bg-gradient-to-r from-sabs-primary to-purple-600 bg-clip-text text-transparent">
                                Lecture
                            </h3>
                            <div className="w-8 h-[1px] bg-gradient-to-r from-sabs-gradient-2 to-sabs-gradient-3 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className={`w-2 h-2 rounded-full ${data?.activeReadConnections?.length > 0 ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></span>
                        <span className="font-light">{data?.activeReadConnections?.length || 0} active{(data?.activeReadConnections?.length || 0) > 1 ? 's' : ''}</span>
                    </div>
                </div>

                {!data?.activeReadConnections?.length ? (
                    <div className="text-center py-6 text-gray-500">
                        <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-light">Aucune lecture</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {data.activeReadConnections.map((conn, index) => (
                            <div 
                                key={conn.id} 
                                className="group/item flex items-center justify-between p-3 bg-white/50 backdrop-blur-xl rounded-lg hover:bg-white/80 transition-all duration-200 border border-gray-200/30 hover:border-blue-200/60 shadow-sm hover:shadow-md will-change-transform"
                            >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover/item:shadow-md transition-all duration-200">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 text-sm truncate group-hover/item:text-sabs-primary transition-colors duration-200">{conn.path}</div>
                                        <div className="text-gray-500 text-xs font-light truncate">{conn.remoteAddr}</div>
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
        </div>
    );
}