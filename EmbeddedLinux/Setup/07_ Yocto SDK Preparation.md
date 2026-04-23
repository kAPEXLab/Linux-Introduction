# Complete Kernel Module Build and Deployment Guide

This is the full printable Markdown version summarizing **all steps you used today** — from SDK setup → module build → SD‑card transfer → BBB loading and testing.  
100% clean, linear, and student‑friendly.

***

# 1. Yocto SDK Preparation on Host PC

## 1.1 Add kernel development packages to Yocto SDK

```bash
cd ~/embeddedlinuxTraining/yocto-bbb/poky/build
nano conf/local.conf
```

Add at the end:

```conf
TOOLCHAIN_TARGET_TASK:append = " kernel-dev kernel-devsrc"
```

## 1.2 Build image + SDK

```bash
bitbake core-image-minimal
bitbake -c populate_sdk core-image-minimal
```

## 1.3 Install SDK

```bash
cd tmp/deploy/sdk
chmod +x poky-glibc-*.sh
sudo ./poky-glibc-*.sh
```

Install to:

    /opt/poky/4.0.35/

***

# 2. Load Yocto SDK Environment

```bash
source /opt/poky/4.0.35/environment-setup-cortexa8hf-neon-poky-linux-gnueabi
```

Verify:

```bash
which gcc
which arm-poky-linux-gnueabi-gcc
echo $ARCH
echo $CROSS_COMPILE
```

Expected:

    ARCH=arm
    CROSS_COMPILE=arm-poky-linux-gnueabi-

***

# 3. Prepare Kernel Build Tree

```bash
export KDIR="$SDKTARGETSYSROOT/lib/modules/$(uname -r)/build"
sudo make -C "$KDIR" ARCH=arm CROSS_COMPILE="$CROSS_COMPILE" modules_prepare
```

Check:

```bash
ls $KDIR/include/asm
```

***

# 4. Create Out‑of‑Tree Kernel Module on Host

## 4.1 Create workspace

```bash
mkdir -p ~/embeddedlinuxTraining/kmods/myled
cd ~/embeddedlinuxTraining/kmods/myled
```

## 4.2 Create files: `myled.c` and `Makefile`

### Makefile

```make
obj-m := myled.o
KDIR := $(SDKTARGETSYSROOT)/lib/modules/$(shell ls $(SDKTARGETSYSROOT)/lib/modules)/build
PWD := $(shell pwd)

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean
```

***

# 5. Build the Kernel Module (.ko)

```bash
cd ~/embeddedlinuxTraining/kmods/myled
make
```

Expected:

    LD [M]  myled.ko

Verify architecture:

```bash
file myled.ko
```

Expected:

    ELF 32-bit LSB relocatable, ARM

***

# 6. Transfer `myled.ko` to BBB Using SD Card (Simplest & Recommended)

## 6.1 Insert SD card into HOST PC

Host auto‑mounts as:

    /media/apex/boot
    /media/apex/root

## 6.2 Copy module to FAT `/boot` partition

```bash
sudo cp ~/embeddedlinuxTraining/kmods/myled/myled.ko /media/apex/boot/
sync
```

Verify:

```bash
ls -l /media/apex/boot/myled.ko
```

## 6.3 Unmount SD card

```bash
sudo umount /media/apex/boot
sudo umount /media/apex/root
```

***

# 7. Boot BBB and Transfer Module Into `/home/root`

Insert SD card into BBB and boot.

## 7.1 Mount FAT partition on BBB

```bash
mkdir -p /mnt/boot
mount /dev/mmcblk0p1 /mnt/boot
```

## 7.2 Copy module

```bash
cp /mnt/boot/myled.ko /home/root/
ls -l /home/root/myled.ko
```

***

# 8. Load, Test, Unload Module on BBB

## 8.1 Load module

```bash
insmod myled.ko
```

Verify:

```bash
lsmod | grep myled
```

## 8.2 Toggle the LED via sysfs

LED ON:

```bash
echo 1 > /sys/kernel/myled/value
```

LED OFF:

```bash
echo 0 > /sys/kernel/myled/value
```

## 8.3 Unload module

```bash
rmmod myled
```

***

# 9. Clean Summary (For Students)

## On Host PC

1.  Build Yocto SDK with kernel-dev and kernel-devsrc
2.  Install SDK
3.  `source` SDK environment
4.  Prepare kernel build tree
5.  Build module using `make`
6.  Copy `.ko` to SD card `/boot`

## On BBB

1.  Mount `/dev/mmcblk0p1`
2.  Copy `.ko` to `/home/root`
3.  `insmod myled.ko` to load
4.  Control LED using `/sys/kernel/myled/value`
5.  `rmmod myled` to unload

***
