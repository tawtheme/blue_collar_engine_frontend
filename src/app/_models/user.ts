import { Role } from "./role";

export interface User {
    data:{
        role: Role;
        token?: string;
        email: string;
        expiration: string;
    }
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    
}