import axios from "axios";

interface RTMPConnectionResponse {
    itemCount: number;
    pageCount: number;
    items: RTMPConnectionItem[];
}

export interface RTMPConnectionItem {
    id: string;
    created: string;
    // remoteAddr: string; // Volontary commented out to avoid exposing sensitive information
    state: string;
    path: string;
    query: string;
    bytesReceived: number;
    bytesSent: number;
}

export class MediaMTX {
    private url: string;
    private username: string;
    private password: string;

    constructor(url: string, username: string, password: string) {
        this.url = url;
        this.username = username;
        this.password = password;
    }

    // /v3/rtmpconns/list
    private async listConnections(): Promise<RTMPConnectionResponse> {
        const response = await axios.get(`${this.url}/v3/rtmpconns/list`, {
            auth: {
                username: this.username,
                password: this.password,
            },
        });
        return response.data;
    }

    public async getActiveStreamConnections(): Promise<RTMPConnectionItem[]> {
        try {
            const data = await this.listConnections();
            // Sort the items by path and filter by state 'publish'
            const activeConnections = data.items
                .filter(item => item.state === 'publish')
                .sort((a, b) => a.path.localeCompare(b.path));
            return activeConnections;
        } catch (error) {
            console.error('Erreur lors de la récupération des connexions RTMP:', error);
            throw error;
        }
    }

    public async getActiveReadConnections(): Promise<RTMPConnectionItem[]> {
        try {
            const data = await this.listConnections();
            // Sort the items by path and filter by state 'read'
            const activeConnections = data.items
                .filter(item => item.state === 'read')
                .sort((a, b) => a.path.localeCompare(b.path));
            return activeConnections;
        } catch (error) {
            console.error('Erreur lors de la récupération des connexions RTMP:', error);
            throw error;
        }
    }
}