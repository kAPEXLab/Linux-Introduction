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
