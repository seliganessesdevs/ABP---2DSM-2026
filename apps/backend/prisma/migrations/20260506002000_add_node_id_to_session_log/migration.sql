ALTER TABLE "SessionLog"
ADD COLUMN "node_id" INTEGER;

CREATE INDEX "SessionLog_node_id_idx" ON "SessionLog"("node_id");
