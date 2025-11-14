export function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 relative">
			{/* Subtle background pattern */}
			<div className="absolute inset-0 opacity-[0.02]">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `radial-gradient(circle at 25% 25%, #7373B4 0%, transparent 70%), 
                                     radial-gradient(circle at 75% 75%, #85527E 0%, transparent 70%)`,
					}}
				></div>
			</div>

			<div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
				<div className="max-w-6xl mx-auto">{children}</div>
			</div>
		</div>
	);
}
