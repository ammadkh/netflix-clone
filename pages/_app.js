import "../styles/globals.css";
import { Roboto_Slab } from "@next/font/google";
import { useEffect, useState } from "react";
import { magic } from "../lib/magic-client";
import { useRouter } from "next/router";
import Loading from "../components/loading/loading";

const roboto = Roboto_Slab({ weight: ["400", "700"], preload: true });

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isLoggedIn = async () => {
    // setIsLoading(true);
    // console.log(magic, "magic");
    // const isUserLoggedIn = await magic.user.isLoggedIn();
    // console.log(isUserLoggedIn, "is user logged in");
    // if (isUserLoggedIn) {
    //   router.push("/");
    // } else {
    //   router.push("/login");
    // }
    // setIsLoading(false);
  };
  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <main className={roboto.className}>
      {isLoading ? <Loading /> : <Component {...pageProps} />}
    </main>
  );
}

export default MyApp;
