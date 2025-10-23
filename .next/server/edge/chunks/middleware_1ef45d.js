(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/middleware_1ef45d.js", {

"[project]/middleware.js [middleware] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "config": ()=>config,
    "middleware": ()=>middleware
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$next$2d$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/server/web/exports/next-response.js [middleware] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
function middleware(req) {
    const { pathname } = req.nextUrl;
    // ✅ Define only the paths that truly require authentication
    const protectedPaths = [
        "/newproduct",
        "/newsletter"
    ];
    // ✅ If path is protected, check token
    if (protectedPaths.some((p)=>pathname.startsWith(p))) {
        const token = req.cookies.get("auth_token")?.value;
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = "/admin" // redirect to login page
            ;
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$next$2d$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].redirect(url);
        }
    }
    // ✅ Allow /admin (login page) even without token
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$next$2d$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].next();
}
const config = {
    matcher: [
        "/admin/:path*",
        "/new-product/:path*"
    ]
};

})()),
}]);

//# sourceMappingURL=middleware_1ef45d.js.map