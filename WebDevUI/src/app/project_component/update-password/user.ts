export class User {
    constructor(
        public name: string,
        public email: string,
        public phone: string,
        public newPassword : string,
        public confPassword: string,
        public timePreference: string,
        public subscribe: boolean
    ) {}
}