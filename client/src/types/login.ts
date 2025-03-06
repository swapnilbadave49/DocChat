import { signUpInterface, signInInterface } from "@/types/auth";
import { User } from "@supabase/supabase-js";

export interface State {
    isLogin: boolean;
    loading: boolean;
    verification: boolean;
    userDetails: signUpInterface | null;
    user: User | null;
    otpValues: string[];
    isFilled: boolean;
    showPassword: boolean;
    showReenterPassword: boolean;
}