# random password
resource "random_password" "db" {
  length           = 20
  special          = true
  override_special = "!@#%&*()-_+=<>?"
}

# Store password to Secrets Manager
resource "aws_secretsmanager_secret" "db_secret" {
  name = "depi-db-secret"
  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "db_secret_version" {
  secret_id     = aws_secretsmanager_secret.db_secret.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.db.result
    host     = aws_db_instance.depidb.address
    port     = aws_db_instance.depidb.port
    dbname   = var.db_name
    engine   = "postgres"
  })

  depends_on = [aws_db_instance.depidb]
}

# Create DB Subnet Group
resource "aws_db_subnet_group" "depi_db_sg" {
  name       = "depi-db-subnet-group"
  subnet_ids = aws_subnet.db.*.id
  tags       = merge(var.tags, { Name = "depi-db-subnet-group" })
}

resource "aws_db_instance" "depidb" {
  identifier              = "depidb"
  engine                  = "postgres"
  engine_version          = var.db_engine_version
  instance_class          = var.db_instance_class
  db_name                 = var.db_name
  username                = var.db_username
  password                = random_password.db.result
  allocated_storage       = var.db_allocated_storage
  storage_type            = "gp2"
  db_subnet_group_name    = aws_db_subnet_group.depi_db_sg.name
  vpc_security_group_ids  = [aws_security_group.db_sg.id]
  skip_final_snapshot     = true
  publicly_accessible     = false
  multi_az                = var.db_multi_az
  backup_retention_period = 7
  deletion_protection     = false
  tags                    = var.tags
}
