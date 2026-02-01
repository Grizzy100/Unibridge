//client/src/app/(auth)/teacher-login/page.tsx
import LoginLayout from "../../../../components/auth/LoginLayout";
import RoleLoginForm from "../../../../components/auth/RoleLoginForm";

export default function TeacherLoginPage() {
  return (
    <LoginLayout>
      <RoleLoginForm defaultRole="teacher" />
    </LoginLayout>
  );
}

