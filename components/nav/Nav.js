import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { magic } from "../../lib/magic-client";
import classes from "./Nav.module.css";

export default function Nav({ username }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState("");
  const [didToken, setDidToken] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const getEmail = async () => {
      const isUserLoggedIn = await magic.user.isLoggedIn();
      if (!isUserLoggedIn) return;
      const { email } = await magic.user?.getMetadata();
      const didToken = await magic.user.getIdToken();
      setDidToken(didToken);
      setEmail(email);
    };
    getEmail();
  }, []);

  const handleSignout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
    } catch (error) {
      console.error("Error logging out", error);
      router.push("/login");
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
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
        <ul className={classes.navItems}>
          <li className={classes.navItem} onClick={() => router.push("/")}>
            Home
          </li>
          <li
            className={classes.navItem2}
            onClick={() => router.push("/browse/my-list")}
          >
            My List
          </li>
        </ul>
        <nav className={classes.navContainer}>
          <div>
            <button
              className={classes.usernameBtn}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <p className={classes.username}>{email}</p>
              <Image
                src="/static/expand_more.svg"
                alt="netflix"
                width={24}
                height={24}
              />
            </button>
            {showDropdown && (
              <div className={classes.navDropdown}>
                <button className={classes.linkName} onClick={handleSignout}>
                  sign out
                </button>
                <div className={classes.lineWrapper}></div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
