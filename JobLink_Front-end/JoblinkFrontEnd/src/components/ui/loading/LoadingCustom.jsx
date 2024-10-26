import { Loader2 } from "lucide-react";

const LoadingCustom = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
      {/* <Loader2 className="animate-spin h-12 w-12 text-white" /> */}
      <img
        src="https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-1/440879710_1311365576486302_465885895535459738_n.jpg?stp=dst-jpg_s200x200&_nc_cat=100&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeFwMNEk_sQdV-RfB0sm4YE1ZNm2NsCaeAlk2bY2wJp4CbaqoySVisau52pRC-dwipFqTIGn9kjUzVvfdl1wv1yx&_nc_ohc=mZB2f4hrYGgQ7kNvgFJw4mD&_nc_ht=scontent.fhan15-2.fna&_nc_gid=AkFV3U5emRflPx-gK0O2G45&oh=00_AYBznXGNXxFUG8qrm-JTmPZ-8elENMeftPiZGKc071saRg&oe=671D5ECF"
        className="w-10 h-10 rounded-full animate-spin"
      />
    </div>
  );
};

export default LoadingCustom;
