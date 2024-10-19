import { Button } from "@/components/ui/button";
import agent from "@/lib/axios";
import { useState } from "react";

export default function Home() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = async () => {
    await agent.CsrfToken.getCsrf()
  };

  return (
    <div>
      <Button onClick={handleClick}>Click me</Button>
      <p>You clicked {clickCount} times</p>
    </div>
  );
}
