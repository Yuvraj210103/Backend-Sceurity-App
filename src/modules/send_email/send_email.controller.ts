import { NextFunction, Request, Response, Router } from "express";
import * as nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { sendEmailSchema } from "./send_email.schema";

export const sendEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await sendEmailSchema.safeParseAsync(req.body);

    if (!result.success) {
      next(result.error);
      return;
    }

    const {
      to_email,
      from_name,
      subject,
      html,
      text,
      attachments,
      bcc,
      cc,
      auth,
    } = result.data;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      debug: true,
      auth: auth
        ? auth
        : {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
          },
    });

    const mailOptions: Mail.Options = {
      from: `${from_name} <${process.env.SENDER_EMAIL}>`,
      to: to_email,
      subject,
      text: text ?? "",
      html: html ?? "",
      cc,
      bcc,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: Buffer.from(attachment.content, "base64"),
        contentType: attachment.contentType,
      })),
    };

    await transporter.sendMail(mailOptions);

    transporter.close();

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};
