import nodemailer from 'nodemailer';

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // para porta 587 normalmente é false (STARTTLS)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendMail(to: string, subject: string, html: string) {
        const mailOptions = {
            from: `"Devocional Plataforma" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email enviado: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            throw new Error('Erro ao enviar email');
        }
    }
}
