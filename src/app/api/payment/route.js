import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/db";

async function isAdmin(db, admin_uid) {
  if (!admin_uid) return false;
  const user = await db.collection("users").findOne({ firebase_uid: admin_uid });
  return user?.role === "admin";
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const { searchParams } = new URL(req.url);
    const admin_uid = searchParams.get("admin_uid");

    if (!(await isAdmin(db, admin_uid))) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const payments = await db
      .collection("payments")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const body = await req.json();
    const {
      receive_number,
      sender_number,
      transactionId,
      img,
      email,
      name,
      phone_number,
      course_name,
      course_id,
      course_price,
      drive_link,
    } = body;

    const newPayment = {
      receive_number,
      sender_number,
      transactionId,
      img: img || null,
      email,
      name,
      phone_number,
      course_name,
      course_id,
      course_price,
      drive_link,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db.collection("payments").insertOne(newPayment);
    return NextResponse.json({ message: "Success", id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const { paymentId, status, admin_uid } = await req.json();

    if (!(await isAdmin(db, admin_uid))) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const paymentData = await db
      .collection("payments")
      .findOne({ _id: new ObjectId(paymentId) });

    if (!paymentData) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    await db.collection("payments").updateOne(
      { _id: new ObjectId(paymentId) },
      { $set: { status: status } }
    );

    if (status === "approved") {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: `"SpyMart Support" <${process.env.EMAIL_USER}>`,
        to: paymentData.email,
        subject: `Payment Approved: ${paymentData.course_name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2563eb;">Payment Successful!</h2>
            <p>Hello <b>${paymentData.name}</b>,</p>
            <p>Your payment for <b>${paymentData.course_name}</b> has been approved.</p>
            <p>You can now access your course materials from the link below:</p>
            <div style="margin: 20px 0;">
              <a href="${paymentData.drive_link}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Access Course</a>
            </div>
            <p>If you have any questions, feel free to reply to this email.</p>
            <p>Happy Learning!<br/><b>SpyMart Team</b></p>
          </div>
        `,
      };

      transporter.sendMail(mailOptions).catch(err => console.error("Email sending failed:", err));
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const admin_uid = searchParams.get("admin_uid");

    if (!(await isAdmin(db, admin_uid))) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await db.collection("payments").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}