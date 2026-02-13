import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/db";

async function isAdmin(db, firebase_uid) {
  if (!firebase_uid) return false;
  const user = await db.collection("users").findOne({ firebase_uid });
  return user?.role === "admin";
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (email) {
      const user = await db.collection("users").findOne({ email });
      return NextResponse.json(user);
    }

    const users = await db.collection("users").find({}).toArray();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const { name, email, img, firebase_uid } = await req.json();

    const existingUser = await db.collection("users").findOne({ firebase_uid });
    if (existingUser)
      return NextResponse.json(
        { message: "Already exists", user: existingUser },
        { status: 200 }
      );

    const result = await db.collection("users").insertOne({
      name,
      email,
      img,
      firebase_uid,
      role: "student",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Saved", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const { admin_uid, firebase_uid, name, role } = await req.json();

    const isUserAdmin = await isAdmin(db, admin_uid);
    if (!isUserAdmin) {
      return NextResponse.json({ message: "Forbidden: Only admin can update" }, { status: 403 });
    }

    const result = await db
      .collection("users")
      .updateOne({ firebase_uid: firebase_uid }, { $set: { name, role } });

    return NextResponse.json({ message: "Updated successfully", result });
  } catch (error) {
    return NextResponse.json(
      { message: "Update failed", error: error.message },
      { status: 500 }
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

    const isUserAdmin = await isAdmin(db, admin_uid);
    if (!isUserAdmin) {
      return NextResponse.json({ message: "Forbidden: Only admin can delete" }, { status: 403 });
    }

    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Deleted successfully", result });
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed", error: error.message },
      { status: 500 }
    );
  }
}