const nodemailer = require("nodemailer");

exports.contactSupport = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Configure Transporter (Reuse logic or keep separate?)
        // Ideally should be a helper, but for now copying logic to keep it isolated
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_PORT == 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send TO the admin (self)
            replyTo: email, // Reply to the user
            subject: `Support Request: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Support request sent successfully" });

    } catch (error) {
        console.error("SUPPORT EMAIL ERROR:", error);
        res.status(500).json({ message: "Failed to send email" });
    }
};
