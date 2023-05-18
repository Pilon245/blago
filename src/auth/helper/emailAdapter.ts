import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
  async sendEmail(email: string, code: string) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'saidparsermail@gmail.com',
          pass: 'kofignlwgnictwgn',
        },
      });
      const info = await transporter.sendMail({
        from: 'Said', // sender address
        to: email, // list of receivers
        subject: 'Registration', // Subject line
        text: "Hello friends, I'am five age!", // plain text body
        html: `Код подтверждения
                  <a href='code=${code}'>complete registration</a>
              </p>`, // html body
      });
      return info;
    } catch (e) {
      return false;
    }
  }
}
