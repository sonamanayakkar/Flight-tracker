import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/flights", async (req, res) => {
  try {
    const response = await axios.get(
      "https://opensky-network.org/api/states/all",
      {
        auth: {
          username: "sonamanayakkar-api-client",
          password: "zXIpuzwZvxb9GNEyVfJVDZA8gftSfdRl"
        }
      }
    );

    res.json({
      data: response.data.states
    });

  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});