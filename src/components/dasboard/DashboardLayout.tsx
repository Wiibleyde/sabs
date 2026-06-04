export function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen relative bg-sabs-bg">
			{/* Top gradient bar */}
			<div className="fixed top-0 left-0 right-0 h-1 z-50 sabs-gradient-bg" />
			<div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 py-12 pt-14">
				<div className="max-w-6xl mx-auto">{children}</div>
			</div>
		</div>
	);
}
