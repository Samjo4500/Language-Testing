import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';
import { seedCommunity } from '@/lib/seed-community';

// Default rooms to seed if they don't exist
const DEFAULT_ROOMS = [
  {
    name: 'Global English Chat',
    slug: 'global',
    description: 'Chat with English learners from around the world. All levels welcome!',
    language: 'multilingual',
    levelRange: 'all',
    isPublic: true,
  },
  {
    name: 'Beginners Corner',
    slug: 'beginners',
    description: 'A safe space for A1-A2 learners to practice basic English.',
    language: 'en',
    levelRange: 'A1-A2',
    isPublic: true,
  },
  {
    name: 'Intermediate Lounge',
    slug: 'intermediate',
    description: 'Practice conversational English at B1-B2 level.',
    language: 'en',
    levelRange: 'B1-B2',
    isPublic: true,
  },
  {
    name: 'Advanced Speakers',
    slug: 'advanced',
    description: 'For C1-C2 learners to discuss complex topics in English.',
    language: 'en',
    levelRange: 'C1-C2',
    isPublic: true,
  },
  {
    name: 'Study Partners',
    slug: 'study-partners',
    description: 'Find study buddies and organize group study sessions.',
    language: 'multilingual',
    levelRange: 'all',
    isPublic: true,
  },
];

async function ensureDefaultRooms() {
  for (const room of DEFAULT_ROOMS) {
    await db.chatRoom.upsert({
      where: { slug: room.slug },
      update: {},
      create: room,
    });
  }
}

// Track whether we've already checked for auto-seed (in-memory flag)
let autoSeedChecked = false;

// GET: List all public chatrooms
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure default rooms exist
    await ensureDefaultRooms();

    // Auto-seed: if rooms have 0 messages, seed the community (run once per server lifecycle)
    // Disabled in production — seed data should not be auto-created in live environments
    if (!autoSeedChecked && process.env.NODE_ENV !== 'production') {
      autoSeedChecked = true;
      try {
        const totalMessages = await db.chatRoomMessage.count({ where: { isDeleted: false } });
        if (totalMessages === 0) {
          // Run seed in background — don't block the response
          seedCommunity().catch((err) => {
            console.error('Auto-seed community failed:', err);
          });
        }
      } catch (err) {
        console.error('Auto-seed check failed:', err);
      }
    }

    const rooms = await db.chatRoom.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { messages: { where: { isDeleted: false } } },
        },
      },
    });

    return NextResponse.json({
      rooms: rooms.map((room) => ({
        id: room.id,
        name: room.name,
        slug: room.slug,
        description: room.description,
        language: room.language,
        levelRange: room.levelRange,
        imageUrl: room.imageUrl,
        isPublic: room.isPublic,
        messageCount: room._count.messages,
        createdAt: room.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get chatrooms error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST: Create a chatroom (admin only for now)
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, description, language, levelRange, imageUrl, isPublic, maxMembers } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 });
    }

    const existing = await db.chatRoom.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A room with this slug already exists.' }, { status: 409 });
    }

    const room = await db.chatRoom.create({
      data: {
        name,
        slug,
        description: description || null,
        language: language || null,
        levelRange: levelRange || null,
        imageUrl: imageUrl || null,
        isPublic: isPublic !== undefined ? isPublic : true,
        maxMembers: maxMembers || 0,
      },
    });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    console.error('Create chatroom error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
