"use client";

import { useReducer, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { State } from "@/types/login";

import { useAppContext } from "@/state/appState";
import { setItem } from "@/config/hooks/localStorageControl";

import { signUpInterface, signInInterface } from "@/types/auth";
import { signUpSchema, signInSchema } from "@/zod/schema";

import Navbar from "@/components/oldcomponents/Navbar";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@nextui-org/react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

enum ActionTypes {
    SET_LOGIN = "SET_LOGIN",
    SET_LOADING = "SET_LOADING",
    SET_VERIFICATION = "SET_VERIFICATION",
    SET_USER_DETAILS = "SET_USER_DETAILS",
    SET_USER = "SET_USER",
    SET_OTP_VALUES = "SET_OTP_VALUES",
    SET_IS_FILLED = "SET_IS_FILLED",
    SET_SHOW_PASSWORD = "SET_SHOW_PASSWORD",
    SET_SHOW_REENTER_PASSWORD = "SET_SHOW_REENTER_PASSWORD",
}

interface Action {
    type: ActionTypes;
    payload: any; // Change the payload type as needed
}

// Initial state
const initialState: State = {
    isLogin: true,
    loading: true,
    verification: false,
    userDetails: null,
    user: null,
    otpValues: ["", "", "", "", "", ""],
    isFilled: false,
    showPassword: false,
    showReenterPassword: false,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionTypes.SET_LOGIN:
            return { ...state, isLogin: action.payload };
        case ActionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case ActionTypes.SET_VERIFICATION:
            return { ...state, verification: action.payload };
        case ActionTypes.SET_USER_DETAILS:
            return { ...state, userDetails: action.payload };
        case ActionTypes.SET_USER:
            return { ...state, user: action.payload };
        case ActionTypes.SET_OTP_VALUES:
            return { ...state, otpValues: action.payload };
        case ActionTypes.SET_IS_FILLED:
            return { ...state, isFilled: action.payload };
        case ActionTypes.SET_SHOW_PASSWORD:
            return { ...state, showPassword: action.payload };
        case ActionTypes.SET_SHOW_REENTER_PASSWORD:
            return { ...state, showReenterPassword: action.payload };
        default:
            return state;
    }
};

function getSchema(isLogin: boolean) {
    if (isLogin === true) {
        return signInSchema;
    } else return signUpSchema;
}

