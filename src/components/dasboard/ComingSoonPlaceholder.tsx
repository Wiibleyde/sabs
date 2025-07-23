export function ComingSoonPlaceholder() {
    return (
        <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
            </div>
            <p className="text-sm font-light">Bientôt disponible</p>
        </div>
    );
}
