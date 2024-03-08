import { AuthProvider } from '@/context/auth';
import PaymentSuccess from '@/page-views/PaymentSuccess';

export default function PaymentSuccessPage() {
  return (
    <AuthProvider>
      <PaymentSuccess />
    </AuthProvider>
  );
}
