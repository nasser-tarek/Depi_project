variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-north-1"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "List of public subnet CIDRs (one per AZ you want public)"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "private_subnets" {
  description = "List of private subnet CIDRs (one per AZ for application)"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "db_subnets" {
  description = "List of DB subnet CIDRs (should cover >=2 AZs)"
  type        = list(string)
  default     = ["10.0.201.0/24", "10.0.202.0/24"]
}

variable "tags" {
  type = map(string)
  default = {
    Project = "depi"
    Owner   = "team"
  }
}

variable "instance_type" {
  type    = string
  default = "m7i-flex.large"
}

variable "ami" {
  description = "AMI ID for EC2 (ARM or x86 depending on instance type)"
  type        = string
  default     = "ami-0fa91bc90632c73c9" 
}

# DB
variable "db_allocated_storage" { type = number; default = 20 }
variable "db_engine_version"    { type = string; default = "17.6" }
variable "db_instance_class"    { type = string; default = "db.t4g.micro" }
variable "db_name"              { type = string; default = "depidb" }
variable "db_username"          { type = string; default = "postgres" }
variable "db_multi_az"          { type = bool; default = false }
