output "vpc_id" {
  value = aws_vpc.this.id
}

output "public_subnets" {
  value = aws_subnet.public.*.id
}

output "private_subnets" {
  value = aws_subnet.private.*.id
}

output "db_endpoint" {
  value = aws_db_instance.depidb.address
}

output "db_port" {
  value = aws_db_instance.depidb.port
}

output "db_password_secret_arn" {
  value = aws_secretsmanager_secret.db_secret.arn
}
