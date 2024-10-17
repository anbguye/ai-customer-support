'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(`Logging in with ${username} and ${password}`);
    router.push("/chat");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2x1 font-bold text-center">
            Login
          </CardTitle>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className='space-y-2'>
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className='space-y-2'>
                <label htmlFor="password" className='text-sm font-medium text-gray-700'>Password</label>
                <Input
                  id='password'
                  type='text'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='w-full'
                />
              </div>
              <Button className='w-full bg-gradient-to-r from-zinc-800 to-zinc-950'>Submit</Button>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}