import { AuthPageShell } from "../../components/auth/auth-page-shell";
import { RegisterForm } from "../../components/auth/register-form";
import { ROUTES } from "../../lib/constants";

export default function RegisterPage() {
  return (
    <AuthPageShell
      title="Daftar Akun Citizen"
      description="Buat akun warga untuk membuat laporan, memberi komentar, melakukan upvote, dan memantau status laporan."
      footerText="Sudah punya akun?"
      footerLinkText="Masuk sekarang"
      footerHref={ROUTES.login}
    >
      <RegisterForm />
    </AuthPageShell>
  );
}