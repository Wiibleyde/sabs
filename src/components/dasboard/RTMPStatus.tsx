'use client';

import { RTMPConnectionItem } from '@/mediamtx';
import useSWR from 'swr';
import { Be_Vietnam_Pro } from 'next/font/google';
import { RTMPSection } from './RTMPSection';
import { RTMPLoadingPlaceholder } from './RTMPLoadingPlaceholder';
import { RTMPErrorPlaceholder } from './RTMPErrorPlaceholder';

const BeVietnam = Be_Vietnam_Pro({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export function RTMPStatus() {
    const { data, error } = useSWR<{
        activePublishConnections: RTMPConnectionItem[];
        activeReadConnections: RTMPConnectionItem[];
    }>('/api/v1/sabs/rtmp/status', fetcher, { refreshInterval: 2000 });

    if (error)
        return (
            <div className="space-y-4" style={{ fontFamily: BeVietnam.style.fontFamily }}>
                <RTMPErrorPlaceholder type="publish" />
                <RTMPErrorPlaceholder type="read" />
            </div>
        );

    if (!data)
        return (
            <div className="space-y-4" style={{ fontFamily: BeVietnam.style.fontFamily }}>
                <RTMPLoadingPlaceholder type="publish" />
                <RTMPLoadingPlaceholder type="read" />
            </div>
        );

    return (
        <div className="space-y-4" style={{ fontFamily: BeVietnam.style.fontFamily }}>
            <RTMPSection type="publish" connections={data.activePublishConnections || []} title="Publication" />
            <RTMPSection type="read" connections={data.activeReadConnections || []} title="Lecture" />
        </div>
    );
}
