# Embedded Linux
Embedded Linux refers to a specialized version of the Linux operating system designed to run on embedded systems—devices with limited resources like memory, storage, and processing power.

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

**Why Yocto Project Matters**
* Hardware Independence: Works across different CPU architectures (ARM, x86, MIPS, PowerPC).
* Customization: Developers can strip down or expand Linux features depending on device constraints (e.g., minimal IoT sensor vs. full-featured smart appliance).
* Industry Standard: Widely adopted as the de facto toolkit for embedded Linux development.
* Reproducibility: Ensures consistent builds across teams and environments, which is critical for long-term product support.
* Community & Ecosystem: Provides shared layers, metadata, and best practices from a global developer community.

**Input to Yocot Project**
* set of data that describles what we want
* Kernel Configuration, Hardware Name, Packages/Binaries to be installed

**Output of Yocot Project**
* Linux Based Embedded Product
* Linux Kernel, Root File System, Bootloader, Device Tree

# Poky

* Poky is a _reference distribution_ of Yocto Project. The word "reference" is used to mean "example" in this context.
* Yocto Project uses Poky to build images (kernel, system and application software) for targeted hardware.
* At the technical level it is a combined repository of the components
  * Bitbake
  * OpenEmbedded Core
  * meta-yocto-bsp
  * Documentation
* Poky does not contain binary files, it is a working example of how to build your own custom Linux distribution from source.
* The exact difference between Yocto and Poky is Yocto refers to the organization (like one would refer to 'canonical', the company behind Ubuntu), and Poky refers to the actual bits downloaded (analogous to 'Ubuntu').


| Aspect	| Poky	| Yocto Project| 
| :---- |:---- |:---- | 
| Definition	| Reference distribution (example implementation)	| Collaborative open-source project|
| Function	| Builds images using BitBake and metadata layers	| Provides tools, standards, and infrastructure|
| Includes	| BitBake, OE-Core, meta-yocto-bsp, documentation	| Poky, meta-layers, tools, documentation|
| Use Case | Starting point for custom embedded Linux builds | Supporting ecosystem for embedded Linux devs|

# Metadata

Outside Yocto (general meaning): Metadata is data that describes other data — like labels on a file telling you its size, type, or when it was created.

**Yocto World**:
Metadata tells the build system:
* What software to use (version and source location)
* How to build it (commands and instructions)
* How to modify it (patches to fix bugs or adapt it for specific hardware)

It’s the blueprint for creating a custom Linux system.

* Metadata is collection of
  * configuration files (.conf)
  * Recipes (.bb and .bbappend)
  * Classes (.bbclass)
  * Includes (.inc)

# OpenEmbedded
* OpenEmbedded offers a best-in-class cross-compile environment. It allows developers to create a complete Linux Distribution for embedded systems.
* adopted as the build system for the Yocto Project in March 2011.

**oe-core**: The Yocto Project and OpenEmbedded have agreed to work together and share a common core set of metadata(recipes, classes and associated files): oe-core


<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/ac0c9ce6-ad69-4a9f-9a3c-0a6a24c592e9" />

# BitBake
BitBake is a key tool in the Yocto Project — like a smarter version of make.
* It reads recipes that describe how to build software.
* It runs tasks (steps like fetch, compile, install) in the right order based on dependencies.
* It understands a mix of Python and shell code.
* It builds packages and combines them into a bootable Linux image.
* It tracks everything to make builds efficient and predictable.

# Board Support Package
* A Board Support Package (BSP) is essentially the bridge between hardware and the operating system.
* It defines:
 * Hardware features (CPU, memory, peripherals).
 * Kernel configuration (drivers, options).
 * Additional drivers (e.g., Ethernet, GPIO, display).
 * Optional software components beyond the generic Linux stack.

**meta‑yocto‑bsp Layer**
* Poky (the Yocto Project reference distribution) includes the meta-yocto-bsp layer.
* This layer provides reference BSPs for common hardware platforms:
 * Beaglebone (ARM-based single-board computer).
 * EdgeRouter (networking device).
 * Generic IA32/IA64 machines (Intel architectures, both 32‑bit and 64‑bit).
* These BSPs serve as templates or starting points for developers to:
 * Understand BSP structure.
 * Port Linux to new hardware.
 * Customize kernel and drivers for their own boards.

**Typical BSP Contents**
* Machine configuration files (.conf) → define CPU, architecture, toolchain.
* Kernel recipes → specify kernel source, patches, configs.
* Device tree files → describe hardware layout.
* Init scripts & drivers → ensure peripherals work at boot.
* Optional software packages → board‑specific utilities.

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/bd38f9b3-bb24-45aa-8ec4-e30374cd8eff" />

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/fa89c857-0688-4b41-8812-f8d6ea42bf01" />

