import useSWR from "swr";
import { Be_Vietnam_Pro } from "next/font/google";
import { useState } from "react";

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

const BeVietnam = Be_Vietnam_Pro({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});


export function BRTemp() {
    const { data, error, isLoading } = useSWR<{
        number: string;
        name: string;
    }>('/api/v1/mindcity/br/game', fetcher, { refreshInterval: 1000 });
    
    const [number, setNumber] = useState<string>(data?.number ?? "");
    const [name, setName] = useState<string>(data?.name ?? "");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const res = await fetch("/api/v1/mindcity/br/game", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ number, name }),
            });
            if (!res.ok) {
                throw new Error("Erreur lors de la modification.");
            }
        } catch (err) {
            setErrorMsg(
                typeof err === "object" && err !== null && "message" in err
                    ? String((err as { message?: unknown }).message)
                    : "Erreur inconnue."
            );
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center text-red-600" style={{ fontFamily: BeVietnam.style.fontFamily }}>
                    <p>Erreur de chargement des informations du Battle Royale.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center text-gray-600" style={{ fontFamily: BeVietnam.style.fontFamily }}>
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
                    </div>
                    <p className="mt-4">Chargement des informations du Battle Royale...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center text-gray-600" style={{ fontFamily: BeVietnam.style.fontFamily }}>
                    <p>Aucune donnée disponible.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" style={{ fontFamily: BeVietnam.style.fontFamily }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section partie actuelle */}
                <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Partie actuelle
                        </h2>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6 text-center">
                        <div className="text-5xl font-bold text-slate-700 mb-2">
                            {data.number}
                        </div>
                        <div className="text-lg text-slate-600 font-medium">
                            {data.name}
                        </div>
                    </div>
                </div>

                {/* Section formulaire */}
                <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Changer de partie
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                                Numéro de la partie
                            </label>
                            <input
                                type="text"
                                name="number"
                                id="number"
                                required
                                value={number}
                                onChange={e => setNumber(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Ex: 1, 2, 3..."
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nom de la partie
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Nom de la partie..."
                                autoComplete="off"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Chargement...
                                </div>
                            ) : (
                                "Changer"
                            )}
                        </button>
                        {errorMsg && (
                            <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                                <p className="text-red-700 text-sm">{errorMsg}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
