import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import muscleGroupsRoutes from "./routes/muscleGroups.routes.js";
import exercisesRoutes from "./routes/exercises.routes.js";
import usersRoutes from "./routes/users.routes.js";
import plansRoutes from "./routes/plans.routes.js";
import workoutsRoutes from "./routes/workouts.routes.js";
import statisticsRoutes from "./routes/statistics.routes.js";
import authorizationRoutes from "./routes/authorization.routes.js";

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("The API is working!")
})

app.use("/muscle_groups", muscleGroupsRoutes);
app.use("/exercises", exercisesRoutes);
app.use("/", usersRoutes);
app.use("/plans", plansRoutes);
app.use("/workouts", workoutsRoutes);
app.use("/statistics", statisticsRoutes);
app.use("/auth", authorizationRoutes);

app.listen(process.env.API_PORT, () => {
    console.log("API listening on http://localhost:" + process.env.API_PORT)
})
