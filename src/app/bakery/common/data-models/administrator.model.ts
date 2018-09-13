export class Administrator {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;

    constructor(args:any){
        this.id = args.id;
        this.firstname = args.firstname;
        this.lastname = args.lastname;
        this.email = args.email;
        this.password = args.password;
    }
}