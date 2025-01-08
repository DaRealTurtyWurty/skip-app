import database from "@/database";
import {NextResponse} from "next/server";

function slightlyOffsetCoordinate(coordinate: number): number {
    const offset = Math.random() * 0.0005;
    return coordinate + offset;
}

export async function POST(req: Request) {
    console.log("POST /api/add_object");

    const { responseData } : { responseData: { name: string, description: string, images: string[], coords: { latitude: number, longitude: number } } } = await req.json();
    console.log(responseData);

    if(!responseData)
        return NextResponse.json({error: "Invalid request"}, {status: 400});

    if (!responseData.name)
        return NextResponse.json({error: "Name is required"}, {status: 400});

    if(responseData.images && !Array.isArray(responseData.images)) {
        return NextResponse.json({error: "Images must be an array"}, {status: 400});
    } else if(responseData.images.length > 5) {
        return NextResponse.json({error: "Too many files"}, {status: 400});
    }

    const imagesStr: string = responseData.images ? responseData.images.join(",").toString() : "";

    // Save object to database
    await database.skipObject.create({
        data: {
            name: responseData.name,
            description: responseData.description,
            images: imagesStr,
            latitude: slightlyOffsetCoordinate(responseData.coords.latitude),
            longitude: slightlyOffsetCoordinate(responseData.coords.longitude)
        }
    });

    return NextResponse.json({success: true});
}