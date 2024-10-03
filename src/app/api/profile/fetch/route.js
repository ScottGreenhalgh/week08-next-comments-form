import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/utils/connect.js";

const db = connect();

export async function GET(request) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "Authorization token missing" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    console.log(`Profile fetch request from: ${username}`);

    const profile = await db.query(
      `SELECT login.username, preferences.background_url, preferences.profile_img, preferences.displayname
      FROM login
      INNER JOIN preferences ON login.id = preferences.user_id
      WHERE login.username = $1;`,
      [username]
    );

    if (profile.rows.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: profile.rows[0] });
  } catch (error) {
    console.error("Error fetching profile: ", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
