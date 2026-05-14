import { AuthPageShell } from "../../components/auth/auth-page-shell";
import { LoginForm } from "../../components/auth/login-form";
import { ROUTES } from "../../lib/constants";

export default function LoginPage() {
  return (
    <AuthPageShell
      title="Masuk ke LATAH"
      description="Gunakan akun citizen atau admin untuk mengakses dashboard sesuai role."
      footerText="Belum punya akun?"
      footerLinkText="Daftar sebagai citizen"
      footerHref={ROUTES.register}
    >
      <LoginForm />
    </AuthPageShell>
  );
}