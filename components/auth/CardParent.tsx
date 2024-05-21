'use client';

import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Header from './Header';
import ReturnButton from './ReturnButton';
import Socials from './Socials';

type Props = {
  children: React.ReactNode;
  title: string;
  returnLabel: string;
  returnHref: string;
  showSocials?: boolean;
};

export default function CardParent({
  children,
  title,
  returnLabel,
  returnHref,
  showSocials,
}: Props) {
  return (
    <Card className="shadow-sm w-[26rem]">
      <CardHeader>
        <Header label={title} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <ReturnButton label={returnLabel} href={returnHref} />
      </CardFooter>
    </Card>
  );
}
