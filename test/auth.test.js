"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const faker_1 = __importDefault(require("@faker-js/faker"));
const app_1 = require("../src/app");
const mongo_1 = require("../src/connection/mongo");
const config_1 = require("../src/config");
const role_model_1 = __importDefault(require("../src/models/role.model"));
const user_model_1 = __importDefault(require("../src/models/user.model"));
const rolesAndPermissions_1 = require("../src/constants/rolesAndPermissions");
jest.setTimeout(30000);
let email;
let username;
let password;
let name;
const promoteUserToSuperAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let adminRole = yield role_model_1.default.findOne({ name: rolesAndPermissions_1.roles.superAdmin.name });
    return user_model_1.default.updateOne({ _id: id }, { role: adminRole === null || adminRole === void 0 ? void 0 : adminRole.id });
});
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongo_1.mongoDBConnection)(config_1.mongoConnectionString);
    email = faker_1.default.internet.email().toLowerCase();
    username = faker_1.default.internet.userName().toLowerCase();
    password = faker_1.default.random.alpha({ count: 10 });
    name = faker_1.default.name.findName().toLowerCase();
}));
describe("POST /API/user/REGISTER", () => {
    it("should return 200 && valid response if request body is valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post(`/api/user/register`)
            .send({
            email,
            password,
            username,
            name,
        })
            .expect("Content-Type", /json/);
        expect(res.body).toMatchObject({ data: { email, username } });
        expect(res.statusCode).toEqual(200);
    }));
    it("should return 422 & error response if request body is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post(`/api/user/register`).send({
            email,
        });
        expect(res.body).toMatchObject({ error: { type: "body validation" } });
        expect(res.statusCode).toEqual(422);
    }));
    it("should return 400 && valid response if email or already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post(`/api/user/register`)
            .send({
            email,
            password,
            username,
            name,
        })
            .expect("Content-Type", /json/)
            .expect(400);
        expect(res.body).toMatchObject({
            error: { message: "Email alreay exists", status: 400 },
        });
        expect(res.statusCode).toBe(400);
    }));
});
describe("POST /API/user/LOGIN", () => {
    it("should return 200 && valid response and user token if email and password matches a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post(`/api/user/login`)
            .send({
            email,
            password,
        })
            .expect("Content-Type", /json/);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
            message: "Welcome back",
            data: {
                user: {
                    email,
                    username,
                },
            },
        });
        expect(res.body.data).toHaveProperty("token");
        expect(res.body.data.user).toHaveProperty("id");
        expect(res.body.data.user).toHaveProperty("createdAt");
    }));
    it("should return 422 & error response if request body is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post(`/api/user/login`).send({
            email,
        });
        expect(res.body).toMatchObject({ error: { type: "body validation" } });
        expect(res.statusCode).toEqual(422);
    }));
    it("should return 401 & error response if email or password are invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post(`/api/user/login`).send({
            email,
            password: "Invalid password",
        });
        expect(res.body).toMatchObject({
            error: { message: "Invalid email or password", status: 401 },
        });
        expect(res.statusCode).toEqual(401);
    }));
});
describe("GET /API/user/ME", () => {
    let token;
    it("should return 401 when no token set", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .get(`/api/user/me`)
            .expect("Content-Type", /json/);
        expect(res.statusCode).toEqual(401);
    }));
    it("should return 200 when viewing profile", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const loginResponse = yield (0, supertest_1.default)(app_1.app)
            .post(`/api/user/login`)
            .send({
            email,
            password,
        })
            .expect("Content-Type", /json/);
        token = (_a = loginResponse.body.data) === null || _a === void 0 ? void 0 : _a.token;
        const res = yield (0, supertest_1.default)(app_1.app)
            .get(`/api/user/me`)
            .expect("Content-Type", /json/)
            .set("authorization", `Bearer ${token}`);
        expect(res.body).toMatchObject({ data: { email, username } });
        expect(res.statusCode).toEqual(200);
    }));
});
describe("GET /API/user/logout", () => {
    let token;
    it("should return 401 when no token set", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .get(`/api/user/logout`)
            .expect("Content-Type", /json/);
        expect(res.statusCode).toEqual(401);
    }));
    it("should return 200 when logout", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app_1.app)
            .post(`/api/user/login`)
            .send({
            email,
            password,
        })
            .expect("Content-Type", /json/);
        token = loginResponse.body.data.token;
        const res = yield (0, supertest_1.default)(app_1.app)
            .get(`/api/user/logout`)
            .expect("Content-Type", /json/)
            .set("authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
    }));
    it("should return 401 when viewing profile after session destroyed", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .get(`/api/user/me`)
            .expect("Content-Type", /json/)
            .set("authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(401);
    }));
});
describe("GET /API/user/super-admin", () => {
    let token;
    let userId;
    it("should return 403(Forbidden) when accessing non allowed route based on role", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app_1.app)
            .post(`/api/user/login`)
            .send({
            email,
            password,
        })
            .expect("Content-Type", /json/);
        token = loginResponse.body.data.token;
        userId = loginResponse.body.data.user.id;
        const res = yield (0, supertest_1.default)(app_1.app)
            .get(`/api/user/super-admin`)
            .expect("Content-Type", /json/)
            .set("authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(403);
    }));
    it("should return 200 when accessing allowed route based on role", () => __awaiter(void 0, void 0, void 0, function* () {
        yield promoteUserToSuperAdmin(userId);
        const loginResponse = yield (0, supertest_1.default)(app_1.app)
            .post(`/api/user/login`)
            .send({
            email,
            password,
        })
            .expect("Content-Type", /json/);
        token = loginResponse.body.data.token;
        const res = yield (0, supertest_1.default)(app_1.app)
            .get(`/api/user/super-admin`)
            .expect("Content-Type", /json/)
            .set("authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
    }));
});
afterAll((done) => {
    done();
});
