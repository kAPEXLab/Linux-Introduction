# Beagle Bone Black
--------------------------------

# BBB Specifications

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

# Yocto on BBB
BB is one of the reference board of Yocto Project. `/poky/meta-yocto-bsp/conf/machine/` has `beaglebone-yocto.conf` file havinf the configuration

1. `source poky/oe-init-build-env build_bbb`
2. from location build_bbb/conf/local.conf: Comment `#MACHINE ??= "qemux86-64"` and uncomment `MACHINE ?= "beaglebone-yocto"`
3. Build Image `bitbake core-image-minimal`
4. Generated image is present at `build_bbb/tmp/deploy/images/
<img width="1614" height="350" alt="image" src="https://github.com/user-attachments/assets/6b4d22f9-5743-488a-b0a3-3bd272d86675" />

* MLO - 2nd Stage Bootloader Secondary Program Loader
* u-boot.img - U-Boot
* zImage - Kernel Image
* core-image-minimal-beaglebone-yocto.tar.bz2 - Root File System

# Booting Process in BBB

* BBB has 128 kB of internal RAM.
* Because of limited RAM, multiple bootloader stages are required.
* These multiple bootloader stages systematically unlock the full potential and functionality of the device so that the all complexities of the device are available to kernel.
* The 4 Bootloader stages are:
  * ROM
  * SPL (Secondary Program Loader)
  * U-Boot
  * Linux Kernel
 
**1 ROM Stage**

* The first stage bootloader is flashed in ROM on the device by Texas Instruments
* The ROM code is the first block that is automatically run on device on start up
* The ROM code is hardcoded and can not be changed by user
* It has two main functions
  1. Device Configuration & initialization of primary peripherals
     - stack setup
     - Configuration of Watchdog Timer
     - PLL and System Clock configuration
  2. Ready device for next bootloader stage
     - check boot sources for next stage
     - moves next bootloader code into memory to run
* By default, the BBB will boot from MMC1 interface (onboard eMMC) followed by MMC0 (external uSD), USB0, UART0
* IF the boot switch S2 is held down during power-up, the ROM will boot from SPIO interface first, followed by MMC0, USB0, UART0

**2 SPL**
* Fully featured version of U-Boot is over 400KB, but internal RAM is 128KB. Hence, not able to load fully.
* Hence, a cut down version of U-Boot called as U-Boot SPL is loaded first
* Once it has initialized the CPU, the chain loads a fully featured version of U-Boot (u-boot.img)
* Name of SPL should be ML0, It should be loaded on active first partition of MMC, whihc must be formatted as FAT12/16/32.

**3 U-Boot**
* U-Boot allows command based control over the kernel boot environment via serial terminal
* User has control over a number of parameters such as boot arguments and the kernel boot command
* U-Boot environment variables are configurable
* The environment variables are stored in uEnv.txt on storage medium
* The built-in environment in u-boot loads a default am335x-boneblack.dts to pass to the kernel at boot.
* In uEnv.txt you can explicitely specify a differetn DTS as command line arguments to pass to the kernel
* U-Boot is capable of obtaining network information via DHCP and loading it into environment variables
* Finally, U-boot loads the kernel and DTS into memory and boots the kernel with some command line arguments
* Then kernel initializes and mount the root filesystem
* By default, the root filesystem is contained in the second partition (mmcblk0p2) of microSD card, formatted for ext3 file system.

# Partitioning and Formating SD Card
* Add SD card to USB card reader and connect to PC having yocto image.
* unmount all the partition `umount /dev/sda*`
* Partition SD card `sudo fdisk /dev/sda`
  * Delete all the partitions
    * Command p will show all the partitions
    * Command d will delete the partitions
  * Create the 1st partitions
    * Command n will create partition, p for primary
    * First Sector, default size (just enter)
    * Last Sector: +32M
  * Create the 2nd partitions for rootfs
    * Command n will create partition, p for primary
    * First Sector, default size (just enter)
    * Last Sector: default size (just enter)
  * Create 1st Partition bootable
    * command a
    * Partition number 1
  * Format 1st Partition - FAT32
    * Command t
    * Partition number 1
    * Codes command L will list all the partitions, find code for W95 FAT32 (LBA) and give as command, this will 'Changed type of partition 'Linux' to 'W95 FAT32 (LBA)'
  * Format 2nd Partition - Linux
    * Command t
    * Partition number 2
    * Codes command L will list all the partitions, find code for Linux and give as command, this will 'Changed type of partition 'Empty' to 'Linux'
  * Command w for writing partition table
  * Format the first partition as FAT, set label as BOOT, so we know what directory it will be mounted by udisks `sudo mkfs.vfat -n "BOOT" /dev/sda1`
  * Format the second partition as ext4 and label as ROOT, it will contain the extracted image of rootfs `sudo mkfs.ext4 -L "ROOT" /dev/sda2`
  * Disconnet the SD card from PC

 # Copying image to SD Card
 * Conect the SD card again to PC
 * check if counted `mount` it will show on terminal

   * `/dev/sda2 on /media/apex/ROOT type ext4`
   * `/dev/sda1 on /media/apex/BOOT type vfat`
 
 * Mounted at build_bbb/tmp/deploy/images/beaglebone-yocto/media/$USER: BOOT  ROOT, check with command `ls /media/$USER`
 * Copy u-boot MLO and u-boot bootloader images into FAT32 partition
    * `sudo cp MLO /media/$USER/BOOT`
    * `sudo cp u-boot.img /media/$USER/BOOT`
 * Copy kernel image to BOOT partition
     * `sudo cp zImage /media/$USER/BOOT`
 * Copy .dtb file (am335x-boneblack.dtb) into BOOT partition. This is required in core-image-minimal case only.
     * `sudo cp am335x-boneblack.dtb /media/$USER/BOOT`
 *  As a root user uncompress core-image-minimal-beaglebone-yocto.tar.bz2 to ext4 partition
     * `sudo tar -xf core-image-minimal-beaglebone-yocto.tar.bz2 -C /media/$USER/ROOT/`
 *  `sync`
