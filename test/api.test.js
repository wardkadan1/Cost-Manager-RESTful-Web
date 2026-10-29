// Unit tests for the API layer. Mongoose model calls are mocked,
// so no MongoDB instance is needed: `npm test`.
const { test, before, after, beforeEach, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");

process.env.LOG_LEVEL = "silent";

const Log = require("../models/Log");
const User = require("../models/User");
const app = require("../app");

let server;
let base;

before(async () => {
  // the request-logging middleware saves a Log row on every response
  mock.method(Log.prototype, "save", async () => {});
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  mock.restoreAll();
  server.close();
});

beforeEach(() => {
  delete process.env.LOGS_ACCESS_TOKEN;
});

afterEach(() => {
  delete process.env.LOGS_ACCESS_TOKEN;
});

function mockLogFind(rows) {
  return mock.method(Log, "find", () => ({
    sort: () => ({ limit: async () => rows }),
  }));
}

test("GET /api/logs stays public when LOGS_ACCESS_TOKEN is unset", async (t) => {
  const find = mockLogFind([{ method: "GET", path: "/api/about", status: 200 }]);
  t.after(() => find.mock.restore());

  const res = await fetch(`${base}/api/logs`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.length, 1);
});

test("GET /api/logs rejects missing or wrong token when LOGS_ACCESS_TOKEN is set", async (t) => {
  const find = mockLogFind([]);
  t.after(() => find.mock.restore());
  process.env.LOGS_ACCESS_TOKEN = "test-token-123";

  let res = await fetch(`${base}/api/logs`);
  assert.equal(res.status, 401);
  assert.deepEqual(await res.json(), { error: "unauthorized" });

  res = await fetch(`${base}/api/logs`, {
    headers: { Authorization: "Bearer wrong-token-12" },
  });
  assert.equal(res.status, 401);
  assert.equal(find.mock.callCount(), 0);
});

test("GET /api/logs accepts the correct bearer token", async (t) => {
  const find = mockLogFind([]);
  t.after(() => find.mock.restore());
  process.env.LOGS_ACCESS_TOKEN = "test-token-123";

  const res = await fetch(`${base}/api/logs`, {
    headers: { Authorization: "Bearer test-token-123" },
  });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), []);
});

test("500 responses do not leak internal error messages", async (t) => {
  const secret = "connection to mongodb+srv://internal-host failed";
  const find = mock.method(User, "find", async () => {
    throw new Error(secret);
  });
  t.after(() => find.mock.restore());

  const res = await fetch(`${base}/api/users`);
  assert.equal(res.status, 500);
  const text = await res.text();
  assert.deepEqual(JSON.parse(text), { error: "server_error" });
  assert.ok(!text.includes("mongodb"));
});

test("GET /api/about returns the team", async () => {
  const res = await fetch(`${base}/api/about`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body) && body.length > 0);
  assert.ok(body.every((m) => m.first_name && m.last_name));
});
