# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Base VM settings
  config.vm.box = "ubuntu/focal64"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
    vb.cpus = 1
  end

  # Disable default synced folder for performance
  config.vm.synced_folder ".", "/vagrant", disabled: false

  # Manager Node
  config.vm.define "manager" do |manager|
    manager.vm.hostname = "manager"
    manager.vm.network "private_network", ip: "192.168.56.10"

    manager.vm.provision "shell", inline: <<-SHELL
      # Update & install Docker
      sudo apt-get update
      sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
      sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
      sudo apt-get update
      sudo apt-get install -y docker-ce docker-ce-cli containerd.io
      sudo usermod -aG docker vagrant

      # Initialize Docker Swarm
      sudo docker swarm init --advertise-addr 192.168.56.10
      SWARM_JOIN_TOKEN=$(sudo docker swarm join-token -q worker)
      echo $SWARM_JOIN_TOKEN > /vagrant/worker_join_token.txt
    SHELL
  end

  # Worker Nodes
  (1..2).each do |i|
    config.vm.define "worker#{i}" do |worker|
      worker.vm.hostname = "worker#{i}"
      worker.vm.network "private_network", ip: "192.168.56.1#{i+0}"

      worker.vm.provision "shell", inline: <<-SHELL
        # Update & install Docker
        sudo apt-get update
        sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io
        sudo usermod -aG docker vagrant

        # Join Docker Swarm
        TOKEN=$(cat /vagrant/worker_join_token.txt)
        sudo docker swarm join --token $TOKEN 192.168.56.10:2377
      SHELL
    end
  end

end




Install VirtualBox

VirtualBox is the provider that runs your Vagrant VMs.

# Update packages
sudo apt update
sudo apt upgrade -y

# Install dependencies for VirtualBox
sudo apt install -y software-properties-common apt-transport-https wget

# Add VirtualBox repository
wget -q https://www.virtualbox.org/download/oracle_vbox_2016.asc -O- | sudo gpg --dearmor -o /usr/share/keyrings/oracle-virtualbox.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/oracle-virtualbox.gpg] https://download.virtualbox.org/virtualbox/debian $(lsb_release -cs) contrib" | sudo tee /etc/apt/sources.list.d/virtualbox.list

# Update repositories
sudo apt update

# Install VirtualBox
sudo apt install -y virtualbox-7.0

# Check installation
vboxmanage --version

-----------------------------------------
Install Vagrant

Vagrant manages your VirtualBox VMs.

# Download latest Vagrant
curl -O https://releases.hashicorp.com/vagrant/2.4.5/vagrant_2.4.5_linux_amd64.deb

# Install Vagrant
sudo dpkg -i vagrant_2.4.5_linux_amd64.deb

# Fix missing dependencies if needed
sudo apt -f install -y

# Verify installation
vagrant --version

---------------------------------------------
# Remove old versions if any
sudo apt remove -y docker docker-engine docker.io containerd runc

# Update packages
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker’s official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to docker group (so you can run docker without sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify Docker installation
docker --version
docker run hello-world

----------------------
vagrant up
vagrant shh manager
docker node ls
