import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { getDailyTip } from '@/lib/database';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipId = searchParams.get('tipId');
    const completed = searchParams.get('completed');

    let content = 'Welcome to Совет Дня!';
    let subtitle = 'Your daily dose of personalized wisdom';
    let actionItems: string[] = [];

    if (completed === 'true') {
      content = 'Great job! 🎉';
      subtitle = 'You\'ve completed today\'s action. Keep up the momentum!';
    } else if (tipId) {
      // Try to get tip from database
      try {
        const tip = await getDailyTip(tipId);
        if (tip) {
          content = tip.content;
          subtitle = `Daily tip for ${tip.niche.replace('-', ' ')}`;
          actionItems = tip.actionItems.slice(0, 2); // Show first 2 actions
        }
      } catch (error) {
        console.error('Error fetching tip:', error);
      }
    }

    // Create the image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f0f23',
            backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a2e 0%, #0f0f23 50%, #0a0a14 100%)',
            fontSize: 32,
            color: 'white',
            padding: '40px',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#ff6b6b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
                fontSize: '24px',
              }}
            >
              💡
            </div>
            <div>
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  margin: '0',
                  color: '#ff6b6b',
                }}
              >
                Совет Дня
              </h1>
              <p
                style={{
                  fontSize: '18px',
                  margin: '0',
                  color: '#cccccc',
                }}
              >
                {subtitle}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              textAlign: 'center',
              maxWidth: '600px',
              marginBottom: '30px',
            }}
          >
            <p
              style={{
                fontSize: '28px',
                lineHeight: '1.4',
                margin: '0',
                color: '#ffffff',
              }}
            >
              {content}
            </p>
          </div>

          {/* Action Items */}
          {actionItems.length > 0 && (
            <div
              style={{
                width: '100%',
                maxWidth: '500px',
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  color: '#ff6b6b',
                }}
              >
                Action Items:
              </h3>
              {actionItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                    fontSize: '18px',
                    color: '#cccccc',
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#ff6b6b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      fontSize: '14px',
                      color: 'white',
                    }}
                  >
                    {index + 1}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              fontSize: '14px',
              color: '#666666',
            }}
          >
            Powered by Base • Built for your success
          </div>
        </div>
      ),
      {
        width: 800,
        height: 600,
      }
    );
  } catch (error) {
    console.error('Error generating frame image:', error);

    // Return fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f0f23',
            fontSize: 32,
            color: 'white',
          }}
        >
          <h1 style={{ color: '#ff6b6b' }}>Совет Дня</h1>
          <p>Your daily dose of wisdom</p>
        </div>
      ),
      {
        width: 800,
        height: 600,
      }
    );
  }
}

