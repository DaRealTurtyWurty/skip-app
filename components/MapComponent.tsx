"use client";

import {useEffect, useMemo, useState} from "react";
import dynamic from "next/dynamic";

export interface Coordinates {
    latitude: number,
    longitude: number
}

interface LocationData {
    position: Coordinates,
    isFallback: boolean
}

async function requestLocationData(): Promise<Coordinates> {
    return await fetch("/api/get_location", {}).then(response => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error("Unable to determine location");
        }
    });
}

function requestGeoLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve({latitude: position.coords.latitude, longitude: position.coords.longitude}),
            error => reject(error)
        );
    });
}

export async function getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
        const isGeolocationAvailable = global.navigator !== undefined && 'geolocation' in navigator;

        if(isGeolocationAvailable) {
            requestGeoLocation().then(position => {
                resolve({position, isFallback: false});
            }).catch(() => {
                requestLocationData().then(position => {
                    resolve({position, isFallback: true});
                });
            });
        } else {
            requestLocationData().then(position => {
                resolve({position, isFallback: true});
            }).catch(() => {
                // reject("Unable to determine location"); TODO: Re-enable this line
                resolve({position: {latitude: 50.7883, longitude: 0.2817}, isFallback: true});
            });
        }
    });
}

export type SkipObject = {
    id: number
    name: string
    description: string | undefined
    createdAt: string
    updatedAt: string
    images: string
    taken: boolean
    takenQuantity: number
    quantityMin: number
    quantityMax: number
    latitude: number
    longitude: number
}

async function fetchObjects() : Promise<SkipObject[]> {
    return await fetch("/api/list_objects", {}).then(response => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error("Unable to fetch objects");
        }
    });
}

export type SkipMarker = {
    position: Coordinates,
    title: string,
    description: string,
    data: SkipObject
}

export default function Map() {
    const [markers, setMarkers] = useState<SkipMarker[]>([]);
    useEffect(() => {
        fetchObjects().then((data: SkipObject[]) => {
            console.log(data);

            if(!('map' in data))
                return;

            setMarkers(data.map(marker => (
                {
                    position: {latitude: marker.latitude, longitude: marker.longitude},
                    title: marker.name,
                    description: marker.description || "",
                    data: marker
                })
            ));
        }).catch(error => {
            console.error(error);
        });
    }, []);

    const Map = useMemo(() => dynamic(
        () => import("@/components/StreetMap"),
        {
            loading: () => <p>Loading...</p>,
            ssr: false
        }
    ), []);

    const [location, setLocation] = useState<Coordinates | null>(null);
    const [isFallback, setIsFallback] = useState<boolean>(false);

    useEffect(() => {
        getCurrentLocation().then(data => {
            setLocation(data.position);
            setIsFallback(data.isFallback);

            console.log(data);
        });
    }, []);

    return <Map
        markers={markers}
        center={location || {latitude: 50.7883, longitude: 0.2817}}
        zoom={13}
    />
}