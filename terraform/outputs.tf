

# Will contain outputs later (e.g., bucket name, URL, etc.)

output "api_invoke_url" {
  value = "https://${aws_api_gateway_rest_api.hello_api.id}.execute-api.eu-north-1.amazonaws.com/prod/hello"
}

