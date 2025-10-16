module.exports = {

"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/hot-reloader-client.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>HotReload
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$strip$2d$ansi$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/strip-ansi/index.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$dev$2f$error$2d$overlay$2f$format$2d$webpack$2d$messages$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/dev/error-overlay/format-webpack-messages.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/navigation.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/error-overlay-reducer.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$parseStack$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/parseStack.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$ReactDevOverlay$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/ReactDevOverlay.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$use$2d$error$2d$handler$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/use-error-handler.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$use$2d$websocket$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/use-websocket.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$parse$2d$component$2d$stack$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/parse-component-stack.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/server/dev/hot-reloader-types.js [ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
;
;
;
;
;
;
;
;
;
let mostRecentCompilationHash = null;
let __nextDevClientId = Math.round(Math.random() * 100 + Date.now());
let reloading = false;
function onBeforeFastRefresh(dispatcher, hasUpdates) {
    if (hasUpdates) {
        dispatcher.onBeforeRefresh();
    }
}
function onFastRefresh(dispatcher, hasUpdates) {
    dispatcher.onBuildOk();
    if (hasUpdates) {
        dispatcher.onRefresh();
    }
}
// There is a newer version of the code available.
function handleAvailableHash(hash) {
    // Update last known compilation hash.
    mostRecentCompilationHash = hash;
}
// Is there a newer version of this code available?
function isUpdateAvailable() {
    /* globals __webpack_hash__ */ // __webpack_hash__ is the hash of the current compilation.
    // It's a global variable injected by Webpack.
    return mostRecentCompilationHash !== __webpack_hash__;
}
// Webpack disallows updates in other states.
function canApplyUpdates() {
    // @ts-expect-error module.hot exists
    return module.hot.status() === "idle";
}
function afterApplyUpdates(fn) {
    if (canApplyUpdates()) {
        fn();
    } else {
        function handler(status) {
            if (status === "idle") {
                // @ts-expect-error module.hot exists
                module.hot.removeStatusHandler(handler);
                fn();
            }
        }
        // @ts-expect-error module.hot exists
        module.hot.addStatusHandler(handler);
    }
}
function performFullReload(err, sendMessage) {
    const stackTrace = err && (err.stack && err.stack.split("\n").slice(0, 5).join("\n") || err.message || err + "");
    sendMessage(JSON.stringify({
        event: "client-full-reload",
        stackTrace,
        hadRuntimeError: !!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$use$2d$error$2d$handler$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["RuntimeErrorHandler"].hadRuntimeError
    }));
    if (reloading) return;
    reloading = true;
    window.location.reload();
}
// Attempt to update code on the fly, fall back to a hard reload.
function tryApplyUpdates(onBeforeUpdate, onHotUpdateSuccess, sendMessage, dispatcher) {
    if (!isUpdateAvailable() || !canApplyUpdates()) {
        dispatcher.onBuildOk();
        return;
    }
    function handleApplyUpdates(err, updatedModules) {
        if (err || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$use$2d$error$2d$handler$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["RuntimeErrorHandler"].hadRuntimeError || !updatedModules) {
            if (err) {
                console.warn("[Fast Refresh] performing full reload\n\n" + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + "You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n" + "Consider migrating the non-React component export to a separate file and importing it into both files.\n\n" + "It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n" + "Fast Refresh requires at least one parent function component in your React tree.");
            } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$use$2d$error$2d$handler$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["RuntimeErrorHandler"].hadRuntimeError) {
                console.warn("[Fast Refresh] performing full reload because your application had an unrecoverable error");
            }
            performFullReload(err, sendMessage);
            return;
        }
        const hasUpdates = Boolean(updatedModules.length);
        if (typeof onHotUpdateSuccess === "function") {
            // Maybe we want to do something.
            onHotUpdateSuccess(hasUpdates);
        }
        if (isUpdateAvailable()) {
            // While we were updating, there was a new update! Do it again.
            tryApplyUpdates(hasUpdates ? ()=>{} : onBeforeUpdate, hasUpdates ? ()=>dispatcher.onBuildOk() : onHotUpdateSuccess, sendMessage, dispatcher);
        } else {
            dispatcher.onBuildOk();
            if (process.env.__NEXT_TEST_MODE) {
                afterApplyUpdates(()=>{
                    if (self.__NEXT_HMR_CB) {
                        self.__NEXT_HMR_CB();
                        self.__NEXT_HMR_CB = null;
                    }
                });
            }
        }
    }
    // https://webpack.js.org/api/hot-module-replacement/#check
    // @ts-expect-error module.hot exists
    module.hot.check(/* autoApply */ false).then((updatedModules)=>{
        if (!updatedModules) {
            return null;
        }
        if (typeof onBeforeUpdate === "function") {
            const hasUpdates = Boolean(updatedModules.length);
            onBeforeUpdate(hasUpdates);
        }
        // https://webpack.js.org/api/hot-module-replacement/#apply
        // @ts-expect-error module.hot exists
        return module.hot.apply();
    }).then((updatedModules)=>{
        handleApplyUpdates(null, updatedModules);
    }, (err)=>{
        handleApplyUpdates(err, null);
    });
}
function processMessage(obj, sendMessage, router, dispatcher) {
    if (!("action" in obj)) {
        return;
    }
    function handleErrors(errors) {
        // "Massage" webpack messages.
        const formatted = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$dev$2f$error$2d$overlay$2f$format$2d$webpack$2d$messages$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"]({
            errors: errors,
            warnings: []
        });
        // Only show the first error.
        dispatcher.onBuildError(formatted.errors[0]);
        // Also log them to the console.
        for(let i = 0; i < formatted.errors.length; i++){
            console.error(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$strip$2d$ansi$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"](formatted.errors[i]));
        }
        // Do not attempt to reload now.
        // We will reload on next success instead.
        if (process.env.__NEXT_TEST_MODE) {
            if (self.__NEXT_HMR_CB) {
                self.__NEXT_HMR_CB(formatted.errors[0]);
                self.__NEXT_HMR_CB = null;
            }
        }
    }
    function handleHotUpdate() {
        if ("TURBOPACK compile-time truthy", 1) {
            onFastRefresh(dispatcher, true);
        } else {
            "TURBOPACK unreachable";
        }
    }
    switch(obj.action){
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["HMR_ACTIONS_SENT_TO_BROWSER"].BUILDING:
            {
                console.log("[Fast Refresh] rebuilding");
                break;
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["HMR_ACTIONS_SENT_TO_BROWSER"].FINISH_BUILDING:
            {
                break;
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["HMR_ACTIONS_SENT_TO_BROWSER"].BUILT:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["HMR_ACTIONS_SENT_TO_BROWSER"].SYNC:
            {
                if (obj.hash) {
                    handleAvailableHash(obj.hash);
                }
                const { errors, warnings } = obj;
                // Is undefined when it's a 'built' event
                if ("versionInfo" in obj) {
                    dispatcher.onVersionInfo(obj.versionInfo);
                }
                const hasErrors = Boolean(errors && errors.length);
                // Compilation with errors (e.g. syntax error or missing modules).
                if (hasErrors) {
                    sendMessage(JSON.stringify({
                        event: "client-error",
                        errorCount: errors.length,
                        clientId: __nextDevClientId
                    }));
                    handleErrors(errors);
                    return;
                }
                const hasWarnings = Boolean(warnings && warnings.length);
                if (hasWarnings) {
                    sendMessage(JSON.stringify({
                        event: "client-warning",
                        warningCount: warnings.length,
                        clientId: __nextDevClientId
                    }));
                    // Compilation with warnings (e.g. ESLint).
                    const isHotUpdate = obj.action !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["HMR_ACTIONS_SENT_TO_BROWSER"].SYNC;
                    // Print warnings to the console.
                    const formattedMessages = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$dev$2f$error$2d$overlay$2f$format$2d$webpack$2d$messages$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"]({
                        warnings: warnings,
                        errors: []
                    });
                    for(let i = 0; i < formattedMessages.warnings.length; i++){
                        if (i === 5) {
                            console.warn("There were more warnings in other files.\n" + "You can find a complete log in the terminal.");
                            break;
                        }
                        console.warn(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$strip$2d$ansi$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"](formattedMessages.warnings[i]));
                    }
                    // Attempt to apply hot updates or reload.
                    if (isHotUpdate) {
                        handleHotUpdate();
                    }
                    return;
                }
                sendMessage(JSON.stringify({
                    event: "client-success",
                    clientId: __nextDevClientId
                }));
                const isHotUpdate = obj.action !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["HMR_ACTIONS_SENT_TO_BROWSER"].SYNC && (!window.__NEXT_DATA__ || window.__NEXT_DATA__.page !== "/_error") && isUpdateAvailable();
                // Attempt to apply hot updates or reload.
                if (isHotUpdate) {
                    handleHotUpdate();
                }
                return;
            }
        // TODO-APP: make server component change more granular
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["HMR_ACTIONS_SENT_TO_BROWSER"].SERVER_COMPONENT_CHANGES:
            {
                sendMessage(JSON.stringify({
                    event: "server-component-reload-page",
                    clientId: __nextDevClientId
                }));
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$use$2d$error$2d$handler$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["RuntimeErrorHandler"].hadRuntimeError) {
                    if (reloading) return;
                    reloading = true;
                    return window.location.reload();
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["startTransition"](()=>{
                    // @ts-ignore it exists, it's just hidden
                    router.fastRefresh();
                    dispatcher.onRefresh();
                });
                if (process.env.__NEXT_TEST_MODE) {
                    if (self.__NEXT_HMR_CB) {
                        self.__NEXT_HMR_CB();
                        self.__NEXT_HMR_CB = null;
                    }
                }
                return;
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["HMR_ACTIONS_SENT_TO_BROWSER"].RELOAD_PAGE:
            {
                sendMessage(JSON.stringify({
                    event: "client-reload-page",
                    clientId: __nextDevClientId
                }));
                if (reloading) return;
                reloading = true;
                return window.location.reload();
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["HMR_ACTIONS_SENT_TO_BROWSER"].REMOVED_PAGE:
            {
                // TODO-APP: potentially only refresh if the currently viewed page was removed.
                // @ts-ignore it exists, it's just hidden
                router.fastRefresh();
                return;
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["HMR_ACTIONS_SENT_TO_BROWSER"].ADDED_PAGE:
            {
                // TODO-APP: potentially only refresh if the currently viewed page was added.
                // @ts-ignore it exists, it's just hidden
                router.fastRefresh();
                return;
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["HMR_ACTIONS_SENT_TO_BROWSER"].SERVER_ERROR:
            {
                const { errorJSON } = obj;
                if (errorJSON) {
                    const { message, stack } = JSON.parse(errorJSON);
                    const error = new Error(message);
                    error.stack = stack;
                    handleErrors([
                        error
                    ]);
                }
                return;
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$dev$2f$hot$2d$reloader$2d$types$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["HMR_ACTIONS_SENT_TO_BROWSER"].DEV_PAGES_MANIFEST_UPDATE:
            {
                return;
            }
        default:
            {
                throw new Error("Unexpected action " + JSON.stringify(obj));
            }
    }
}
function HotReload(param) {
    let { assetPrefix, children } = param;
    const [state, dispatch] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useReducer"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["errorOverlayReducer"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["INITIAL_OVERLAY_STATE"]);
    const dispatcher = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return {
            onBuildOk () {
                dispatch({
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ACTION_BUILD_OK"]
                });
            },
            onBuildError (message) {
                dispatch({
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ACTION_BUILD_ERROR"],
                    message
                });
            },
            onBeforeRefresh () {
                dispatch({
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ACTION_BEFORE_REFRESH"]
                });
            },
            onRefresh () {
                dispatch({
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ACTION_REFRESH"]
                });
            },
            onVersionInfo (versionInfo) {
                dispatch({
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ACTION_VERSION_INFO"],
                    versionInfo
                });
            }
        };
    }, [
        dispatch
    ]);
    const handleOnUnhandledError = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useCallback"]((error)=>{
        // Component stack is added to the error in use-error-handler in case there was a hydration errror
        const componentStack = error._componentStack;
        dispatch({
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ACTION_UNHANDLED_ERROR"],
            reason: error,
            frames: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$parseStack$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["parseStack"](error.stack),
            componentStackFrames: componentStack && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$parse$2d$component$2d$stack$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["parseComponentStack"](componentStack)
        });
    }, []);
    const handleOnUnhandledRejection = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useCallback"]((reason)=>{
        dispatch({
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ACTION_UNHANDLED_REJECTION"],
            reason: reason,
            frames: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$parseStack$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["parseStack"](reason.stack)
        });
    }, []);
    const handleOnReactError = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$use$2d$error$2d$handler$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["RuntimeErrorHandler"].hadRuntimeError = true;
    }, []);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$use$2d$error$2d$handler$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useErrorHandler"](handleOnUnhandledError, handleOnUnhandledRejection);
    const webSocketRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$use$2d$websocket$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useWebsocket"](assetPrefix);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$use$2d$websocket$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useWebsocketPing"](webSocketRef);
    const sendMessage = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$use$2d$websocket$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useSendMessage"](webSocketRef);
    const processTurbopackMessage = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$use$2d$websocket$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useTurbopack"](sendMessage);
    const router = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"]();
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const handler = (event)=>{
            try {
                const obj = JSON.parse(event.data);
                const handledByTurbopack = processTurbopackMessage == null ? void 0 : processTurbopackMessage(obj);
                if (!handledByTurbopack) {
                    processMessage(obj, sendMessage, router, dispatcher);
                }
            } catch (err) {
                var _err_stack;
                console.warn("[HMR] Invalid message: " + event.data + "\n" + ((_err_stack = err == null ? void 0 : err.stack) != null ? _err_stack : ""));
            }
        };
        const websocket = webSocketRef.current;
        if (websocket) {
            websocket.addEventListener("message", handler);
        }
        return ()=>websocket && websocket.removeEventListener("message", handler);
    }, [
        sendMessage,
        router,
        webSocketRef,
        dispatcher,
        processTurbopackMessage
    ]);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$ReactDevOverlay$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        onReactError: handleOnReactError,
        state: state
    }, children);
} //# sourceMappingURL=hot-reloader-client.js.map

})()),

};

//# sourceMappingURL=8069e_next_dist_esm_client_components_react-dev-overlay_hot-reloader-client_b8faa0.js.map