import jwt from "jsonwebtoken";

export const GET = async (request) => {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header missing" }),
        { status: 400 }
      );
    }

    const authToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

    return new Response(JSON.stringify({ username: decoded.username }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 401,
    });
  }
};
