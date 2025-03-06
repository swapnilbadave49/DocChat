"use client";

import FileUpload from "@/components/FileUpload";
import { Separator } from "@/components/ui/separator";

export default function Home() {
    return (
        <div className="m-5 rounded-lg border">
            <div className="flex justify-center">
                <div className="w-full p-5 space-y-5 items-center">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Upload Files
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Upload files to start a conversation with them.
                            </p>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <FileUpload />
                </div>
            </div>
        </div>
    );
}
