const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'markoverseas28@gmail.com',
            pass: 'aopp wbdc ykky txwl' // Gmail App Password
        }
    });

    const mailOptions = {
        from: `Mark Overseas <markoverseas28@gmail.com>`,
        to: 'markoverseas28@gmail.com',
        replyTo: email,
        subject: `Inquiry: ${subject}`,
        html: `
            <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px;">
                <h2 style="color: #08af08;">New Website Inquiry</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('SMTP Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
