import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/db";

// 🔐 Check Admin
async function isAdmin(db, firebase_uid) {
  if (!firebase_uid) return false;
  const user = await db.collection("users").findOne({ firebase_uid });
  return user?.role === "admin";
}

/* =========================
   GET → Get All Payment Methods
========================= */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const methods = await db.collection("pay_num").find({}).toArray();

    return NextResponse.json(methods);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch payment methods", error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   POST → Add Payment Method (Admin Only)
========================= */
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // ✅ MUST destructure first
    const body = await req.json();
    const { admin_uid, name, number } = body;

    if (!name || !number) {
      return NextResponse.json(
        { message: "Name and number are required" },
        { status: 400 }
      );
    }

    const isUserAdmin = await isAdmin(db, admin_uid);
    if (!isUserAdmin) {
      return NextResponse.json(
        { message: "Forbidden: Only admin can add" },
        { status: 403 }
      );
    }

    const result = await db.collection("pay_num").insertOne({
      name,
      number,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Payment method added", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add", error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   PATCH → Update Payment Method (Admin Only)
========================= */
export async function PATCH(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const { admin_uid, id, name, number } = await req.json();

    const isUserAdmin = await isAdmin(db, admin_uid);
    if (!isUserAdmin) {
      return NextResponse.json(
        { message: "Forbidden: Only admin can update" },
        { status: 403 }
      );
    }

    const result = await db.collection("pay_num").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, number } }
    );

    return NextResponse.json({
      message: "Payment method updated",
      result,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Update failed", error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE → Delete Payment Method (Admin Only)
========================= */
export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const admin_uid = searchParams.get("admin_uid");

    const isUserAdmin = await isAdmin(db, admin_uid);
    if (!isUserAdmin) {
      return NextResponse.json(
        { message: "Forbidden: Only admin can delete" },
        { status: 403 }
      );
    }

    const result = await db.collection("pay_num").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({
      message: "Deleted successfully",
      result,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed", error: error.message },
      { status: 500 }
    );
  }
}