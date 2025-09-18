const axios = require("axios");

const baseUrl = "https://cost-manager-restful-web.onrender.com/api";

async function runTests() {
  try {
    console.log("=== Testing /about ===");
    let res = await axios.get(`${baseUrl}/about`);
    console.log(res.data);

    console.log("\n=== Adding user with POST /add ===");
    res = await axios.post(`${baseUrl}/add`, {
      id: 123123,
      first_name: "mosh",
      last_name: "israeli",
      birthday: "1990-01-01",
    });
    console.log(res.data);

    console.log("\n=== Listing users with GET /users ===");
    res = await axios.get(`${baseUrl}/users`);
    console.log(res.data);

    console.log("\n=== Getting user details with GET /users/123123 ===");
    res = await axios.get(`${baseUrl}/users/123123`);
    console.log(res.data);

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;
    const oldMonth = month === 1 ? 12 : month - 1;
    const oldYear = month === 1 ? year - 1 : year;

    console.log("\n=== Getting report for OLD month (should be empty) ===");
    res = await axios.get(
      `${baseUrl}/report?id=123123&year=${oldYear}&month=${oldMonth}`
    );
    console.log(JSON.stringify(res.data, null, 2));

    console.log("\n=== Adding cost (food) with POST /add ===");
    res = await axios.post(`${baseUrl}/add`, {
      userid: 123123,
      description: "milk",
      category: "food",
      sum: 8,
    });
    console.log(res.data);

    console.log("\n=== Adding another cost (food) ===");
    res = await axios.post(`${baseUrl}/add`, {
      userid: 123123,
      description: "bread",
      category: "food",
      sum: 5,
    });
    console.log(res.data);

    console.log("\n=== Adding another cost (health) ===");
    res = await axios.post(`${baseUrl}/add`, {
      userid: 123123,
      description: "vitamins",
      category: "health",
      sum: 20,
    });
    console.log(res.data);

    console.log("\n=== Getting user details with GET /users/123123 ===");
    res = await axios.get(`${baseUrl}/users/123123`);
    console.log(res.data);

    console.log(
      "\n=== Getting report for CURRENT month (should show costs) ==="
    );
    res = await axios.get(
      `${baseUrl}/report?id=123123&year=${year}&month=${month}`
    );
    console.log(JSON.stringify(res.data, null, 2));

    console.log("\n=== Getting logs with GET /logs ===");
    res = await axios.get(`${baseUrl}/logs`);
    console.log(res.data);
  } catch (err) {
    console.error(
      "Test error:",
      err.response ? err.response.data : err.message
    );
  }
}

runTests();
