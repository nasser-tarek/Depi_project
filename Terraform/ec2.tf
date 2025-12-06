data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-arm64-server-*"] 
  }
  owners = ["099720109477"] 
}

resource "aws_instance" "bastion" {
  ami           = var.ami != "" ? var.ami : data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = element(aws_subnet.public.*.id, 0)
  key_name      = var.key_name == "" ? null : var.key_name
  vpc_security_group_ids = [aws_security_group.bastion_sg.id]

  tags = merge(var.tags, { Name = "depi-bastion" })

}

output "bastion_public_ip" {
  value = aws_instance.bastion.public_ip
}
