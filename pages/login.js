import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import classes from "../styles/Login.module.css";
import { useRouter } from "next/router";
import { magic } from "../lib/magic-client";

export default function Login() {
  const [userMsg, setUserMsg] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onChangeEmail = (e) => {
    setUserMsg("");
    setEmail(e.target.value);
  };

  useEffect(() => {
    const changeRouterHandler = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", changeRouterHandler);
    return router.events.off("routeChangeComplete", changeRouterHandler);
  }, [router]);

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        setIsLoading(true);
        const didToken = await magic.auth.loginWithMagicLink({
          email: email,
          showUI: true,
        });
        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });
          const loggedInResponse = await response.json();
          if (loggedInResponse.done) {
            router.push("/");
          } else {
            setIsLoading(false);
          }
          console.log(loggedInResponse, "logged in response");
        }
      } catch (error) {
        setIsLoading(false);
        setUserMsg("Sth went wrong while logging in");
        console.log(error);
      }
    } else {
      setUserMsg("Enter valid email address");
    }
    setIsLoading(false);
  };
  return (
    <div className={classes.container}>
      <Head>
        <title>Netflix Login</title>
      </Head>
      <header className={classes.header}>
        <div className={classes.headerWrapper}>
          <Link className={classes.logoLink} href="/">
            <div className={classes.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="netflix"
                width={111}
                height={30}
              />
            </div>
          </Link>
        </div>
      </header>
      <main className={classes.main}>
        <div className={classes.mainWrapper}>
          <h1 className={classes.signinHeader}>Sign In</h1>
          <input
            type="text"
            placeholder="Email Address"
            className={classes.emailInput}
            onChange={onChangeEmail}
          />
          {!!userMsg && <p className={classes.userMsg}>{userMsg}</p>}
          <button onClick={handleLoginWithEmail} className={classes.loginBtn}>
            {isLoading ? "Loading..." : "Sign in"}
          </button>
        </div>
      </main>
    </div>
  );
}
