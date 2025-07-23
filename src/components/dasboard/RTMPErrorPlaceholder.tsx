interface ErrorPlaceholderProps {
    type: 'publish' | 'read';
}

export function RTMPErrorPlaceholder({ type }: ErrorPlaceholderProps) {
    const isPublish = type === 'publish';
    
    return (
        <div className="group p-4 md:p-6 bg-white/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-red-200/50 shadow-[0_8px_32px_0_rgba(248,113,113,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/25">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h3 className={`text-lg font-medium tracking-tight ${isPublish ? 'text-red-700' : 'text-red-700'}`}>
                            {isPublish ? 'Publication' : 'Lecture'}
                        </h3>
                        <div className={`w-8 h-[1px] bg-gradient-to-r from-red-400 to-red-500 rounded-full`}></div>
                    </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-red-600">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="font-light">Erreur</span>
                </div>
            </div>
            
            <div className="text-center py-6 text-red-500">
                <svg className="w-8 h-8 mx-auto mb-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-sm font-light">Impossible de charger les données</p>
            </div>
        </div>
    );
}
