import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// create the handler once
const handler = NextAuth(authOptions);

// export it under both GET and POST
export { handler as GET, handler as POST };
