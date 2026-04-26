import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    let code = "print('Hello Vibe Coding!')";
    if (id) {
       const { data, error } = await supabase.from('snippets').select('code').eq('id', id).single();
       if (data && !error) code = data.code;
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            color: '#ffffff',
            padding: '80px',
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bolder',
              color: '#ccff00',
              marginBottom: 40,
              display: 'flex',
              letterSpacing: '-0.05em'
            }}
          >
            Universal Code Runner
          </div>
          <div
            style={{
              display: 'flex',
              padding: '40px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255,255,255,0.03)',
              fontSize: 36,
              lineHeight: 1.5,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
              maxHeight: '380px',
              width: '100%',
              boxShadow: '0 0 40px rgba(204,255,0,0.05)'
            }}
          >
            {code.length > 250 ? code.slice(0, 250) + '\n...' : code}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    return new Response(`Failed to generate preview image`, {
      status: 500,
    });
  }
}
