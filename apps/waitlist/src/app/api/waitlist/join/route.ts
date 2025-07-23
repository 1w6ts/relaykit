import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    // Add to waitlist (as a Redis list)
    await redis.lpush("waitlist", email);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await redis.llen("waitlist");
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 }
    );
  }
}
