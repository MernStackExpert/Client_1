import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/db";

async function isAdmin(db, admin_uid) {
  if (!admin_uid) return false;
  const user = await db
    .collection("users")
    .findOne({ firebase_uid: admin_uid });
  return user?.role === "admin";
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const { searchParams } = new URL(req.url);
    const admin_uid = searchParams.get("admin_uid");

    if (!(await isAdmin(db, admin_uid))) {
      return NextResponse.json(
        { message: "Forbidden: Admin access only" },
        { status: 403 },
      );
    }

    const payments = await db
      .collection("payments")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 },
    );
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
    return NextResponse.json(
      { message: "Success", id: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed", error: error.message },
      { status: 500 },
    );
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
      return NextResponse.json(
        { message: "Payment records not found" },
        { status: 404 },
      );
    }

    const result = await db
      .collection("payments")
      .updateOne(
        { _id: new ObjectId(paymentId) },
        { $set: { status: status } },
      );

    if (status === "approved") {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"Course Success" <${process.env.EMAIL_USER}>`,
        to: paymentData.email,
        subject: `Your Payment Approved! Get Access to ${paymentData.course_name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Hello ${paymentData.name},</h2>
            <p>Great news! Your payment for the course <b>${paymentData.course_name}</b> has been approved.</p>
            <p>You can now access your course materials using the Google Drive link below:</p>
            <div style="margin: 20px 0;">
              <a href="${paymentData.drive_link}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Access Course Link</a>
            </div>
            <p>If you have any issues, feel free to contact us.</p>
            <p>Happy Learning!</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({
      message:
        status === "approved"
          ? "Status updated & Email sent!"
          : "Status updated",
      result,
    });
  } catch (error) {
    console.error("Error in PATCH payment:", error);
    return NextResponse.json(
      { message: "Update failed", error: error.message },
      { status: 500 },
    );
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

    const result = await db
      .collection("payments")
      .deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Deleted successfully", result });
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed", error: error.message },
      { status: 500 },
    );
  }
}
