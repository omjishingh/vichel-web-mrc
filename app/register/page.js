import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Register — Vichel" };

export default function RegisterPage() {
  return (
    <>
      <SiteHeader />
      <main className="auth-page">
        <AuthForm mode="register" />
      </main>
      <SiteFooter />
    </>
  );
}
