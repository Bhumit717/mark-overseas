const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, subject, message } = req.body;

    // Premium HTML Template with GIF and Logo
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                border: 1px solid #e0e0e0;
            }
            .header {
                background: linear-gradient(135deg, #08af08 0%, #058f05 100%);
                padding: 30px;
                text-align: center;
                color: white;
            }
            .header img {
                max-width: 150px;
                margin-bottom: 10px;
            }
            .gif-container {
                text-align: center;
                padding: 20px;
                background-color: #f9fafb;
            }
            .gif-container img {
                width: 120px;
                border-radius: 50%;
            }
            .content {
                padding: 30px;
                color: #333;
                line-height: 1.6;
            }
            .info-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            .info-table td {
                padding: 12px;
                border-bottom: 1px solid #eeeeee;
            }
            .label {
                font-weight: bold;
                color: #08af08;
                width: 30%;
            }
            .message-box {
                background-color: #f3f4f6;
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
                border-left: 4px solid #08af08;
            }
            .footer {
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
                background-color: #f9fafb;
            }
        </style>
    </head>
    <body style="background-color: #f4f4f4; padding: 20px;">
        <div class="email-container">
            <div class="header">
                <img src="https://www.mark-overseas.com/images/mark-logo.png" alt="Mark Overseas Logo">
                <h1 style="margin:0; font-size: 24px;">New Inquiry Received</h1>
            </div>

            <div class="gif-container">
                <!-- Professional Notification Animation (GIF) -->
                <img src="https://cdn.dribbble.com/users/1537480/screenshots/7123498/media/25261175317789.GIF" alt="New Notification">
                <p style="margin-top: 10px; font-weight: 500; color: #666;">A new message from your website</p>
            </div>

            <div class="content">
                <table class="info-table">
                    <tr>
                        <td class="label">Client Name</td>
                        <td>${name}</td>
                    </tr>
                    <tr>
                        <td class="label">Email Address</td>
                        <td><a href="mailto:${email}" style="color: #08af08; text-decoration: none;">${email}</a></td>
                    </tr>
                    <tr>
                        <td class="label">Phone</td>
                        <td>${phone}</td>
                    </tr>
                    <tr>
                        <td class="label">Subject</td>
                        <td>${subject}</td>
                    </tr>
                </table>

                <div class="message-box">
                    <strong>Message Content:</strong><br>
                    <p style="margin-top: 10px;">${message.replace(/\n/g, '<br>')}</p>
                </div>
            </div>

            <div class="footer">
                <p>&copy; 2026 Mark Overseas | Agro Commodities Exporter & Supplier</p>
                <p>This is an automated notification from your website's contact form.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'markoverseas28@gmail.com',
            pass: 'aopp wbdc ykky txwl'
        }
    });

    const mailOptions = {
        from: `Mark Overseas Website <markoverseas28@gmail.com>`,
        to: 'markoverseas28@gmail.com',
        replyTo: email,
        subject: `[Website Inquiry] ${subject} - from ${name}`,
        html: emailHtml
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('SMTP Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
