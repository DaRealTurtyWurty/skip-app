"use client";

import React, {useRef, useCallback, useState} from "react";
import {FileError, useDropzone} from "react-dropzone";
import {getCurrentLocation} from "@/components/MapComponent";

function openAddObjectDialog(ref: React.RefObject<any>) {
    if (ref.current && ref.current instanceof HTMLDialogElement) {
        ref.current.showModal();
    }
}

export default function AddObjectButton() {
    const modal: React.RefObject<any> = useRef(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<string[]>([]);

    const addImage = (image: string) => {
        setImages(prevImages => [...prevImages, image]);
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file: File) => {
            const reader = new FileReader();
            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = () => {
                const binaryStr = reader.result;
                if (typeof binaryStr === "string") {
                    addImage(btoa(binaryStr));
                } else {
                    const bytes = new Uint8Array(binaryStr as ArrayBuffer);
                    const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
                    addImage(btoa(binary));
                }
            };

            reader.readAsArrayBuffer(file);
        });
    }, []);

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpeg"],
            "image/png": [".png"]
        },
        maxFiles: 5,
        validator: (file: File): FileError | null => {
            if (file.size > 1024 * 1024) {
                return {code: "file-too-large", message: "File is too large"};
            }

            if (images.length >= 5) {
                return {code: "too-many-files", message: "Too many files"};
            }

            return null;
        }
    });

    return <>
        <button className="bg-blue-500 text-white p-2 rounded mt-4" onClick={() => openAddObjectDialog(modal)}>
            Add Object
        </button>

        <dialog className="bg-white p-4 rounded shadow-md text-center" open={false} ref={modal}>
            <h2 className="text-xl font-semibold mb-2">Add Object</h2>
            <form className="flex flex-col">
                <label htmlFor="name" className="text-left">Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" id="name" className="p-2 rounded border mb-2" required
                       onChange={(e) => setName(e.target.value)}/>

                <label htmlFor="description" className="text-left">Description</label>
                <textarea name="description" id="description" className="p-2 rounded border h-24 mb-2"
                          onChange={(e) => setDescription(e.target.value)}/>

                <label htmlFor="image" className="text-left">Images</label>
                <div {...getRootProps()} className="p-4 border-dashed border-gray-200 border-2 rounded">
                    <input {...getInputProps()} />
                    {images.length === 0 ? (
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    ) : (
                        <ul className="flex flex-wrap justify-center gap-4">
                            {images.map((image, index) => (
                                <li key={index}>
                                    <img
                                        src={`data:image/jpeg;base64,${image}`}
                                        width={100}
                                        height={100}
                                        alt={`Image ${index}`}
                                        className="rounded border border-gray-300 shadow-md p-1"
                                    />
                                </li>
                            ))}
                        </ul>)}
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded mt-4"
                    onClick={async (e) => {
                        e.preventDefault();
                        if (!name) {
                            alert("Name is required");
                            return;
                        }

                        fetch("/api/add_object", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                responseData: {
                                    name,
                                    description,
                                    images,
                                    coords: await getCurrentLocation().then(location => {
                                        return {
                                            latitude: location.position.latitude,
                                            longitude: location.position.longitude
                                        }
                                    })
                                }
                            })
                        }).then(response => {
                            if (response.ok) {
                                alert("Object added successfully");
                                modal.current.close();
                            } else {
                                alert("Failed to add object");
                            }
                        });
                    }}
                >Add Object
                </button>
            </form>
        </dialog>
    </>
}