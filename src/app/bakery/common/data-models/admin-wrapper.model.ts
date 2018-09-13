import { Administrator } from './administrator.model';
export class AdminWrapper {
    admin: Administrator;
    encodedAdminImage: string;

    constructor(args){
        this.admin = args.admin;
        this.encodedAdminImage = args.encodedAdminImage;
    }
}