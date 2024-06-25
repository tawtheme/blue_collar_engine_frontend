import { Role } from "./role";

export interface User {
    data: {
        role: Role;
        token?: string;
        email: string;
        expiration: string;
        tenantInfo: {
            timezone: string;
            subDomainName: string;
            userId: string;
            firstName: string;
            lastName: string;
        }
    }
    id: number;
    firstName: string;
    lastName: string;
    username: string;


}