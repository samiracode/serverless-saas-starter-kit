

terraform {
  required_version = ">= 1.0.0"

  backend "s3" {
    bucket         = "cloudiness-terraform-state"      # Use your actual bucket name
    key            = "serverless-saas/terraform.tfstate"
    region         = "eu-north-1"                       # Use your chosen AWS region
    dynamodb_table = "cloudiness-terraform-locks"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

