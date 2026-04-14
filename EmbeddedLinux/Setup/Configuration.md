````bash
mkdir training && cd training
````

````bash
git clone git://git.yoctoproject.org/poky
````

````bash
git checkout kirkstone
````

````bash
source poky/oe-init-build-env build
````

````bash
bitbake core-image-minimal
````
