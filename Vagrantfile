Vagrant.configure("2") do |config|
  # feat: use cnf in .env file
  config.env.enable
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
  end

  # feat: set box to be cache-able
  if Vagrant.has_plugin?("vagrant-cachier")
    config.cache.scope = :box
  end

  # feat: set guest vbguest (when virtualbox)
  if Vagrant.has_plugin?("vagrant-vbguest")
    config.vbguest.auto_update = false
    config.vbguest.no_install = false
    config.vbguest.no_remote = false
  end

  # feat: set env to cache env in .env file
  MASTERHOSTNAME = ENV["MASTER_HOSTNAME"]
  ETCDHOSTNAME = ENV["ETCD_HOSTNAME"]
  NODEHOSTNAME = ENV["NODE_HOSTNAME"]
  BASHSCRIPTPATH = ENV["BASH_SCRIPT_PATH"]
  IP_S=ENV["IP_S"]

  # feat: setup master is optional
  if ENV["SETUP_MASTER"]
    (1..( ENV["MASTER_COUNT"] ).to_i(10)).each do |i|
      config.vm.define "#{MASTERHOSTNAME}-#{i}" do |subconfig|
        subconfig.vm.hostname = "#{MASTERHOSTNAME}-#{i}"+ ENV["MY_ROOT_DOMAIN"]
        subconfig.vm.network :private_network, ip: ENV["IP_NW"] + "#{i + IP_S.to_i}"
        subconfig.vm.provider :virtualbox do |vb|
          vb.customize ["modifyvm", :id, "--cpus", ENV["MASTER_CPU"]]
          vb.customize ["modifyvm", :id, "--memory", ENV["MASTER_MEMORY"]]
          vb.name ="#{MASTERHOSTNAME}-#{i}"
        end
        # subconfig.vm.provision "ansible_local" do |ansible|
        #   ansible.playbook = "/etc/k8s-scripts/worker.yaml"
        #   ansible.verbose = "v"
        # end
      end
    end
    IP_S="#{IP_S}".to_i + ENV["NODE_COUNT"].to_i
  end

  # feat: setup etcd is optional
  if ENV["SETUP_ETCDS"]
    # support mutli instance
    (1..( ENV["ETCD_COUNT"] ).to_i(10)).each do |i|
      config.vm.define "#{ETCDHOSTNAME}-#{i}" do |subconfig|
        subconfig.vm.hostname = "#{ETCDHOSTNAME}-#{i}"+ ENV["MY_ROOT_DOMAIN"]
        subconfig.vm.network :private_network, ip: ENV["IP_NW"] + "#{i + IP_S.to_i}"
        subconfig.vm.provider :virtualbox do |vb|
          vb.customize ["modifyvm", :id, "--cpus", ENV["ETCD_CPU"]]
          vb.customize ["modifyvm", :id, "--memory", ENV["ETCD_MEMORY"]]
          vb.name ="#{ETCDHOSTNAME}-#{i}"
        end
        # subconfig.vm.provision "ansible_local" do |ansible|
        #   ansible.playbook = "/etc/k8s-scripts/worker.yaml"
        #   ansible.verbose = "v"
        # end
      end
    end
    IP_S="#{IP_S}".to_i + ENV["NODE_COUNT"].to_i
  end

  # feat: setup node is optional
  if ENV["SETUP_NODES"]
    # support mutli instance
    (1..( ENV["NODE_COUNT"] ).to_i(10)).each do |i|
      config.vm.define "#{NODEHOSTNAME}-#{i}" do |subconfig|
        subconfig.vm.hostname = "#{NODEHOSTNAME}-#{i}"+ ENV["MY_ROOT_DOMAIN"]
        subconfig.vm.network :private_network, ip: ENV["IP_NW"] + "#{i + IP_S.to_i}"
        subconfig.vm.provider :virtualbox do |vb|
            vb.customize ["modifyvm", :id, "--cpus", ENV["NODE_CPU"]]
            vb.customize ["modifyvm", :id, "--memory", ENV["NODE_MEMORY"]]
            vb.name ="#{NODEHOSTNAME}-#{i}"
        end
      # subconfig.vm.provision "ansible_local" do |ansible|
      #   ansible.playbook = "/etc/k8s-scripts/worker.yaml"
      #   ansible.verbose = "v"
      # end
      end
    end
    IP_S="#{IP_S}".to_i + ENV["NODE_COUNT"].to_i
  end
end