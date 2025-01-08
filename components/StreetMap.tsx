"use client";

import {MapContainer, Marker, TileLayer, Tooltip} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import {Coordinates, SkipMarker, SkipObject} from "@/components/MapComponent";
import {useRef, useState} from "react";

export interface MapProperties {
    markers: SkipMarker[],
    center: Coordinates,
    zoom: number | 13
}

function getMinPossibleLeft(object: SkipObject): number {
    return (object?.quantityMin || 1) - (object?.takenQuantity || 0);
}

function getMaxPossibleLeft(object: SkipObject): number {
    return (object?.quantityMax || 1) - (object?.takenQuantity || 0);
}

function getAmountLeft(object: SkipObject): string {
    let minPossibleLeft = getMinPossibleLeft(object);
    let maxPossibleLeft = getMaxPossibleLeft(object);
    return minPossibleLeft === maxPossibleLeft ? `${minPossibleLeft} left` : `Between ${minPossibleLeft} - ${maxPossibleLeft} left`;
}

export default function StreetMap(props: MapProperties) {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [selectedObject, setSelectedObject] = useState<SkipObject>();

    return (
        <>
            <MapContainer
                center={[props.center.latitude, props.center.longitude]}
                zoom={props.zoom}
                style={{height: "80vh"}}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                    attribution='Tiles &copy; Esri'
                />
                {props.markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={[marker.position.latitude, marker.position.longitude]}
                        eventHandlers={{
                            click: () => {
                                setSelectedObject(marker.data);
                                modalRef.current?.showModal();
                            }
                        }}
                    >
                        <Tooltip className="bg-white text-black">
                            <p className="font-bold">{marker.title + ` (${getAmountLeft(marker.data)})`}</p>
                            <p>{marker.description}</p>

                            <img
                                src={`data:image/jpeg;base64,${marker.data.images.split(",")[0]}`}
                                alt={marker.title}
                                className="h-auto rounded-lg shadow-md object-cover object-center"
                                width={200}
                                height={200}
                            />
                        </Tooltip>
                    </Marker>
                ))}
            </MapContainer>
            <dialog ref={modalRef} open={false}>
                <div className="rounded-lg p-4 bg-white shadow-md flex justify-center items-center flex-col">
                    <h2 className="text-2xl font-bold">
                        {selectedObject?.name}
                    </h2>
                    <p className="text-gray-600 mb-2">
                        {selectedObject?.description}
                    </p>
                    <p className="text-gray-400">
                        {getAmountLeft(selectedObject!)}
                    </p>
                    <ul className="flex flex-wrap gap-2 justify-center mt-4 mb-4">
                        {selectedObject?.images.split(",").map((image, index) => (
                            <li key={index}>
                                <img
                                    src={`data:image/jpeg;base64,${image}`}
                                    alt={selectedObject?.name}
                                    className="h-auto rounded-lg shadow-md object-cover object-center hover:scale-105 transition-transform cursor-pointer"
                                    width={200}
                                    height={200}
                                />
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => modalRef.current?.close()}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            Mark as taken (WIP)
                        </button>
                        <button
                            onClick={() => modalRef.current?.close()}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                            Close
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    )
}