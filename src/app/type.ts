export interface UserRegister {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  roll?: string;
  department?: string;
  batch?: string;
  position?: string;
  password?: string;
  confirmPassword?: string;
  profilePicture?: File | null;
  profilePictureUrl?: string;
  role: string;
}
export interface BookRegister {
  roll: string;
  department: string;
  batch: string;
  position: string;
  profilePictureUrl: string;
  role: string;
  phone: string;
  name: string;
  email: string;
  bookId?: string;
  _id?: string;
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
  bookCoverUrl?: string;
  description: string;
  files?: string;
}


export interface BookBrowsing {
  userRoll: string;
  bookId: string;
  startDate : string;
  endDate : string;
  totalDays: number;
  status: string;
}