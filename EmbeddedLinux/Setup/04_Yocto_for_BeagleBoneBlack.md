# Beagle Bone Black Specification
--------------------------------

* Texas Instruments AM335x (ARM Cortex-A8 CPU)
* 512MB DDR3 RAM
* 4 GB of on-board eMMC storage
* 3D graphics accelerator
* NEON floating-point accelerator
* 2x PRU 32-bit micro-controllers
* USB client for power & communications
* USB host
* Ethernet
* HDMI (micro)
* 2x 46 pin headers with access to many expansion buses (I2C, SPI, UART and more)
* A huge number of expansion boards, called capes

![beagle_bone_black](https://github.com/user-attachments/assets/5348f865-7f09-4b07-9742-f527a5a65a8c)


BB is one of the reference board of Yocto Project. `/poky/meta-yocto-bsp/conf/machine/` has `beaglebone-yocto.conf` file havinf the configuration

1. source poky/oe-init-build-env build_bbb
2. from location build_bbb/conf/local.conf: Comment `#MACHINE ??= "qemux86-64"` and uncomment `MACHINE ?= "beaglebone-yocto"`
3. Build Image `bitbake core-image-minimal`
4. Generated image is present at 
