import express from "express";
import { Resend } from "resend";
import cors from 'cors'

const app = express();
app.use(express.json())
app.use(cors())

const resend = new Resend("re_Gjipo4Vr_6Qkwvepa8y14FGiv7CBZnc4X");

app.get("/send-mail", async (req, res) => {
    const { to, subject, html } = req.body;
    console.log(req.body)
    try {
        const data = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: to,
            subject: subject,
            html: html,
        });
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
});
