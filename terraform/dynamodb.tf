

resource "aws_dynamodb_table" "hello_table" {
  name           = "hello-table"
  billing_mode   = "PAY_PER_REQUEST"  # Free tier-friendly
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Environment = "dev"
    Project     = "serverless-saas"
  }
}
