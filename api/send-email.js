const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "markoverseas28@gmail.com",
            pass: "aoppwbdcykkytxwl"
        },
        // Increase timeout for serverless
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000
    });

    const mailOptions = {
        from: `"Mark Overseas Support" <markoverseas28@gmail.com>`,
        to: "markoverseas28@gmail.com",
        replyTo: email,
        subject: `New Inquiry: ${subject || "No Subject"}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="text-align: center; border-bottom: 2px solid #08af08; padding-bottom: 10px;">
                    <h2 style="color: #08af08; margin: 0;">New Website Inquiry</h2>
                </div>
                <div style="padding: 20px 0;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #08af08;">
                        <p style="margin: 0;"><strong>Message:</strong></p>
                        <p style="margin-top: 10px; line-height: 1.5;">${message}</p>
                    </div>
                </div>
                <div style="text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
                    <p>Sent from Mark Overseas Website</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Notification sent successfully" });
    } catch (error) {
        console.error("SMTP ERROR:", error);
        res.status(500).json({ success: false, error: "Failed to send email. Check SMTP credentials.", details: error.message });
    }
}
