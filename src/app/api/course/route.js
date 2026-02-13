import { NextResponse } from "next/server";
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
    const id = searchParams.get("id");

    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { message: "Invalid Course ID" },
          { status: 400 },
        );
      }
      const course = await db
        .collection("courses")
        .findOne({ _id: new ObjectId(id) });
      if (!course) {
        return NextResponse.json(
          { message: "Course not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(course);
    }

    const courses = await db
      .collection("courses")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(courses);
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
      course_name,
      course_price,
      course_rating,
      course_description,
      course_sell,
      course_img,
      drive_link,
      admin_uid,
    } = body;

    if (!(await isAdmin(db, admin_uid))) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const newCourse = {
      course_name,
      course_price: Number(course_price),
      course_rating: Number(course_rating) || 0,
      course_description,
      course_sell: Number(course_sell) || 0,
      course_img,
      drive_link,
      createdAt: new Date(),
    };

    const result = await db.collection("courses").insertOne(newCourse);
    return NextResponse.json(
      { message: "Course added successfully", id: result.insertedId },
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
    const body = await req.json();
    const { course_id, admin_uid, ...updateData } = body;

    if (!(await isAdmin(db, admin_uid))) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const result = await db
      .collection("courses")
      .updateOne({ _id: new ObjectId(course_id) }, { $set: updateData });
    return NextResponse.json({
      message: "Course updated successfully",
      result,
    });
  } catch (error) {
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
      .collection("courses")
      .deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({
      message: "Course deleted successfully",
      result,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed", error: error.message },
      { status: 500 },
    );
  }
}
