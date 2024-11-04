import { Button } from "@/components/ui/button";
import agent from "@/lib/axios";
import { useState } from "react";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Giả lập quá trình tải (thay thế bằng xử lý thực tế)
    setTimeout(() => {
      setIsLoading(false); // Dừng spinner sau 2 giây
    }, 10000);
  };

  return (
    <>
      {isLoading ? (
        <img
          src="https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-1/440879710_1311365576486302_465885895535459738_n.jpg?stp=dst-jpg_s200x200&_nc_cat=100&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeFwMNEk_sQdV-RfB0sm4YE1ZNm2NsCaeAlk2bY2wJp4CbaqoySVisau52pRC-dwipFqTIGn9kjUzVvfdl1wv1yx&_nc_ohc=GHKL1dbACacQ7kNvgHBnwsJ&_nc_ht=scontent.fhan5-11.fna&_nc_gid=AFBdI2BRhRsrNe9D7x8JTwR&oh=00_AYDck-Ngnn3cZdmFksNqIpxI9VaFecv11eq0IhKrWFYgzQ&oe=671C7DCF"
          alt="Loading..."
          className="w-[100px] h-[100px] mr-2 inline-block animate-spin rounded-full shadow-lg duration-500 hover:scale-110 hover:shadow-2xl"
        />
      ) : (
        <p>Click me</p>
      )}
      <Button onClick={handleClick} disabled={isLoading}>
        Click me
      </Button>
    </>
  );
};

export default Home;
