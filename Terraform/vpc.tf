resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = merge(var.tags, { Name = "depi-vpc" })
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.this.id
  tags   = merge(var.tags, { Name = "depi-igw" })
}

# Public subnets
resource "aws_subnet" "public" {
  for_each = toset(range(length(var.public_subnets)))
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.public_subnets[each.value]
  map_public_ip_on_launch = true
  availability_zone = element(data.aws_availability_zones.available.names, each.value)
  tags              = merge(var.tags, { Name = "depi-public-${each.value}" })
}

# Private app subnets
resource "aws_subnet" "private" {
  for_each = toset(range(length(var.private_subnets)))
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnets[each.value]
  availability_zone = element(data.aws_availability_zones.available.names, each.value)
  tags              = merge(var.tags, { Name = "depi-private-${each.value}" })
}

# DB subnets (must be in at least 2 AZs)
resource "aws_subnet" "db" {
  for_each = toset(range(length(var.db_subnets)))
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.db_subnets[each.value]
  availability_zone = element(data.aws_availability_zones.available.names, each.value)
  tags              = merge(var.tags, { Name = "depi-db-${each.value}" })
}

data "aws_availability_zones" "available" {
  state = "available"
}

# Route table for public
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  tags   = merge(var.tags, { Name = "depi-public-rt" })
}

resource "aws_route" "default_public" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public_assoc" {
  for_each       = aws_subnet.public
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

# Optional: NAT gateway for internet access from private subnets - simple example uses one NAT in first public subnet
resource "aws_eip" "nat" {
  vpc = true
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = element(aws_subnet.public.*.id, 0)
  depends_on    = [aws_internet_gateway.igw]
  tags          = merge(var.tags, { Name = "depi-nat" })
}

# Private route tables
resource "aws_route_table" "private" {
  for_each = aws_subnet.private
  vpc_id = aws_vpc.this.id
  tags   = merge(var.tags, { Name = "depi-private-rt-${each.key}" })
}

resource "aws_route" "private_default_route" {
  for_each = aws_route_table.private
  route_table_id         = each.value.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat.id
}

resource "aws_route_table_association" "private_assoc" {
  for_each = aws_subnet.private
  subnet_id      = each.value.id
  route_table_id = aws_route_table.private[each.key].id
}
