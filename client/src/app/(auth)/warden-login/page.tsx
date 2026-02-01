//client/src/app/(auth)/warden-login/page.tsx
import LoginLayout from "../../../../components/auth/LoginLayout";
import RoleLoginForm from "../../../../components/auth/RoleLoginForm";

export default function WardenLoginPage() {
  return (
    <LoginLayout>
      <RoleLoginForm defaultRole="warden" />
    </LoginLayout>
  );
}

