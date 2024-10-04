import forumsStyle from "@/app/styles/forums.module.css";

import Link from "next/link";
import { connect } from "@/utils/connect";

export default async function ForumsPage({ searchParams }) {
  const db = connect();
  const posts = (await db.query(`SELECT * FROM forum_posts`)).rows;

  const sortedPosts = posts.sort((a, b) => {
    if (searchParams.sortBy == "asc") {
      return a.title.localeCompare(b.title);
    }
    if (searchParams.sortBy == "desc") {
      return b.title.localeCompare(a.title);
    }
  });

  return (
    <div className={forumsStyle["forums-container"]}>
      <h1 className={`text-4xl ${forumsStyle["forums-title"]}`}>Forums</h1>
      <div className={forumsStyle["dropdown"]}>
        <button className={forumsStyle["dropdown-button"]}>^</button>
        <div className={forumsStyle["dropdown-content"]}>
          <Link href="/forums?sortBy=asc"> Sort: A-Z </Link>
          <Link href="/forums?sortBy=desc"> | Sort: Z-A </Link>
          <Link href="/forums"> | Sort: None </Link>
        </div>
      </div>
      <Link href={"/forums/create"}>
        <span className={`text-2xl ${forumsStyle["forums-create"]}`}>+</span>
      </Link>
      <div className={forumsStyle["posts-container"]}>
        {sortedPosts.map((post) => {
          const date = new Date(post.created_at);
          const formattedDate = `${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} 
            ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          // returns a Day/month/year 2 digit hour and 2 digit min
          return (
            <div className={forumsStyle["individual-post"]} key={post.id}>
              <Link
                href={`/forums/p/${post.title
                  .toLowerCase()
                  .replace(/ /g, "-")}`}
              >
                <h3
                  className={`text-amber-500 ${forumsStyle["forums-post-title"]}`}
                >
                  {post.title}
                </h3>
              </Link>
              <p className={forumsStyle["forums-post-sender"]}>
                By: {post.username}
              </p>
              <p className={forumsStyle["forums-post-date"]}>{formattedDate}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
