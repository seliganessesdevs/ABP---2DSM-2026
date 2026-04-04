-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SECRETARIA');

-- CreateEnum
CREATE TYPE "Satisfaction" AS ENUM ('ATENDEU', 'NAO_ATENDEU');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('ABERTA', 'RESPONDIDA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatNode" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "prompt" TEXT,
    "answer_summary" TEXT,
    "evidence_excerpt" TEXT,
    "evidence_source" TEXT,
    "parent_id" INTEGER,
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionLog" (
    "id" SERIAL NOT NULL,
    "navigation_flow" JSONB NOT NULL,
    "flag" "Satisfaction",
    "inquiry_ids" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "requester_name" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "requester_email" TEXT NOT NULL,
    "attachment_name" TEXT,
    "attachment_mime_type" TEXT,
    "attachment_data" BYTEA,
    "status" "InquiryStatus" NOT NULL DEFAULT 'ABERTA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ChatNode_slug_key" ON "ChatNode"("slug");

-- CreateIndex
CREATE INDEX "ChatNode_parent_id_display_order_idx" ON "ChatNode"("parent_id", "display_order");

-- CreateIndex
CREATE INDEX "Question_status_created_at_idx" ON "Question"("status", "created_at");

-- AddForeignKey
ALTER TABLE "ChatNode" ADD CONSTRAINT "ChatNode_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "ChatNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
