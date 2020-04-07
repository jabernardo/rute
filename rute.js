"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var route_ts_1 = require("./route.ts");
var route_parser_ts_1 = require("./route_parser.ts");
var server_ts_1 = require("https://deno.land/std@v0.36.0/http/server.ts");
var middleware_ts_1 = require("./middleware.ts");
var request_ts_1 = require("./request.ts");
var Rute = /** @class */ (function (_super) {
    __extends(Rute, _super);
    function Rute() {
        var _this = _super.call(this) || this;
        _this._routes = {};
        _this._default = new route_ts_1.Route("404", ["GET", "POST", "DELETE", "UPDATE", "PUT", "OPTIONS", "HEAD"], function (request) {
            return {
                status: 404,
                body: "404 Page not Found"
            };
        });
        return _this;
    }
    Rute.prototype.addRoute = function (method, path, handler) {
        var middlewares = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            middlewares[_i - 3] = arguments[_i];
        }
        var routePath = path != "/" ? route_parser_ts_1.getCleanPath(path) : "/";
        this._routes[routePath] = new route_ts_1.Route(path, method, handler);
        return this._routes[routePath];
    };
    Rute.prototype.getRoute = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var routeObj, data, route;
            return __generator(this, function (_a) {
                routeObj = this._routes["404"] || this._default;
                data = {};
                for (route in this._routes) {
                    data = route_parser_ts_1.test(route, url);
                    if (data != null) {
                        routeObj = this._routes[route];
                        break;
                    }
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        resolve({
                            path: url,
                            data: data == null ? {} : data,
                            route: routeObj
                        });
                    })];
            });
        });
    };
    Rute.prototype.listen = function (s) {
        var s_1, s_1_1;
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var req, path, routeInfo, httpRequest, answer, _b, _c, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, 8, 13]);
                        s_1 = __asyncValues(s);
                        _d.label = 1;
                    case 1: return [4 /*yield*/, s_1.next()];
                    case 2:
                        if (!(s_1_1 = _d.sent(), !s_1_1.done)) return [3 /*break*/, 6];
                        req = s_1_1.value;
                        path = route_parser_ts_1.getCleanPath(req.url);
                        return [4 /*yield*/, this.getRoute(path)];
                    case 3:
                        routeInfo = _d.sent();
                        httpRequest = new request_ts_1.Request(req);
                        answer = this._default.execute(httpRequest);
                        _c = (_b = console).log;
                        return [4 /*yield*/, httpRequest.body()];
                    case 4:
                        _c.apply(_b, [_d.sent()]);
                        if (routeInfo.route != undefined) {
                            this.go(function () {
                                httpRequest = new request_ts_1.Request(req, routeInfo.data);
                                answer = routeInfo.route.execute(httpRequest);
                                console.log(answer);
                            });
                        }
                        req.respond(answer);
                        _d.label = 5;
                    case 5: return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _d.trys.push([8, , 11, 12]);
                        if (!(s_1_1 && !s_1_1.done && (_a = s_1["return"]))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(s_1)];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    return Rute;
}(middleware_ts_1.Middleware));
exports.Rute = Rute;
var app = new Rute();
app.use(function (next) {
    console.log("start");
    next();
    console.log("stop");
});
app.addRoute("GET", "/", function (request) {
    return {
        body: "Hi There!"
    };
});
app.addRoute("GET", "/categories/{category}/pages/{page}", function (request) {
    console.log(request.params);
    return {
        body: "Boo!"
    };
});
app.listen(server_ts_1.serve({ port: 8000 }));
console.log('test');
