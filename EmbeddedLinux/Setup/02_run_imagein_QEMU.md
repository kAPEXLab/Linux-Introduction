1. Source image
   `poky$ source oe-init-build-env`

2. `runqemu -h`

3. `runqemu qemux86-64 core-image-minimal`
   * This will open new terminal with generated image running, login with username `root`
   * Can Check cpuinfo, meminfo, df -m, ...and all the linux commands and features.
   * `poweroff` to shut down
