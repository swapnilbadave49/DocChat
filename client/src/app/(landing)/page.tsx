import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "@nextui-org/react";

const LandingPage = () => {
    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center md:justify-start text-center flex-1 px-6">
                <div className="max-x-3xl space-y-4">
                    <h1 className="text-3xl md:text-5xl sm:text-4xl font-bold tracking-tight">
                        Document Reading,{" "}
                        <span className="highlight text-white text">
                            Redefined.
                        </span>
                        <br></br> Welcome to{" "}
                        <span className="hover-2">PageTalk</span>.
                    </h1>
                    <h3 className=" sm:text-xl md:text-xl text-base font-normal tracking-tight">
                        PageTalk is a connected workspace powered by AI where
                        better and faster work happens
                    </h3>
                    <Link href="/login">
                        <Button>
                            Get Started
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                </div>
                <div className="flex flex-col items-center justify-center max-w-5xl">
                    <div className="flex items-center">
                        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]">
                            <Image
                                src="/MessyDoodle_dark.svg"
                                fill
                                className="object-contain dark:hidden"
                                alt="Documents"
                            />
                            <Image
                                src="/MessyDoodle_light.svg"
                                fill
                                className="object-contain hidden dark:block"
                                alt="Documents"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center md:justify-start flex-1 px-6 my-10 text-base font-normal tracking-tight">
                <div className="relative flex flex-col items-center max-w-4xl space-y-2">
                    <div className="flex-row grid md:grid-cols-6 gap-2 z-10">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Efficient</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Get instant (well, almost) responses to all your
                                queries on any document!
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-4">
                            <CardHeader>
                                <CardTitle>Improve Productivity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Skip the process of reading the whole document
                                whenever you&apos;re in a hurry. Just upload and
                                ask questions!
                            </CardContent>
                        </Card>
                    </div>
                    <div className="absolute -top-40 -right-44 sm:w-[250px] sm:h-[250px] md:h-[300px] md:w-[300px] md:z-0">
                        <Image
                            src="/SittingDoodle.svg"
                            fill
                            className="object-contain dark:hidden"
                            alt="Documents"
                        />
                    </div>

                    <div className="grid md:grid-cols-7 gap-2 justify-center">
                        <Card className="md:col-span-4 bg-black text-white">
                            <CardHeader>
                                <CardTitle>Powerful</CardTitle>
                            </CardHeader>
                            <CardContent>
                                With a context windows of 32,000 tokens, you can
                                feed quite large documents and get instant
                                responses.
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-3">
                            <CardHeader>
                                <CardTitle>Stone Age much?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Still reading? What are you waiting for? Get
                                started now!
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            {/* <section className="flex w-full py-12 md:py-24 lg:py-30 xl:py-25 bg-white justify-center dark:bg-black">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 items-center">
                        <div className="flex flex-col justify-center space-y-8 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-500 dark:from-white">
                                    Discover Our Unique Features
                                </h1>
                                <p className="max-w-[600px] tracking-tight md:text-xl text-black dark:text-white mx-auto">
                                    Our features are designed to enhance your
                                    productivity and streamline your workflow.
                                </p>
                            </div>
                            <div className="w-full max-w-full space-y-4 mx-auto">
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                                        <div className="p-2 rounded-full">
                                            <InboxIcon className="text-black h-6 w-6 mb-2 opacity-75 dark:text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-black dark:text-white">
                                            Smart Inbox
                                        </h2>
                                        <p className="text-black dark:text-white ">
                                            Our Smart Inbox feature helps you
                                            manage your emails efficiently by
                                            prioritizing important emails.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                                        <div className="p-2 rounded-full">
                                            <MergeIcon className="text-black h-6 w-6 mb-2 opacity-75 dark:text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-black dark:text-white">
                                            Seamless Integration
                                        </h2>
                                        <p className="text-black dark:text-white ">
                                            Seamless Integration allows you to
                                            connect with your favorite apps and
                                            services without leaving your inbox.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                                        <div className="p-2 rounded-full">
                                            <SettingsIcon className="text-black h-6 w-6 mb-2 opacity-75 dark:text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-black dark:text-white">
                                            Advanced Customization
                                        </h2>
                                        <p className="text-black dark:text-white ">
                                            With Advanced Customization, you can
                                            personalize your email client to
                                            suit your preferences and work
                                            style.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                                        <div className="p-2 rounded-full">
                                            <SearchIcon className="text-black h-6 w-6 mb-2 opacity-75 dark:text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-black dark:text-white">
                                            Powerful Search
                                        </h2>
                                        <p className="text-black dark:text-white">
                                            Our Powerful Search feature allows
                                            you to find any email, contact, or
                                            file in seconds.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                                        <div className="p-2 rounded-full">
                                            <LockIcon className="text-black h-6 w-6 mb-2 opacity-75 dark:text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-black dark:text-white">
                                            Reliable Security
                                        </h2>
                                        <p className="text-black dark:text-white">
                                            With Reliable Security, your data is
                                            always safe and protected.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                                        <div className="p-2 rounded-full">
                                            <MergeIcon className="text-black h-6 w-6 mb-2 opacity-75 dark:text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-black dark:text-white">
                                            Easy Collaboration
                                        </h2>
                                        <p className="text-black dark:text-white">
                                            Easy Collaboration allows you to
                                            share and edit documents with your
                                            team in real time.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
             </section> */}
            <div className="text-white flex flex-row items-center w-full p-6 z-50 dark:bg-white">
                <span>PageTalk</span>
                <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
                    <Button variant="ghost" size="sm">
                        Privacy Policy
                    </Button>
                    <Button variant="ghost" size="sm">
                        Terms & Conditions
                    </Button>
                </div>
            </div>
        </div>
    );
};

function InboxIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
    );
}

function MergeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 6 4-4 4 4" />
            <path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" />
            <path d="m20 22-5-5" />
        </svg>
    );
}

function SettingsIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function SearchIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function LockIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

export default LandingPage;
