import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendComplaintNotificationEmail(
  adminEmail: string,
  complaintDetails: {
    title: string;
    category: string;
    priority: string;
    description: string;
  }
) {
  const { title, category, priority, description } = complaintDetails;

  const mailOptions = {
    from: `"Complaint Tracker" <${process.env.EMAIL_USER}>`, // sender address
    to: adminEmail, // list of receivers
    subject: "New Complaint Submitted", // Subject line
    text: `A new complaint has been submitted.\n\nTitle: ${title}\nCategory: ${category}\nPriority: ${priority}\nDescription: ${description}`, // plain text body
    html: `<p>A new complaint has been submitted.</p>
           <p><strong>Title:</strong> ${title}</p>
           <p><strong>Category:</strong> ${category}</p>
           <p><strong>Priority:</strong> ${priority}</p>
           <p><strong>Description:</strong> ${description}</p>`, // html body
  };

  await transporter.sendMail(mailOptions);
}

export async function sendStatusUpdateEmail(
  adminEmail: string,
  complaintDetails: {
    title: string;
    newStatus: string;
    updatedAt: Date;
  }
) {
  const { title, newStatus, updatedAt } = complaintDetails;

  const mailOptions = {
    from: `"Complaint Tracker" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: "Complaint Status Updated",
    text: `The status of a complaint has been updated.\n\nTitle: ${title}\nNew Status: ${newStatus}\nUpdated At: ${updatedAt.toLocaleString()}`,
    html: `<p>The status of a complaint has been updated.</p>
           <p><strong>Title:</strong> ${title}</p>
           <p><strong>New Status:</strong> ${newStatus}</p>
           <p><strong>Updated At:</strong> ${updatedAt.toLocaleString()}</p>`,
  };

  await transporter.sendMail(mailOptions);
}
