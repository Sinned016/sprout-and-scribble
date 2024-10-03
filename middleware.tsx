import { NextResponse } from "next/server";

export default function Middleware(request: NextResponse) {
  console.log(request.url);
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/about/:path*",
};
