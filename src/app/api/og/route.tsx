import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    let snippetName = "Interactive App";
    if (id) {
       const { data, error } = await supabase.from('snippets').select('*').eq('id', id).single();
       if (data && !error) {
         if (data.title) {
            snippetName = data.title;
         } else if (data.code?.includes('<title>')) {
           const match = data.code.match(/<title>(.*?)<\/title>/);
           if (match) snippetName = match[1];
         } else {
           snippetName = `Interactive Tool (ID: ${id.substring(0,4).toUpperCase()})`;
         }
       }
    }

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
            backgroundColor: '#09090b',
            color: '#ffffff',
            padding: '60px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Ambient Glow Effects */}
          <div
            style={{
              position: 'absolute',
              top: '-150px',
              right: '-150px',
              width: '700px',
              height: '700px',
              background: 'radial-gradient(circle, rgba(204,255,0,0.15) 0%, rgba(9,9,11,0) 70%)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-150px',
              left: '-200px',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(204,255,0,0.1) 0%, rgba(9,9,11,0) 70%)',
              borderRadius: '50%',
            }}
          />

          {/* Browser Chrome Window Mockup */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Header / Traffic Lights */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '24px 32px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: 'rgba(255,255,255,0.02)',
              }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
              </div>
            </div>

            {/* Content Area */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                padding: '40px',
              }}
            >
              {/* Sleek Play Button Mock */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '120px',
                  height: '120px',
                  borderRadius: '35px',
                  backgroundColor: '#ccff00',
                  boxShadow: '0 0 45px rgba(204,255,0,0.25)',
                  marginBottom: '40px',
                }}
              >
                <div style={{ fontSize: 64, display: 'flex' }}>▶️</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: 56,
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '20px',
                  letterSpacing: '-0.02em',
                }}
              >
                {snippetName}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 32,
                  color: '#a1a1aa',
                  fontWeight: 500,
                }}
              >
                Click to Launch App
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    return new Response(`Failed to generate preview image`, { status: 500 });
  }
}
