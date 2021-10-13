
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_iam_user" "jarvis" {
  name = "jarvis"
}

resource "aws_iam_access_key" "jarvis-keys" {
  user = aws_iam_user.jarvis.id
}

resource "aws_sqs_queue" "turnoff" {
  name = "turnoff"
}

resource "aws_sqs_queue_policy" "turnoff-queue-policy" {
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "AllowAll"
        Effect = "Allow"
        Principal = {
          AWS =  [
            aws_iam_user.jarvis.arn,
          ]
        }
        Action = "sqs:*"
        Resource = aws_sqs_queue.turnoff.arn
      },
    ]
  })
  queue_url = aws_sqs_queue.turnoff.id
}
