import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Login — Vichel" };

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="auth-page">
        <AuthForm mode="login" />
      </main>
      <SiteFooter />
    </>
  );
}
