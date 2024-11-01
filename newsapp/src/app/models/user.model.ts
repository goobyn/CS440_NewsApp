export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;   // Optional, since you typically don’t want to expose it widely
    interests?: string[];  // Categories or interests, like 'Business', 'Technology'
    avatarUrl?: string;      // Optional profile picture URL
    createdAt?: Date;
    updatedAt?: Date;
  }
  