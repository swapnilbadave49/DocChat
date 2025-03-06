"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/state/appState";
import { clearLocalStorage } from "@/config/hooks/localStorageControl";
import { Home, Upload } from "lucide-react";

import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { message } from "antd";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const supabase = createClientComponentClient();
    const { dispatch } = useAppContext();
    const [toast, contextHolder] = message.useMessage();
    const router = useRouter();

    const [selectedButton, setSelectedButton] = useState("Documents");

    const handleSidebarButtonClick = (buttonName: string) => {
        setSelectedButton(buttonName);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        dispatch({ type: "RESET_APP_STATE" });
        clearLocalStorage();
        router.replace("/");
    };

    const sidebarLinks: Record<string, any> = {
        Home: { route: "/home", icon: <Home size={15} /> },
        Upload: { route: "/upload", icon: <Upload size={15} /> },
    };

    return (
        <div className="fixed">
            {/* Menu */}
            {contextHolder}
            <Menubar className="rounded-none border-b border-none px-2 py-7 lg:px-4">
                <MenubarMenu>
                    <MenubarTrigger className="font-bold text-xl outline-dashed outline-green-600">
                        PageTalk
                    </MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onClick={() => toast.success("Hello")}>
                            About Us
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarSeparator />
                        <MenubarShortcut />
                        <MenubarItem
                            className="bg-red-100 focus:bg-red-200"
                            onClick={handleLogout}
                        >
                            Logout <MenubarShortcut>⌘Q</MenubarShortcut>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                {/* <MenubarMenu>
                    <MenubarTrigger className="relative">File</MenubarTrigger>
                    <MenubarContent>
                        <MenubarSub>
                            <MenubarSubTrigger>New</MenubarSubTrigger>
                            <MenubarSubContent className="w-[230px]">
                                <MenubarItem>
                                    Playlist{" "}
                                    <MenubarShortcut>⌘N</MenubarShortcut>
                                </MenubarItem>
                                <MenubarItem disabled>
                                    Playlist from Selection{" "}
                                    <MenubarShortcut>⇧⌘N</MenubarShortcut>
                                </MenubarItem>
                                <MenubarItem>
                                    Smart Playlist...{" "}
                                    <MenubarShortcut>⌥⌘N</MenubarShortcut>
                                </MenubarItem>
                                <MenubarItem>Playlist Folder</MenubarItem>
                                <MenubarItem disabled>
                                    Genius Playlist
                                </MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarItem>
                            Open Stream URL...{" "}
                            <MenubarShortcut>⌘U</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            Close Window <MenubarShortcut>⌘W</MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarSub>
                            <MenubarSubTrigger>Library</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem>Update Cloud Library</MenubarItem>
                                <MenubarItem>Update Genius</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem>Organize Library...</MenubarItem>
                                <MenubarItem>Export Library...</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem>Import Playlist...</MenubarItem>
                                <MenubarItem disabled>
                                    Export Playlist...
                                </MenubarItem>
                                <MenubarItem>Show Duplicate Items</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem>Get Album Artwork</MenubarItem>
                                <MenubarItem disabled>
                                    Get Track Names
                                </MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarItem>
                            Import... <MenubarShortcut>⌘O</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled>
                            Burn Playlist to Disc...
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>
                            Show in Finder{" "}
                            <MenubarShortcut>⇧⌘R</MenubarShortcut>{" "}
                        </MenubarItem>
                        <MenubarItem>Convert</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Page Setup...</MenubarItem>
                        <MenubarItem disabled>
                            Print... <MenubarShortcut>⌘P</MenubarShortcut>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Edit</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem disabled>
                            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled>
                            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem disabled>
                            Cut <MenubarShortcut>⌘X</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled>
                            Copy <MenubarShortcut>⌘C</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled>
                            Paste <MenubarShortcut>⌘V</MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>
                            Select All <MenubarShortcut>⌘A</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled>
                            Deselect All <MenubarShortcut>⇧⌘A</MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>
                            Smart Dictation...{" "}
                            <MenubarShortcut>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                                    <circle cx="17" cy="7" r="5" />
                                </svg>
                            </MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            Emoji & Symbols{" "}
                            <MenubarShortcut>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                            </MenubarShortcut>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>View</MenubarTrigger>
                    <MenubarContent>
                        <MenubarCheckboxItem>
                            Show Playing Next
                        </MenubarCheckboxItem>
                        <MenubarCheckboxItem checked>
                            Show Lyrics
                        </MenubarCheckboxItem>
                        <MenubarSeparator />
                        <MenubarItem inset disabled>
                            Show Status Bar
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem inset>Hide Sidebar</MenubarItem>
                        <MenubarItem disabled inset>
                            Enter Full Screen
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu> */}
            </Menubar>

            <div className="border-t">
                <div className="bg-background">
                    <div className="grid sm:grid-cols-3 lg:grid-cols-5">
                        {/* Sidebar */}
                        <div className="pb-12">
                            <div className="space-y-4 py-4">
                                <div className="px-3 py-2">
                                    <h2 className="mb-2 px-4 text-xl font-bold tracking-tight">
                                        Discover
                                    </h2>
                                    {Object.keys(sidebarLinks).map(
                                        (buttonName) => (
                                            <Link
                                                href={
                                                    sidebarLinks[buttonName]
                                                        .route
                                                }
                                                key={buttonName}
                                            >
                                                <Button
                                                    key={buttonName}
                                                    variant={
                                                        buttonName ===
                                                        selectedButton
                                                            ? "secondary"
                                                            : "ghost"
                                                    }
                                                    className="w-full justify-start"
                                                    onClick={() => {
                                                        handleSidebarButtonClick(
                                                            buttonName
                                                        );
                                                    }}
                                                >
                                                    <span className="px-3">
                                                        {
                                                            sidebarLinks[
                                                                buttonName
                                                            ].icon
                                                        }
                                                    </span>
                                                    {buttonName}
                                                </Button>
                                            </Link>
                                        )
                                    )}
                                </div>
                                <Separator className="" />

                                {/* <div className="py-2">
                                    <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                                        Recent Chats
                                    </h2>
                                    <ScrollArea className="h-[300px] px-1">
                                        <div className="space-y-1 p-2">
                                            {playlists?.map((playlist, i) => (
                                                <Button
                                                    key={`${playlist}-${i}`}
                                                    variant="ghost"
                                                    className="w-full justify-start font-normal"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="mr-2 h-4 w-4"
                                                    >
                                                        <path d="M21 15V6" />
                                                        <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                                                        <path d="M12 12H3" />
                                                        <path d="M16 6H3" />
                                                        <path d="M12 18H3" />
                                                    </svg>
                                                    {playlist}
                                                </Button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div> */}
                            </div>
                        </div>

                        {/* Main */}
                        <div className="col-span-3 lg:col-span-4 lg:border-l">
                            <div>{children}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
