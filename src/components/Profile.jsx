import profileStyles from "@/app/styles/profile.module.css";

import { useEffect, useState, useContext } from "react";
import { LoginContext } from "@/context/LoginProvider";
import Image from "next/image";

const HOST = process.env.NEXT_PUBLIC_HOSTNAME;

export default function Profile() {
  const [displayname, setDisplayname] = useState("");
  const [profile_img, setProfileImg] = useState("");
  const [background_url, setBackgroundUrl] = useState("");
  const [error, setError] = useState("");
  const { currentLogin, fetchSession } = useContext(LoginContext);

  const fetchProfile = async () => {
    const token = sessionStorage.getItem("authToken");
    try {
      const response = await fetch(`${HOST}/api/profile/fetch`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setDisplayname(data.profile.displayname);
        setBackgroundUrl(data.profile.background_url);
        setProfileImg(data.profile.profile_img);
        console.log("Profile data:", data.profile);
      } else {
        console.error("Error fetching profile:", data.error);
      }
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchSession().then(() => {
      if (currentLogin) {
        fetchProfile();
      }
    });
  }, [currentLogin, displayname, background_url, profile_img, fetchSession]);

  return (
    <div>
      {error && <p className={profileStyles["error-message"]}>{error}</p>}
      <div className={profileStyles["profile-container"]}>
        <h2
          className={`text-3xl ${profileStyles["profile-displayname"]}`}
        >{`${displayname}`}</h2>
        <p
          className={profileStyles["profile-username"]}
        >{`User: ${currentLogin}`}</p>
        <Image
          className={profileStyles["profile-image"]}
          src={profile_img || "https://via.placeholder.com/150"}
          alt={`${currentLogin} profile image`}
          height={150}
          width={150}
        />
        <Image
          className={profileStyles["background-image"]}
          src={background_url || "https://via.placeholder.com/150"}
          alt={`${currentLogin} background image`}
          height={300}
          width={800}
        />
      </div>
    </div>
  );
}
