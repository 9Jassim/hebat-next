module.exports = {

"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/parse-component-stack.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "parseComponentStack": ()=>parseComponentStack
});
function parseComponentStack(componentStack) {
    const componentStackFrames = [];
    for (const line of componentStack.trim().split("\n")){
        // Get component and file from the component stack line
        const match = /at ([^ ]+)( \((.*)\))?/.exec(line);
        if (match == null ? void 0 : match[1]) {
            const component = match[1];
            const webpackFile = match[3];
            // Stop parsing the component stack if we reach a Next.js component
            if (webpackFile == null ? void 0 : webpackFile.includes("next/dist")) {
                break;
            }
            const modulePath = webpackFile == null ? void 0 : webpackFile.replace(/^(webpack-internal:\/\/\/|file:\/\/)(\(.*\)\/)?/, "");
            var _modulePath_split;
            const [file, lineNumber, column] = (_modulePath_split = modulePath == null ? void 0 : modulePath.split(":", 3)) != null ? _modulePath_split : [];
            componentStackFrames.push({
                component,
                file,
                lineNumber: lineNumber ? Number(lineNumber) : undefined,
                column: column ? Number(column) : undefined
            });
        }
    }
    return componentStackFrames;
} //# sourceMappingURL=parse-component-stack.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/get-socket-url.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "getSocketUrl": ()=>getSocketUrl
});
function getSocketProtocol(assetPrefix) {
    let protocol = window.location.protocol;
    try {
        // assetPrefix is a url
        protocol = new URL(assetPrefix).protocol;
    } catch (e) {}
    return protocol === "http:" ? "ws" : "wss";
}
function getSocketUrl(assetPrefix) {
    const { hostname, port } = window.location;
    const protocol = getSocketProtocol(assetPrefix);
    const normalizedAssetPrefix = assetPrefix.replace(/^\/+/, "");
    let url = protocol + "://" + hostname + ":" + port + (normalizedAssetPrefix ? "/" + normalizedAssetPrefix : "");
    if (normalizedAssetPrefix.startsWith("http")) {
        url = protocol + "://" + normalizedAssetPrefix.split("://", 2)[1];
    }
    return url;
} //# sourceMappingURL=get-socket-url.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/use-websocket.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "useSendMessage": ()=>useSendMessage,
    "useTurbopack": ()=>useTurbopack,
    "useWebsocket": ()=>useWebsocket,
    "useWebsocketPing": ()=>useWebsocketPing
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/contexts/app-router-context.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$get$2d$socket$2d$url$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/get-socket-url.js [ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
function useWebsocket(assetPrefix) {
    const webSocketRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRef"]();
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (webSocketRef.current) {
            return;
        }
        const url = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$get$2d$socket$2d$url$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getSocketUrl"](assetPrefix);
        webSocketRef.current = new window.WebSocket("" + url + "/_next/webpack-hmr");
    }, [
        assetPrefix
    ]);
    return webSocketRef;
}
function useSendMessage(webSocketRef) {
    const sendMessage = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useCallback"]((data)=>{
        const socket = webSocketRef.current;
        if (!socket || socket.readyState !== socket.OPEN) {
            return;
        }
        return socket.send(data);
    }, [
        webSocketRef
    ]);
    return sendMessage;
}
function useTurbopack(sendMessage) {
    const turbopackState = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRef"]({
        init: false,
        // Until the dynamic import resolves, queue any turbopack messages which will be replayed.
        queue: [],
        callback: undefined
    });
    const processTurbopackMessage = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useCallback"]((msg)=>{
        var _msg_type;
        if ("type" in msg && ((_msg_type = msg.type) == null ? void 0 : _msg_type.startsWith("turbopack-"))) {
            const { callback, queue } = turbopackState.current;
            if (callback) {
                callback(msg);
            } else {
                queue.push(msg);
            }
            return true;
        }
        return false;
    }, []);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const { current: initCurrent } = turbopackState;
        // TODO(WEB-1589): only install if `process.turbopack` set.
        if (initCurrent.init) {
            return;
        }
        initCurrent.init = true;
        __turbopack_require__("[turbopack]/dev/client/hmr-client.ts [ssr] (ecmascript, loader)")(__turbopack_import__).then((param)=>{
            let { connect } = param;
            const { current } = turbopackState;
            connect({
                addMessageListener (cb) {
                    current.callback = cb;
                    // Replay all Turbopack messages before we were able to establish the HMR client.
                    for (const msg of current.queue){
                        cb(msg);
                    }
                    current.queue = undefined;
                },
                sendMessage
            });
        });
    }, [
        sendMessage
    ]);
    return processTurbopackMessage;
}
function useWebsocketPing(websocketRef) {
    const sendMessage = useSendMessage(websocketRef);
    const { tree } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useContext"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["GlobalLayoutRouterContext"]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        // Taken from on-demand-entries-client.js
        const interval = setInterval(()=>{
            sendMessage(JSON.stringify({
                event: "ping",
                tree,
                appDirRoute: true
            }));
        }, 2500);
        return ()=>clearInterval(interval);
    }, [
        tree,
        sendMessage
    ]);
} //# sourceMappingURL=use-websocket.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/hydration-error-info.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "hydrationErrorComponentStack": ()=>hydrationErrorComponentStack,
    "hydrationErrorWarning": ()=>hydrationErrorWarning,
    "patchConsoleError": ()=>patchConsoleError
});
let hydrationErrorWarning;
let hydrationErrorComponentStack;
// https://github.com/facebook/react/blob/main/packages/react-dom/src/__tests__/ReactDOMHydrationDiff-test.js used as a reference
const knownHydrationWarnings = new Set([
    'Warning: Text content did not match. Server: "%s" Client: "%s"%s',
    "Warning: Expected server HTML to contain a matching <%s> in <%s>.%s",
    'Warning: Expected server HTML to contain a matching text node for "%s" in <%s>.%s',
    "Warning: Did not expect server HTML to contain a <%s> in <%s>.%s",
    'Warning: Did not expect server HTML to contain the text node "%s" in <%s>.%s'
]);
function patchConsoleError() {
    const prev = console.error;
    console.error = function(msg, serverContent, clientContent, componentStack) {
        if (knownHydrationWarnings.has(msg)) {
            hydrationErrorWarning = msg.replace("%s", serverContent).replace("%s", clientContent).replace("%s", "");
            hydrationErrorComponentStack = componentStack;
        }
        // @ts-expect-error argument is defined
        prev.apply(console, arguments);
    };
} //# sourceMappingURL=hydration-error-info.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/use-error-handler.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "RuntimeErrorHandler": ()=>RuntimeErrorHandler,
    "useErrorHandler": ()=>useErrorHandler
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$hydration$2d$error$2d$info$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/hydration-error-info.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$is$2d$next$2d$router$2d$error$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/is-next-router-error.js [ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
const RuntimeErrorHandler = {
    hadRuntimeError: false
};
function isHydrationError(error) {
    return error.message.match(/(hydration|content does not match|did not match)/i) != null;
}
if (typeof window !== "undefined") {
    try {
        // Increase the number of stack frames on the client
        Error.stackTraceLimit = 50;
    } catch (e) {}
}
const errorQueue = [];
const rejectionQueue = [];
const errorHandlers = [];
const rejectionHandlers = [];
if (typeof window !== "undefined") {
    // These event handlers must be added outside of the hook because there is no
    // guarantee that the hook will be alive in a mounted component in time to
    // when the errors occur.
    window.addEventListener("error", (ev)=>{
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$is$2d$next$2d$router$2d$error$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["isNextRouterError"](ev.error)) {
            ev.preventDefault();
            return;
        }
        const error = ev == null ? void 0 : ev.error;
        if (!error || !(error instanceof Error) || typeof error.stack !== "string") {
            // A non-error was thrown, we don't have anything to show. :-(
            return;
        }
        if (isHydrationError(error) && !error.message.includes("https://nextjs.org/docs/messages/react-hydration-error")) {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$hydration$2d$error$2d$info$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hydrationErrorWarning"]) {
                // The patched console.error found hydration errors logged by React
                // Append the logged warning to the error message
                error.message += "\n\n" + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$hydration$2d$error$2d$info$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hydrationErrorWarning"];
            }
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$hydration$2d$error$2d$info$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hydrationErrorComponentStack"]) {
                error._componentStack = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$hydration$2d$error$2d$info$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hydrationErrorComponentStack"];
            }
            error.message += "\n\nSee more info here: https://nextjs.org/docs/messages/react-hydration-error";
        }
        const e = error;
        errorQueue.push(e);
        for (const handler of errorHandlers){
            handler(e);
        }
    });
    window.addEventListener("unhandledrejection", (ev)=>{
        const reason = ev == null ? void 0 : ev.reason;
        if (!reason || !(reason instanceof Error) || typeof reason.stack !== "string") {
            // A non-error was thrown, we don't have anything to show. :-(
            return;
        }
        const e = reason;
        rejectionQueue.push(e);
        for (const handler of rejectionHandlers){
            handler(e);
        }
    });
}
function useErrorHandler(handleOnUnhandledError, handleOnUnhandledRejection) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        // Handle queued errors.
        errorQueue.forEach(handleOnUnhandledError);
        rejectionQueue.forEach(handleOnUnhandledRejection);
        // Listen to new errors.
        errorHandlers.push(handleOnUnhandledError);
        rejectionHandlers.push(handleOnUnhandledRejection);
        return ()=>{
            // Remove listeners.
            errorHandlers.splice(errorHandlers.indexOf(handleOnUnhandledError), 1);
            rejectionHandlers.splice(rejectionHandlers.indexOf(handleOnUnhandledRejection), 1);
        };
    }, [
        handleOnUnhandledError,
        handleOnUnhandledRejection
    ]);
} //# sourceMappingURL=use-error-handler.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/noop-template.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "noop": ()=>noop
});
function noop(strings) {
    for(var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        keys[_key - 1] = arguments[_key];
    }
    const lastIndex = strings.length - 1;
    return strings.slice(0, lastIndex).reduce((p, s, i)=>p + s + keys[i], "") + strings[lastIndex];
} //# sourceMappingURL=noop-template.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/use-open-in-editor.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "useOpenInEditor": ()=>useOpenInEditor
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js [ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
function useOpenInEditor(param) {
    let { file, lineNumber, column } = param === void 0 ? {} : param;
    const openInEditor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (file == null || lineNumber == null || column == null) return;
        const params = new URLSearchParams();
        params.append("file", file);
        params.append("lineNumber", String(lineNumber));
        params.append("column", String(column));
        self.fetch((("TURBOPACK compile-time value", "") || "") + "/__nextjs_launch-editor?" + params.toString()).then(()=>{}, ()=>{
            console.error("There was an issue opening this code in your editor.");
        });
    }, [
        file,
        lineNumber,
        column
    ]);
    return openInEditor;
} //# sourceMappingURL=use-open-in-editor.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/stack-frame.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "getFrameSource": ()=>getFrameSource,
    "getOriginalStackFrame": ()=>getOriginalStackFrame,
    "getOriginalStackFrames": ()=>getOriginalStackFrames
});
function getOriginalStackFrame(source, type, errorMessage) {
    var _source_file, _source_file1;
    async function _getOriginalStackFrame() {
        var /* collapsed */ _source_file, _body_originalStackFrame_file, _body_originalStackFrame;
        const params = new URLSearchParams();
        params.append("isServer", String(type === "server"));
        params.append("isEdgeServer", String(type === "edge-server"));
        params.append("isAppDirectory", "true");
        params.append("errorMessage", errorMessage);
        for(const key in source){
            var _source_key;
            params.append(key, ((_source_key = source[key]) != null ? _source_key : "").toString());
        }
        const controller = new AbortController();
        const tm = setTimeout(()=>controller.abort(), 3000);
        const res = await self.fetch((("TURBOPACK compile-time value", "") || "") + "/__nextjs_original-stack-frame?" + params.toString(), {
            signal: controller.signal
        }).finally(()=>{
            clearTimeout(tm);
        });
        if (!res.ok || res.status === 204) {
            return Promise.reject(new Error(await res.text()));
        }
        const body = await res.json();
        var _ref;
        return {
            error: false,
            reason: null,
            external: false,
            expanded: !Boolean((_ref = ((_source_file = source.file) == null ? void 0 : _source_file.includes("node_modules")) || ((_body_originalStackFrame = body.originalStackFrame) == null ? void 0 : (_body_originalStackFrame_file = _body_originalStackFrame.file) == null ? void 0 : _body_originalStackFrame_file.includes("node_modules"))) != null ? _ref : true),
            sourceStackFrame: source,
            originalStackFrame: body.originalStackFrame,
            originalCodeFrame: body.originalCodeFrame || null,
            sourcePackage: body.sourcePackage
        };
    }
    if (source.file === "<anonymous>" || ((_source_file = source.file) == null ? void 0 : _source_file.match(/^node:/)) || ((_source_file1 = source.file) == null ? void 0 : _source_file1.match(/https?:\/\//))) {
        return Promise.resolve({
            error: false,
            reason: null,
            external: true,
            expanded: false,
            sourceStackFrame: source,
            originalStackFrame: null,
            originalCodeFrame: null
        });
    }
    var _err_message, _ref;
    return _getOriginalStackFrame().catch((err)=>({
            error: true,
            reason: (_ref = (_err_message = err == null ? void 0 : err.message) != null ? _err_message : err == null ? void 0 : err.toString()) != null ? _ref : "Unknown Error",
            external: false,
            expanded: false,
            sourceStackFrame: source,
            originalStackFrame: null,
            originalCodeFrame: null
        }));
}
function getOriginalStackFrames(frames, type, errorMessage) {
    return Promise.all(frames.map((frame)=>getOriginalStackFrame(frame, type, errorMessage)));
}
function getFrameSource(frame) {
    let str = "";
    try {
        var _globalThis_location;
        const u = new URL(frame.file);
        // Strip the origin for same-origin scripts.
        if (typeof globalThis !== "undefined" && ((_globalThis_location = globalThis.location) == null ? void 0 : _globalThis_location.origin) !== u.origin) {
            // URLs can be valid without an `origin`, so long as they have a
            // `protocol`. However, `origin` is preferred.
            if (u.origin === "null") {
                str += u.protocol;
            } else {
                str += u.origin;
            }
        }
        // Strip query string information as it's typically too verbose to be
        // meaningful.
        str += u.pathname;
        str += " ";
    } catch (e) {
        str += (frame.file || "(unknown)") + " ";
    }
    if (frame.lineNumber != null) {
        if (frame.column != null) {
            str += "(" + frame.lineNumber + ":" + frame.column + ") ";
        } else {
            str += "(" + frame.lineNumber + ") ";
        }
    }
    return str.slice(0, -1);
} //# sourceMappingURL=stack-frame.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/group-stack-frames-by-framework.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

/**
 * Get the origin framework of the stack frame by package name.
 */ __turbopack_esm__({
    "groupStackFramesByFramework": ()=>groupStackFramesByFramework
});
function getFramework(sourcePackage) {
    if (!sourcePackage) return undefined;
    if (/^(react|react-dom|react-is|react-refresh|react-server-dom-webpack|react-server-dom-turbopack|scheduler)$/.test(sourcePackage)) {
        return "react";
    } else if (sourcePackage === "next") {
        return "next";
    }
    return undefined;
}
function groupStackFramesByFramework(stackFrames) {
    const stackFramesGroupedByFramework = [];
    for (const stackFrame of stackFrames){
        const currentGroup = stackFramesGroupedByFramework[stackFramesGroupedByFramework.length - 1];
        const framework = getFramework(stackFrame.sourcePackage);
        if (currentGroup && currentGroup.framework === framework) {
            currentGroup.stackFrames.push(stackFrame);
        } else {
            stackFramesGroupedByFramework.push({
                framework: framework,
                stackFrames: [
                    stackFrame
                ]
            });
        }
    }
    return stackFramesGroupedByFramework;
} //# sourceMappingURL=group-stack-frames-by-framework.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/nodeStackFrames.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "decorateServerError": ()=>decorateServerError,
    "getErrorSource": ()=>getErrorSource,
    "getFilesystemFrame": ()=>getFilesystemFrame,
    "getServerError": ()=>getServerError
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$stacktrace$2d$parser$2f$stack$2d$trace$2d$parser$2e$cjs$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/stacktrace-parser/stack-trace-parser.cjs.js [ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
function getFilesystemFrame(frame) {
    const f = {
        ...frame
    };
    if (typeof f.file === "string") {
        if (f.file.startsWith("/") || // Win32:
        /^[a-z]:\\/i.test(f.file) || // Win32 UNC:
        f.file.startsWith("\\\\")) {
            f.file = "file://" + f.file;
        }
    }
    return f;
}
const symbolError = Symbol("NextjsError");
function getErrorSource(error) {
    return error[symbolError] || null;
}
function decorateServerError(error, type) {
    Object.defineProperty(error, symbolError, {
        writable: false,
        enumerable: false,
        configurable: false,
        value: type
    });
}
function getServerError(error, type) {
    let n;
    try {
        throw new Error(error.message);
    } catch (e) {
        n = e;
    }
    n.name = error.name;
    try {
        n.stack = n.toString() + "\n" + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$stacktrace$2d$parser$2f$stack$2d$trace$2d$parser$2e$cjs$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["parse"](error.stack).map(getFilesystemFrame).map((f)=>{
            let str = "    at " + f.methodName;
            if (f.file) {
                let loc = f.file;
                if (f.lineNumber) {
                    loc += ":" + f.lineNumber;
                    if (f.column) {
                        loc += ":" + f.column;
                    }
                }
                str += " (" + loc + ")";
            }
            return str;
        }).join("\n");
    } catch (e) {
        n.stack = error.stack;
    }
    decorateServerError(n, type);
    return n;
} //# sourceMappingURL=nodeStackFrames.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/getErrorByType.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "getErrorByType": ()=>getErrorByType
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/error-overlay-reducer.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$nodeStackFrames$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/nodeStackFrames.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$stack$2d$frame$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/stack-frame.js [ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
async function getErrorByType(ev) {
    const { id, event } = ev;
    switch(event.type){
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ACTION_UNHANDLED_ERROR"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ACTION_UNHANDLED_REJECTION"]:
            {
                const readyRuntimeError = {
                    id,
                    runtime: true,
                    error: event.reason,
                    frames: await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$stack$2d$frame$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getOriginalStackFrames"](event.frames, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$nodeStackFrames$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getErrorSource"](event.reason), event.reason.toString())
                };
                if (event.type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ACTION_UNHANDLED_ERROR"]) {
                    readyRuntimeError.componentStackFrames = event.componentStackFrames;
                }
                return readyRuntimeError;
            }
        default:
            {
                break;
            }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = event;
    throw new Error("type system invariant violation");
} //# sourceMappingURL=getErrorByType.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/parseStack.js [ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "parseStack": ()=>parseStack
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$stacktrace$2d$parser$2f$stack$2d$trace$2d$parser$2e$cjs$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/stacktrace-parser/stack-trace-parser.cjs.js [ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const regexNextStatic = /\/_next(\/static\/.+)/;
function parseStack(stack) {
    const frames = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$stacktrace$2d$parser$2f$stack$2d$trace$2d$parser$2e$cjs$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["parse"](stack);
    return frames.map((frame)=>{
        try {
            const url = new URL(frame.file);
            const res = regexNextStatic.exec(url.pathname);
            if (res) {
                var _process_env___NEXT_DIST_DIR_replace, _process_env___NEXT_DIST_DIR;
                const distDir = (_process_env___NEXT_DIST_DIR = process.env.__NEXT_DIST_DIR) == null ? void 0 : (_process_env___NEXT_DIST_DIR_replace = _process_env___NEXT_DIST_DIR.replace(/\\/g, "/")) == null ? void 0 : _process_env___NEXT_DIST_DIR_replace.replace(/\/$/, "");
                if (distDir) {
                    frame.file = "file://" + distDir.concat(res.pop());
                }
            }
        } catch (e) {}
        return frame;
    });
} //# sourceMappingURL=parseStack.js.map

})()),

};

//# sourceMappingURL=8069e_next_dist_esm_client_components_react-dev-overlay_internal_helpers_34cca5._.js.map