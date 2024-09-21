import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired();

// If you want to protect specific routes, you can pass a configuration object to withMiddlewareAuthRequired.
// export const config = {
//     matcher: ["/protected", "/admin"],
// };