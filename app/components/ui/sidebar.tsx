export default function Sidebar() {
    return (
        <div className="fixed top-0 left-0 w-64 h-screen bg-gray-800 text-white p-4">
            <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
            <ul className="space-y-2">
                <li>
                    <a href="#" className="block p-2 hover:bg-gray-700 rounded">
                        Dashboard
                    </a>
                </li>
                <li>
                    <a href="#" className="block p-2 hover:bg-gray-700 rounded">
                        Settings
                    </a>
                </li>
                <li>
                    <a href="#" className="block p-2 hover:bg-gray-700 rounded">
                        Profile
                    </a>
                </li>
                <li>
                    <a href="#" className="block p-2 hover:bg-gray-700 rounded">
                        Logout
                    </a>
                </li>
            </ul>
        </div>
    )
}