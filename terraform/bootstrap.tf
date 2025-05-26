

resource "aws_s3_bucket" "terraform_state" {
  bucket = "cloudiness-terraform-state"
  force_destroy = true
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "cloudiness-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
