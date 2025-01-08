import MapComponent from '@/components/MapComponent'
import AddObjectButton from "@/components/AddObjectButton";

export default function Home() {
    return <>
        <header className="bg-gray-800 text-white p-4 text-center text-xl font-semibold">
            <h1 className="text-3xl font-bold text-white mb-2">
                Skip App
            </h1>
            <p className="text-md text-gray-300">
                A web application to share, map and find materials and household goods
                found in skips or offered for free collection in the street
            </p>
        </header>

        <main className="p-4 text-gray-800 bg-gray-100 min-h-screen">
            <MapComponent/>
            <AddObjectButton/>
        </main>

        <footer className="bg-gray-900 text-gray-400 p-4 text-sm text-center">
            <p>All rights reserved &copy; 2024-present</p>
        </footer>
    </>
}
