# Assets bucket for the orders service. Piece 06 checks the plan of this module before apply.
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 6.0" }
  }
}

variable "owner" {
  type    = string
  default = "frankTurtle"
}

variable "name" {
  type    = string
  default = "rollcage-example"
}

resource "aws_s3_bucket" "assets" {
  bucket = "${var.name}-assets"
  tags   = { service = var.name, owner = var.owner, data-class = "internal" }
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket                  = aws_s3_bucket.assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    bucket_key_enabled = true
    apply_server_side_encryption_by_default { sse_algorithm = "aws:kms" }
  }
}
