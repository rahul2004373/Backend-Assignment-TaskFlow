import type { RegisterInput, LoginInput, RefreshInput } from '../schema/auth.schema.ts';
export declare const authService: {
    register(data: RegisterInput): Promise<{
        id: any;
        name: any;
        email: any;
    }>;
    login(data: LoginInput): Promise<{
        accessToken: string;
        refreshToken: any;
    }>;
    refresh(data: RefreshInput): Promise<{
        accessToken: string;
        refreshToken: any;
    }>;
    logout(data: RefreshInput): Promise<void>;
};
