"use client";
import useSWR from "swr";

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function MCBRPage() {
    const { data, error, isLoading } = useSWR<{
        number: string;
        name: string;
    }>('/api/v1/mindcity/br/game', fetcher, { refreshInterval: 1000 });
    
    return (
        <div className="w-full h-full flex items-center justify-center font-mono overflow-hidden m-0 p-0 bg-transparent">
            {error && (
                <div className="bg-red-900/80 backdrop-blur-sm border border-red-500 rounded-lg px-6 py-4 shadow-2xl">
                    <div className="text-red-300 font-semibold text-lg">⚠️ Erreur de connexion</div>
                </div>
            )}
            
            {isLoading && (
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600 rounded-lg px-8 py-6 shadow-2xl">
                    <div className="text-gray-300 font-semibold text-xl flex items-center gap-3">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                        Chargement...
                    </div>
                </div>
            )}
            
            {!isLoading && !error && (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="flex items-center gap-8 text-center">
                        <div className="flex items-center gap-6">
                            <div>
                                <div className="text-7xl font-bold text-[#007292] font-mono">
                                    Partie n°{data?.number ?? "N/A"}
                                </div>
                            </div>
                            <p className="text-gray-500 text-7xl">
                                -
                            </p>
                            <div>
                                <div className="text-6xl text-[#5419a2] font-mono font-black">
                                    {data?.name ?? "En attente..."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}