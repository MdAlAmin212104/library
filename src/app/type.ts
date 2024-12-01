export interface UserRegister {
  _id: string;
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
export interface BookRegister {
  _id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  edition: string;
  category: string;
  language: string;
  totalCopies: number;
  availableCopies: number;
  publicationYear: number;
  bookCoverUrl: string;
  description: string;
}
