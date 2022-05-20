import request from "supertest";
import faker from "@faker-js/faker";
import { app } from "../src/app";
import { mongoDBConnection } from "../src/connection/mongo";
import { mongoConnectionString } from "../src/config";
import { ObjectId } from "mongoose";
import RoleModel from "../src/models/role.model";
import UserModel from "../src/models/user.model";
import { roles } from "../src/constants/rolesAndPermissions";
jest.setTimeout(30000);
let email: string;
let username: string;
let password: string;
let name: string;

const promoteUserToSuperAdmin = async (id: ObjectId) => {
  let adminRole = await RoleModel.findOne({ name: roles.superAdmin.name });
  return UserModel.updateOne({ _id: id }, { role: adminRole?.id });
};

beforeAll(async () => {
  mongoDBConnection(mongoConnectionString);
  email = faker.internet.email().toLowerCase();
  username = faker.internet.userName().toLowerCase();
  password = faker.random.alpha({ count: 10 });
  name = faker.name.findName().toLowerCase();
});

describe("POST /API/user/REGISTER", () => {
  it("should return 200 && valid response if request body is valid", async () => {
    const res = await request(app)
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
  });

  it("should return 422 & error response if request body is missing", async () => {
    const res = await request(app).post(`/api/user/register`).send({
      email,
    });

    expect(res.body).toMatchObject({ error: { type: "body validation" } });
    expect(res.statusCode).toEqual(422);
  });

  it("should return 400 && valid response if email or already exists", async () => {
    const res = await request(app)
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
  });
});

describe("POST /API/user/LOGIN", () => {
  it("should return 200 && valid response and user token if email and password matches a user", async () => {
    const res = await request(app)
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
  });

  it("should return 422 & error response if request body is missing", async () => {
    const res = await request(app).post(`/api/user/login`).send({
      email,
    });
    expect(res.body).toMatchObject({ error: { type: "body validation" } });
    expect(res.statusCode).toEqual(422);
  });

  it("should return 401 & error response if email or password are invalid", async () => {
    const res = await request(app).post(`/api/user/login`).send({
      email,
      password: "Invalid password",
    });

    expect(res.body).toMatchObject({
      error: { message: "Invalid email or password", status: 401 },
    });

    expect(res.statusCode).toEqual(401);
  });
});

describe("GET /API/user/ME", () => {
  let token: string;

  it("should return 401 when no token set", async () => {
    const res = await request(app)
      .get(`/api/user/me`)
      .expect("Content-Type", /json/);

    expect(res.statusCode).toEqual(401);
  });

  it("should return 200 when viewing profile", async () => {
    const loginResponse = await request(app)
      .post(`/api/user/login`)
      .send({
        email,
        password,
      })
      .expect("Content-Type", /json/);

    token = loginResponse.body.data?.token;

    const res = await request(app)
      .get(`/api/user/me`)
      .expect("Content-Type", /json/)
      .set("authorization", `Bearer ${token}`);
    expect(res.body).toMatchObject({ data: { email, username } });
    expect(res.statusCode).toEqual(200);
  });
});

describe("GET /API/user/logout", () => {
  let token: string;

  it("should return 401 when no token set", async () => {
    const res = await request(app)
      .get(`/api/user/logout`)
      .expect("Content-Type", /json/);

    expect(res.statusCode).toEqual(401);
  });

  it("should return 200 when logout", async () => {
    const loginResponse = await request(app)
      .post(`/api/user/login`)
      .send({
        email,
        password,
      })

      .expect("Content-Type", /json/);
    token = loginResponse.body.data.token;

    const res = await request(app)
      .get(`/api/user/logout`)
      .expect("Content-Type", /json/)
      .set("authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
  });

  it("should return 401 when viewing profile after session destroyed", async () => {
    const res = await request(app)
      .get(`/api/user/me`)
      .expect("Content-Type", /json/)
      .set("authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(401);
  });
});

describe("GET /API/user/super-admin", () => {
  let token: string;
  let userId: ObjectId;

  it("should return 403(Forbidden) when accessing non allowed route based on role", async () => {
    const loginResponse = await request(app)
      .post(`/api/user/login`)
      .send({
        email,
        password,
      })
      .expect("Content-Type", /json/);
    token = loginResponse.body.data.token;
    userId = loginResponse.body.data.user.id;
    const res = await request(app)
      .get(`/api/user/super-admin`)
      .expect("Content-Type", /json/)
      .set("authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(403);
  });

  it("should return 200 when accessing allowed route based on role", async () => {
    await promoteUserToSuperAdmin(userId);
    const loginResponse = await request(app)
      .post(`/api/user/login`)
      .send({
        email,
        password,
      })
      .expect("Content-Type", /json/);
    token = loginResponse.body.data.token;

    const res = await request(app)
      .get(`/api/user/super-admin`)
      .expect("Content-Type", /json/)
      .set("authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
  });
});

afterAll((done) => {
  done();
});
