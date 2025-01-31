import * as session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    email: string;
  }
}
