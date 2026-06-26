import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function POST() {
  const today = new Date().toISOString().split("T")[0];

  const [total, todayViews, lastVisit] = await Promise.all([
    redis.incr("total_views"),
    redis.incr(`views:${today}`),
    redis.get<number>("last_visit"),
  ]);

  await Promise.all([
    redis.set("last_visit", Date.now()),
    redis.expire(`views:${today}`, 172800),
  ]);

  return NextResponse.json({ total, today: todayViews, lastVisit });
}
