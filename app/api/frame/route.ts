import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedTip, generateTipId } from '@/lib/utils';
import { saveDailyTip, getUserByFarcasterId, linkFarcasterUser, saveUser } from '@/lib/database';
import { User } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData } = body;

    if (!untrustedData) {
      return NextResponse.json({ error: 'Invalid frame data' }, { status: 400 });
    }

    const { fid, buttonIndex, inputText } = untrustedData;

    // Handle different frame actions
    switch (buttonIndex) {
      case 1: // Get Today's Tip
        return await handleGetTip(fid);
      case 2: // Mark as Done
        return await handleMarkDone(fid);
      case 3: // Get New Tip
        return await handleGetNewTip(fid);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleGetTip(fid: number) {
  try {
    // Check if user exists
    let user = await getUserByFarcasterId(fid.toString());

    if (!user) {
      // Create new user from frame interaction
      const newUser: User = {
        userId: `farcaster_${fid}`,
        statedGoal: 'Personal growth and development', // Default goal
        niche: 'productivity', // Default niche
        onboardingComplete: true,
        notificationPreferences: {
          enabled: true,
          time: '09:00'
        },
        createdAt: new Date()
      };

      await saveUser(newUser);
      await linkFarcasterUser(fid.toString(), newUser.userId);
      user = newUser;
    }

    // Generate or get today's tip
    const today = new Date().toDateString();
    const tipId = `tip_${fid}_${today}`;

    // For demo, generate a new tip each time
    const tipData = await generatePersonalizedTip(
      user.statedGoal,
      user.niche,
      'intermediate'
    );

    const tip = {
      tipId,
      content: tipData.content,
      niche: user.niche,
      actionItems: tipData.actionItems,
      generatedAt: new Date(),
      difficulty: 'intermediate' as const
    };

    await saveDailyTip(tip);

    // Return frame response
    const frameResponse = {
      frames: [
        {
          version: 'vNext',
          image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?tipId=${tipId}`,
          buttons: [
            {
              label: 'Mark as Done ✅',
              action: 'post',
              target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame`
            },
            {
              label: 'Get New Tip 🔄',
              action: 'post',
              target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame`
            }
          ],
          input: {
            text: 'Optional notes...'
          },
          state: {
            tipId,
            fid,
            action: 'view'
          }
        }
      ]
    };

    return NextResponse.json(frameResponse);
  } catch (error) {
    console.error('Error handling get tip:', error);
    return NextResponse.json({ error: 'Failed to generate tip' }, { status: 500 });
  }
}

async function handleMarkDone(fid: number) {
  // In a real implementation, this would log the completion
  // For now, just return a success frame
  const frameResponse = {
    frames: [
      {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image?completed=true`,
        buttons: [
          {
            label: 'Get New Tip 🔄',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame`
          }
        ],
        state: {
          fid,
          action: 'completed'
        }
      }
    ]
  };

  return NextResponse.json(frameResponse);
}

async function handleGetNewTip(fid: number) {
  // Similar to handleGetTip but forces a new tip
  return await handleGetTip(fid);
}

export async function GET() {
  // Return initial frame
  const frameResponse = {
    frames: [
      {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image`,
        buttons: [
          {
            label: 'Get Today\'s Tip 💡',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame`
          }
        ],
        state: {
          action: 'initial'
        }
      }
    ]
  };

  return NextResponse.json(frameResponse);
}

