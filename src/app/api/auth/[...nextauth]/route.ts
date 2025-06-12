import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/', // Usaremos la landing page como página de inicio de sesión
  },
  callbacks: {
    async redirect({baseUrl }) {
      // Después de un login exitoso, redirigir a /home
      return `${baseUrl}/home`;
    },
  },
});

export { handler as GET, handler as POST }; 