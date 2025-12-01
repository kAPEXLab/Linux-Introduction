## **Elements of Embedded Linux**

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
