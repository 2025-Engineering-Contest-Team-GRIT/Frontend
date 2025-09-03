
import { LoginScreen } from '@/components/views/LoginScreen';

export default function LoginPage() {
  // SSR: 상태 관리용 no-op 핸들러 전달
  return (
    <LoginScreen
      onLogin={() => {}}
      onViewPublicProfileDemo={() => {}}
    />
  );
}
