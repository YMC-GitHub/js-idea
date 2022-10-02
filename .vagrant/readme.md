## what is .vagrant diretory

cache some data for vagrant

-   [x] vagrant global depedents(inlude plugin)

-   [x] some machines for the project

-   [x] ...

## diretory construtor

```
.vagrant
|-- bundler
|   -- global.sol # vagrant global depedents(inlude plugin)
|-- machines # some machine
|   -- win2102-1 # machine name
|       -- virtualbox # machine provider
|           |-- action_provision
|           |-- action_set_name
|           |-- box_meta # box name,version,provider,diretory
|           |-- creator_uid
|           |-- id
|           |-- index_uuid
|           |-- synced_folders # some shared dir in guest and host
|           -- vagrant_cwd
-- rgloader
    -- loader.rb
```
