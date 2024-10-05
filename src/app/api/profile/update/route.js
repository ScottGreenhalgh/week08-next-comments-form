import jwt from "jsonwebtoken";
import { connect } from "@/utils/connect";

const db = connect();

export const PUT = async (request) => {
  const { background_url, profile_img, displayname } = await request.json();
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Authorization token missing" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
    if (error) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const username = decoded.username;
    console.log(`Profile update request from: ${username}`);

    try {
      const updateFields = [];
      const updateValues = [];
      let index = 2; // Start from 2 because the first value is the username

      if (background_url) {
        updateFields.push(`background_url = $${index++}`);
        updateValues.push(background_url);
      }
      if (profile_img) {
        updateFields.push(`profile_img = $${index++}`);
        updateValues.push(profile_img);
      }
      if (displayname) {
        updateFields.push(`displayname = $${index++}`);
        updateValues.push(displayname);
      }

      if (updateFields.length > 0) {
        await db.query(
          `UPDATE preferences
           SET ${updateFields.join(", ")}
           WHERE user_id = (SELECT id FROM login WHERE username = $1);`,
          [username, ...updateValues]
        );

        return new Response(
          JSON.stringify({
            message: "Profile updated successfully",
            username,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(
          JSON.stringify({ error: "No valid fields provided for update." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } catch (error) {
      console.error("Database error: ", error);
      return new Response(
        JSON.stringify({ error: { name: error.name, message: error.message } }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  });
};
