import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {Form} from "@/app/(public)/(auth)/login/form"

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      {/* Left Section: Image */}
      <div className="flex-1 hidden md:flex items-center justify-center p-8">
        <div className="relative w-full max-w-xl h-[80vh]">
          <Image
            src="/images/team-presentation-6-80.png"
            alt="Landing Page Image"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      

      {/* Right Section: Login Component */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-sm">
          <CardHeader className="flex flex-col items-center gap-2">

            <div className="flex items-center gap-2"> {/* New container for the image and text */}
              <Image
                src="/images/logo.png"
                alt="Your App Logo"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
              <span className="text-3xl font-semibold">Your App Name</span>
            </div>

          </CardHeader>
          <CardContent>
            {/* Login Form */}
            <Form/>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}



