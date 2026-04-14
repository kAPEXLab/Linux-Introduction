````bash
mkdir training && cd training
````

1. Download Poky Source Code
````bash
git clone git://git.yoctoproject.org/poky
````

2. `/poky$ ls -a` shows
<img width="1285" height="60" alt="image" src="https://github.com/user-attachments/assets/095aa1bb-070c-43b2-824e-829e419213a0" />

Image shows top‑level directory listing of the Poky (Yocto Project reference distribution) source tree

* bitbake/: Contains the BitBake build tool
* meta/: OpenEmbedded Core (OE-Core) layer
* meta-poky/: Poky‑specific distribution configuration
* meta-yocto-bsp/: Reference Board Support Packages
* meta-selftest/: Yocto runtime & build self‑tests, Useful if you want to test Yocto internals, not mandatory for builds.
* meta-skeleton/: Used when creating new custom layers, Use this as a starter pack to create your own layer.
* oe-init-build-env: Shell script to initialize the build environment
* scripts/: Helper scripts for: Layer management, Sanity checks, Maintenance tasks
* documentation/: Structured documentation sources, Linked to official Yocto docs

3. Checkout the latest release at `/poky$ git checkout kirkstone`
````bash
git checkout kirkstone
````

4. Prepare build environment - Poky provides a script 'oe-init-build-env' that is to be used to setup the build environment. It will set upp environment to use Yocto build systems and add bitbake utility to path
````bash
source poky/oe-init-build-env build
````

5. `/poky/build$ tree conf/` will provide
  
  ````bash
  conf/
  ├── bblayers.conf
  ├── local.conf
  └── templateconf.cfg
  ````

6. If en_US.UTF-8 is NOT available → Generate locales (permanent fix)
````bash
sudo apt update
sudo apt install -y locales
sudo locale-gen en_US.UTF-8
sudo update-locale LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
````
7. Build again

````bash
/poky$ source oe-init-build-env build
````

8. Install ALL Yocto host dependencies
````bash
sudo apt install -y \
  gawk wget git diffstat unzip texinfo gcc build-essential \
  chrpath socat cpio python3 python3-pip python3-pexpect \
  xz-utils debianutils iputils-ping python3-git python3-jinja2 \
  libegl1-mesa libsdl1.2-dev pylint xterm lz4
````

9. Yocto build
````bash
bitbake core-image-minimal
````
It generrates image for the below configuration
    
    ````bash
    Build Configuration:
    BB_VERSION           = "2.0.0"
    BUILD_SYS            = "x86_64-linux"
    NATIVELSBSTRING      = "ubuntu-22.04"
    TARGET_SYS           = "x86_64-poky-linux"
    MACHINE              = "qemux86-64"
    DISTRO               = "poky"
    DISTRO_VERSION       = "4.0.35"
    TUNE_FEATURES        = "m64 core2"
    TARGET_FPU           = ""
    meta                 
    meta-poky            
    meta-yocto-bsp       = "kirkstone:93431249a6260da7bd29ee3ca32145d89e5b8259"
    ````

It is a snapshot of your Yocto build context `Host → Toolchain → Target → Distro → Machine → Layers`

| Pipeline Stage | Configuration Item(s) | Value from Build Configuration | Description |
|---------------|-----------------------|-------------------------------|-------------|
| Host | BUILD_SYS | x86_64-linux | Architecture and operating system of the build machine |
| Host | NATIVELSBSTRING | ubuntu-22.04 | Host Linux distribution detected by Yocto |
| Toolchain (Build Engine) | BB_VERSION | 2.0.0 | BitBake version driving the build |
| Toolchain (Build Engine) | (implicit) | Yocto-generated cross-toolchain | Yocto builds and uses its own cross-compiler |
| Target | TARGET_SYS | x86_64-poky-linux | Architecture, vendor/distro namespace, and OS of generated binaries |
| Target | TUNE_FEATURES | m64 core2 | CPU tuning and optimization features for target builds |
| Target | TARGET_FPU | (empty) | Floating-point configuration (implicit on x86-64) |
| Distro | DISTRO | poky | Linux distribution policy being built |
| Distro | DISTRO_VERSION | 4.0.35 | Yocto Project Kirkstone LTS point release |
| Machine (Hardware) | MACHINE | qemux86-64 | Target hardware definition (QEMU virtual x86-64 machine) |
| Layers (Metadata) | meta | OE-Core | Core OpenEmbedded recipes and build metadata |
| Layers (Metadata) | meta-poky | Poky layer | Poky reference distribution configuration |
| Layers (Metadata) | meta-yocto-bsp | kirkstone:93431249a6… | BSP layer providing reference machines like qemux86-64 |
