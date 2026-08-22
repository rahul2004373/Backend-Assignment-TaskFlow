export declare const userRepository: {
    createUser(data: any): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findById(id: string): Promise<any>;
};
