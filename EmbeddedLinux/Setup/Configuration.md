````bash
mkdir training && cd training
````

````bash
git clone git://git.yoctoproject.org/poky
````

git checkout kirkstone

source poky/oe-init-build-env build

bitbake core-image-minimal
