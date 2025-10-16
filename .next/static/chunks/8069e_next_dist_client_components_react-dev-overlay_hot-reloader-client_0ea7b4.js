(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/8069e_next_dist_client_components_react-dev-overlay_hot-reloader-client_0ea7b4.js", {

"[project]/node_modules/next/dist/client/components/react-dev-overlay/hot-reloader-client.js [client] (ecmascript)": (function({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, k: __turbopack_refresh__, m: module, e: exports, t: require }) { !function() {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return HotReload;
    }
});
const _interop_require_default = __turbopack_require__("[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [client] (ecmascript)");
const _interop_require_wildcard = __turbopack_require__("[project]/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_require__("[project]/node_modules/next/dist/compiled/react/index.js [client] (ecmascript)"));
const _stripansi = /*#__PURE__*/ _interop_require_default._(__turbopack_require__("[project]/node_modules/next/dist/compiled/strip-ansi/index.js [client] (ecmascript)"));
const _formatwebpackmessages = /*#__PURE__*/ _interop_require_default._(__turbopack_require__("[project]/node_modules/next/dist/client/dev/error-overlay/format-webpack-messages.js [client] (ecmascript)"));
const _navigation = __turbopack_require__("[project]/node_modules/next/dist/client/components/navigation.js [client] (ecmascript)");
const _erroroverlayreducer = __turbopack_require__("[project]/node_modules/next/dist/client/components/react-dev-overlay/internal/error-overlay-reducer.js [client] (ecmascript)");
const _parseStack = __turbopack_require__("[project]/node_modules/next/dist/client/components/react-dev-overlay/internal/helpers/parseStack.js [client] (ecmascript)");
const _ReactDevOverlay = /*#__PURE__*/ _interop_require_default._(__turbopack_require__("[project]/node_modules/next/dist/client/components/react-dev-overlay/internal/ReactDevOverlay.js [client] (ecmascript)"));
const _useerrorhandler = __turbopack_require__("[project]/node_modules/next/dist/client/components/react-dev-overlay/internal/helpers/use-error-handler.js [client] (ecmascript)");
const _usewebsocket = __turbopack_require__("[project]/node_modules/next/dist/client/components/react-dev-overlay/internal/helpers/use-websocket.js [client] (ecmascript)");
const _parsecomponentstack = __turbopack_require__("[project]/node_modules/next/dist/client/components/react-dev-overlay/internal/helpers/parse-component-stack.js [client] (ecmascript)");
const _hotreloadertypes = __turbopack_require__("[project]/node_modules/next/dist/server/dev/hot-reloader-types.js [client] (ecmascript)");
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
        hadRuntimeError: !!_useerrorhandler.RuntimeErrorHandler.hadRuntimeError
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
        if (err || _useerrorhandler.RuntimeErrorHandler.hadRuntimeError || !updatedModules) {
            if (err) {
                console.warn("[Fast Refresh] performing full reload\n\n" + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + "You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n" + "Consider migrating the non-React component export to a separate file and importing it into both files.\n\n" + "It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n" + "Fast Refresh requires at least one parent function component in your React tree.");
            } else if (_useerrorhandler.RuntimeErrorHandler.hadRuntimeError) {
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
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.__NEXT_TEST_MODE) {
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
        const formatted = (0, _formatwebpackmessages.default)({
            errors: errors,
            warnings: []
        });
        // Only show the first error.
        dispatcher.onBuildError(formatted.errors[0]);
        // Also log them to the console.
        for(let i = 0; i < formatted.errors.length; i++){
            console.error((0, _stripansi.default)(formatted.errors[i]));
        }
        // Do not attempt to reload now.
        // We will reload on next success instead.
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.__NEXT_TEST_MODE) {
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
        case _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.BUILDING:
            {
                console.log("[Fast Refresh] rebuilding");
                break;
            }
        case _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.FINISH_BUILDING:
            {
                break;
            }
        case _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.BUILT:
        case _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.SYNC:
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
                    const isHotUpdate = obj.action !== _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.SYNC;
                    // Print warnings to the console.
                    const formattedMessages = (0, _formatwebpackmessages.default)({
                        warnings: warnings,
                        errors: []
                    });
                    for(let i = 0; i < formattedMessages.warnings.length; i++){
                        if (i === 5) {
                            console.warn("There were more warnings in other files.\n" + "You can find a complete log in the terminal.");
                            break;
                        }
                        console.warn((0, _stripansi.default)(formattedMessages.warnings[i]));
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
                const isHotUpdate = obj.action !== _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.SYNC && (!window.__NEXT_DATA__ || window.__NEXT_DATA__.page !== "/_error") && isUpdateAvailable();
                // Attempt to apply hot updates or reload.
                if (isHotUpdate) {
                    handleHotUpdate();
                }
                return;
            }
        // TODO-APP: make server component change more granular
        case _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.SERVER_COMPONENT_CHANGES:
            {
                sendMessage(JSON.stringify({
                    event: "server-component-reload-page",
                    clientId: __nextDevClientId
                }));
                if (_useerrorhandler.RuntimeErrorHandler.hadRuntimeError) {
                    if (reloading) return;
                    reloading = true;
                    return window.location.reload();
                }
                (0, _react.startTransition)(()=>{
                    // @ts-ignore it exists, it's just hidden
                    router.fastRefresh();
                    dispatcher.onRefresh();
                });
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.__NEXT_TEST_MODE) {
                    if (self.__NEXT_HMR_CB) {
                        self.__NEXT_HMR_CB();
                        self.__NEXT_HMR_CB = null;
                    }
                }
                return;
            }
        case _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.RELOAD_PAGE:
            {
                sendMessage(JSON.stringify({
                    event: "client-reload-page",
                    clientId: __nextDevClientId
                }));
                if (reloading) return;
                reloading = true;
                return window.location.reload();
            }
        case _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.REMOVED_PAGE:
            {
                // TODO-APP: potentially only refresh if the currently viewed page was removed.
                // @ts-ignore it exists, it's just hidden
                router.fastRefresh();
                return;
            }
        case _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.ADDED_PAGE:
            {
                // TODO-APP: potentially only refresh if the currently viewed page was added.
                // @ts-ignore it exists, it's just hidden
                router.fastRefresh();
                return;
            }
        case _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.SERVER_ERROR:
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
        case _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.DEV_PAGES_MANIFEST_UPDATE:
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
    const [state, dispatch] = (0, _react.useReducer)(_erroroverlayreducer.errorOverlayReducer, _erroroverlayreducer.INITIAL_OVERLAY_STATE);
    const dispatcher = (0, _react.useMemo)(()=>{
        return {
            onBuildOk () {
                dispatch({
                    type: _erroroverlayreducer.ACTION_BUILD_OK
                });
            },
            onBuildError (message) {
                dispatch({
                    type: _erroroverlayreducer.ACTION_BUILD_ERROR,
                    message
                });
            },
            onBeforeRefresh () {
                dispatch({
                    type: _erroroverlayreducer.ACTION_BEFORE_REFRESH
                });
            },
            onRefresh () {
                dispatch({
                    type: _erroroverlayreducer.ACTION_REFRESH
                });
            },
            onVersionInfo (versionInfo) {
                dispatch({
                    type: _erroroverlayreducer.ACTION_VERSION_INFO,
                    versionInfo
                });
            }
        };
    }, [
        dispatch
    ]);
    const handleOnUnhandledError = (0, _react.useCallback)((error)=>{
        // Component stack is added to the error in use-error-handler in case there was a hydration errror
        const componentStack = error._componentStack;
        dispatch({
            type: _erroroverlayreducer.ACTION_UNHANDLED_ERROR,
            reason: error,
            frames: (0, _parseStack.parseStack)(error.stack),
            componentStackFrames: componentStack && (0, _parsecomponentstack.parseComponentStack)(componentStack)
        });
    }, []);
    const handleOnUnhandledRejection = (0, _react.useCallback)((reason)=>{
        dispatch({
            type: _erroroverlayreducer.ACTION_UNHANDLED_REJECTION,
            reason: reason,
            frames: (0, _parseStack.parseStack)(reason.stack)
        });
    }, []);
    const handleOnReactError = (0, _react.useCallback)(()=>{
        _useerrorhandler.RuntimeErrorHandler.hadRuntimeError = true;
    }, []);
    (0, _useerrorhandler.useErrorHandler)(handleOnUnhandledError, handleOnUnhandledRejection);
    const webSocketRef = (0, _usewebsocket.useWebsocket)(assetPrefix);
    (0, _usewebsocket.useWebsocketPing)(webSocketRef);
    const sendMessage = (0, _usewebsocket.useSendMessage)(webSocketRef);
    const processTurbopackMessage = (0, _usewebsocket.useTurbopack)(sendMessage);
    const router = (0, _navigation.useRouter)();
    (0, _react.useEffect)(()=>{
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
    return /*#__PURE__*/ _react.default.createElement(_ReactDevOverlay.default, {
        onReactError: handleOnReactError,
        state: state
    }, children);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=hot-reloader-client.js.map

}.call(this) }),
}]);

//# sourceMappingURL=8069e_next_dist_client_components_react-dev-overlay_hot-reloader-client_0ea7b4.js.map