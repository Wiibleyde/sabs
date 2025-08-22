import { NextRequest, NextResponse } from "next/server";

const currentGame = {
    number: "1",
    name: "Chacun pour soi",
}

export async function GET(): Promise<NextResponse> {
    return NextResponse.json(currentGame);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    if (!body.number || !body.name) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    currentGame.number = body.number;
    currentGame.name = body.name;
    return NextResponse.json(currentGame);
}