(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_9ad994._.js", {

"[project]/lib/api.js [client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/axios/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const Client = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    withCredentials: true
});
const __TURBOPACK__default__export__ = Client;

})()),
"[project]/lib/auth.js [client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "CheckSession": ()=>CheckSession,
    "LogInUser": ()=>LogInUser,
    "LogOutUser": ()=>LogOutUser
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/api.js [client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const LogInUser = async (data)=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("/auth/signin", data, {
            withCredentials: true
        });
        return res.data.user || null;
    } catch (error) {
        console.error("Login error:", error?.response?.data || error.message);
        return null;
    }
};
_c = LogInUser;
const CheckSession = async ()=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("/auth/session", {
            withCredentials: true
        });
        return res.data || null;
    } catch (error) {
        console.error("Session check error:", error?.response?.data || error.message);
        return null;
    }
};
_c1 = CheckSession;
const LogOutUser = async ()=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("/auth/signout", {}, {
            withCredentials: true
        });
        return true;
    } catch (error) {
        console.error("Logout error:", error?.response?.data || error.message);
        return false;
    }
};
_c2 = LogOutUser;
var _c, _c1, _c2;
__turbopack_refresh__.register(_c, "LogInUser");
__turbopack_refresh__.register(_c1, "CheckSession");
__turbopack_refresh__.register(_c2, "LogOutUser");

})()),
"[project]/context/AuthContext.js [client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "AuthProvider": ()=>AuthProvider,
    "useAuth": ()=>useAuth
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/auth.js [client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature(), _s1 = __turbopack_refresh__.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"]();
function AuthProvider(param) {
    let { children } = param;
    _s();
    const [user, setUser] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [loading, setLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"](true);
    // 🔁 Automatically check session on load
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const fetchSession = async ()=>{
            try {
                const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$client$5d$__$28$ecmascript$29$__["CheckSession"]();
                console.log("context :", session);
                if (session?.user) {
                    setUser(session.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Session check failed:", err);
            } finally{
                setLoading(false);
            }
        };
        fetchSession();
    }, []);
    // 🚪 Logout handler
    const logout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$client$5d$__$28$ecmascript$29$__["LogOutUser"]() // backend clears cookie
            ;
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"](AuthContext.Provider, {
        value: {
            user,
            setUser,
            logout,
            loading
        },
        children: children
    }, void 0, false, {
        fileName: "<[project]/context/AuthContext.js>",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthProvider;
function useAuth() {
    _s1();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"](AuthContext);
}
_s1(useAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_refresh__.register(_c, "AuthProvider");

})()),
"[project]/context/AuthContext.jsx [client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "AuthProvider": ()=>AuthProvider,
    "useAuth": ()=>useAuth
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/auth.js [client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature(), _s1 = __turbopack_refresh__.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"]({
    user: null,
    setUser: ()=>{},
    logout: async ()=>{}
});
function AuthProvider(param) {
    let { children } = param;
    _s();
    const [user, setUser] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"](null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const fetchSession = async ()=>{
            const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$client$5d$__$28$ecmascript$29$__["CheckSession"]();
            setUser(session?.user || null);
        };
        fetchSession();
    }, []);
    const logout = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"](async ()=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$client$5d$__$28$ecmascript$29$__["LogOutUser"]();
        setUser(null);
        if (typeof window !== "undefined") window.location.reload();
    }, []);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"](AuthContext.Provider, {
        value: {
            user,
            setUser,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "<[project]/context/AuthContext.jsx>",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "uE2UxO3LsdHeg1tRJVeyiUfHQHU=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"](AuthContext);
};
_s1(useAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_refresh__.register(_c, "AuthProvider");

})()),
"[project]/app/newproduct/page.jsx [client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>NewProduct
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/api.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/context/AuthContext.jsx [client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
function NewProduct() {
    _s();
    const router = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]();
    const { user } = __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"]();
    const [categories, setCategories] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [newCategory, setNewCategory] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [selectedCategories, setSelectedCategories] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const categoryRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const modelRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const barcodeRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const nameRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const descriptionRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const manualRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const imageRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"](null);
    // Fetch categories
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!user) {
            router.push("/admin");
            return;
        }
        const getCategories = async ()=>{
            try {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("/products/category");
                setCategories(res.data.categories || []);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        getCategories();
    }, [
        user,
        router
    ]);
    // ✅ Add category to selected list
    const handleSelectCategory = (e)=>{
        const id = e.target.value;
        if (id && !selectedCategories.includes(id)) {
            setSelectedCategories([
                ...selectedCategories,
                id
            ]);
        }
    };
    // ✅ Remove category tag
    const removeCategory = (id)=>{
        setSelectedCategories((prev)=>prev.filter((catId)=>catId !== id));
    };
    // ✅ Add new product
    const addProduct = async (e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("model", modelRef.current.value);
        formData.append("barcode", barcodeRef.current.value);
        formData.append("name", nameRef.current.value);
        formData.append("description", descriptionRef.current.value);
        // ✅ Add multiple categories
        selectedCategories.forEach((cat)=>formData.append("categories", cat));
        if (manualRef.current.files[0]) formData.append("manual", manualRef.current.files[0]);
        if (imageRef.current.files[0]) formData.append("image", imageRef.current.files[0]);
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
            const product = res.data.product;
            const slug = product.slug;
            // ✅ Redirect using first selected category (from UI)
            if (selectedCategories.length > 0) {
                const firstCategoryId = selectedCategories[0];
                // Fetch its name from your already-loaded category list
                const firstCategory = categories.find((cat)=>cat._id === firstCategoryId);
                const categorySlug = firstCategory ? firstCategory.name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-") : "others";
                router.push(`/products/${categorySlug}/${slug}`);
            } else {
                // fallback to products page
                router.push("/products");
            }
        } catch (err) {
            console.error("Add product error:", err);
            alert("Error adding product");
        }
    };
    // ✅ Add new category inline
    const addCategory = async ()=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("/products/category", {
                name: categoryRef.current.value
            });
            setCategories((prev)=>[
                    ...prev,
                    res.data.category
                ]);
            categoryRef.current.value = "";
            setNewCategory(false);
        } catch (err) {
            console.error("Add category error:", err);
        }
    };
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
        className: "flex flex-col w-full pt-10",
        children: /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("form", {
            onSubmit: addProduct,
            className: "flex flex-col my-2 gap-3 p-2.5 shadow-lg border border-gray-300 rounded-lg w-full max-w-sm mx-auto pt-5 bg-yellow-500",
            children: [
                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("h1", {
                    className: "text-xl font-bold leading-tight tracking-tight text-gray-900",
                    children: "New Product"
                }, void 0, false, {
                    fileName: "<[project]/app/newproduct/page.jsx>",
                    lineNumber: 123,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                    children: [
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("label", {
                            htmlFor: "model",
                            className: "block mb-2 text-sm font-medium text-gray-900",
                            children: "Model"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("input", {
                            ref: modelRef,
                            type: "text",
                            id: "model",
                            className: "block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-yellow-500 focus:border-yellow-500",
                            placeholder: "Product model"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 132,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "<[project]/app/newproduct/page.jsx>",
                    lineNumber: 128,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                    children: [
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("label", {
                            htmlFor: "barcode",
                            className: "block mb-2 text-sm font-medium text-gray-900",
                            children: "Barcode"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 143,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("input", {
                            ref: barcodeRef,
                            type: "text",
                            id: "barcode",
                            className: "block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-yellow-500 focus:border-yellow-500",
                            placeholder: "Product barcode"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "<[project]/app/newproduct/page.jsx>",
                    lineNumber: 142,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                    children: [
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("label", {
                            htmlFor: "name",
                            className: "block mb-2 text-sm font-medium text-gray-900",
                            children: "Name"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("input", {
                            ref: nameRef,
                            type: "text",
                            id: "name",
                            className: "block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-yellow-500 focus:border-yellow-500",
                            placeholder: "Product name"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "<[project]/app/newproduct/page.jsx>",
                    lineNumber: 156,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                    children: [
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("label", {
                            htmlFor: "description",
                            className: "block mb-2 text-sm font-medium text-gray-900",
                            children: "Description"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 171,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("textarea", {
                            ref: descriptionRef,
                            id: "description",
                            rows: "4",
                            className: "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500",
                            placeholder: "Product description"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 174,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "<[project]/app/newproduct/page.jsx>",
                    lineNumber: 170,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                    children: [
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("label", {
                            htmlFor: "categories",
                            className: "block mb-2 text-sm font-medium text-gray-900",
                            children: "Categories (Select one or more)"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                            className: "flex flex-col space-y-2",
                            children: [
                                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("select", {
                                    id: "categories",
                                    onChange: handleSelectCategory,
                                    className: "block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs",
                                    children: [
                                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("option", {
                                            value: "",
                                            children: "--Select Category--"
                                        }, void 0, false, {
                                            fileName: "<[project]/app/newproduct/page.jsx>",
                                            lineNumber: 196,
                                            columnNumber: 15
                                        }, this),
                                        categories.map((category)=>/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("option", {
                                                value: category._id,
                                                children: category.name
                                            }, category._id, false, {
                                                fileName: "<[project]/app/newproduct/page.jsx>",
                                                lineNumber: 198,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "<[project]/app/newproduct/page.jsx>",
                                    lineNumber: 191,
                                    columnNumber: 13
                                }, this),
                                selectedCategories.length > 0 && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                                    className: "flex flex-wrap gap-2 mt-1",
                                    children: selectedCategories.map((id)=>{
                                        const cat = categories.find((c)=>c._id === id);
                                        return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("span", {
                                            className: "flex items-center bg-black text-white px-2 py-1 rounded text-xs",
                                            children: [
                                                cat?.name || "Unknown",
                                                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("button", {
                                                    type: "button",
                                                    onClick: ()=>removeCategory(id),
                                                    className: "ml-1 text-yellow-400 hover:text-red-400",
                                                    title: "Remove",
                                                    children: "✕"
                                                }, void 0, false, {
                                                    fileName: "<[project]/app/newproduct/page.jsx>",
                                                    lineNumber: 215,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, id, true, {
                                            fileName: "<[project]/app/newproduct/page.jsx>",
                                            lineNumber: 210,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "<[project]/app/newproduct/page.jsx>",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 189,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("span", {
                            className: "mx-2 cursor-pointer text-sm underline",
                            onClick: ()=>setNewCategory(!newCategory),
                            children: "New"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 231,
                            columnNumber: 11
                        }, this),
                        newCategory && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                            className: "flex mt-2",
                            children: [
                                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("input", {
                                    type: "text",
                                    id: "category-name",
                                    ref: categoryRef,
                                    className: "block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs flex-1",
                                    placeholder: "new category name"
                                }, void 0, false, {
                                    fileName: "<[project]/app/newproduct/page.jsx>",
                                    lineNumber: 240,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("button", {
                                    onClick: addCategory,
                                    type: "button",
                                    className: "h-9 text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm ml-1 px-3",
                                    children: "+"
                                }, void 0, false, {
                                    fileName: "<[project]/app/newproduct/page.jsx>",
                                    lineNumber: 247,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 239,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "<[project]/app/newproduct/page.jsx>",
                    lineNumber: 184,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                    children: [
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("label", {
                            className: "block mb-2 text-sm font-medium text-gray-900",
                            children: "Manual"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 260,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("input", {
                            ref: manualRef,
                            type: "file",
                            id: "manual",
                            name: "manual",
                            className: "p-1.5 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 261,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "<[project]/app/newproduct/page.jsx>",
                    lineNumber: 259,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                    children: [
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("label", {
                            className: "block mb-2 text-sm font-medium text-gray-900",
                            children: "Image"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 272,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("input", {
                            ref: imageRef,
                            type: "file",
                            id: "image",
                            name: "image",
                            className: "p-1.5 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                        }, void 0, false, {
                            fileName: "<[project]/app/newproduct/page.jsx>",
                            lineNumber: 273,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "<[project]/app/newproduct/page.jsx>",
                    lineNumber: 271,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"]("button", {
                    type: "submit",
                    className: "flex justify-center w-full text-white bg-black hover:bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center",
                    children: "Add Product"
                }, void 0, false, {
                    fileName: "<[project]/app/newproduct/page.jsx>",
                    lineNumber: 283,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "<[project]/app/newproduct/page.jsx>",
            lineNumber: 119,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "<[project]/app/newproduct/page.jsx>",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_s(NewProduct, "mKyDBWr5cF4bo9bc0amogIf3jKA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AuthContext$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = NewProduct;
var _c;
__turbopack_refresh__.register(_c, "NewProduct");

})()),
}]);

//# sourceMappingURL=_9ad994._.js.map