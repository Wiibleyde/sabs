"use client";

import { RTMPConnectionItem } from "@/mediamtx";
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function DashboardPage() {
    const { data, error } = useSWR<{
        activePublishConnections: RTMPConnectionItem[];
        activeReadConnections: RTMPConnectionItem[];
    }>('/api/v1/sabs/rtmp/status', fetcher);

    return (
        <div className="scroll-smooth snap-y snap-mandatory overflow-y-scroll h-screen touch-pan-y">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {error && <div className="text-red-500">Failed to load data</div>}
            {!data ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Active Publish Connections</h2>
                    <ul>
                        {data.activePublishConnections.map(conn => (
                            <li key={conn.id}>{conn.path} - {conn.remoteAddr}</li>
                        ))}
                    </ul>

                    <h2 className="text-xl font-semibold mt-4 mb-2">Active Read Connections</h2>
                    <ul>
                        {data.activeReadConnections.map(conn => (
                            <li key={conn.id}>{conn.path} - {conn.remoteAddr}</li>
                        ))}
                    </ul>
                </div>
            )}
            <footer className="mt-8 text-sm text-gray-500">
                <p>Powered by MediaMTX</p>
            </footer>
        </div>
    );
}
