interface LoadingPlaceholderProps {
    type: 'publish' | 'read';
}

export function RTMPLoadingPlaceholder({ type }: LoadingPlaceholderProps) {
    const isPublish = type === 'publish';
    
    return (
        <div className="group p-4 md:p-6 bg-white/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-gray-200/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${isPublish ? 'from-sabs-gradient-1 to-sabs-gradient-2' : 'from-sabs-gradient-2 to-sabs-gradient-3'} rounded-lg flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]`}>
                        <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <div>
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-20 mb-1"></div>
                        <div className="w-8 h-[1px] bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
            </div>
            
            <div className="text-center py-6 text-gray-500">
                <div className="w-8 h-8 mx-auto mb-2 opacity-40">
                    <div className="w-full h-full bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
            </div>
        </div>
    );
}
