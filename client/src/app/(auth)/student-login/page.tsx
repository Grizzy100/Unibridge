//client/src/app/(auth)/student-login/page.tsx
import LoginLayout from "../../../../components/auth/LoginLayout";
import RoleLoginForm from "../../../../components/auth/RoleLoginForm";

export default function StudentLoginPage() {
  return (
    <LoginLayout>
      <RoleLoginForm defaultRole="student" />
    </LoginLayout>
  );
}
