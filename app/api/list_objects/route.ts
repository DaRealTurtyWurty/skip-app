import database from '@/database';

export async function GET() {
    const dbResponse = await database.skipObject.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            images: true,
            taken: true,
            takenQuantity: true,
            quantityMin: true,
            quantityMax: true,
            latitude: true,
            longitude: true
        }
    });

    return Response.json(dbResponse);
}