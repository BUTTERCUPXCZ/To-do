-- CreateTable
CREATE TABLE "public"."employee" (
    "id" SERIAL NOT NULL,
    "Fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "Position" TEXT NOT NULL,
    "Department" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "public"."employee"("email");
