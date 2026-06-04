var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res) => {
        res.render("login", { title: "Login", error: null });
});

router.post("/", async (req,res) => {
  try {
    const { email, password } = req.body;
    const response = await fetch(process.env.API_URL + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email, password
      })
    });

    const data = await response.json();

    req.session.token = data.data.token;

    if (!response.ok) {
      throw new Error(data.data.result);
    }

    return res.redirect("/products")

  } catch (error) {
    if (error.message.includes("fetch failed")) {
      return res.render("login", {
        title: "Login",
        error: "Login service down.."
      });
    }

    return res.render("login", { title: "Login", error: error.message });
  }
})

module.exports = router;
