import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardFooter,
    CardDescription,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { X } from "lucide-react";

import { Image, Link } from "@nextui-org/react";

interface PdfCardProps {
    title: string;
    originalTitle: string;
    size: string;
    link: string;
    onChatPressed: () => void;
    onRemovePressed: (pdf_title: string) => void;
}

const Component: React.FC<PdfCardProps> = ({
    title = "Sample PDF",
    originalTitle = "Sample PDF",
    size = "1.1 MB",
    link = "/",
    onChatPressed,
    onRemovePressed,
}) => {
    return (
        <Card className="max-w-xs m-2 relative">
            {" "}
            <Button
                className="absolute top-0 right-0 m-2 bg-red-500 rounded-full hover:bg-red-700"
                onClick={() => onRemovePressed(originalTitle)}
                style={{ width: "30px", height: "30px" }}
            >
                <X color="white" height="30px" />
            </Button>
            <div className="flex items-center gap-4 p-6">
                <Image
                    alt="Image"
                    className="rounded-full border"
                    height="80"
                    src="https://poainc.org/wp-content/uploads/2018/06/pdf-placeholder.png"
                    style={{
                        aspectRatio: "80/80",
                        objectFit: "cover",
                    }}
                    width="80"
                />
                <div className="grid gap-1.5">
                    <h2 className="text-lg font-bold tracking-wide">{title}</h2>
                    <p className="text-sm text-gray-500">{size}</p>
                </div>
            </div>
            <CardFooter className="border-t p-6 grid gap-2">
                <Button size="sm" onClick={onChatPressed}>
                    Chat
                </Button>

                <Button size="sm">
                    <Link isExternal href={link}>
                        <p className="text-white text-sm">Download</p>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Component;
