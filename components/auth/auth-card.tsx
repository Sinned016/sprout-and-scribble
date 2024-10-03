import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Socials from "./socials";
import BackButton from "./back-button";

type CardWrapperProps = {
  children: React.ReactNode;
  cardTitle: string;
  backButtonHref: string;
  backButtonLabel: string;
  showSocials?: boolean;
};

export default function AuthCard({
  children,
  cardTitle,
  backButtonHref,
  backButtonLabel,
  showSocials,
}: CardWrapperProps) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
}