export default function Access() {
    const [state, localDispatch] = useReducer(reducer, initialState);

    const setLogin = (value: boolean) =>
        localDispatch({ type: ActionTypes.SET_LOGIN, payload: value });
    const setLoading = (value: boolean) =>
        localDispatch({ type: ActionTypes.SET_LOADING, payload: value });
    const setVerification = (value: boolean) =>
        localDispatch({ type: ActionTypes.SET_VERIFICATION, payload: value });
    const setUserDetails = (value: signUpInterface | null) =>
        localDispatch({ type: ActionTypes.SET_USER_DETAILS, payload: value });
    const setUser = (value: User | null) =>
        localDispatch({ type: ActionTypes.SET_USER, payload: value });
    const setOTPValues = (value: string[]) =>
        localDispatch({ type: ActionTypes.SET_OTP_VALUES, payload: value });
    const setIsFilled = (value: boolean) =>
        localDispatch({ type: ActionTypes.SET_IS_FILLED, payload: value });
    const setShowPassword = (value: boolean) =>
        localDispatch({ type: ActionTypes.SET_SHOW_PASSWORD, payload: value });
    const setShowReenterPassword = (value: boolean) =>
        localDispatch({
            type: ActionTypes.SET_SHOW_REENTER_PASSWORD,
            payload: value,
        });

    const togglePasswordVisibility = () => {
        setShowPassword(!state.showPassword);
    };

    const toggleReenterPasswordVisibility = () => {
        localDispatch({
            type: ActionTypes.SET_SHOW_REENTER_PASSWORD,
            payload: !state.showReenterPassword,
        });
    };

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const { dispatch } = useAppContext();

    const handleInputChange = (index: number, value: string) => {
        const newValues = [...state.otpValues];
        newValues[index] = value;
        setOTPValues(newValues);
        if (
            value &&
            index < inputRefs.length - 1 &&
            inputRefs[index + 1].current
        ) {
            inputRefs[index + 1].current!.focus();
        }
    };

    let currentSchema = getSchema(state.isLogin);
    const loginForm = useForm<z.infer<typeof currentSchema>>({
        resolver: zodResolver(currentSchema),
    });
    const supabase = createClientComponentClient();
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof currentSchema>) => {
        if (state.isLogin) {
            const formData = values as signInInterface;
            const res = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (res.error) {
                console.error("Error logging in:", res.error.message);
                return;
            }
            const { data, error } = await supabase
                .from("user")
                .select("*")
                .eq("id", res.data.user?.id);
            const payload = {
                email: data![0].email,
                name: data![0].name,
                phone: data![0].phone,
                user_id: data![0].id,
                access_token: res.data.session?.access_token!,
            };
            dispatch({
                type: "UPDATE_USER_DETAILS",
                payload: payload,
            });

            setItem("user_id", data![0].id);
            setItem("access_token", res.data.session?.access_token!);
            setItem("email", data![0].email);
            setItem("name", data![0].name);
            setItem("phone", data![0].phone.toString());
            setUser(res.data.user);
            router.replace("/home");
        } else {
            const formData = values as signUpInterface;
            await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    data: {
                        name: formData.name,
                        phone: formData.phone,
                    },
                },
            });
            setUserDetails(formData);
            setVerification(true);
        }
    };

    const onOTP = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const token = state.otpValues.join("");
        const res = await supabase.auth.verifyOtp({
            email: state.userDetails!.email,
            token,
            type: "email",
        });
        setUser(res.data.user);
        const error = res.error;
        if (error) {
            console.error("Error signing up:", error.message);
        } else {
            const { error } = await supabase.from("user").upsert([
                {
                    id: res.data.user?.id,
                    email: state.userDetails!.email,
                    name: state.userDetails!.name,
                    phone: state.userDetails!.phone,
                },
            ]);
            if (error) {
                console.error("Error updating user data:", error);
            } else {
                dispatch({
                    type: "UPDATE_USER_DETAILS",
                    payload: {
                        email: state.userDetails!.email,
                        name: state.userDetails!.name,
                        phone: state.userDetails!.phone,
                        user_id: res.data.user?.id!,
                        access_token: res.data.session?.access_token!,
                    },
                });
                setItem("user_id", res.data.user?.id!);
                setItem("access_token", res.data.session?.access_token!);
                setItem("email", state.userDetails!.email);
                setItem("name", state.userDetails!.name);
                setItem("phone", state.userDetails!.phone.toString());
                router.replace("/home");
            }
        }
    };

    useEffect(() => {
        async function getUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        }
        getUser();
    }, []);

    useEffect(() => {
        const checkAndRedirect = async () => {
            try {
                if (state.user) router.replace("/home");
            } catch (error) {
                console.error("Error checking and redirecting:", error);
            }
        };
        checkAndRedirect();
    }, []);

    useEffect(() => {
        setIsFilled(state.otpValues.every((value: any) => value !== ""));
    }, [state.otpValues]);

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            {state.loading ? (
                <Spinner color="default" />
            ) : state.verification ? (
                <>
                    <form onSubmit={onOTP}>
                        <Card className="w-full max-w-md mx-auto sm:mx-5">
                            <CardHeader>
                                <CardTitle>Enter OTP</CardTitle>
                                <CardDescription>
                                    Please enter the 6-digit OTP sent to your
                                    email.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-between gap-4">
                                {state.otpValues.map((value, index) => (
                                    <Input
                                        key={index}
                                        className="w-10 text-center"
                                        maxLength={1}
                                        value={value}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) =>
                                            handleInputChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        ref={inputRefs[index]}
                                    />
                                ))}
                            </CardContent>
                            <CardFooter className="flex justify-center">
                                <Button
                                    type="submit"
                                    disabled={!state.isFilled}
                                >
                                    Submit
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </>
            ) : (
                <div className="flex-grow flex items-center justify-center px-5 py-10 sm:mx-5">
                    <Form {...loginForm}>
                        <form
                            onSubmit={loginForm.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <Tabs
                                defaultValue="login"
                                className="md:w-[400px] sm:w-[200px]"
                                onValueChange={(_) => {
                                    setLogin(!state.isLogin);
                                    currentSchema = getSchema(state.isLogin);
                                }}
                            >
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="login">
                                        Log In
                                    </TabsTrigger>
                                    <TabsTrigger value="signup">
                                        Sign Up
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="login">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Log In</CardTitle>
                                            <CardDescription>
                                                Log into your existing account
                                                to use PageTalk.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <FormField
                                                control={loginForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="space-y-1">
                                                            <FormLabel>
                                                                Email
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={loginForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="space-y-1">
                                                            <FormLabel>
                                                                Password
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Input
                                                                        {...field}
                                                                        type={
                                                                            state.showPassword
                                                                                ? "text"
                                                                                : "password"
                                                                        }
                                                                        placeholder="Password"
                                                                    />
                                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                                                                        {state.showPassword ? (
                                                                            <EyeOff
                                                                                className="h-5 w-5 text-black"
                                                                                onClick={() => {
                                                                                    setShowPassword(
                                                                                        !state.showPassword
                                                                                    );
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <Eye
                                                                                className="h-5 w-5 text-black"
                                                                                onClick={() => {
                                                                                    setShowPassword(
                                                                                        !state.showPassword
                                                                                    );
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                        <CardFooter>
                                            <Button type="submit">
                                                Log In
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="signup">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Sign Up</CardTitle>
                                            <CardDescription>
                                                Create an account to access all
                                                the features of PageTalk.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <FormField
                                                control={loginForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="space-y-1">
                                                            <FormLabel>
                                                                Email
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={loginForm.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="space-y-1">
                                                            <FormLabel>
                                                                Name
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={loginForm.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="space-y-1">
                                                            <FormLabel>
                                                                Phone
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={loginForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="space-y-1">
                                                            <FormLabel>
                                                                Password
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Input
                                                                        {...field}
                                                                        type={
                                                                            state.showPassword
                                                                                ? "text"
                                                                                : "password"
                                                                        }
                                                                        placeholder="Password"
                                                                    />
                                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                                                                        {state.showPassword ? (
                                                                            <EyeOff
                                                                                className="h-5 w-5 text-black"
                                                                                onClick={
                                                                                    togglePasswordVisibility
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <Eye
                                                                                className="h-5 w-5 text-black"
                                                                                onClick={
                                                                                    togglePasswordVisibility
                                                                                }
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={loginForm.control}
                                                name="reenterPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="space-y-1">
                                                            <FormLabel>
                                                                Re-enter
                                                                Password
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Input
                                                                        {...field}
                                                                        type={
                                                                            state.showPassword
                                                                                ? "text"
                                                                                : "password"
                                                                        }
                                                                        placeholder="Password"
                                                                    />
                                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                                                                        {state.showPassword ? (
                                                                            <EyeOff
                                                                                className="h-5 w-5 text-black"
                                                                                onClick={
                                                                                    toggleReenterPasswordVisibility
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <Eye
                                                                                className="h-5 w-5 text-black"
                                                                                onClick={
                                                                                    toggleReenterPasswordVisibility
                                                                                }
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                        <CardFooter>
                                            <Button type="submit">
                                                Sign Up
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </form>
                    </Form>
                </div>
            )}
        </div>
    );
}
