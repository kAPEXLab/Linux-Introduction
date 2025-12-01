# **Elements of Embedded Linux**

* _Toolchain_ → Developers build kernel, rootfs, and applications.
* _Bootloader_ → Initializes hardware and loads the kernel.
* _Kernel_ → Manages hardware and system resources.
* _Root File System_ → Provides libraries, utilities, and configuration.
* _Applications_ → Deliver the device’s functionality to the end user.


| Element	|  Why It’s Needed	|  How It Plays a Role in Development  |
| :------ | :---------- | :---- |
| Toolchain	| Enables building software for target hardware (often different CPU architecture than the developer’s PC).	| Provides compiler, linker, debugger for cross-compilation; developers use it to build kernel, root filesystem, and applications.
| Bootloader	| Embedded devices lack a BIOS; bootloader is essential to start the system.	| Initializes hardware, loads the kernel into memory, and passes parameters to it (e.g., U-Boot).
| Kernel	| Core of the operating system; manages hardware and system resources.	| Provides multitasking, device drivers, and system calls; often customized to reduce footprint and improve performance.
| Root File System	| Kernel alone cannot provide a usable environment; rootfs supplies libraries, configs, and utilities.	| Contains directories (/bin, /etc, /lib, /dev); built with BusyBox, Yocto, or Buildroot; provides runtime environment.
| Application Programs	| Define the actual purpose of the embedded device (e.g., IoT, industrial control, consumer electronics).	| Developed with the toolchain, deployed into rootfs; optimized for low resource usage; deliver device-specific functionality.


Summary:
* Toolchain is for development.
* Bootloader is for startup.
* Kernel is for hardware control.
* Root filesystem is for environment setup.
* Applications are for the actual purpose of the device.


# **Yocto Project**

* A collaborative project under the Linux Foundation, launched in 2010, designed to simplify the creation of custom embedded Linux systems.
* The Yocto Project is an open-source initiative that provides tools and processes to help developers build custom Linux distributions for embedded devices. 
* It’s not a Linux distribution itself, but rather a toolkit that lets you create one tailored to your hardware and application needs.
* Instead of downloading a prebuilt distribution, Yocto gives you the framework to generate your own, optimized for your device.

## Why Yocto Project Matters
* Hardware Independence: Works across different CPU architectures (ARM, x86, MIPS, PowerPC).
* Customization: Developers can strip down or expand Linux features depending on device constraints (e.g., minimal IoT sensor vs. full-featured smart appliance).
* Industry Standard: Widely adopted as the de facto toolkit for embedded Linux development.
* Reproducibility: Ensures consistent builds across teams and environments, which is critical for long-term product support.
* Community & Ecosystem: Provides shared layers, metadata, and best practices from a global developer community.

## Input to Yocot Project
* set of data that describles what we want
* Kernel Configuration, Hardware Name, Packages/Binaries to be installed

## Output of Yocot Project
* Linux Based Embedded Product
* Linux Kernel, Root File System, Bootloader, Device Tree
