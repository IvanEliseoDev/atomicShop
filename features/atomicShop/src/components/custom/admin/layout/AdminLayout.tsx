
import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "../../sidebar/Sidebar";
import { Header } from "../../header/Header";

export const AdminLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isMobileOpen={isMobileMenuOpen}
                onMobileClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden w-full">
                {/* Header */}
                <Header onMobileMenuClick={() => setIsMobileMenuOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
