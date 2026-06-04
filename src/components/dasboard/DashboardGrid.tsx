const COMING_SOON_CARDS = [
	{
		title: "SRT",
		desc: "Connexions SRT en temps réel",
		accent: "border-t-sabs-green text-sabs-green",
		dot: "bg-sabs-green",
	},
	{
		title: "RTMP",
		desc: "Flux RTMP actifs",
		accent: "border-t-sabs-purple text-sabs-purple",
		dot: "bg-sabs-purple",
	},
	{
		title: "Statistiques",
		desc: "Métriques système",
		accent: "border-t-sabs-red text-sabs-red",
		dot: "bg-sabs-red",
	},
	{
		title: "Événements",
		desc: "Journal des activités",
		accent: "border-t-sabs-gold text-sabs-gold",
		dot: "bg-sabs-gold",
	},
];

export function DashboardGrid() {
	return (
		<div>
			{/* Coming soon banner */}
			<div className="flex flex-col items-center justify-center py-16 mb-10 rounded-2xl text-center bg-sabs-bg-2 border border-sabs-border">
				<div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 sabs-gradient-bg">
					<svg
						className="w-8 h-8 text-sabs-bg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>En construction</title>
						<path d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
						<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
				<h2 className="text-2xl font-black text-white mb-3">En construction</h2>
				<p className="text-sm font-light max-w-md text-sabs-muted">
					Le panneau d&apos;administration SABS est en cours de développement.
					Les fonctionnalités seront disponibles prochainement.
				</p>
			</div>

			{/* Module placeholders */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{COMING_SOON_CARDS.map((card) => (
					<div
						key={card.title}
						className={`p-6 rounded-xl bg-sabs-bg-2 border border-sabs-border border-t-2 ${card.accent.split(" ")[0]}`}
					>
						<div className="inline-flex w-8 h-8 rounded-lg items-center justify-center mb-4 bg-sabs-bg-3">
							<div className={`w-2 h-2 rounded-full ${card.dot}`} />
						</div>
						<h3 className="text-white font-bold text-base mb-1">
							{card.title}
						</h3>
						<p className="text-xs font-light text-sabs-muted">{card.desc}</p>
						<p
							className={`text-xs font-bold tracking-wider uppercase mt-4 ${card.accent.split(" ")[1]} opacity-60`}
						>
							Bientôt disponible
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
