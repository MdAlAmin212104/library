export interface UserRegister {
    name: string;
    email: string;
    phone: string;
    roll?: string;
    department?: string;
    batch?: string;
    position?: string;
    password: string;
    confirmPassword?: string;
    profilePicture?: File | null;
    profilePictureUrl?: string;
    hashedPassword?: string;
    role: string;
    
}
