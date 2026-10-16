import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function POST() {
  const today = new Date().toISOString().split("T")[0];

  // 로컬(배포 환경이 아닐 때)은 실제 사이트와 같은 저장소를 쓰므로 숫자를 올리지 않고 읽기만 함
  if (!process.env.VERCEL) {
    const [total, todayViews, lastVisit] = await Promise.all([
      redis.get<number>("total_views"),
      redis.get<number>(`views:${today}`),
      redis.get<number>("last_visit"),
    ]);
    return NextResponse.json({ total: total ?? 0, today: todayViews ?? 0, lastVisit });
  }

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
