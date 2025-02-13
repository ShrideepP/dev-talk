import { Resend } from "resend";
import { User } from "better-auth/types";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendResetPassword = async ({
  user,
  url,
}: {
  user: User;
  url: string;
}) => {
  const { error } = await resend.emails.send({
    from: "DevTalk <verification@digital-alchemy.agency>",
    to: user.email,
    subject: "Reset your password",
    text: `Click the link to reset your password: ${url}`,
  });

  if (error) throw new Error(error.message);
};

export const sendVerificationEmail = async ({
  user,
  url,
}: {
  user: User;
  url: string;
}) => {
  const { error } = await resend.emails.send({
    from: "DevTalk <verification@digital-alchemy.agency>",
    to: user.email,
    subject: "Verify your email address",
    text: `Click the link to verify your email: ${url}`,
  });

  if (error) throw new Error(error.message);
};
