import Header from '@/components/auth/Header';
import ReturnButton from '@/components/auth/ReturnButton';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';

export default function page() {
  return (
    <Card className="w-96 shadow-md">
      <CardHeader>
        <Header label="Something went wrong!" />
      </CardHeader>
      <CardFooter>
        <ReturnButton label="Return to Login" href="/auth/login" />
      </CardFooter>
    </Card>
  );
}
