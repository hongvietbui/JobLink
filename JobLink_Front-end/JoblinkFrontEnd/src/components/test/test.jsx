import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(clickCount + 1);
  };

  return (
    <div>
      <Button onClick={handleClick}>Click me</Button>
      <p>You clicked {clickCount} times</p>
    </div>
  );
}
