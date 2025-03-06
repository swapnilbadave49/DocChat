"use client";

import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@nextui-org/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import PDFCard from "@/components/pdfcard/PDFCard";
import MicIcon from "@mui/icons-material/Mic";
import axios from "axios";
import { message } from "antd";
import { Separator } from "@/components/ui/separator";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useAppContext } from "@/state/appState";
import { extractFileNameFromPath } from "@/lib/utils";

function Documents() {
    const [isListening, setIsListening] = useState(false);
    const supabase = createClientComponentClient();
    const { state, dispatch } = useAppContext();
    const [docs, setDocs] = useState([]);
    const [currentlySelectedDoc, setCurrentlySelectedDoc] = useState(null);
    const [apiInProgress, setApiInProgress] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [toast, contextHolder] = message.useMessage();
    const [newMessage, setNewMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        setApiInProgress(true);
        const fetchDocs = async () => {
            const { data, error } = await supabase
                .from("pdf")
                .select("*")
                .eq("user_id", state.user_id);
            if (error) {
                console.log(error);
                return;
            }
            setDocs(data);
            setApiInProgress(false);
        };
        fetchDocs();
    }, []);

    useEffect(() => {
        let recognitionInstance;

        const startSpeechRecognition = () => {
            recognitionInstance = new window.webkitSpeechRecognition();
            recognitionInstance.lang = "en-US";

            recognitionInstance.onresult = (event) => {
                const result = event.results[0][0].transcript;
                setNewMessage((prevMessage) => prevMessage + " " + result);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            recognitionInstance.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
            };

            recognitionInstance.start();
            setIsListening(true);
        };

        const stopSpeechRecognition = () => {
            if (recognitionInstance) {
                recognitionInstance.stop();
                setIsListening(false);
            }
        };

        if (isListening) {
            startSpeechRecognition();
        } else if (recognitionInstance) {
            stopSpeechRecognition();
        }

        return () => {
            if (recognitionInstance) {
                stopSpeechRecognition();
            }
        };
    }, [isListening]);

    const handleChatPressed = async (pdf_id, pdf_url, pdf_name) => {
        const user_id = state.user_id;
        setCurrentlySelectedDoc({
            id: pdf_id,
            url: pdf_url,
            name: pdf_name,
        });
        dispatch({
            type: "UPDATE_CURRENT_PDF",
            payload: {
                id: pdf_id,
                url: pdf_url,
                name: pdf_name,
            },
        });
        const { data, error } = await supabase
            .from("message")
            .select("*")
            .eq("pdf_id", pdf_id);

        if (!error) {
            data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            const msgs = data.map((rowData) => {
                return {
                    role: rowData.isModelResponse ? "model" : "user",
                    message: rowData.content,
                    timestamp: rowData.timestamp,
                };
            });
            setChatMessages(msgs);
        }

        try {
            await axios.post("http://localhost:5000/embed", {
                user_id,
                url: pdf_url,
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() !== "") {
            // Update to include the role in the chat message
            const newChatMessage = {
                role: "user",
                message: newMessage,
                timestamp: new Date().toISOString().toLocaleString(),
            };

            const { data, error } = await supabase.from("message").insert({
                user_id: state.user_id,
                pdf_id: currentlySelectedDoc.id,
                content: newMessage,
                isModelResponse: false,
                timestamp: new Date().toISOString().toLocaleString(),
            });

            setChatMessages((prevMessages) => [
                ...prevMessages,
                newChatMessage,
            ]);

            setNewMessage("");

            axios
                .post("http://localhost:5000/search", {
                    user_id: state.user_id,
                    message: newMessage,
                })
                .then(async (res) => {
                    console.log(res);
                    const newChatbotMessage = {
                        role: "bot",
                        message: res.data.completion,
                        timestamp: new Date().toISOString().toLocaleString(),
                    };
                    setChatMessages((prevMessages) => [
                        ...prevMessages,
                        newChatbotMessage,
                    ]);
                    const { data, error } = await supabase
                        .from("message")
                        .insert({
                            user_id: "140eca17-077c-407d-9473-cd7f518fdecd",
                            pdf_id: currentlySelectedDoc.id,
                            content: res.data.completion,
                            isModelResponse: true,
                            timestamp: new Date()
                                .toISOString()
                                .toLocaleString(),
                        });
                });
        }
    };

    const handleRemovePressed = async (pdf_title) => {
        await supabase.from("pdf").delete().eq("title", pdf_title);
        await supabase.storage.from("pdf").remove([pdf_title]);
        setDocs((prevDocs) =>
            prevDocs.filter((doc) => doc.title !== pdf_title)
        );
        toast.open({
            type: "success",
            content: "File deleted!",
        });
    };

    const handleExportPressed = async (note) => {
        console.log("ID: ", state.current_pdf_id);
        console.log("Name: ", state.current_pdf_name);

        const messages = JSON.stringify(chatMessages);
        axios
            .post("http://localhost:5000/search", {
                user_id: state.user_id,
                message: `I have the following JSON of a conversation between me and my LLM. Can you summarize the conversation based on the JSON? Do not mention the user or the model, but summarize the essence of the conversation as a note (which can be directly used in a note taking app).\nRetun the summarized note in Markdown Format with appropriate formatting.\n\nHere's the JSON:\n\n${messages}`,
            })
            .then(async (res) => {
                console.log(res.data);
                if (res.status == 200) {
                    if (note) {
                        const { data, error } = await supabase
                            .from("pdf")
                            .select("exported, note_link")
                            .eq("id", state.current_pdf_id);
                        console.log(data);
                        if (data[0].exported) {
                            router.push(data[0].note_link);
                        } else {
                            axios
                                .post(process.env.NEXT_PUBLIC_NOTE_URL, {
                                    user_id: state.user_id,
                                    content: res.data.completion,
                                })
                                .then(async (res) => {
                                    if (res.status == 201) {
                                        await supabase
                                            .from("pdf")
                                            .update({
                                                exported: true,
                                                note_link: res.data.url,
                                            })
                                            .eq("id", state.current_pdf_id);
                                        router.push(res.data.url);
                                    } else {
                                        console.error("Error:", res.data);
                                        toast.error("Some error occurred");
                                    }
                                });
                        }
                    } else {
                        const blob = new Blob([res.data.completion], {
                            type: "text/markdown",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "conversation.md";
                        a.click();
                    }
                } else {
                    console.error("Error:", res.data);
                    toast.error("Some error occurred");
                }
            });
    };

    return (
        <div className="sm:pt-10 md:p-5 lg:p-5">
            {contextHolder}
            <div className="flex flex-row justify-center">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="min-h-full rounded-lg border"
                >
                    <ResizablePanel defaultSize={50} maxSize={55} minSize={45}>
                        <div className="w-full h-screen overflow-auto p-5 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        Home
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        List of all your uploaded documents.
                                        <br />
                                        Click on that{" "}
                                        <strong>&quot;Chat&quot;</strong> button
                                        to start a conversation or{" "}
                                        <strong>&quot;Download&quot;</strong>{" "}
                                        button to download the file.
                                    </p>
                                </div>
                            </div>
                            <Separator className="my-4 w-full" />
                            <div
                                className={`grid grid-cols-1 sm:grid-cols-2 ${
                                    currentlySelectedDoc
                                        ? "lg:grid-cols-2"
                                        : "lg:grid-cols-4"
                                } items-center`}
                            >
                                {apiInProgress ? (
                                    <div className="items-center justify-center p-5">
                                        <Spinner size="md" />
                                    </div>
                                ) : docs.length === 0 ? (
                                    <p className="text-center text-default-500">
                                        No PDFs uploaded yet
                                    </p>
                                ) : (
                                    docs.map((pdf) => {
                                        return (
                                            <PDFCard
                                                key={pdf.id}
                                                title={extractFileNameFromPath(
                                                    pdf.title
                                                )}
                                                originalTitle={pdf.title}
                                                size="1 MB"
                                                link={pdf.downloadURL}
                                                onChatPressed={async () => {
                                                    await handleChatPressed(
                                                        pdf.id,
                                                        pdf.downloadURL,
                                                        extractFileNameFromPath(
                                                            pdf.title
                                                        )
                                                    );
                                                }}
                                                onRemovePressed={
                                                    handleRemovePressed
                                                }
                                            />
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </ResizablePanel>
                    {currentlySelectedDoc && (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={50}>
                                <div className="flex flex-col sticky bottom-0 top-0 h-[90vh] overflow-auto">
                                    <section className="flex flex-col w-full h-full">
                                        <header className="border-b dark:border-zinc-700 p-4">
                                            <h2 className="text-xl font-bold flex items-center gap-2">
                                                <Avatar className="relative overflow-visible w-10 h-10">
                                                    <span className="absolute right-0 top-0 flex h-3 w-3 rounded-full bg-green-600" />
                                                    <AvatarImage
                                                        alt="User Avatar"
                                                        src="/placeholder-avatar.jpg"
                                                    />
                                                    <AvatarFallback>
                                                        U
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    {state.current_pdf_name}
                                                    <span className="text-xs text-green-600 block">
                                                        Online
                                                    </span>
                                                </div>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline">
                                                            Export
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-80">
                                                        <div className="grid gap-4">
                                                            <div className="space-y-2">
                                                                <h4 className="font-medium leading-none">
                                                                    Export
                                                                    Conversation
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Download the
                                                                    conversation
                                                                    as a
                                                                    markdown
                                                                    file or
                                                                    export it to
                                                                    NoteSync.
                                                                </p>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Button
                                                                    onClick={() =>
                                                                        handleExportPressed(
                                                                            true
                                                                        )
                                                                    }
                                                                >
                                                                    Export
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        handleExportPressed(
                                                                            false
                                                                        )
                                                                    }
                                                                >
                                                                    Download
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </h2>
                                        </header>
                                        <main className="flex-1 overflow-auto p-4">
                                            {chatMessages.map((msg, index) => (
                                                <div
                                                    className={`flex ${
                                                        msg.role === "user"
                                                            ? "justify-end"
                                                            : ""
                                                    } items-end gap-2`}
                                                    key={index}
                                                >
                                                    <div
                                                        className={`relative rounded-lg ${
                                                            msg.role === "user"
                                                                ? "bg-blue-500 text-white"
                                                                : "bg-zinc-200 dark:bg-zinc-700"
                                                        } py-2 px-3 max-w-sm mt-2 shadow-md min-h-fit`}
                                                    >
                                                        <p className="text-sm">
                                                            {msg.message}
                                                        </p>
                                                        <div
                                                            className={`absolute w-3 h-3 ${
                                                                msg.role ===
                                                                "user"
                                                                    ? "bg-blue-500 bottom-0 left-0 ml-2"
                                                                    : "bg-zinc-200 dark:bg-zinc-700 bottom-0 right-0 mr-2"
                                                            }`}
                                                            style={{
                                                                clipPath:
                                                                    "polygon(0 0, 0 100%, 100% 0)",
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </main>
                                        <footer className="border-t dark:border-zinc-700 p-4">
                                            <div className="flex items-center gap-2">
                                                <IconButton
                                                    style={{
                                                        padding: "20px",
                                                        margin: "10px",
                                                    }}
                                                    onClick={() =>
                                                        setIsListening(
                                                            (prev) => !prev
                                                        )
                                                    }
                                                >
                                                    <MicIcon />
                                                </IconButton>
                                                <Input
                                                    className="flex-1"
                                                    placeholder="Type a message..."
                                                    value={newMessage}
                                                    onChange={(e) =>
                                                        setNewMessage(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    onClick={handleSendMessage}
                                                >
                                                    Send
                                                </Button>
                                            </div>
                                        </footer>
                                    </section>
                                </div>
                            </ResizablePanel>{" "}
                        </>
                    )}
                </ResizablePanelGroup>
            </div>
        </div>
    );
}

export default Documents;
