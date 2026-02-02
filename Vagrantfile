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

