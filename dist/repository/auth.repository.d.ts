export declare const authRepository: {
    createRefreshToken(userId: string, expiresInDays?: number): Promise<any>;
    findRefreshToken(token: string): Promise<any>;
    revokeRefreshToken(token: string): Promise<any>;
    revokeAllUserTokens(userId: string): Promise<any>;
};
