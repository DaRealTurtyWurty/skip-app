export const dynamic = 'force-static';

export async function GET() {
    const data = await fetch("https://ipapi.co/json/", {
        next: {revalidate: 3600},
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async response => {
        try {
            return await response.json();
        } catch {
            return {latitude: 0, longitude: 0};
        }
    })

    return Response.json(data);
}