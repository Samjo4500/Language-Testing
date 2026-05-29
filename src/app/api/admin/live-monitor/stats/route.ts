import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/db';
import { listRooms as listLiveKitRooms, listRecordings } from '@/lib/livekit';

/**
 * GET /api/admin/live-monitor/stats
 *
 * Get analytics stats for the live monitor dashboard.
 * Admin only.
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    // Today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Total rooms created today
    const totalRoomsToday = await db.liveRoom.count({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // Peak concurrent users today (maxConcurrent is tracked)
    const peakResult = await db.liveRoom.aggregate({
      _max: { maxConcurrent: true },
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // Also check current live rooms for real-time peak
    let livekitRooms: any[] = [];
    let currentOnline = 0;
    try {
      livekitRooms = await listLiveKitRooms();
      currentOnline = livekitRooms.reduce(
        (sum: number, r: any) => sum + (r.numParticipants || 0),
        0,
      );
    } catch { /* continue without */ }

    const peakConcurrent = Math.max(
      peakResult._max.maxConcurrent || 0,
      currentOnline,
    );

    // Average room duration (ended rooms with duration data)
    const endedRooms = await db.liveRoom.findMany({
      where: {
        status: 'ended',
        endedAt: { not: null },
      },
      select: {
        createdAt: true,
        endedAt: true,
      },
      take: 100,
    });

    let avgDurationMinutes = 0;
    if (endedRooms.length > 0) {
      const totalMinutes = endedRooms.reduce((sum, room) => {
        if (room.endedAt && room.createdAt) {
          return sum + (room.endedAt.getTime() - room.createdAt.getTime()) / 60000;
        }
        return sum;
      }, 0);
      avgDurationMinutes = Math.round(totalMinutes / endedRooms.length);
    }

    // Total recordings
    let totalRecordings = 0;
    try {
      const recordings = await listRecordings();
      totalRecordings = Array.isArray(recordings) ? recordings.length : 0;
    } catch { /* continue without */ }

    // Also count DB rooms with isRecording
    const recordedRooms = await db.liveRoom.count({
      where: { isRecording: true },
    });
    totalRecordings = Math.max(totalRecordings, recordedRooms);

    // Room type distribution
    const roomTypeDistribution = await db.liveRoom.groupBy({
      by: ['type'],
      _count: { type: true },
      orderBy: { _count: { type: 'desc' } },
    });

    // CEFR level distribution of participants
    const cefrLevelDistribution = await db.liveRoom.groupBy({
      by: ['cefrLevel'],
      _count: { cefrLevel: true },
      orderBy: { _count: { cefrLevel: 'desc' } },
    });

    // Active rooms now
    const activeRooms = await db.liveRoom.count({
      where: { status: 'active' },
    });

    // Total participants currently
    const totalParticipantsNow = await db.liveRoomParticipant.count({
      where: { leftAt: null },
    });

    return NextResponse.json({
      totalRoomsToday,
      peakConcurrent,
      avgDurationMinutes,
      totalRecordings,
      activeRooms,
      currentOnline,
      totalParticipantsNow,
      roomTypeDistribution: roomTypeDistribution.map((r) => ({
        type: r.type,
        count: r._count.type,
      })),
      cefrLevelDistribution: cefrLevelDistribution.map((r) => ({
        level: r.cefrLevel || 'Unspecified',
        count: r._count.cefrLevel,
      })),
    });
  } catch (error) {
    console.error('[Live Monitor Stats Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats.' },
      { status: 500 },
    );
  }
}
