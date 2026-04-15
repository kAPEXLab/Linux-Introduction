1. Open file `build/conf/local.conf`
2. Make the change to MACHINE

````bash
# This sets the default machine to be qemux86-64 if no other machine is selected:
MACHINE ??= "qemuarm"
````
3. `source oe-init-build-env build`
4. Build for QEMU ARM `build$ bitbake core-image-minimal`
5. Run in QEMU `runqemu core-image-minimal`
