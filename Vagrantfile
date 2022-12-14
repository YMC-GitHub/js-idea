Vagrant.configure("2") do |config|
  # feat: use cnf in .env file
  config.env.enable

  # feat: use custom env file name
  config.env.load "vagrant.env.properties"
  # https://github.com/gosuri/vagrant-env/blob/master/lib/vagrant-env/config.rb
  # https://github.com/gosuri/vagrant-env/issues/8

  # feat: set env to cache env in .env file
  MASTERHOSTNAME = ENV["MASTER_HOSTNAME"]
  ETCDHOSTNAME = ENV["ETCD_HOSTNAME"]
  NODEHOSTNAME = ENV["NODE_HOSTNAME"]
  BASHSCRIPTPATH = ENV["BASH_SCRIPT_PATH"]
  IP_S=ENV["IP_S"]

  # feat: use shared dir 
  config.vm.synced_folder ".", "/app"
  # config.vm.synced_folder ".data/", "/etc/.vagrantdata/"

  # feat: use env .env file to set box
  config.vm.box = ENV["BOX_IMAGE"]
  config.vm.box_version = ENV["BOX_VERSION"]
  config.vm.box_check_update = false

  # feat: set guest host file
  if Vagrant.has_plugin?("vagrant-hostmanager")
    config.hostmanager.enabled = true
    config.hostmanager.manage_guest = true
    #config.hostmanager.manage_host = true
    #config.hostmanager.ignore_private_ip = false
    #config.hostmanager.include_offline = true
  end
  # https://github.com/devopsgroup-io/vagrant-hostmanager

  # feat: set box to be cache-able
  if Vagrant.has_plugin?("vagrant-cachier")
    config.cache.scope = :box
  end
  # https://github.com/fgrehm/vagrant-cachier

  # feat: set guest vbguest (when virtualbox)
  if Vagrant.has_plugin?("vagrant-vbguest")
    config.vbguest.iso_path = "https://download.virtualbox.org/virtualbox/%{version}/VBoxGuestAdditions_%{version}.iso"
    config.vbguest.allow_downgrade = true
    config.vbguest.auto_update = true
    config.vbguest.no_install = false
    config.vbguest.no_remote = false
  end
  # https://github.com/dotless-de/vagrant-vbguest

  # feat: setup master is optional
  if ENV["SETUP_MASTERS"]
    (1..( ENV["MASTER_COUNT"] ).to_i(10)).each do |i|
      config.vm.define "#{MASTERHOSTNAME}-#{i}" do |subconfig|
        # fix: comment it , cause GuestAdditions 5.2.40 running  fail
        #subconfig.vm.disk :disk, size: ENV["NODE_DISKSIZE"], primary: true 
        #https://www.vagrantup.com/docs/disks/usage
        subconfig.vm.hostname = "#{MASTERHOSTNAME}-#{i}"
        subconfig.vm.network :private_network, ip: ENV["IP_NW"] + "#{i + IP_S.to_i}"
        subconfig.vm.provider :virtualbox do |vb|
          vb.customize ["modifyvm", :id, "--cpus", ENV["MASTER_CPU"]]
          vb.customize ["modifyvm", :id, "--memory", ENV["MASTER_MEMORY"]]
          vb.name ="#{MASTERHOSTNAME}-#{i}"
        end
        #subconfig.vm.provision "shell", privileged: true, path: "#{BASHSCRIPTPATH}setup-scoop.ps1"
        #subconfig.vm.provision "shell", privileged: true, path: "#{BASHSCRIPTPATH}setup-nodejs.ps1"
        #subconfig.vm.provision "shell", privileged: true, path: "#{BASHSCRIPTPATH}setup-vagrant.ps1"
      end
    end
    IP_S="#{IP_S}".to_i + ENV["MASTER_COUNT"].to_i
  end

  # feat: setup etcd is optional
  if ENV["SETUP_ETCDS"]
    (1..( ENV["ETCD_COUNT"] ).to_i(10)).each do |i|
      config.vm.define "#{ETCDHOSTNAME}-#{i}" do |subconfig|
        # fix: comment it , cause GuestAdditions 5.2.40 running  fail
        #subconfig.vm.disk :disk, size: ENV["NODE_DISKSIZE"], primary: true 
        #https://www.vagrantup.com/docs/disks/usage
        subconfig.vm.hostname = "#{ETCDHOSTNAME}-#{i}"
        subconfig.vm.network :private_network, ip: ENV["IP_NW"] + "#{i + IP_S.to_i}"
        subconfig.vm.provider :virtualbox do |vb|
          vb.customize ["modifyvm", :id, "--cpus", ENV["ETCD_CPU"]]
          vb.customize ["modifyvm", :id, "--memory", ENV["ETCD_MEMORY"]]
          vb.name ="#{ETCDHOSTNAME}-#{i}"
        end
        #subconfig.vm.provision "shell", privileged: true, path: "#{BASHSCRIPTPATH}setup-scoop.ps1"
        #subconfig.vm.provision "shell", privileged: true, path: "#{BASHSCRIPTPATH}setup-nodejs.ps1"
        #subconfig.vm.provision "shell", privileged: true, path: "#{BASHSCRIPTPATH}setup-vagrant.ps1"
      end
    end
    IP_S="#{IP_S}".to_i + ENV["ETCD_COUNT"].to_i
  end

  # feat: setup node is optional
  if ENV["SETUP_NODES"]
    (1..( ENV["NODE_COUNT"] ).to_i(10)).each do |i|
      config.vm.define "#{NODEHOSTNAME}-#{i}" do |subconfig|
        # fix: comment it , cause GuestAdditions 5.2.40 running  fail
        #subconfig.vm.disk :disk, size: ENV["NODE_DISKSIZE"], primary: true 
        #https://www.vagrantup.com/docs/disks/usage
        subconfig.vm.hostname = "#{NODEHOSTNAME}-#{i}"
        subconfig.vm.network :private_network, ip: ENV["IP_NW"] + "#{i + IP_S.to_i}"
        subconfig.vm.provider :virtualbox do |vb|
          vb.customize ["modifyvm", :id, "--cpus", ENV["NODE_CPU"]]
          vb.customize ["modifyvm", :id, "--memory", ENV["NODE_MEMORY"]]
          vb.name ="#{NODEHOSTNAME}-#{i}"
        end
        #subconfig.vm.provision "shell", privileged: true, path: "#{BASHSCRIPTPATH}setup-scoop.ps1"
        #subconfig.vm.provision "shell", privileged: true, path: "#{BASHSCRIPTPATH}setup-nodejs.ps1"
        #subconfig.vm.provision "shell", privileged: true, path: "#{BASHSCRIPTPATH}setup-vagrant.ps1"
      end
    end
    IP_S="#{IP_S}".to_i + ENV["NODE_COUNT"].to_i
  end
end